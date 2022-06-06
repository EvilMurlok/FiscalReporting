const {Model, DataTypes} = require('sequelize');
const {StatByDayCredentialsError} = require("../statByDay/errors");
const moment = require("moment");

module.exports = async (sequelize) => {
    class LotteryNominalStat extends Model {
        static getBalanceReport = async ({date = null}) => {
            // формат date — YYYY-MM-DD !!!
            if (!date) {
                throw new StatByDayCredentialsError("Date are expected!", [{
                    text: "Для получения статистики необходимо указать дату"
                }]);
            }
            if (moment(date, 'YYYY-MM-DD').diff(moment(await sequelize.models.day.max('date'), 'YYYY-MM-DD').format('YYYY-MM-DD')) >= 0) {
                throw new StatByDayCredentialsError("Stats are not ready!", [{
                    text: "Статистика по этому дню еще не собрана"
                }]);
            }
            const remains = await sequelize.models.lottery.findAll({
                attributes: [
                    'name',
                    [sequelize.literal('"lotteryNominals->nominal".value'), 'value'],
                    [sequelize.literal('"lotteryNominals->lotteryNominalStats"."amountAtEnd"'), 'amount']
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
                },
                raw: true,
                order: [["name", "ASC"]],
            });
            if (remains.length === 0) {
                throw new StatByDayCredentialsError("Information for this day has not yet been collected!", [{
                    text: "Информация по этому дню еще не собрана!"
                }]);
            }

            let remaindersData = [];

            for (let remain of remains) {
                let lotteryIndex = remaindersData.findIndex(rd => rd.lottery === remain.name);
                if (lotteryIndex === -1) {
                    remaindersData.push({
                        lottery: remain.name,
                        remainders: []
                    });
                } else {
                    let remainIndex = remaindersData[lotteryIndex].remainders.findIndex(r => r.value === remain.value);
                    if (remainIndex === -1) {
                        remaindersData[lotteryIndex].remainders.push({
                            value: remain.value,
                            amount: 0
                        });
                        remainIndex = remaindersData[lotteryIndex].remainders.length - 1;
                    }
                    remaindersData[lotteryIndex].remainders[remainIndex].amount += remain.amount;
                }
            }
            return remaindersData;
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