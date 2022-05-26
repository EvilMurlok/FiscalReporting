const { Model, DataTypes } = require('sequelize');


module.exports = async(sequelize) => {
    class StatByDay extends Model {

    }

    return StatByDay.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        amountAtStart: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: 0,
                    msg: 'Количество оставшихся лотерейных квитанций не может быть отрицательным'
                }
            }
        },
        totalWin: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: {
                    args: 0,
                    msg: 'Общая сумма выигрыша не может быть отрицательной'
                }
            }
        },
        totalSold: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: 0,
                    msg: 'Количество проданных лотерейных квитанций не может быть отрицательным'
                }
            }
        },
        briefInfo: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.getDataValue('id')} ${this.getDataValue('amount')}`
            }
        }
    }, {
        modelName: 'statByDay',
        tableName: 'stat_by_day',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}