const { Model, DataTypes } = require('sequelize');


module.exports = async(sequelize) => {
    class Nominal extends Model {

    }

    return Nominal.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        value: {
            type: DataTypes.ENUM('0.1', '0.2', '0.3', '0.4', '0.5', '1', '2', '3', '4', '5', '10', '15', '20', '25'),
            unique: {
                msg: 'Уже есть номинал с таким значением'
            },
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Необходимо указать значение номинала'
                }
            }
        },
        briefInfo: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.getDataValue('id')} ${this.getDataValue('value')}`
            }
        }
    }, {
        sequelize,
        modelName: 'nominal',
        tableName: 'nominal',
        timestamps: true,
        paranoid: true
    });
}