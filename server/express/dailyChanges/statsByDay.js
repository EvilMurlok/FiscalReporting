const axios = require("axios");
const {Transaction} = require("sequelize");
const config = require("../../config/dbConfigDocker");
const {getCoefficientsByInterval} = require("../statByDay/utils");
const {StatByDayCommonError, StatByDayTransactionError} = require("../../sequelize/statByDay/errors");
const dbConnection = require('../../sequelize/dbConnection').getInstance({config: config, mode: 'development'});


const getBetTradeDataByYesterday = async ({date, internalPartnerIds}) => {
    // const date = moment().add(3, "hour").subtract(1, "day").format("YYYY-MM-DD");
    // let partnerIds = await dbConnection.models.partner.findAll({
    //     attributes: ["id"]
    // });
    // partnerIds = partnerIds.map(partner => partner.id);
    // const requiredStats = await getCoefficientsByInterval({from: date, to: date, internalPartnerIds: internalPartnerIds});
    const HARDCODE_STATS = [
        {
            from: "2020-09-23",
            to: "2020-09-29",
            kq: 0.1,
            partnerIds: [
                50, 511, 64, 508
            ]
        },
        {
            from: "2020-09-23",
            to: "2020-09-29",
            kq: 1,
            partnerIds: [
                505, 1, 19, 131
            ]
        },
        {
            from: "2021-02-25",
            to: "2021-02-25",
            kq: 0.6,
            partnerIds: [
                1, 19, 131
            ]
        },
        {
            from: "2021-02-25",
            to: "2021-02-25",
            kq: 1,
            partnerIds: [
                50, 508, 505
            ]
        },
        {
            from: "2021-09-20",
            to: "2021-09-20",
            kq: 0.8,
            partnerIds: [
                1, 19, 131, 511, 64,
            ]
        },
        {
            from: "2022-05-30",
            to: "2022-05-30",
            kq: 0.4,
            partnerIds: [511]
        }
    ];
    const response = await axios.get(`http://192.168.1.41:2001/ext_reports/lotteries_fiscal/`, {
        headers: {
            'X-Auth-Token': "d4087b2a9f264c4e8337de40181dd785"
        },
        params: {
            // requiredStats: requiredStats,
            requiredStats: HARDCODE_STATS,
        }
    });
    console.log(response.data);
    if (response.data.success) {
        const responseData = response.data.result;
        const preparedData = [];
        for (let partnerId in responseData) {
            // все новые партнеры (если такие "пришли" с BetTrade) уже были добавлены в локальный сервис,
            // поэтому партнер точно будет получен!
            const partner = await dbConnection.models.partner.findOne({
                where: {
                    internalId: partnerId
                }
            });
            for (let lotteryName in responseData[partnerId]) {
                const transactionLottery = await dbConnection.sequelize.transaction();
                console.log("START LOTTERY TRANSACTION");
                let lottery = {};
                try {
                    lottery = await dbConnection.models.lottery.findOne({
                        where: {
                            name: lotteryName
                        }
                    });
                    // если лотереи с текущим именем (пришедшим из BetTrade) нет,
                    // то ее надо создать в локальном сервисе

                    if (!lottery) {
                        lottery = await dbConnection.models.lottery.create({
                            name: lotteryName,
                        }, {transaction: transactionLottery});
                    }
                    // Если партнер не связан в локальном сервисе с лотереей:
                    //      1. Новая лотерея;
                    //      2. В эту лотерею до текущего момента не играли у этого партнера.
                    // Тогда этого партнера необходимо связать с данной лотереей]
                    const isPartnerHasLottery = await partner.hasLotteries([lottery], {transaction: transactionLottery});
                    if (!isPartnerHasLottery) {
                        await partner.addLottery(lottery, {transaction: transactionLottery});
                    }
                    await transactionLottery.commit();
                    console.log("COMMIT LOTTERY TRANSACTION");
                } catch (e) {
                    console.log(e);
                    await transactionLottery.rollback();
                    console.log("ROLLBACK LOTTERY TRANSACTION");
                }
                for (let resNominal in responseData[partnerId][lotteryName]) {
                    // берем только объекты, связанные с номиналами (они целиком состоят из цифр),
                    // отсекая данные о суммарной продаже,
                    // суммарном выплаченном налоге и суммарном выигрыше ПО ЛОТЕРЕЕ
                    // формат каждого номинала следующий:
                    // "100": {
                    //     "paid_out": 1000,
                    //     "paid_out_pit": 1000 * 0.13,
                    //     "sold_count": 10
                    // }
                    console.log(/^\d+$/.test(resNominal));
                    if (/^\d+$/.test(resNominal)) {
                        const transactionNominal = await dbConnection.sequelize.transaction();
                        console.log("START NOMINAL TRANSACTION");
                        try {
                            // Необходимо делить на 100, т. к. данные приходят в копейках
                            const nominal = String(+(parseInt(resNominal) / 100).toFixed(2));

                            // как было потребовано, в случае, если количество проданных билетов по текущему номиналу
                            // является дробным, округлять в меньшую сторону
                            const totalSold = Math.floor(responseData[partnerId][lotteryName][resNominal]["sold_count"]);
                            let totalWin = 0;
                            // если в результате округления количество проданных билетов не нулевое,
                            // тогда сумму продажи делим опять на 100 и округляем до 2 знаков,
                            // иначе просто обнуляем выигрыш
                            if (totalSold) {
                                totalWin = +(responseData[partnerId][lotteryName][resNominal]["paid_out"] / 100).toFixed(2);
                            }
                            // ищем номинал в лотерее

                            let currentNominal = await dbConnection.models.nominal.findOne({
                                where: {
                                    value: nominal
                                }
                            }, {transaction: transactionNominal});
                            // console.log((await dbConnection.models.nominal.findAll({
                            //     attributes: ["value"]
                            // })).map(nominal => nominal.value));
                            // console.log(currentNominal);
                            // Если номинала в лотерее нет:
                            //      1. Была создана новая лотерея, у которой есть номинал, отсутствующий в системе;
                            //      2. В старой лотерее появился новый уникальный номинал.
                            // Создаем номинал
                            if (!currentNominal) {
                                currentNominal = await dbConnection.models.nominal.create({
                                    value: nominal,
                                }, {transaction: transactionNominal});
                            }
                            // пробуем найти номинал в КОНКРЕТНО ЭТОЙ лотерее
                            let currentLotteryNominal = await dbConnection.models.lotteryNominal.findOne({
                                where: {
                                    nominalId: currentNominal.id,
                                    lotteryId: lottery.id
                                }
                            }, {transaction: transactionNominal});
                            // если не находим, то создаем связь (значит в этой лотерее такого номинала пока что не было)
                            if (!currentLotteryNominal) {
                                currentLotteryNominal = await dbConnection.models.lotteryNominal.create({
                                    amount: 0, // на начало предыдущего дня было нулевое количество такого номинала
                                    nominalId: currentNominal.id,
                                    lotteryId: lottery.id
                                }, {transaction: transactionNominal});

                                await dbConnection.models.lotteryNominalStat.create({
                                    amountAtStart: 0,
                                    income: 0,
                                    amountAtEnd: null,
                                    lotteryNominalId: currentLotteryNominal.id,
                                    date: date
                                }, {transaction: transactionNominal});
                            }

                            preparedData.push({
                                partnerId: parseInt(partnerId),
                                lotteryId: lottery.id,
                                nominal,
                                totalWin,
                                totalSold
                            });
                            await transactionNominal.commit();
                            console.log("COMMIT NOMINAL TRANSACTION");
                        } catch (e) {
                            console.log(e);
                            await transactionNominal.rollback();
                            console.log("ROLLBACK NOMINAL TRANSACTION");
                        }
                    }
                }
            }
        }
        return preparedData;
    } else {
        throw new StatByDayCommonError("Unable to get daily statistic from BetTrade!", [{
            text: "Не удалось получить ежедневный отчет по клубам из сервиса BetTrade!"
        }]);
    }
}

