const moment = require("moment");
const {Model, DataTypes, Op} = require('sequelize');
const {
    HardDayCredentialsError, HardDayCommonError,
    HardDaySameCredentialsError, HardDayTransactionError
} = require("./errors");


module.exports = async (sequelize) => {
    class Day extends Model {
        static changeKq = async ({newKq}) => {
            const rightNumber = new RegExp(/^\d*([.,]\d+)?$/);
            if (!rightNumber.test(String(newKq))) {
                throw new HardDayCredentialsError("The coefficient must be a float value!", [{
                    text: "Вводимый коэффициент должен быть числом с плавающей точкой!"
                }]);
            }
            newKq = parseFloat(String(newKq).replace(",", "."));
            if (newKq < 0 || newKq > 1) {
                throw new HardDayCredentialsError("Kq must be between [0; 1]!", [{
                    text: "Вводимый коэффициент должен быть в пределах [0; 1]!"
                }]);
            } else {
                const currentDay = moment().format().slice(0, 10);
                const updatedDayCoefficient = await this.update({
                    coefficient: newKq
                }, {
                    where: {
                        date: currentDay,
                        coefficient: {
                            [Op.ne]: 1
                        }
                    }
                });
                if (updatedDayCoefficient) {
                    return updatedDayCoefficient;
                } else {
                    throw new HardDayCommonError("Something went wrong", [{
                        text: "Ошибка при обновлении коэффициента!"
                    }]);
                }
            }
        }

        static createInspection = async ({id = 0, name = "", dateOfInspection = ""}) => {
            if ((!id && !name) || !dateOfInspection) {
                throw new HardDayCredentialsError("Invalid passed parameters", [{
                    text: "Должно быть передано хотя бы одно поле, позволяющее идентифицировать клуб!"
                }]);
            }
            const alreadyBeenInspected = await sequelize.models.partner.findOne({
                where: {
                    [Op.or]: [
                        {
                            id: id
                        },
                        {
                            name: name
                        }
                    ],
                },
                attributes: ["id", "name"],
                include: {
                    model: this,
                    required: true,
                    where: {
                        date: dateOfInspection,
                        coefficient: 1,
                    },
                    attributes: ["id", "date", "coefficient"],
                    through: {attributes: []}
                }
            });
            if (!alreadyBeenInspected) {
                const t = await sequelize.transaction();
                try {
                    const currentPartner = await sequelize.models.partner.findOne({
                        where: {
                            [Op.or]: [
                                {
                                    id: id
                                },
                                {
                                    name: name
                                }
                            ],
                        },
                        attributes: ["id", "name"]
                    }, {transaction: t});
                    const notInspectedDate = await this.findOne({
                        where: {
                            date: dateOfInspection,
                            coefficient: {
                                [Op.lt]: 1
                            },
                        },
                        attributes: ["id", "date", "coefficient"]
                    }, {transaction: t});
                    if (notInspectedDate) {
                        await currentPartner.removeDay(notInspectedDate, {transaction: t});
                    }
                    let alreadyInspectedDate = await this.findOne({
                        where: {
                            date: dateOfInspection,
                            coefficient: 1
                        },
                        attributes: ["id", "date", "coefficient"]
                    }, {transaction: t});
                    if (!alreadyInspectedDate) {
                        alreadyInspectedDate = await this.create({
                            date: dateOfInspection,
                            coefficient: 1
                        });
                    }
                    await currentPartner.addDay(alreadyInspectedDate, {transaction: t})
                    await t.commit();
                } catch (e) {
                    await t.rollback();
                    throw new HardDayTransactionError("An error occurred during the transaction", [{
                        text: "Во время добавления дня проверки произошла ошибка!"
                    }]);
                }
            } else {
                throw new HardDaySameCredentialsError("Inspection has been already added to this partner!", [{
                    text: "К данному клубу уже была добавлена проверка в эту дату!"
                }]);
            }
        }
    }

    return Day.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        coefficient: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        briefInfo: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.getDataValue('id')} ${this.getDataValue('date')}`
            }
        }
    }, {
        modelName: 'day',
        tableName: 'day',
        timestamps: true,
        paranoid: true,
        createdAt: 'created',
        updatedAt: 'updated',
        deletedAt: 'deleted',
        sequelize: sequelize,
    });
}