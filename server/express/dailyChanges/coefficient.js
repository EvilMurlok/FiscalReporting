const moment = require("moment");
const {Op} = require('sequelize');

const config = require('../../config/dbConfigDocker');
const {HardDayTransactionError} = require("../../sequelize/day/errors");
const dbConnection = require('../../sequelize/dbConnection').getInstance({config: config, mode: 'development'});

const changeKqDaily = async ({transaction = null}) => {
    const yesterdayKq = await dbConnection.models.day.findOne({
        where: {
            date: moment().add(3, "hours").subtract(1, "day").format("YYYY-MM-DD"),
            // date: moment().add(3, "hours").format("YYYY-MM-DD"),
            coefficient: {
                [Op.lt]: 1
            }
        },
        attributes: ["id", "date", "coefficient"]
    });
    console.log(yesterdayKq.date, yesterdayKq.coefficient);

    const allPartners = await dbConnection.models.partner.findAll({
        attributes: ["id"]
    });
    // const t = await dbConnection.sequelize.transaction();
    try {
        const insertedCoefficientToday = await dbConnection.models.day.create({
            date: moment().add(3, "hours").add(1, "day").format("YYYY-MM-DD"),
            coefficient: yesterdayKq.coefficient
        }, {transaction: transaction});
        await insertedCoefficientToday.setPartners(allPartners, {transaction: transaction});
        // await t.commit();
        return {
            "previousDay": yesterdayKq,
            "nextDay": insertedCoefficientToday
        };
    } catch (e) {
        throw new HardDayTransactionError("Unable to create next day", [{
            text: "Не удалось создать следующий день!"
        }]);
        // await t.rollback();
    }
}

module.exports = {
    changeKqDaily
}