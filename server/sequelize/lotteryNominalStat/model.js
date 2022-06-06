const {Model, DataTypes} = require('sequelize');
const {StatByDayCredentialsError} = require("../statByDay/errors");
const moment = require("moment");

module.exports = async (sequelize) => {
    class LotteryNominalStat extends Model {
        static getBalanceReport = async({date = null}) => {
            // формат date — YYYY-MM-DD !!!
            if (!date) {
                throw new StatByDayCredentialsError("Date are expected!", [{
                    text: "Для получения статистики необходимо указать дату"
                }]);
            }
            if (moment(date, 'YYYY-MM-DD').diff(moment().format('YYYY-MM-DD')) >= 0) {
                throw new StatByDayCredentialsError("Date are expected!", [{
                    text: "Статистика по этому дню еще не собрана"
                }]);
            }
            const remains = await sequelize.models.lottery.findAll({
                attributes: [
                    'name',
                    [sequelize.literal('"lotteryNominals->nominal".value'), 'value'],
                    [sequelize.literal('"lotteryNominalStat".amountAtEnd'), 'amount']
                ],
                include: {
                    model: sequelize.models.lotteryNominal,
                    required: true,
                    attributes: [],
                    include: [
                        {
                            required: true,
                            model: sequelize.models.nominal,
                            attributes: []
                        },
                        {
                            model: sequelize.models.lotteryNominalStat,
                            attributes: [],
                            required: true,
                            where: {
                                date: date
                            }
                        }
                    ]
                }
            });

            console.log(remains.dataValues);

            let output = {
                remaindersData: [
                    {
                        lottery: remains[0].name,
                        remainders: [
                            {
                                value: remains[0].value,
                                amount: remains[0].amount
                            }
                        ]
                    }
                ]
            };
            let j = 0;
            for (let i = 1; i < remains.length; i++) {
                if (remains[i].name !== remains[i-1].name) {
                    output.remaindersData.push({
                        lottery: remains[i].name,
                        remainders: []
                    });
                    j++;
                }
                output.remaindersData[j].remainders.push(
                    {
                        value: remains[i].value,
                        amount: remains[i].amount
                    }
                );
            }
            return output.remaindersData;
        }
    }

    return LotteryNominalStat.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        amountAtStart: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: [0],
                    msg: 'Количество лотерейных квитанций на начало дня не может быть отрицательным'
                }
            }
        },
        income: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: [0],
                    msg: 'Поступление лотерейных квитанций отрицательным'
                }
            }
        },
        amountAtEnd: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: {
                    args: [0],
                    msg: 'Количество лотерейных квитанций на конец дня не может быть отрицательным'
                }
            }
        },
        briefInfo: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.getDataValue('id')} ${this.getDataValue('amountAtStart')} ${this.getDataValue('income')} ${this.getDataValue('amountAtEnd')}`
            }
        }
    }, {
        sequelize,
        modelName: 'lotteryNominalStat',
        tableName: 'lottery_nominal_stat',
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        paranoid: true
    });

}