const config = require('../config/dbConfigLocal');

const dbConnection = require('../sequelize/dbConnection').getInstance({
    config: config,
    mode: 'development'
});

const main = async() => {
    try {
        await dbConnection.connectToDatabase();
        await dbConnection.insertBasic();
    } catch(e) {
        console.log(e);
    }
}

main().then();