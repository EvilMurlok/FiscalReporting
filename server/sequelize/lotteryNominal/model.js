const { Model, DataTypes } = require('sequelize');
const {LotteryNominalCredentialsError} = require("./errors");

module.exports = async(sequelize) => {
    class LotteryNominal extends Model {
        /**
         * Найти номиналы лотерей.
         * Можно указывать и иденификаторы, и названия/значения.
         * В таком случае будут найдены записи с указаным идентификатором И с указанным названием/значением
         * @param lotteryIds
         * @param lotteryNames
         * @param nominalIds
         * @param nominalValues
         * @returns {Promise<LotteryNominal[]>}
         */
        static findByLotteryAndNominal = async({
                                                   lotteryIds = [],
                                                   lotteryNames = [],
                                                   nominalIds = [],
                                                   nominalValues = []
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
            console.log(includeParams);
            return await this.findAll({
                include: includeParams,
            })
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
                    args: 0,
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
        modelName: 'lotteryNominal',
        tableName: 'lottery_nominal',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}