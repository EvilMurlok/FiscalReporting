const { Model, DataTypes } = require('sequelize');

class Pack extends Model {

}

module.exports = async(sequelize) => {
    return Pack.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            validate: {
                isIn: {
                    args: [[0, 1, 2]],
                    msg: 'Неверное значение кода статуса'
                },
                notEmpty: {
                    msg: 'Необходимо указать статус тиража'
                }
            },
            get() {
                if (this.getDataValue('status') === 0) {
                    return 'sold out';
                }
                if (this.getDataValue('status') === 1) {
                    return 'relevant';
                }
                return 'full';
            },
            set(value) {
                if (value === 'sold out') {
                    this.setDataValue('status', 0);
                } else if (value === 'relevant') {
                    this.setDataValue('status', 1);
                } else if (value === 'full') {
                    this.setDataValue('status', 2);
                } else {
                    throw new Error('Неверное значение для статуса');
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
                return `${this.getDataValue('id')} ${this.getDataValue('status')} ${this.getDataValue('date')}`
            }
        }
    }, {
        modelName: 'pack',
        tableName: 'Pack',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}