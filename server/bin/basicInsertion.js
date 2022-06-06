const config = require('../config/dbConfigDocker');

const dbConnection = require('../sequelize/dbConnection').getInstance({
    config: config,
    mode: 'development'
});

const main = async() => {
    try {
        await dbConnection.connectToDatabase();
        await dbConnection.insert();
    } catch(e) {
        console.log(e);
    }
}

main().then();