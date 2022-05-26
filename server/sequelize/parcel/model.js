const { Model, DataTypes } = require('sequelize');

class Parcel extends Model {

}

module.exports = async(sequelize) => {
    return Parcel.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: 1,
                    msg: 'Количество выпущенных лотерейных квитанций может быть только положительным'
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
        modelName: 'parcel',
        tableName: 'Parcel',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}