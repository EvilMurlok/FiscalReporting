const {Model, DataTypes} = require('sequelize');
const {LotteryNominalCredentialsError} = require("./errors");
const {LotteryNominalStatCommonError} = require("../lotteryNominalStat/errors");

module.exports = async (sequelize) => {
    class LotteryNominal extends Model {
        /**
         * Найти номиналы лотерей.
         * Можно указывать и иденификаторы, и названия/значения.
         * В таком случае будут найдены записи с указаным идентификатором И с указанным названием/значением
         * @param lotteryIds
         * @param lotteryNames
         * @param nominalIds
         * @param nominalValues
         * @param transaction
         * @returns {Promise<LotteryNominal[]>}
         */
        static findByLotteriesAndNominals = async({
                                                      lotteryIds = [],
                                                      lotteryNames = [],
                                                      nominalIds = [],
                                                      nominalValues = [],
                                                      transaction = null
                                                  }) => {
            if (lotteryIds.length === 0 && lotteryNames.length === 0) {
                throw new LotteryNominalCredentialsError(
                    'Неверные данные номинала лотереи',
                    [{
                        text: 'Для нахождения номиналов лотереи необходимо указать ' +
                            'либо идентификаторы лотереи, либо их названия'
                    }]
                );
            }
            if (nominalIds.length === 0 && nominalValues.length === 0) {
                throw new LotteryNominalCredentialsError(
                    'Неверные данные номинала лотереи',
                    [{
                        text: 'Для нахождения номиналов лотереи необходимо указать ' +
                            'либо идентификаторы номинала, либо их значения'
                    }]
                );
            }

            let nominalWhereParams = Object.assign({},
                nominalIds.length === 0 ? null : {
                    'id': nominalIds
                },
                nominalValues.length === 0 ? null : {
                    'value': nominalValues
                }
            );

            let lotteryWhereParams = Object.assign({},
                lotteryIds.length === 0 ? null : {
                    'id': lotteryIds
                },
                lotteryNames.length === 0 ? null : {
                    'name': lotteryNames
                }
            );
            let includeParams = Array.of(
                {
                    'model': sequelize.models.nominal,
                    'required': true,
                    'where': nominalWhereParams
                },
                {
                    'model': sequelize.models.lottery,
                    'required': true,
                    'where': lotteryWhereParams
                }
            );
            return await this.findAll({
                include: includeParams,

            }, {transaction: transaction});
        }

        /**
         * Обновить баланс у номиналов конкретной лотереи на внесенные значения
         * @param date
         * @param lotteryId идентификатор лотереи
         * @param nominalsInfo массив объектов вида: {
         * *         "id": id номинала,
         * *         "broughtCirculation": внесенное количество номинала
         * *       }
         * @param transaction
         * @returns {Promise<LotteryNominal[]>}
         */
        static updateAmountByLotteryAndNominals = async ({
                                                             lotteryId = 0,
                                                             nominalsInfo = null,
                                                             date = "",
                                                             transaction = null
                                                         }) => {
            if (lotteryId <= 0) {
                throw new LotteryNominalCredentialsError(
                    'Неверные данные номинала лотереи',
                    [{
                        text: 'Для обновления количества остатков по номиналам лотереи необходимо указать ' +
                            'идентификатор лотереи'
                    }]
                );
            }
            if (!nominalsInfo) {
                throw new LotteryNominalCredentialsError(
                    'Неверные данные номинала лотереи',
                    [{
                        text: 'Для обновления количества остатков по номиналам лотереи необходимо указать ' +
                            'информацию по поступлениям по номиналам'
                    }]
                );
            }
            if (!date) {
                throw new LotteryNominalStatCommonError(
                    'Неверные данные статистики номинала лотереи',
                    [{
                        text: 'Для обновления статистики по номиналу лотереи ' +
                            'необходимо передать информацию о текущей дате'
                    }]
                );
            }
            nominalsInfo.forEach(el => {
                if (el.broughtCirculation < 0) {
                    throw new LotteryNominalCredentialsError(
                        'Неверные данные номинала лотереи',
                        [{
                            text: 'Количество новых билетов в тираже не может быть отрицательным'
                        }]
                    );
                }
            });
            const lotteryNominals = await sequelize.models.lotteryNominal.findByLotteriesAndNominals({
                lotteryIds: [lotteryId],
                nominalIds: nominalsInfo.map(el => el.id),
                transaction: transaction
            });
            const lotteryNominalStats = await sequelize.models.lotteryNominalStat.findAll({
                where: {
                    lotteryNominalId: lotteryNominals.map(ln => ln.id),
                    date: date
                }
            });
            lotteryNominalStats.forEach(el => console.log(el.id, el.lotteryNominalId));
            for (let ln of lotteryNominals) {
                // console.log(ln);
                // console.log(ln.lotteryNominalStats);
                let index = nominalsInfo.findIndex((el) => el.id === ln.nominalId);
                let lns = lotteryNominalStats.find((el) => el.lotteryNominalId === ln.id);
                // console.log(lns);
                ln.amount += nominalsInfo[index].broughtCirculation;
                lns.income += nominalsInfo[index].broughtCirculation;
                // console.log('found index: ', index, 'toAdd', nominalsInfo[index].broughtCirculation, 'updated', ln.amount);
                await ln.save({transaction: transaction});
                await lns.save({transaction: transaction});
            }
            return lotteryNominals;
        }
    }

    return LotteryNominal.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: [0],
                    msg: 'Остаток по лотерейным квитанциям не может быть отрицательным'
                }
            }
        },
        briefInfo: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.getDataValue('id')} ${this.getDataValue('amount')}`
            }
        }
    }, {
        sequelize,
        modelName: 'lotteryNominal',
        tableName: 'lottery_nominal',
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        paranoid: true
    });

}