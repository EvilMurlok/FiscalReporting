const app = require('./server/express/index');
const config = require('./server/config/dbConfigDocker');
const PORT = 9001;

const dbConnection = require('./server/sequelize/dbConnection').getInstance({
    config: config,
    mode: 'development'
});

async function init() {
    await dbConnection.connectToDatabase();
    // await dbConnection.migrate({force: true},);
    app.listen(PORT, () => {
        console.log(`Express server started on port ${PORT} ...`);
    });
}

init().then();