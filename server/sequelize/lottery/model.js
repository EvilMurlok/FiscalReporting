const { Model, DataTypes } = require('sequelize');

module.exports = async(sequelize) => {
    class Lottery extends Model {

    }

    return Lottery.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            unique: {
                msg: 'Уже есть лотерея с таким названием'
            },
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Необходимо указать название лотереи'
                }
            }
        },
        briefInfo: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.getDataValue('id')} ${this.getDataValue('name')}`
            }
        }
    }, {
        modelName: 'lottery',
        tableName: 'lottery',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}