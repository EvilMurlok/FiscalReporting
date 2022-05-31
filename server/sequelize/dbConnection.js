const {Sequelize} = require('sequelize');
const initModels = require('./index');
const dbConfig = require('../config/dbConfigDocker');

const lotteriesJSON = require('../data/lotteries.json');
const nominalsJSON = require('../data/nominals.json');
const partnersJSON = require('../data/partners.json');

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

    async insertBasic() {
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

        // мб придется подправить этот момент
        const today = await this.models.day.create({
            date: new Date(),
            coefficient: 0.1
        });
        await today.setPartners(partners);
        let stats = [];
        for (let partner of partners) {
            for (let el of lotteryNominals) {
                stats.push({
                    amountAtStart: 0,
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
}

module.exports = DBConnection;