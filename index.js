const app = require('./server/express/app');
const config = require('./server/config/dbConfigLocal');
const prompt = require('prompt-sync')();
const PORT = 8888;

const dbConnection = require('./server/sequelize/dbConnection').getInstance({
        config: config,
        mode: 'development'
});

async function init() {
        await dbConnection.connectToDatabase();
        console.log(`Starting Sequelize + Express on port ${PORT}...`);

        app.listen(PORT, () => {
                console.log(`Express server started on port ${PORT}.`);
        });
}

init().then();