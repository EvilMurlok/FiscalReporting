const config = require('../../config/dbConfigLocal');
const dbConnection = require('../../sequelize/dbConnection').getInstance({
    config: config,
    mode: 'development'});


/*
* На вход подается json следующего вида:
* {
*   "pack": {
*     "lotteryId": какой-то айдишник у лотереи,
*     "nominals": [
*       {
*         "value": значение номинала,
*         "currentAmount": текущий остаток номинала,
*         (мб нахуй удалить, он же и так хранится на серваке в LotteryNominals)
*         "broughtCirculation": внесенное количество номинала (название надо поменять имхо)
*       },
*     "date": дата занесения
*     (по-моему ее тоже лучше передавать, вдруг у нас запрос будет долго обрабатываться)
*       ...
*     ]
*   }
* }
* Таким образом на входе информация о Parcel'ах, поэтому мы должны
* 1) создать Pack со статусом Актуален
* 2) создать и присоединить к нему Parcel'ы для пополненных номиналов
* 3) изменить amount в LotteryNominals, прибавив к нему broughtCirculation
*
* ВСЁ В ТРАНЗАКЦИИ БЛЕАДЬ!!!!
*
* */
const makePack = async (req, res) => {
    let packInfo = req.body;
    const t = await dbConnection.sequelize.transaction();
    try {
        // Создали пак
        // Засунуть в метод CreateWithParcels
        const createdPack = await dbConnection.models.pack.create({
            status: 'relevant',
            date: packInfo.pack.date
        }, {transaction: t});



        let parcelsInfo = [];
        for (let nominal of packInfo.pack.nominals) {
            parcelsInfo.push({amount: nominal.broughtCirculation})
        }


        res.send({
            status: 'success',
            user: createdUser.dataValues,
            messages: [{
                text: `Пользователь ${createdUser.username} успешно зарегистрирован`
            }]
        });
    } catch(e) {
        console.log(e);
        res.send({
            status: 'warning',
            messages: e.errors.map(msg => {
                return {text: msg.message};
            })
        });
    }
}

module.exports = {
    makePack
}