const insertStatsForNextDay = async ({previousDay = '', nextDay = null, data = null}) => {
    // date: YYYY-MM-DD ДАТА ПРЕДЫДУЩЕГО ДНЯ!!!!!!!!!!!!!
    const transaction = await dbConnection.sequelize.transaction();
    try{
        const stats = await dbConnection.models.statByDay.findAll({
            include: {
                model: dbConnection.models.day,
                required: true,
                where: {
                    date: previousDay.date
                },
                attributes: ['date']
            },
            order: [
                ['dayId', 'ASC'],
                ['partnerId', 'ASC'],
                ['lotteryNominalId', 'ASC']
            ],
            attributes: [
                'id', 'totalWin',
                'totalSold', 'dayId', 'partnerId', 'lotteryNominalId'
            ]
        }, {transaction: transaction});

        // stats.forEach(el => console.log(el.partnerId, el.lotteryNominalId, el.amountAtStart, el.amountAtEnd));

        // обновленный список партнеров
        const partners = await dbConnection.models.partner.findAll({
            order: [['id', 'ASC']],
            attributes: ['id', 'name', 'internalId']
        }, {transaction: transaction});



        partners.forEach(el => console.log(el.id, el.name, el.internalId));
        console.log(partners.find(p => p.internalId === 19));

        // обновленный список лотерейных номиналов
        const lns = await dbConnection.models.lotteryNominal.findAll({
            include: [
                {
                    model: dbConnection.models.nominal,
                    required: true,
                    attributes: ['id', 'value']
                }
            ],
            order: [['id', 'ASC']],
            attributes: ['id', 'lotteryId']
        }, {transaction: transaction});

        // lns.forEach(el => console.log(el.id, el.nominal.value, el.lotteryNominalStats[0].dataValues));

        // TODO сделать один большой апдейт
        // Обновляем статистику партнеров по продажам и выигрышам и считаем, сколько всего продали все клубы по лотереям

        // Статистика по партнерам на следующий день и статистика о том, что не было в системе за предыдущий день
        let newPartnerStats = [];
        // общие продажи по номиналам лотерей
        let totalSold = [];
        for (let part of data) {
            // по-любому находим партнера, так как перед началом данного метода обновляем их список!
            let partner = partners.find(p => p.internalId === part.partnerId);
            // console.log(part.partnerId, "QWE");
            // console.log(partner, "QWEQWE");

            // находим конкретный номинал в конкретной лотерее
            let ln = lns.find(ln => ln.nominal.value === part.nominal && ln.lotteryId === part.lotteryId);
            // если не нашли лотерейный номинал (строчка сверху), то хз

            // нашли статистику по номиналу в нужной лотерее за прошлый день
            let st = stats.find(st => st.partnerId === partner.id && st.lotteryNominalId === ln.id);
            // если не находим, то новый номинал или новая лотерея, или новый партнер
            if (st) {
                st.totalWin = part.totalWin;
                st.totalSold = part.totalSold;
                await st.save({transaction: transaction});
            } else {
                // если не нашли запись в statByDay о конкретном номинале, в конкретной лотерее, в конкретном клубе,
                // то надо добавить запись об этом за предыдущий день тоже!!!!!!!
                newPartnerStats.push({
                    totalWin: part.totalWin,
                    totalSold: part.totalSold,
                    dayId: previousDay.id,
                    partnerId: partner.id,
                    lotteryNominalId: ln.id
                });
            }
            // пытаемся найти элемент массива, с суммарной продажей по нужному нам номиналу лотереи
            let lotteryNominalSellIndex = totalSold.findIndex(el => el.lotteryNominalId === ln.id);
            if (lotteryNominalSellIndex === -1) {
                // первая запись о продажах номинала этой лотереи
                totalSold.push({
                    lotteryNominalId: ln.id,
                    amount: part.totalSold
                });
            } else {
                // прибавляем продажу конкретного номинала
                // в конкретном клубе к общим продажам по номиналу этой лотереи
                totalSold[lotteryNominalSellIndex].amount += part.totalSold;
            }
            newPartnerStats.push({
                totalWin: 0,
                totalSold: 0,
                dayId: nextDay.id,
                partnerId: partner.id,
                lotteryNominalId: ln.id
            });
        }

        // статистика по лотерейным номиналам за прошлый день
        const lotteryNominalStats = await dbConnection.models.lotteryNominalStat.findAll({
            where: {
                lotteryNominalId: lns.map(ln => ln.id),
                date: previousDay.date
            }
        }, {transaction: transaction});

        // информация о том, сколько надо довыпустить за прошлый день
        let needToAdd = [];
        // новая статистика по лотерейным номиналам
        let newLotteryNominalStats = [];
        for (let sell of totalSold) {
            // по-любому находим новый лотерейный номинал
            let ln = lns.find(ln => ln.id === sell.lotteryNominalId);
            // по-любому находим статистику по нужному лотерейному номиналу за прошлый день (обновили в прошлом методе)
            let lnStat = lotteryNominalStats.find((el) => el.lotteryNominalId === ln.id);
            // console.log('ln:', ln);
            // ln: id, nominal.value, lotteryNominalStats[0]: amountAtStart, income, amountAtEnd
            // lns.forEach(el => console.log(el.id, el.nominal.value, el.lotteryNominalStats[0].dataValues));
            // количество билетов на начало предыдущего дня
            let amountAtStart = lnStat.amountAtStart;
            let amountAtEnd = lnStat.amountAtEnd;
            // количество билетов на начало нового дня
            let newAmountAtStart = 0;
            // количество внесенных билетов нужного номинала в лотерее
            let income = lnStat.income;

            let broughtCirculation = 0;
            // обновляем исторические или за вчера?
            if (amountAtEnd === null) {
                // не исторические данные
                if (sell.amount > amountAtStart + income) {
                    // продали больше, чем имеется => надо довыпустить тираж
                    broughtCirculation = sell.amount - (amountAtStart + income);
                    lnStat.amountAtEnd = 0;
                } else {
                    lnStat.amountAtEnd = amountAtStart + income - sell.amount;
                }

                // если не исторические данные, то надо добавить данные за следующий день!
                newAmountAtStart = lnStat.amountAtEnd;
                newLotteryNominalStats.push({
                    amountAtStart: newAmountAtStart,
                    income: 0,
                    amountAtEnd: null,
                    date: nextDay.date,
                    lotteryNominalId: ln.id
                });
                await lnStat.save({transaction: transaction});
            } else {
                // исторические данные
                // if (sell.amount > amountAtStart + income - amountAtEnd) {
                // продали больше, чем имеется => надо довыпустить тираж
                // broughtCirculation = lnStat.amountAtEnd + sell.amount - (amountAtStart + income);
                // }
                broughtCirculation = lnStat.amountAtEnd + sell.amount - (amountAtStart + income);
            }
            // если надо довыпустить номинала
            if (broughtCirculation !== 0) {
                console.log('dovipustkaem')
                // пытаемся найти элемент, который указывает на то, сколько надо довыпустить этого номинала
                // сначала находмим лотерею
                let parcel = needToAdd.find(el => el.lotteryId === ln.lotteryId);
                if (parcel) {
                    // если находим, то пытаемся найти номинал в лотерее
                    let nominal = parcel.nominals.find(p => p.id === ln.nominal.id);
                    if (nominal) {
                        // если находим то просто прибавляем
                        nominal.broughtCirculation += broughtCirculation;
                    } else {
                        // если нет, то добавляем номинал
                        parcel.nominals.push({
                            id: ln.nominal.id,
                            broughtCirculation: broughtCirculation
                        });
                    }
                } else {
                    needToAdd.push({
                        lotteryId: ln.lotteryId,
                        date: previousDay.date,
                        nominals: [
                            {
                                id: ln.nominal.id,
                                broughtCirculation: broughtCirculation
                            }
                        ]
                    });
                }
            }
            // ЭТО СТАРАЯ ВЕРСИЯ (НЕ УДАЛЯТЬ, ВДРУГ ПОНАДОБИТСЯ
            // если продали больше, чем было суммарно в конце дня
            // if (sell.amount > amountAtStart + income) {
            //     let broughtCirculation = null;
            //     // если добавляем свежие данные (нет данных по тому, сколько ДОЛЖНО остаться на конец дня)
            //     if (lnStat.amountAtEnd === null) {
            //         // довыпускаем нужное количество
            //         broughtCirculation = sell.amount - (amountAtStart + income);
            //         lnStat.amountAtEnd = 0;
            //     } else {
            //         // довыпускаем нужное количество номинала таким образом, чтобы amountAtEnd не изменился
            //         broughtCirculation = lnStat.amountAtEnd + sell.amount - (amountAtStart + income);
            //     }
            //     // пытаемся найти элемент, который указывает на то, сколько надо довыпустить этого номинала
            //     // сначала находмим лотерею
            //     let parcel = needToAdd.find(el => el.lotteryId === ln.lotteryId);
            //     if (parcel) {
            //         // если находим, то пытаемся найти номинал в лотерее
            //         let nominal = parcel.nominals.find(p => p.id === ln.nominal.id);
            //         if (nominal) {
            //             // если находим то просто прибавляем
            //             nominal.broughtCirculation += broughtCirculation;
            //         } else {
            //             // если нет, то добавляем номинал
            //             parcel.nominals.push({
            //                 id: ln.nominal.id,
            //                 broughtCirculation: broughtCirculation
            //             });
            //         }
            //     } else {
            //         // если не находим, то добавляем лотерею с номиналом
            //         needToAdd.push({
            //             lotteryId: ln.lotteryId,
            //             date: previousDay.date,
            //             nominals: [
            //                 {
            //                     id: ln.nominal.id,
            //                     broughtCirculation: broughtCirculation
            //                 }
            //             ]
            //         });
            //     }
            // } else {
            //     lnStat.amountAtEnd = amountAtStart + income - sell.amount;
            //     newAmountAtStart = amountAtStart + income - sell.amount;
            // }
            // await lnStat.save({transaction: transaction});
            // newLotteryNominalStats.push({
            //     amountAtStart: newAmountAtStart,
            //     income: 0,
            //     amountAtEnd: null,
            //     date: nextDay.date,
            //     lotteryNominalId: ln.id
            // });
        }

        // console.log(needToAdd);

        const root = await dbConnection.models.user.findOne({
            where: {
                role: 'root'
            }
        }, {transaction: transaction});

        needToAdd.forEach(el => console.log(el));

        for (let pack of needToAdd) {
            await dbConnection.models.pack.createWithParcels({
                user: root,
                packInfo: pack,
                date: previousDay.date,
                transaction: transaction
            });
        }
        // надо дозаполнить массив нулями (чтоб было как на клиенте)
        // newPartnerStats.forEach(el => console.log(el));
        // newLotteryNominalStats.forEach(el => console.log(el));
        await dbConnection.models.statByDay.bulkCreate(newPartnerStats, {transaction: transaction});
        await dbConnection.models.lotteryNominalStat.bulkCreate(newLotteryNominalStats, {transaction: transaction});
        await transaction.commit();
    } catch (e){
        console.log(e);
        await transaction.rollback();
    }
    // Получили все статистику по партнерам за предыдущий день

}

module.exports = {
    getBetTradeDataByYesterday,
    insertStatsForNextDay
}


