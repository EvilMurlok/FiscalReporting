const { Model, DataTypes } = require('sequelize');


module.exports = async(sequelize) => {
    class Parcel extends Model {

    }

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
                    args: [0],
                    msg: 'Количество выпущенных лотерейных квитанций не может быть отрицательным'
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
        tableName: 'parcel',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}