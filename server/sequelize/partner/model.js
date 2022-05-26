const { Model, DataTypes } = require('sequelize');

class Partner extends Model {

}

module.exports = async(sequelize) => {
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
                },
                is: {
                    args: [/[А-я\d ()\/,]{7,70}/g],
                    msg: 'Имя Партнера может иметь от 7 до 70 букв кирилицы, скобки, слэш, цифры и запятую'
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
        tableName: 'Partner',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}