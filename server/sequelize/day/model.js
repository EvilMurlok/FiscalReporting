const {Model, DataTypes} = require('sequelize');


module.exports = async (sequelize) => {
    class Day extends Model {

    }

    return Day.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        coefficient: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        briefInfo: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.getDataValue('id')} ${this.getDataValue('date')}`
            }
        }
    }, {
        sequelize,
        modelName: 'day',
        tableName: 'day',
        timestamps: true,
        paranoid: true
    });
}