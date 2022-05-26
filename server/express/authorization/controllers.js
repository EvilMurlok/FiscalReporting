const config = require('../../config/dbConfigDocker');
const {UserSameCredentialsError, UserCredentialsError} = require("../../sequelize/user/errors");
const dbConnection = require('../../sequelize/dbConnection').getInstance({config: config, mode: 'development'});


const user_register_post = async (req, res) => {
    let {username, role, password, confirmPassword} = req.body;
    console.log(password, confirmPassword);
    if (password === confirmPassword) {
        try {
            const createdUser = await dbConnection.models.user.create({
                username: username,
                password: password,
                role: role
            });
            res.send({
                status: 'success',
                user: createdUser.dataValues,
                messages: [{
                    text: `Пользователь ${createdUser.username} успешно зарегистрирован`
                }]
            });
        } catch (e) {
            console.log(e);
            res.send({
                status: 'warning',
                messages: e.errors.map(msg => {
                    return {text: msg.message};
                })
            });
        }
    } else {
        res.send({
            status: 'warning',
            messages: [{
               text: "Введенные пароли не совпадают!"
            }]
        });
    }

}

const user_edition = async (req, res) => {
    let user = req.user;
    let {newUsername} = req.body;
    try {
        if (newUsername === user.username) {
            res.send({
                status: 'info',
                messages: [{
                    text: 'Информация не была изменена'
                }]
            });
            return;
        }
        user = await dbConnection.models.user.findByPk(user.id);
        if (!user) {
            res.send({
                status: 'error',
                messages: [{
                    text: 'Не удалось найти пользователя'
                }]
            });
            return;
        }
        user.username = newUsername;
        await user.save();
        res.send({
            status: 'success',
            messages: [{
                text: `Информация о пользователе успешно обновлена`
            }]
        });
    } catch (e) {
        res.send({
            status: 'warning',
            messages: e.errors.map(msg => {
                return {text: msg.message};
            })
        });
    }
}

const user_change_password = async (req, res) => {
    let user = req.user;
    let {oldPassword, newPassword, newPasswordConfirm} = req.body;
    try {
        user = await dbConnection.models.user.findByPk(user.id);
        if (!user) {
            res.send({
                status: 'warning',
                messages: [{
                    text: 'Не удалось найти пользователя'
                }]
            });
            return;
        }
        await user.changePassword({
            oldPassword: oldPassword,
            newPassword: newPassword,
            newPasswordConfirm: newPasswordConfirm
        });
        res.send({
            status: 'success',
            messages: [{
                text: 'Пароль успешно изменен'
            }]
        });
    } catch (e) {
        if (e instanceof UserSameCredentialsError) {
            // ошибка из кастомого метода
            res.send({
                status: 'info',
                messages: e.messages
            });
        } else if (e instanceof UserCredentialsError) {
            // ошибка из кастомого метода
            res.send({
                status: 'warning',
                messages: e.messages
            });
        } else {
            // ошибка валидации
            res.send({
                status: 'warning',
                messages: e.errors.map(msg => {
                    return {text: msg.message};
                })
            });
        }
    }
}

const user_retrieve = async (req, res) => {
    const userId = req.user.id;
    try {
        const requiredUser = await dbConnection.models.user.findByPk(userId);
        if (!requiredUser) {
            res.send({
                status: 'warning',
                messages: [{
                    text: 'Не удалось найти пользователя'
                }]
            });
            return;
        }
        res.send({
            status: 'success',
            user: requiredUser,
        });
    } catch (e) {
        res.send({
            status: 'warning',
            messages: e.messages
        });
    }
}

const user_deletion = async (req, res) => {
    let user = req.user;
    try {
        user = await dbConnection.models.user.findByPk(user.id);
        if (!user) {
            res.send({
                status: 'warning',
                messages: [{
                    text: 'Не удалось найти пользователя'
                }]
            });
            return;
        }
        req.logout();
        await user.destroy();
        res.send({
            status: 'success',
            messages: [{
                text: `Пользователь успешно удален из системы`
            }]
        });
    } catch (e) {
        res.send({
            status: 'warning',
            messages: e.errors.map(msg => {
                return {text: msg.message};
            })
        });
    }
}

const user_logout = async (req, res) => {
    const username = req.user.username;
    req.logout();
    res.send({
        status: 'success',
        messages: [{
            text: 'Вы успешно вышли из системы!'
        }],
        username: username
    });
}

module.exports = {
    user_register_post,
    user_edition,
    user_change_password,
    user_logout,
    user_retrieve,
    user_deletion
}