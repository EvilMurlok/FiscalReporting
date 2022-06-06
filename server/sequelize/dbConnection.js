const {Sequelize} = require('sequelize');
const initModels = require('./index');
const dbConfig = require('../config/dbConfigDocker');

const lotteriesJSON = require('../data/lotteries.json');
const nominalsJSON = require('../data/nominals.json');
const partnersJSON = require('../data/partners.json');
const {Op} = require("sequelize");
const moment = require("moment");

class DBConnection {
    constructor({config = null, mode = ''}) {
        this.sequelize = new Sequelize(
            dbConfig[mode].database,
            dbConfig[mode].user,
            dbConfig[mode].password,
            {
                host: dbConfig[mode].host,
                port: dbConfig[mode].port,
                dialect: dbConfig[mode].dialect,
                dialectOptions: {
                    useUTC: false,
                },
                timezone: "+03:00"
            },
        );
        this.models = null;
    }

    static getInstance({config = null, mode = ''}) {
        if (!this.instance) {
            this.instance = new DBConnection({config: config, mode: mode});
        }

        return this.instance;
    }

    async connectToDatabase() {
        try {
            await this.sequelize.authenticate();
            const output = await initModels(this.sequelize);
            this.sequelize = output.sequelize;
            this.models = output.models;
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    async migrate({force = false}) {
        const output = await initModels(this.sequelize);
        await this.sequelize.sync({force: force});
        this.sequelize = output.sequelize;
        this.models = output.models;
        console.log('All models were synchronized successfully.');
    }

    async insert() {
        let root = this.models.user.create({
            username: 'root',
            password: 'qwerty123',
            role: 'root'
        });
        await this.models.day.create({
            date: moment().subtract(5, "day"),
            coefficient: 0.1
        });
    }

    async insertBasic() {
        const date = new Date();
        let root = this.models.user.create({
            username: 'root',
            password: 'qwerty123',
            role: 'root'
        });
        let lotteries = lotteriesJSON.lotteries;
        lotteries = await this.models.lottery.bulkCreate(lotteries);
        let nominals = nominalsJSON.nominals;
        nominals = await this.models.nominal.bulkCreate(nominals);
        let partners = partnersJSON.partners;
        partners = await this.models.partner.bulkCreate(partners);
        let ln = [];
        for (let lottery of lotteries) {
            for (let nominal of nominals) {
                ln.push({
                    amount: 0,
                    nominalId: nominal.id,
                    lotteryId: lottery.id
                });
            }
            await lottery.setPartners(partners);
        }
        let lotteryNominals = await this.models.lotteryNominal.bulkCreate(ln);

        let lns = [];
        for (let lotteryNominal of lotteryNominals) {
            lns.push({
                amountAtStart: 0,
                income: 0,
                amountAtEnd: null,
                date: date,
                lotteryNominalId: lotteryNominal.id
            });
        }

        let lotteryNominalStats = await this.models.lotteryNominalStat.bulkCreate(lns);

        // мб придется подправить этот момент
        const today = await this.models.day.create({
            date: date,
            coefficient: 0.1
        });
        await today.setPartners(partners);
        let stats = [];
        for (let partner of partners) {
            for (let el of lotteryNominals) {
                stats.push({
                    amountAtEnd: 0,
                    totalWin: 0,
                    totalSold: 0,
                    partnerId: partner.id,
                    lotteryNominalId: el.id,
                    dayId: today.id
                });
            }
        }
        // stats.forEach(st => console.log(st));
        await this.models.statByDay.bulkCreate(stats);
    }

    async insertStatsForNextDay({date = ''}) {

        // date: YYYY-MM-DD ДАТА ПРЕДЫДУЩЕГО ДНЯ!!!!!!!!!!!!!

        // Получили все статы за предыдущий день
        const stats = await this.models.statByDay.findAll({
            include: {
                model: this.models.day,
                required: true,
                where: {
                    date: date
                },
                attributes: ['date']
            },
            order: [
                ['dayId', 'ASC'],
                ['partnerId', 'ASC'],
                ['lotteryNominalId', 'ASC']
            ],
            attributes: [
                'id', 'totalWin',
                'totalSold', 'dayId', 'partnerId', 'lotteryNominalId'
            ]
        });

        // stats.forEach(el => console.log(el.partnerId, el.lotteryNominalId, el.amountAtStart, el.amountAtEnd));

        // обновленный список партнеров
        const partners = await this.models.partner.findAll({
            order: [['id', 'ASC']],
            attributes: ['id', 'name', 'internalId']
        });

        const yesterdayKq = await this.models.day.findOne({
            where: {
                date: moment(date, 'YYYY-MM-DD'),
                coefficient: {
                    [Op.lt]: 1
                }
            },
            attributes: ["id", "date", "coefficient"]
        });
        // console.log(yesterdayKq.date, yesterdayKq.coefficient);

        // const allPartners = await this.models.partner.findAll({
        //     attributes: ["id"]
        // });
        const t = await this.sequelize.transaction();
        let insertedCoefficientToday = null;
        try {
            insertedCoefficientToday = await this.models.day.create({
                date: moment(date, 'YYYY-MM-DD').add(1, 'day'),
                coefficient: yesterdayKq.coefficient
            }, {transaction: t});
            await insertedCoefficientToday.setPartners(partners, {transaction: t});
        } catch (e) {
            await t.rollback();
        }

        // partners.forEach(el => console.log(el.id, el.name));

        const lns = await this.models.lotteryNominal.findAll({
            include: [
                {
                    model: this.models.nominal,
                    required: true,
                    attributes: ['id', 'value']
                },
                // {
                //     model: this.models.lotteryNominalStat,
                //     required: true,
                //     attributes: ['amountAtStart', 'income', 'amountAtEnd'],
                //     where: {
                //         date: date
                //     }
                // }
            ],
            order: [['id', 'ASC']],
            attributes: ['id', 'lotteryId']
        });

        // lns.forEach(el => console.log(el.id, el.nominal.value, el.lotteryNominalStats[0].dataValues));

        // стата за следующий день
        const magicArray = [];
        for (let i = 0; i < partners.length; i++) {
            for (let j = 0; j < lns.length; j++) {
                magicArray.push({
                    partnerId: partners[i].internalId,
                    lotteryId: lns[j].lotteryId,
                    nominal: lns[j].nominal.value,
                    totalWin: Math.random() * (600 - 100) + 100,
                    totalSold: Math.floor(Math.random() * 50)
                });
            }
        }

        // magicArray.forEach(el => console.log(el.partnerId, el.nominal, el.totalWin, el.totalSold));
        //
        // TODO сделать один большой апдейт (сейчас пиздец)
        // Обновляем статистику партнеров по продажам и выигрышам и считаем, сколько всего продали все клубы по лотереям
        let newPartnerStats = [];
        let totalSold = [];
        for (let magic of magicArray) {
            // по-любому находим партнера, так как перед началом данного методо обновляем их список!
            let partner = partners.find(p => p.internalId === magic.partnerId);
            // TODO сначала искать лотерею, если не нашли — добавлять лотерею, потом искать номинал в лотерее,
            //  если не нашли, то добавлять номинал в существующую лотерею

            let ln = lns.find(ln => ln.nominal.value === magic.nominal && ln.lotteryId === magic.lotteryId);

            // если не нашли лотерейный номинал (строчка сверху), то партнер дал возможность играть у себя в лоторею,
            // которая ранее у него не игралась, либо у старой лотереи добавился новый номинал
            if (!ln) {

            }

            // нашли статистику по номиналу в нужной лотерее за прошлый день
            let st = stats.find(st => st.partnerId === partner.id && st.lotteryNominalId === ln.id);
            // если не находим, то новый номинал или новая лотерея или новый партнер
            if (st) {
                st.totalWin = magic.totalWin;
                st.totalSold = magic.totalSold;
                // пытаемся найти элемент массива, с суммарной продажей по нужному нам номиналу лотереи
                let lotteryNominalSellIndex = totalSold.findIndex(el => el.lotteryNominalId === st.lotteryNominalId);
                if (lotteryNominalSellIndex === -1) {
                    // первая запись о продажах номинала этой лотереи
                    totalSold.push({
                        lotteryNominalId: st.lotteryNominalId,
                        amount: magic.totalSold
                    });
                } else {
                    // прибавляем продажу конкретного номинала
                    // в конкретном клубе к общим продажам по номиналу этой лотереи
                    totalSold[lotteryNominalSellIndex].amount +=  magic.totalSold;
                }
                await st.save();
            } else {
                // если не нашли запись в statByDay о конкретном номинале, в конкретной лотерее, в конкретном клубе,
                // то надо добавить запись об этом за предыдущий день тоже!!!!!!!
                newPartnerStats.push({
                    totalWin: 0,
                    totalSold: 0,
                    dayId: yesterdayKq.id,
                    partnerId: partner.id,
                    lotteryNominalId: ln.id
                });
            }
            newPartnerStats.push({
                totalWin: 0,
                totalSold: 0,
                dayId: insertedCoefficientToday.id,
                partnerId: partner.id,
                lotteryNominalId: ln.id
            });
        }
        // TODO сделать по тиражу на каждый элемент массива
        // totalSold.forEach(el => console.log(el));

        const lotteryNominalStats = await this.models.lotteryNominalStat.findAll({
            where: {
                lotteryNominalId: lns.map(ln => ln.id),
                date: date
            }
        });

        let needToAdd = [];
        let newLotteryNominalStats = [];
        for (let sell of totalSold) {
            let ln = lns.find(ln => ln.id === sell.lotteryNominalId);
            let lnStat = lotteryNominalStats.find((el) => el.lotteryNominalId === ln.id);
            // console.log('ln:', ln);
            // ln: id, nominal.value, lotteryNominalStats[0]: amountAtStart, income, amountAtEnd
            // lns.forEach(el => console.log(el.id, el.nominal.value, el.lotteryNominalStats[0].dataValues));
            let amountAtStart = lnStat.amountAtStart;
            let newAmountAtStart = 0;
            let income = lnStat.income;
            if (sell.amount > amountAtStart + income) {
                let broughtCirculation = null;
                if (lnStat.amountAtEnd === null) {
                    // изменяем данные по вчерашней статистике
                    broughtCirculation = sell.amount - (amountAtStart + income)
                } else {
                    // изменяем историческую статистику
                    broughtCirculation = sell.amount - (amountAtStart + income + lnStat.amountAtEnd);
                }
                let parcel = needToAdd.find(el => el.lotteryId === ln.lotteryId);
                if (parcel) {
                    let nominal = parcel.nominals.find(p => p.id === ln.nominal.id);
                    if (nominal) {
                        nominal.broughtCirculation += broughtCirculation;
                    } else {
                        parcel.nominals.push({
                            id: ln.nominal.id,
                            broughtCirculation: broughtCirculation
                        });
                    }
                } else {
                    needToAdd.push({
                        lotteryId: ln.lotteryId,
                        date: date,
                        nominals: [
                            {
                                id: ln.nominal.id,
                                broughtCirculation: broughtCirculation
                            }
                        ]
                    });
                }
                lnStat.amountAtEnd = 0;
            } else {
                lnStat.amountAtEnd = amountAtStart + income - sell.amount;
                newAmountAtStart = amountAtStart + income - sell.amount;
            }
            await lnStat.save();
            newLotteryNominalStats.push({
                amountAtStart: newAmountAtStart,
                income: 0,
                amountAtEnd: null,
                date: insertedCoefficientToday.date,
                lotteryNominalId: ln.id
            });
        }

        // console.log(needToAdd);

        const root = await this.models.user.findOne({
            where: {
                username: 'root'
            }
        });

        // needToAdd.forEach(el => console.log(el));

        for (let pack of needToAdd) {
            await this.models.pack.createWithParcels({
                user: root,
                packInfo: pack,
                date: date,
                transaction: t
            });
        }
        // надо дозаполнить массив нулями (чтоб было как на клиенте)
        // TODO записать статистику на новый день
        // newPartnerStats.forEach(el => console.log(el));
        // newLotteryNominalStats.forEach(el => console.log(el));
        await this.models.statByDay.bulkCreate(newPartnerStats, {transaction: t});
        await this.models.lotteryNominalStat.bulkCreate(newLotteryNominalStats, {transaction: t});
        await t.commit();
    }
}

module.exports = DBConnection;