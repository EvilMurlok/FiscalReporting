const { Model, DataTypes } = require('sequelize');
const {StatByDayCredentialsError} = require("./errors");


module.exports = async(sequelize) => {
    class StatByDay extends Model {
        static getBalanceReport = async ({date}) => {
            if (!date) {
                throw new StatByDayCredentialsError("Date are expected!", [{
                    text: "Для получения статистики необходимо указать дату!"
                }]);
            }
            const stats = await sequelize.models.lottery.findAll({
                attributes: ['name', [sequelize.literal('"lotteryNominals->nominal".value'), 'value'], [sequelize.fn('sum', sequelize.col('amountAtEnd')), 'amount']],
                include: {
                    required: true,
                    model: sequelize.models.lotteryNominal,
                    attributes: [],
                    include: [
                        {
                            required: true,
                            model: sequelize.models.nominal,
                            attributes: []
                        },
                        {
                            model: sequelize.models.statByDay,
                            attributes: [],
                            required: true,
                            include: {
                                model: sequelize.models.day,
                                where: {
                                    date: date
                                },
                                attributes: [],
                                required:  true
                            }
                        }
                    ]
                },
                group: [['"lottery".id'], ["value"], ['name']],
                raw: true
            });

            if (stats.length === 0) {
                throw new StatByDayCredentialsError("Information for this day has not yet been collected!", [{
                    text: "Информация по этому дню еще не собрана!"
                }]);
            }

            let output = {
                remaindersData: [
                    {
                        lottery: stats[0].name,
                        remainders: [
                            {
                                value: stats[0].value,
                                amount: stats[0].amount
                            }
                        ]
                    }
                ]
            };
            let j = 0;
            for (let i = 1; i < stats.length; i++) {
                if (stats[i].name !== stats[i-1].name) {
                    // console.log(stats[i-1]);
                    output.remaindersData.push({
                        lottery: stats[i].name,
                        remainders: []
                    });
                    j++;
                    // console.log(output.remaindersData[j]);
                }
                // console.log(j, stats[i].value, stats[i].amount);
                output.remaindersData[j].remainders.push(
                    {
                        value: stats[i].value,
                        amount: stats[i].amount
                    }
                );
            }
            return output.remaindersData;
        }
    }

    return StatByDay.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        totalWin: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: {
                    args: 0,
                    msg: 'Общая сумма выигрыша не может быть отрицательной'
                }
            }
        },
        totalSold: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: 0,
                    msg: 'Количество проданных лотерейных квитанций не может быть отрицательным'
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
        modelName: 'statByDay',
        tableName: 'stat_by_day',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}