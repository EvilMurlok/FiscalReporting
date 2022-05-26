const config = {
    development: {
        database: 'loto_sport',
        user: 'klim',
        password: 'Limelime#100',
        dialect: 'postgres',
        host: 'localhost'
    },
    test: {
        database: 'loto_sport_test',
        user: 'klim',
        password: 'Limelime#100',
        dialect: 'postgres',
        host: 'localhost'
    }
}

module.exports = config