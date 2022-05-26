const config = require('../config/dbConfigLocal');

const dbConnection = require('../sequelize/dbConnection').getInstance({
    config: config,
    mode: 'development'
});

dbConnection.migrate({force: true}).then();