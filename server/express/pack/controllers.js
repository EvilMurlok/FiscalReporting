const config = require('../../config/dbConfigLocal');
const moment = require("moment");
const dbConnection = require('../../sequelize/dbConnection').getInstance({
    config: config,
    mode: 'development'
});


/*
* На вход подается json следующего вида:
* {
*   "lotteryId": какой-то айдишник у лотереи,
*   "date": дата занесения
*   "nominals": [
*     {
*       "id": id номинала
*       "broughtCirculation": внесенное количество номинала (название надо поменять имхо)
*     },
*     ...
*   ]
* }

* Таким образом на входе информация о Parcel'ах, поэтому мы должны
* 1) создать Pack со статусом Актуален
* 2) создать и присоединить к нему Parcel'ы для пополненных номиналов
* 3) изменить amount в LotteryNominals, прибавив к нему broughtCirculation
*
*
*
* */
const makePack = async (req, res) => {
    const {packInfo} = req.body;
    const t = await dbConnection.sequelize.transaction();
    try {
        moment.locale();
        console.log(packInfo);
        // Создали пак
        // Засунуть в метод CreateWithParcels
        const createdPack = await dbConnection.models.pack.createWithParcels({
            user: req.user,
            packInfo: packInfo,
            date: packInfo.date,
            transaction: t
        });

        await t.commit();
        res.send({
            status: 'success',
            pack: createdPack.dataValues,
            messages: [{
                text: `Тираж успешно выпущен`
            }]
        });
    } catch(e) {
        console.log(e);
        let messages = '';
        if (e.errors) {
            messages = e.errors.map(msg => {
                return {text: msg.message};
            })
        } else {
            messages = e.messages
        }
        await t.rollback();
        res.send({
            status: 'warning',
            message: e.message,
            messages: messages
        });
    }
}

const getHistory = async (req, res) => {
    let {date} = req.query;
    try {
        const history = await dbConnection.models.pack.getHistory({date: date});
        res.send({
            status: 'success',
            history: history,
            messages: [{
                text: `История тиражей успешно получена`
            }]
        });
    } catch(e) {
        console.log(e);
        res.send({
            status: 'warning',
            message: e.message,
            messages: e.messages
        });
    }
}

module.exports = {
    makePack,
    getHistory
}