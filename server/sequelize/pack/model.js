const { Model, DataTypes } = require('sequelize');


module.exports = async(sequelize) => {
    class Pack extends Model {
        /**
         * Создать Pack вместе с Parcel'ами
         * @param data
         */
        static createWithParcels ({data = null}) {

        }
    }

    return Pack.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: DataTypes.ENUM('relevant', 'sold out'),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Необходимо указать статус тиража'
                }
            }
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        briefInfo: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.getDataValue('id')} ${this.status} ${this.getDataValue('date')}`
            }
        }
    }, {
        modelName: 'pack',
        tableName: 'pack',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}