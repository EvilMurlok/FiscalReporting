const {Op} = require('sequelize');

const config = require('../../config/dbConfigDocker');
const {StatByDayCredentialsError} = require("../../sequelize/statByDay/errors");
const dbConnection = require('../../sequelize/dbConnection').getInstance({config: config, mode: 'development'});

const getCoefficientsByInterval = async ({from = "", to = "", internalPartnerIds = []}) => {
    if (!from || !to || !internalPartnerIds.length) {
        throw new StatByDayCredentialsError("Wrong credentials for getting stats", [{
            text: "Для получения статистики необходимо указать временной интервал и идентификаторы партнеров!"
        }]);
    }
    // получаем Kq для каждого партнера за интересующий интервал
    const tempRequiredStats = await dbConnection.models.day.findAll({
        where: {
            date: {
                [Op.lte]: to,
                [Op.gte]: from
            }
        },
        attributes: ["coefficient"],
        include: {
            where: {
               internalId: internalPartnerIds
            },
            model: dbConnection.models.partner,
            required: true,
            attributes: ["internalId"],
            through: {attributes: []}
        }
    });
    const requiredStats = [];
    for (let tempRequiredStat of tempRequiredStats) {
        const tmp = {
            from: from,
            to: to,
            kq: tempRequiredStat.coefficient,
            partnerIds: tempRequiredStat.partners.map(partner => partner.internalId)
        };
        console.log(tmp);
        requiredStats.push(tmp);
    }
    return requiredStats;
}

module.exports = {
    getCoefficientsByInterval
}