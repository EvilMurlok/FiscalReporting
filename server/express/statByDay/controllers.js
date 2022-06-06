const config = require('../../config/dbConfigDocker');
const dbConnection = require('../../sequelize/dbConnection').getInstance({
    config: config,
    mode: 'development'
});


const getBalanceReport = async (req, res) => {
    let {date} = req.query;
    try {
        const remaindersData = await dbConnection.models.statByDay.getBalanceReport({date: date});
        res.send({
            status: 'success',
            remaindersData: remaindersData,
            messages: [{
                text: `Отчет по остаткам успешно составлен`
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

const getBalanceReportForOneLottery = async (req, res) => {
    const id = req.params.id;
    try {
        const nominals = await dbConnection.models.lottery.findAll({
            where: {
                id: id
            },
            attributes: [
                [dbConnection.sequelize.literal('"lotteryNominals->nominal".id'), 'id'],
                [dbConnection.sequelize.literal('"lotteryNominals".amount'), 'currentAmount'],
                [dbConnection.sequelize.literal('"lotteryNominals->nominal".value'), 'value']
            ],
            include: {
                model: dbConnection.models.lotteryNominal,
                attributes: [],
                include: {
                    model: dbConnection.models.nominal,
                    attributes: [],
                }
            },
            order: [[dbConnection.models.lotteryNominal, dbConnection.models.nominal, "value", "ASC"]],
            raw: true,
        });

        if (nominals.length === 0) {
            res.send({
                status: 'warning',
                messages: [{
                    text: `Попытка получить информацию по лотерее не из системы`
                }]
            });
            return;
        }

        // let output = {
        //     remaindersData: [
        //         {
        //             lottery: stats[0].name,
        //             remainders: [
        //                 {
        //                     value: stats[0].value,
        //                     amount: stats[0].amount
        //                 }
        //             ]
        //         }
        //     ]
        // };
        // let j = 0;
        // for (let i = 1; i < stats.length; i++) {
        //     if (stats[i].name !== stats[i-1].name) {
        //         // console.log(stats[i-1]);
        //         output.remaindersData.push({
        //             lottery: stats[i].name,
        //             remainders: []
        //         });
        //         j++;
        //         // console.log(output.remaindersData[j]);
        //     }
        //     // console.log(j, stats[i].value, stats[i].amount);
        //     output.remaindersData[j].remainders.push(
        //         {
        //             value: stats[i].value,
        //             amount: stats[i].amount
        //         }
        //     );
        // }

        res.send({
            status: 'success',
            nominals: nominals,
            messages: [{
                text: `Отчет по остаткам успешно составлен`
            }]
        });
    } catch(e) {
        console.log(e);
        let messages;
        if (e.errors) {
            messages = e.errors.map(msg => {
                return {text: msg.message};
            })
        } else {
            messages = e.messages
        }
        res.send({
            status: 'warning',
            message: e.message,
            messages: messages
        });
    }
}

module.exports = {
    getBalanceReport,
    getBalanceReportForOneLottery
}