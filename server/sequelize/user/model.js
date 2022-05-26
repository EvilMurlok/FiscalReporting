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
            type: DataTypes.SMALLINT,
            allowNull: false,
            validate: {
                isIn: {
                    args: [[0, 1, 2, 3]],
                    msg: 'Неверное значение кода роли'
                },
                notEmpty: {
                    msg: 'Необходимо указать роль пользователя'
                }
            },
            get() {
                if (this.getDataValue('role') === 0) {
                    return 'employee';
                }
                if (this.getDataValue('role') === 1) {
                    return 'specialist';
                }
                if (this.getDataValue('role') === 2) {
                    return 'admin';
                }
                return 'root';
            },
            set(value) {
                if (value === 'employee') {
                    this.setDataValue('role', 0);
                } else if (value === 'specialist') {
                    this.setDataValue('role', 1);
                } else if (value === 'admin') {
                    this.setDataValue('role', 2);
                } else if (value === 'root') {
                    this.setDataValue('role', 3);
                } else {
                    throw new Error('Неверное значение для роли');
                }
            }
        },
        briefInfo: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.getDataValue('id')} ${this.getDataValue('username')} ${this.role}`
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
        tableName: 'User',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}