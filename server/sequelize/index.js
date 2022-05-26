const day = require('./day/model');
const lottery = require('./lottery/model');
const lotteryNominal = require('./lotteryNominal/model');
const nominal = require('./nominal/model');
const pack = require('./pack/model');
const parcel = require('./parcel/model');
const partner = require('./partner/model');
const statByDay = require('./statByDay/model');
const user = require('./user/model');

const associations = require('./associations');

const initModels = async(sequelize) => {
    let models = [
        day,
        lottery,
        lotteryNominal,
        nominal,
        pack,
        parcel,
        partner,
        statByDay,
        user
    ];


    for (let i = 0; i < models.length; i++) {
        models[i] = (await models[i](sequelize));
    }

    models = models.reduce((a, v) => ({ ...a, [v.name]: v}), {})

    await associations(models);

    return {sequelize, models};
}

module.exports = initModels;