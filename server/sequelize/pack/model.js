const { Model, DataTypes } = require('sequelize');
const {PackCredentialsError} = require("./errors");
const moment = require("moment");


module.exports = async(sequelize) => {
    class Pack extends Model {
        /**
         * Создать Pack вместе с Parcel'ами
         * @param user
         * @param packInfo объект вида: {
         *     lotteryId: идентификатор лотереи,
         *     date: дата создания тиража НА КЛИЕНТЕ
         *     nominals: [
         *         {
         *             id: идентификатор номинала,
         *             broughtCirculation: часть внесенного тиража по конкретно этому номиналу
         *         }
         *         ...
         *     ]
         * }
         * @param date
         * @param transaction транзакция запросов
         * @returns {Promise<void>}
         */
        static createWithParcels = async({ user = null, packInfo = null, date = null, transaction = null}) => {
            if (!user) {
                throw new PackCredentialsError(
                    'Неверные данные для создания Тиража',
                    [{
                        text: 'Для создания тиража необходимо передать информацию ' +
                            'о пользователе'
                    }]
                );
            }
            if (user.role === 'employee') {
                throw new PackCredentialsError(
                    'Неверные данные для создания Тиража',
                    [{
                        text: 'Сотрудник не может вносить новый тираж'
                    }]
                );
            }
            if (!packInfo) {
                throw new PackCredentialsError(
                    'Неверные данные для создания Тиража',
                    [{
                        text: 'Для создания тиража необходимо передать информацию ' +
                            'о вносимых номиналах и лотерее, к которой тираж относится'
                    }]
                );
            }
            if (!date) {
                throw new PackCredentialsError(
                    'Неверные данные для создания Тиража',
                    [{
                        text: 'Для создания тиража необходимо передать информацию ' +
                            'о текущей дате'
                    }]
                );
            }
            packInfo.nominals.sort((a, b) => {
                if (a.id <= 0 || b.id <= 0) {
                    throw new PackCredentialsError(
                        'Неверные данные для создания Тиража',
                        [{
                            text: 'В списке пополнений номиналов должны быть ' +
                                'только реальные идентификаторы номиналов (положительные)'
                        }]
                    );
                }
                if (a.id < b.id) {
                    return -1;
                }
                if (a.id > b.id) {
                    return 1;
                }
                throw new PackCredentialsError(
                    'Неверные данные для создания Тиража',
                    [{
                        text: 'В списке пополнений номиналов не должно быть повторяющихся идентификаторов номиналов'
                    }]
                );
            });
            const lotteryNominals = await sequelize.models.lotteryNominal.updateAmountByLotteryAndNominals({
                lotteryId: packInfo.lotteryId,
                nominalsInfo: packInfo.nominals,
                date: date,
                transaction: transaction
            });

            let parcelsInfo = [];
            for (let i = 0; i < lotteryNominals.length; i++) {
                parcelsInfo.push(Object.assign({}, {
                    amount: packInfo.nominals[i].broughtCirculation,
                    lotteryNominalId: lotteryNominals[i].id
                }));
            }
            return await sequelize.models.pack.create({
                status: 'relevant',
                date: date,
                userId: user.id,
                lotteryId: packInfo.lotteryId,
                parcels: parcelsInfo
            }, {
                include: [{
                    association: sequelize.models.pack.parcels
                }],
                transaction: transaction
            });
        }

        static getHistory = async ({date}) => {
            if (!date) {
                date = moment().format('YYYY-MM-DD');
            } else if (moment().diff(moment(date, 'YYYY-MM-DD')) < 0) {
                throw new PackCredentialsError("Selected date has not yet arrived!", [{
                    text: "Выбранная дата еще не наступила!"
                }]);
            }
            const packInfo = await sequelize.models.pack.findAll({
                where: {
                    date: date
                },
                include: [
                    {
                        model: sequelize.models.parcel,
                        required: true,
                        attributes: ['amount', 'lotteryNominalId']
                    },
                    {
                        model: sequelize.models.lottery,
                        required: true,
                        attributes: ['name'],
                        include: {
                            model: sequelize.models.lotteryNominal,
                            attributes: ['id'],
                            include: {
                                model: sequelize.models.nominal,
                                attributes: ['value']
                            },
                        },
                    }
                ],
                attributes: ['id', 'date', 'status', 'lotteryId'],
                order: [[sequelize.models.lottery, "name", "ASC"],
                    [sequelize.models.lottery, sequelize.models.lotteryNominal, sequelize.models.nominal, 'value', 'ASC']]
            });


            if (packInfo.length === 0) {
                throw new PackCredentialsError("No draws have been added on this date!", [{
                    text: "В эту дату не было добавлено ни одного тиража!"
                }]);
            }

            return packInfo.map(pack => {
                const composition = pack.lottery.lotteryNominals.map(ln => {
                    const index = pack.parcels.findIndex((el) => el.lotteryNominalId === ln.id)
                    if (index === -1) {
                        return Object.assign({}, {
                            'value': ln.nominal.value,
                            'amount': 0
                        });
                    }
                    return Object.assign({}, {
                        'value': ln.nominal.value,
                        'amount': pack.parcels[index].amount
                    });
                });
                return Object.assign({}, {
                    id: pack.id,
                    dateOfIssue: pack.date,
                    lottery: pack.lottery.name,
                    composition: composition
                });
            });
        }
    }

    return Pack.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: DataTypes.ENUM('relevant', 'sold out'),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Необходимо указать статус тиража'
                }
            }
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        briefInfo: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.getDataValue('id')} ${this.status} ${this.getDataValue('date')}`
            }
        }
    }, {
        modelName: 'pack',
        tableName: 'pack',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}