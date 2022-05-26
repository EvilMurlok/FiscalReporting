const { Sequelize } = require('sequelize');
const initModels = require('./index');
const dbConfig = require('../config/dbConfigDocker');


class DBConnection {
    constructor({config = null, mode = ''}) {
        this.sequelize = new Sequelize(
            dbConfig[mode].DB,
            dbConfig[mode].USER,
            dbConfig[mode].PASSWORD,
            {
                host: dbConfig[mode].HOST,
                port: dbConfig[mode].PORT,
                dialect: dbConfig[mode].dialect,
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
        await this.sequelize.sync({ force: force });
        console.log('All models were synchronized successfully.');
    }

    async insertUser({}) {

    }

    async insert({amountOfSubjects = 0}) {

    }
}

module.exports = DBConnection;