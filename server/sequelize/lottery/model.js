const { Model, DataTypes } = require('sequelize');

class Lottery extends Model {

}

module.exports = async(sequelize) => {
    return Lottery.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            unique: {
                msg: 'Уже есть лотерея с таким названием'
            },
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Необходимо указать название лотереи'
                },
                is: {
                    args: [/[\w\d ()\/]{7,50}/g],
                    msg: 'Имя Партнера может иметь от 7 до 50 латинских букв, скобки, слэш, цифры'
                }
            }
        },
        briefInfo: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.getDataValue('id')} ${this.getDataValue('name')}`
            }
        }
    }, {
        modelName: 'lottery',
        tableName: 'Lottery',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}