const axios = require("axios");
const moment = require("moment");

const config = require('../../config/dbConfigDocker');
const {PartnerCommonError, PartnerTransactionError} = require("../../sequelize/partner/errors");
const dbConnection = require('../../sequelize/dbConnection').getInstance({config: config, mode: 'development'});

const checkForPartnersUpdatesDaily = async ({date}) => {
    // отсылается запрос для получения актуального списка партнеров через axios
    let transaction = await dbConnection.sequelize.transaction();
    // TODO изменить токен для Таджикистана!
    try {
        const response = await axios.get("http://192.168.1.41:2001/partners/list", {
            headers: {
                'X-Auth-Token': "d4087b2a9f264c4e8337de40181dd785"
            }
        });
        // console.log(response.data);
        const currentPartners = await dbConnection.models.partner.findAll({
            attributes: ["id", "name", "closedAt", "internalId"],
        }, {transaction: transaction});
        // console.log(response);
        if (response.data["success"]) {
            let [availableClubsObj, availablePartnersArr] = [response.data, []];
            delete availableClubsObj["success"];
            for (let partnerIndex in availableClubsObj) {
                availablePartnersArr.push({
                    id: availableClubsObj[partnerIndex].id,
                    name: availableClubsObj[partnerIndex].name
                });
            }
            availablePartnersArr.sort((lhs, rhs) => {
                if (lhs.id > rhs.id) {
                    return 1;
                } else if (lhs.id < rhs.id) {
                    return -1;
                } else {
                    return 0;
                }
            });

            // availablePartnersArr = availablePartnersArr.slice(0, 299);

            const recentlyAddedPartners = [];
            for (let currentPartner of currentPartners) {
                recentlyAddedPartners.push(currentPartner);
                // если клуб есть в базе сервиса fiscal_reporting, но его нет в базе betTrade, то он был удален, и надо его отметить как "closedAt"
                let requiredNewPartner = availablePartnersArr.filter((partner) => currentPartner.internalId === partner.id);
                if (!requiredNewPartner.length) {
                    // тут возможно, что клуб уже был до этого закрыт, поэтому проверка на null-значение поля closedAt
                    if (currentPartner.closedAt === null) {

                        await dbConnection.models.partner.update({
                            closedAt: date.date,
                        }, {
                            where: {
                                internalId: currentPartner.internalId
                            }
                        }, {transaction: transaction});
                    }
                } else {
                    // если клуб уже есть, то, возможно, у него сменилось название, поэтому дополнительная проверка с изменением
                    requiredNewPartner = requiredNewPartner[0];
                    if (requiredNewPartner.name !== currentPartner.name) {
                        await dbConnection.models.partner.update({
                            name: requiredNewPartner.name,
                        }, {
                            where: {
                                internalId: currentPartner.internalId
                            }
                        }, {transaction: transaction});
                    }
                }
            }

            for (let availablePartner of availablePartnersArr) {
                // если клуб есть в betTrade, но его нет в базе сервиса fiscal_reporting, то он не был еще добавлен
                const requiredPartner = currentPartners.filter((partner) => availablePartner.id === partner.internalId);
                if (!requiredPartner.length) {
                    const createdPartner = await dbConnection.models.partner.create({
                        name: availablePartner.name,
                        closedAt: null,
                        internalId: availablePartner.id
                    }, {transaction: transaction});
                    await createdPartner.setDays([date], {transaction: transaction});
                    recentlyAddedPartners.push(createdPartner);
                }
            }
            await transaction.commit();
            return recentlyAddedPartners;
        } else {
            throw new PartnerCommonError("Unable to get the list of partners!", [{
                text: "Не удалось получить список партнеров из BetTrade!"
            }]);
        }
    } catch (e) {
        await transaction.rollback();
        console.log(e);
        throw new PartnerTransactionError(e.message, [{
            text: "При обновлении списка партнеров возникла ошибка!"
        }]);
    }
}

module.exports = {
    checkForPartnersUpdatesDaily
}