const { Model, DataTypes, Op } = require('sequelize');
const {StatByDayCredentialsError} = require("./errors");
const moment = require("moment");


module.exports = async(sequelize) => {
    class StatByDay extends Model {
        static getBalanceReport = async ({date}) => {
            // TODO переделать и вообще выкинуть этот метод в таблицу lotteryNominalStats
            // формат даты: YYYY-MM-DD
            if (!date) {
                throw new StatByDayCredentialsError("Date are expected!", [{
                    text: "Для получения статистики необходимо указать дату!"
                }]);
            }
            // если дата, по которой строится отчет сегодняшняя, либо из будущего
            console.log(`${moment(new Date(date))} >= ${moment(new Date()).subtract(1, 'day')}?`)
            if (moment(date) >= moment(new Date()).subtract(1, 'day')) {
                throw new StatByDayCredentialsError("No report for this date yet!", [{
                    text: "По этой дате данные еще не поступили!"
                }]);
            }
            const stats = await sequelize.models.lottery.findAll({
                attributes: ['name', [sequelize.literal('"lotteryNominals->nominal".value'), 'value'], [sequelize.fn('sum', sequelize.col('lotteryNominals->lotteryNominalStats"."amountAtEnd')), 'amount']],
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

        static getSellsReport = async({from = null, to = null, partnerIds = null}) => {
            if (!from) {
                throw new StatByDayCredentialsError("Date are expected!", [{
                    text: "Для получения статистики необходимо указать начальную дату!"
                }]);
            }
            if (!to) {
                throw new StatByDayCredentialsError("Date are expected!", [{
                    text: "Для получения статистики необходимо указать конечную дату!"
                }]);
            }
            if (moment(from) > moment(to)) {
                throw new StatByDayCredentialsError("No report for this date yet!", [{
                    text: "Начальная дата больше конечной!"
                }]);
            }
            if (!partnerIds) {
                throw new StatByDayCredentialsError("Date are expected!", [{
                    text: "Для получения статистики по продажам, необходимо указать, по каким партнерам ее собрать!"
                }]);
            }
            // если дата, по которой строится отчет сегодняшняя, либо из будущего
            // console.log(`${moment(new Date(date))} >= ${moment(new Date()).subtract(1, 'day')}?`)
            if (moment(to) >= moment(new Date()).subtract(1, 'day')) {
                throw new StatByDayCredentialsError("No report for this date yet!", [{
                    text: "По этой дате данные еще не поступили!"
                }]);
            }

            // Получаем все даты между from и to
            const getDatesBetween = function (from, to) {
                let res = [];
                let currDate = moment(from).startOf('day');
                let lastDate = moment(to).startOf('day');
                res.push(currDate.format('YYYY-MM-DD'));

                while(currDate.add(1, 'days').diff(lastDate) <= 0) {
                    console.log(currDate.format('YYYY-MM-DD'));
                    res.push(currDate.format('YYYY-MM-DD'));
                }

                return res;
            }
            const dates = getDatesBetween(from, to);

            console.log(dates);

            /*
            Хочу такое
            Select
                l."name",
                n."value",
                sum(sbd."totalSold") as totalSold,
                sum(sbd."totalWin") as totalWin,
                sum(sbd."totalWin") * 0.13 as totalTax
            From partner p
                Join partner_lottery pl on p."id" = pl."partnerId"
                    Join lottery l on l."id" = pl."lotteryId"
                        Join lottery_nominal ln on l."id" = ln."lotteryId"
                            Join nominal n on n."id" = ln."nominalId"
                Join partner_day pd on p."id" = pd."partnerId"
                    Join day d on d.id = pd."dayId"
                Join stat_by_day sbd on
                    sbd."dayId" = d."id"
                    and
                    sbd."lotteryNominalId" = ln."id"
                    and
                    sbd."partnerId" = p."id"
            Where
                d."date" = '2022-06-02'
                and
                p."id" in (1, 2)
            Group by l."name", n."value";
             */

            const stats = await sequelize.models.partner.findAll({
                where: {
                    id: partnerIds
                },
                includeIgnoreAttributes: false,
                attributes: [
                    [sequelize.literal('"lotteries".name'), 'lotteryName'],
                    [sequelize.literal('"lotteries->lotteryNominals->nominal".value'), 'value'],
                    [sequelize.fn('sum', sequelize.col('"statByDays".totalSold')), 'totalSold'],
                    [sequelize.fn('sum', sequelize.col('"statByDays".totalWin')), 'totalWin'],
                    [sequelize.literal('0.13 * sum("statByDays"."totalWin")'), 'totalTax']
                ],
                include: [
                    {
                        model: sequelize.models.lottery,
                        required: true,
                        attributes: [],
                        include: {
                            model: sequelize.models.lotteryNominal,
                            required: true,
                            attributes: [],
                            include: {
                                model: sequelize.models.nominal,
                                required: true,
                                attributes: [],
                            },
                        },
                    },
                    {
                        model: sequelize.models.day,
                        required: true,
                        attributes: [],
                        where: {
                            date: dates
                        }
                    },
                    {
                        model: sequelize.models.statByDay,
                        required: true,
                        attributes: [],
                        where: {
                            lotteryNominalId: [sequelize.col('"lotteries->lotteryNominals".id')],
                            dayId: [sequelize.col('"days".id')]
                        }
                    }
                ],
                group: [['"days".id'], ['lotteryName'], ['"lotteries->lotteryNominals".id'], ["value"]],
                raw: true
            });

            if (stats.length === 0) {
                throw new StatByDayCredentialsError("Information for this day has not yet been collected!", [{
                    text: "Информация по этому дню еще не собрана!"
                }]);
            }

            let output = [];

            for (let stat of stats) {
                let lotteryIndex = output.findIndex(el => el.lotteryName === stat.lotteryName);
                if (lotteryIndex === -1) {
                    output.push({
                        lotteryName: stat.lotteryName,
                        nominals: [],
                        totalSold: 0,
                        totalWin: 0,
                        totalTax: 0
                    });
                    // индекс последнего элемента
                    lotteryIndex = output.length - 1;
                    // console.log(output, output.length, lotteryIndex);
                }
                let nominalIndex = output[lotteryIndex].nominals.findIndex(el => el.value === stat.value);
                if (nominalIndex === -1) {
                    output[lotteryIndex].nominals.push({
                        value: stat.value,
                        sold: stat.totalSold
                    });
                    // индекс последнего элемента
                } else {
                    output[lotteryIndex].nominals[nominalIndex].sold += stat.totalSold;
                }
                output[lotteryIndex].totalWin += stat.totalWin;
                output[lotteryIndex].totalTax += stat.totalTax;
                output[lotteryIndex].totalSold += stat.totalSold * stat.value;
            }

            return output;
        }
    }

    return StatByDay.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // amountAtStart: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     validate: {
        //         min: {
        //             args: [0],
        //             msg: 'Количество лотерейных квитанций на начало дня не может быть отрицательным'
        //         }
        //     }
        // },
        // amountAtEnd: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     validate: {
        //         min: {
        //             args: [0],
        //             msg: 'Количество лотерейных квитанций на конец дня не может быть отрицательным'
        //         }
        //     }
        // },
        totalWin: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: {
                    args: [0],
                    msg: 'Общая сумма выигрыша не может быть отрицательной'
                }
            }
        },
        totalSold: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: [0],
                    msg: 'Количество проданных лотерейных квитанций не может быть отрицательным'
                }
            }
        },
        briefInfo: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.getDataValue('id')} ${this.getDataValue('amountAtEnd')}`
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