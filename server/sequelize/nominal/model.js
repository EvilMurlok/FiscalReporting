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
            type: DataTypes.STRING,
            unique: {
                msg: 'Уже есть номинал с таким значением'
            },
            allowNull: false,
            validate: {
                is: {
                   msg: "Номинал может быть только целым числом или числом с плавающей точкой",
                   args: [/^[0-9]*[.]?[0-9]+$/]
                },
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

        modelName: 'nominal',
        tableName: 'nominal',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}