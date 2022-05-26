const config = require('../config/dbConfigLocal');
const prompt = require('prompt-sync')();

const dbConnection = require('../sequelize/dbConnection').getInstance({config: config, mode: 'test'});

async function insertMode() {
    console.log('You are in User insertion mode...')
    let username = null;
    let password = null;
    let user = null;
    do {
        username = prompt('Enter username: ');
        password = prompt('Enter password: ');
        user = await dbConnection.models.user.create({
            username: username,
            password: password
        });
        console.log(user.briefInfo);
    } while (prompt('Stop? (y/n): ') !== 'y');
    console.log('Switching to default mode...');
}

async function updateMode() {
    console.log('You are in User update mode...')
    let id = null;
    let username = null;
    let password = null;
    let amountOfRows = null;
    do {
        id = prompt('Enter id: ')
        username = prompt('Enter username: ');
        password = prompt('Enter password: ');
        amountOfRows = await dbConnection.models.user.update({
            username: username,
            password: password
        }, {
            where: {
                id: id
            }
        });
        console.log(amountOfRows);
    } while (prompt('Stop? (y/n): ') !== 'y');
    console.log('Switching to default mode...');
}

async function deleteMode() {
    console.log('You are in User delete mode...')
    let id = null;
    let userIds = null;
    do {
        id = prompt('Enter id: ')
        userIds = await dbConnection.models.user.destroy({
            where: {
                id: id
            }
        });
        console.log(userIds);
    } while (prompt('Stop? (y/n): ') !== 'y');
    console.log('Switching to default mode...');
}

async function selectMode() {
    console.log('You are in User select mode...')
    let id = null;
    let user = null;
    do {
        id = prompt('Enter id: ')
        user = await dbConnection.models.user.findByPk(id, {paranoid: false});
        console.log(user);
    } while (prompt('Stop? (y/n): ') !== 'y');
    console.log('Switching to default mode...');
}

async function test() {
    await dbConnection.connectToDatabase();
    let makeMigration = prompt('Do you want to migrate before tests? (force/soft): ');
    if (makeMigration === 'force') {
        await dbConnection.migrate({force: true});
    } else if (makeMigration === 'force') {
        await dbConnection.migrate({force: false});
    }
    let action = null;
    do {
        console.log('You are in default mode. Several commands are executable:\n' +
            'insert — switch to User insertion mode\n' +
            'update — switch to User update mode\n' +
            'delete — switch to User delete mode\n' +
            'select — switch to User select mode.\n' +
            'stop — stop the program\n');
        action = prompt('Enter command: ');
        try {
            if (action === 'insert') {
                await insertMode();
            } else if (action === 'update') {
                await updateMode();
            } else if (action === 'delete') {
                await deleteMode();
            } else if (action === 'select') {
                await selectMode();
            } else {
                console.log('Unsupported command. Try again!');
            }
        } catch(e) {
            console.log('Error itself: ', e);
            const res = e.errors.map(err => err.message);
            console.log('After map: ', res);
        }
    } while (action !== 'stop');
    console.log('Bye :)');
}

test().then();