const { Model, DataTypes } = require('sequelize');


module.exports = async(sequelize) => {
    class Partner extends Model {

    }

    return Partner.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(70),
            unique: {
                msg: 'Уже есть партнер с таким названием'
            },
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Необходимо указать название партнера'
                }
            }
        },
        closedAt: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        briefInfo: {
            type: DataTypes.VIRTUAL,
            get() {
                let closedAt = this.getDataValue('closedAt')
                if (closedAt) {
                    return `${this.getDataValue('id')} ${this.getDataValue('name')} ${this.getDataValue('closedAt')}`
                } else {
                    return `${this.getDataValue('id')} ${this.getDataValue('name')}`
                }
            }
        }
    }, {
        modelName: 'partner',
        tableName: 'partner',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}