const config = require('../config/dbConfigDocker');

const dbConnection = require('../sequelize/dbConnection').getInstance({
    config: config,
    mode: 'development'
});

dbConnection.migrate({force: true}).then();