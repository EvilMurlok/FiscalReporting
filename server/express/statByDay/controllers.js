const config = require('../../config/dbConfigLocal');
const moment = require("moment");
const {Op} = require("sequelize");
const dbConnection = require('../../sequelize/dbConnection').getInstance({
    config: config,
    mode: 'development'
});


const getBalanceReport = async (req, res) => {
    let {date} = req.query;
    try {
        const remaindersData = await dbConnection.models.lotteryNominalStat.getBalanceReport({date: date});
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

const getSellsReport = async (req, res) => {
    let {from, to, partnerIds} = req.query;
    try {
        const sellsData = await dbConnection.models.statByDay.getSellsReport({from: from, to: to, partnerIds: partnerIds});
        // console.log('sellsData: ', sellsData);
        res.send({
            status: 'success',
            sellsData: sellsData,
            messages: [{
                text: `Отчет по продажам успешно составлен`
            }]
        });
    } catch(e) {
        // console.log(e);
        res.send({
            status: 'warning',
            message: e.message,
            messages: e.messages
        });
    }
}

const getCurrentBalanceForOneLottery = async (req, res) => {
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

        res.send({
            status: 'success',
            nominals: nominals,
            messages: [{
                text: `Отчет по остаткам успешно составлен`
            }]
        });
    } catch(e) {
        // console.log(e);
        let messages = '';
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
    getCurrentBalanceForOneLottery,
    getSellsReport
}