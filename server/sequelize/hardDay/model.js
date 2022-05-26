const { Model, DataTypes } = require('sequelize');

class HardDay extends Model {

}

module.exports = async(sequelize) => {
    return HardDay.init({
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
        briefInfo: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.getDataValue('id')} ${this.getDataValue('date')}`
            }
        }
    }, {
        modelName: 'hardDay',
        tableName: 'HardDay',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}