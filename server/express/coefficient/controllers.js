const config = require('../../config/dbConfigDocker');
const dbConnection = require('../../sequelize/dbConnection').getInstance({config: config, mode: 'development'});

const changeKq = async (req, res) => {
    const newKq = req.body.newKq;
    try {
        const updatedDay = await dbConnection.models.day.changeKq({newKq: newKq});
        res.send({
            status: "success",
            messages: [{
                text: "Кофициент на текущий день для всех клубов (кроме проверенных) изменен!"
            }],
            updatedDay: updatedDay
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const createInspection = async (req, res) => {
    const {id, name, dateOfInspection} = req.body;
    try {
        await dbConnection.models.day.createInspection({id, name, dateOfInspection});
        res.send({
            status: "success",
            messages: [{
                text: "Данные о проверке успешно внесены!"
            }],
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

module.exports = {
    changeKq,
    createInspection
}