const {Model, DataTypes} = require('sequelize');
const bcrypt = require("bcrypt");
const {UserCredentialsError, UserSameCredentialsError} = require("./errors");

class User extends Model {
    changePassword = async ({oldPassword = '', newPassword = '', newPasswordConfirm = ''}) => {
        if (!await bcrypt.compare(oldPassword, this.password)) {
            throw new UserCredentialsError(
                'Неверные пользовательские данные',
                [{
                    text: 'Неправильный старый пароль'
                }]
            );
        }
        if (newPassword !== newPasswordConfirm) {
            throw new UserCredentialsError(
                'Неверные пользовательские данные',
                [{
                    text: 'Пароли не совпадают'
                }]
            );
        }
        if (oldPassword === newPassword) {
            throw new UserSameCredentialsError(
                'Повторяющиеся пользовательские данные',
                [{
                    text: 'Пароль не был изменен'
                }]
            );
        }
        this.password = newPassword;
        await this.save();
    }
}

module.exports = async (sequelize) => {
    return User.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(30),
            unique: {
                msg: 'Пользователь с таким именем уже существует'
            },
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Необходимо указать имя пользователя'
                },
                is: {
                    args: [/\w{4,50}/g],
                    msg: 'Имя пользователя может только состоять из латинских букв и символов ' +
                        'подчеркивания и обязано быть от 7 до 30 символов в длину'
                }
            }
        },
        password: {
            type: DataTypes.STRING(60),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Необходимо указать пароль'
                },
                is: {
                    args: [/^[a-zA-Z0-9_-]+/],
                    msg: 'Пароль  должен состоять только из латинских буквы и цифр, символов подчеркивания и тире!'
                },
            }
        },
        role: {
            type: DataTypes.ENUM('employee', 'specialist', 'admin', 'root'),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Необходимо указать роль пользователя'
                }
            }
        },
        briefInfo: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.getDataValue('id')} ${this.getDataValue('username')} ${this.getDataValue('role')}`
            }
        }
    }, {
        hooks: {
            beforeCreate: async (user) => {
                // Хэшируем пароль
                user.password = await bcrypt.hash(user.password, 10);
            },
            beforeUpdate: async (user, options) => {
                // Хэшируем пароль, если изменяем его
                if (options.fields.includes('password')) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            }
        },
        modelName: 'user',
        tableName: 'user',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}