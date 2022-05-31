const config = require('../../config/dbConfigLocal');
const moment = require("moment");
const dbConnection = require('../../sequelize/dbConnection').getInstance({
    config: config,
    mode: 'development'
});


const allLotteries = async (req, res) => {
    const lotteries = await dbConnection.models.lottery.findAll({
        attributes: ["id", "name", "created"]
    });
    res.send({
        status: "success",
        lotteries: lotteries
    });
}

module.exports = {
    allLotteries,
}
