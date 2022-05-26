const { Model, DataTypes } = require('sequelize');

class LotteryNominal extends Model {

}

module.exports = async(sequelize) => {
    return LotteryNominal.init({
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
                    args: 0,
                    msg: 'Остаток по лотерейным квитанциям не может быть отрицательным'
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
        modelName: 'lotteryNominal',
        tableName: 'LotteryNominal',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}