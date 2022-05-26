const config = require('../config/dbConfigLocal');
const prompt = require('prompt-sync')();
const loteries = require('../data/lotteries.json');

const dbConnection = require('../sequelize/dbConnection').getInstance({config: config, mode: 'test'});

async function selectMode() {
    let lotteryIds = null;
    let lotteryNamesIndexes = null;
    let nominalIds = null;
    let nominalValues = null;
    let action = null;
    do {
        console.log('You are in select mode');
        lotteryIds = prompt('Enter lotteryIds with spaces between: ', '');
        if (lotteryIds.length <= 0) {
            lotteryIds = [];
        } else {
            lotteryIds = lotteryIds.split(' ').map(el => Number(el));
        }
        lotteryNamesIndexes = prompt('Enter lotteryNamesIndexes with spaces between: ');
        if (lotteryNamesIndexes.length <= 0) {
            lotteryNamesIndexes = [];
        } else {
            lotteryNamesIndexes = lotteryNamesIndexes.split(' ').map(el => Number(el));
        }
        nominalIds = prompt('Enter nominalIds with spaces between: ');
        if (nominalIds.length <= 0) {
            nominalIds = [];
        } else {
            nominalIds = nominalIds.split(' ').map(el => Number(el));
        }
        nominalValues = prompt('Enter nominalValues with spaces between: ');
        if (nominalValues.length <= 0) {
            nominalValues = [];
        } else {
            nominalValues = nominalValues.split(' ').map(el => Number(el));
        }

        console.log('4u4a', lotteryIds, lotteryNamesIndexes, nominalIds, nominalValues);
        try {
            const lotteryNominals = await dbConnection.models.lotteryNominal.findByLotteryAndNominal({
                lotteryIds: lotteryIds,
                lotteryNames: lotteryNamesIndexes.map(i => loteries.lotteries[i].name),
                nominalIds: nominalIds,
                nominalValues: nominalValues
            });
            lotteryNominals.forEach(el => console.log(el.id))
            action = prompt('Enter command: ');
        } catch (e) {
            console.log('Error itself: ', e);
            const res = e.errors.map(err => err.message);
            console.log('After map: ', res);
        }
    } while (action !== 'stop')
}

async function test() {
    await dbConnection.connectToDatabase();
    let makeMigration = prompt('Do you want to migrate before tests? (force/soft): ');
    if (makeMigration === 'force') {
        await dbConnection.migrate({force: true});
        await dbConnection.insertBasic();
    } else if (makeMigration === 'soft') {
        await dbConnection.migrate({force: false});
        await dbConnection.insertBasic();
    }
    let action = null;
    do {
        console.log('You are in default mode. Several commands are executable:\n' +
            'select — switch to User select mode.\n' +
            'stop — stop the program\n');
        action = prompt('Enter command: ', '');
        try {
            if (action === 'select') {
                await selectMode();
            } else {
                console.log('Unsupported command. Try again!');
            }
        } catch (e) {
            console.log('Error itself: ', e);
            const res = e.errors.map(err => err.message);
            console.log('After map: ', res);
        }
    } while (action !== 'stop')
    console.log('Bye :)');
}

test().then();