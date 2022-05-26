const { Model, DataTypes } = require('sequelize');

class Nominal extends Model {

}

module.exports = async(sequelize) => {
    return Nominal.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        value: {
            type: DataTypes.STRING(3),
            unique: {
                msg: 'Уже есть номинал с таким значением'
            },
            allowNull: false,
            validate: {
                isIn: {
                    args: [['0.1', '0.2', '0.3', '0.4', '0.5', '1', '2', '3', '4', '5', '10', '15', '20', '25']],
                    msg: 'Значение номинала может равнятся только указанным в списке числам:' +
                        '[\'0.1\', \'0.2\', \'0.3\', \'0.4\', \'0.5\', \'1\', \'2\',' +
                        '\'3\', \'4\', \'5\', \'10\', \'15\', \'20\', \'25\']'
                },
                notEmpty: {
                    msg: 'Необходимо указать значение номинала'
                },
                is: {
                    args: [/[\d.]{1,3}/g],
                    msg: 'Значение номинала может быть числом с точкой или натуральным числом не более, чем три символа в длину'
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
        tableName: 'Nominal',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}