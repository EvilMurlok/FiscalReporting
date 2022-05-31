const moment = require("moment");
const {Op} = require('sequelize');

const config = require('../../config/dbConfigDocker');
const dbConnection = require('../../sequelize/dbConnection').getInstance({config: config, mode: 'development'});

const changeKqDaily = async () => {
    const yesterdayKq = await dbConnection.models.day.findOne({
        where: {
            date: moment().add(3, "hours").subtract(1, "day").format("YYYY-MM-DD"),
            // date: moment().add(3, "hours").format("YYYY-MM-DD"),
            coefficient: {
                [Op.lt]: 1
            }
        },
        attributes: ["date", "coefficient"]
    });
    console.log(yesterdayKq.date, yesterdayKq.coefficient);

    const allPartners = await dbConnection.models.partner.findAll({
        attributes: ["id"]
    });
    const t = await dbConnection.sequelize.transaction();
    try {
        const insertedCoefficientToday = await dbConnection.models.day.create({
            date: moment().add(3, "hours").format("YYYY-MM-DD"),
            coefficient: yesterdayKq.coefficient
        }, {transaction: t});
        await insertedCoefficientToday.setPartners(allPartners, {transaction: t});
        await t.commit();
    } catch (e) {
        await t.rollback();
    }
}

module.exports = {
    changeKqDaily
}