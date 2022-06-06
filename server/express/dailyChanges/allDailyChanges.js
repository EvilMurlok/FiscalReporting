const moment = require("moment");
const {Op} = require("sequelize");
const {changeKqDaily} = require("./coefficient");
const config = require("../../config/dbConfigDocker");
const {checkForPartnersUpdatesDaily} = require("./partner");
const {getBetTradeDataByYesterday, insertStatsForNextDay} = require("./statsByDay");
const dbConnection = require('../../sequelize/dbConnection').getInstance({config: config, mode: 'development'});


const makeDailyChanges = async (req, res) => {
    const date = req.query.date;
    const yesterday = await dbConnection.models.day.findOne({
        where: {
            date: date,
            coefficient: {
                [Op.lt]: 1
            }
        }
    });
    // console.log(yesterday);

    try {
        // первое, что необходимо сделать - обновить списки партнеров(клубов)
        // согласно информации, полученной с betTrade по партнерам(клубам)
        const newPartners = await checkForPartnersUpdatesDaily({date: yesterday});
        console.log(newPartners.length);
        const internalPartnerIds = newPartners.map(partner => partner.internalId);
        // второе, что надо сделать - добавить следующий день уже с новыми клубами и с коэффициентом Kq вчерашнего дня
        // const days = await changeKqDaily({transaction: t});

        // TODO удалить после тестирования
        const yesterdayKq = await dbConnection.models.day.findOne({
            where: {
                date: date,
                coefficient: {
                    [Op.lt]: 1
                }
            },
            attributes: ["id", "date", "coefficient"]
        });
        let insertedCoefficientToday = null;
        const t = await dbConnection.sequelize.transaction();
        try {
            insertedCoefficientToday = await dbConnection.models.day.create({
                date: moment(date, 'YYYY-MM-DD').add(1, 'day').format("YYYY-MM-DD"),
                coefficient: yesterdayKq.coefficient
            }, {transaction: t});
            // всех партнеров соединяем с новым днем!
            await insertedCoefficientToday.setPartners(newPartners, {transaction: t});
            await t.commit();
        } catch (e) {
            console.log(e);
            await t.rollback();
        }

        const days = {
            previousDay: yesterdayKq,
            nextDay: insertedCoefficientToday
        }
        //
        // наконец, надо получить из betTrade статистику и запихать ее в базку хитрым способом!
        const preparedData = await getBetTradeDataByYesterday({date: date, internalPartnerIds: internalPartnerIds});
        await insertStatsForNextDay({
            previousDay: days.previousDay,
            nextDay: days.nextDay,
            data: preparedData,
            transaction: t
        });
        res.send({
            data: preparedData
        });
    } catch (e) {
        console.log(e);
    }

}


module.exports = {
    checkForPartnersUpdatesDaily,
    changeKqDaily,
    makeDailyChanges
}