const config = require('../../config/dbConfigDocker');
const dbConnection = require('../../sequelize/dbConnection').getInstance({config: config, mode: 'development'});

const getAllPartners = async (req, res) => {
    const allPartners = await dbConnection.models.partner.findAll({
        attributes: ["id", "name", "closedAt"],
    });
    const [openedPartners, closedPartners] = [[], []];
    for (let partner of allPartners) {
        if (partner.closedAt) {
            closedPartners.push(partner);
        } else {
            openedPartners.push(partner);
        }
    }
    res.send({
        status: "success",
        availablePartners: openedPartners,
        disabledPartners: closedPartners
    });
}

module.exports = {
    getAllPartners,
};