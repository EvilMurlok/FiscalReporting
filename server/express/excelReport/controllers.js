const excel = require("exceljs");
const config = require('../../config/dbConfigDocker');
const dbConnection = require('../../sequelize/dbConnection').getInstance({
    config: config,
    mode: 'development'
});

const {
    LETTERS, FILL, BORDER,
    convertCell
} = require("./utils");

const createRemaindersReport = async (req, res) => {
    const currentDate = req.query.date;
    const arrDate = currentDate.split("-").reverse();
    const actualDateString = `Данные актуальны на ${arrDate[0]}.${arrDate[1]}.${arrDate[2]} 23:59:59`;
    let tempRemaindersData = "";
    try {
        tempRemaindersData = await dbConnection.models.lotteryNominalStat.getBalanceReport({date: currentDate});
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
        return;
    }
    const availableNominals = [];
    for (let lottery of tempRemaindersData) {
        for (let remainder of lottery.remainders) {
            if (availableNominals.findIndex(availableNominal => availableNominal === remainder.value) < 0) {
                availableNominals.push(remainder.value);
            }
        }
    }

    // отсортировать список ВСЕХ номиналов от меньшего к большему
    availableNominals.sort((lhs, rhs) => {
        return parseFloat(lhs) - parseFloat(rhs);
    });

    // теперь надо создать таблицу, где для каждого номинала будет информация
    // (если у какой-то лотереи нет какого-то номинала, тогда ставим "-")
    // this.tableOfRemainders.remaindersData.forEach(rem => console.log('3u3a', rem));
    const remaindersData = [];
    for (let lottery of tempRemaindersData) {
        const tempRemainders = [];
        for (let availableNominal of availableNominals) {
            const receivedNominal = lottery.remainders.find(remainder => remainder.value === availableNominal);
            if (receivedNominal) {
                tempRemainders.push({value: receivedNominal.value, amount: receivedNominal.amount});
            } else {
                tempRemainders.push({value: availableNominal, amount: "-"});
            }
        }
        remaindersData.push({
            lottery: lottery.lottery,
            remainders: tempRemainders
        });
        // tempRemainders.forEach(rem => console.log(rem));
    }
    // this.tableOfRemainders.remaindersData.forEach(rem => console.log('4u4a', rem));
    const lotteries = [];
    for (let lottery of remaindersData) {
        const lotteryData = {lottery: lottery.lottery};
        for (let nominalIndex in availableNominals) {
            lotteryData[availableNominals[nominalIndex]] = (lottery["remainders"][nominalIndex].amount !== "-")
                ? parseInt(lottery["remainders"][nominalIndex].amount) : lottery["remainders"][nominalIndex].amount;
        }
        lotteries.push(lotteryData);
    }

    const workbook = new excel.Workbook();

    const worksheet = workbook.addWorksheet("remaindersReport");
    const worksheetColumns = [{header: "Лотерея Номинал", key: "lottery", width: 30,}];
    for (let nominal of availableNominals) {
        worksheetColumns.push({
            header: nominal,
            key: nominal,
            width: 10
        });
    }
    worksheet.columns = worksheetColumns;

    worksheet.addRows(lotteries);

    for (let i = 0; i <= availableNominals.length; ++i) {
        const requiredCell = worksheet.getCell(`${LETTERS[i]}1`);
        convertCell(requiredCell);
        if (i > 0 && i <= lotteries.length) {
            const lotteryCell = worksheet.getCell(`A${i + 1}`);
            lotteryCell.font = {bold: true};
            lotteryCell.fill = FILL("ffff7b");
        }
    }

    worksheet.mergeCells(`A${lotteries.length + 2}:${LETTERS[availableNominals.length]}${lotteries.length + 2}`);
    // worksheet.addRow({lottery: actualDateString});
    worksheet.getCell(`A${lotteries.length + 2}`).value = actualDateString;

    worksheet.eachRow(function (row) {
        row.eachCell(function (cell) {
            cell.border = BORDER;
            cell.alignment = {vertical: "middle", horizontal: "center"};
        });
    });
    worksheet.getCell(`A${lotteries.length + 2}`).alignment = {horizontal: "left", vertical: "bottom"};

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "RemaindersTickets.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
    });
}

const createGlobalReport = async (req, res) => {
    const [from, to, partnerIds] = [req.query.from, req.query.to, req.query.partnerIds];
    const tempReportTable = await dbConnection.models.statByDay.getSellsReport({from: from, to: to, partnerIds: partnerIds});
    const [availableNominals, amountsOfSoldNominals] = [[], []];
    let [sumTotalSold, sumTotalTax, sumTotalWin] = [0.0, 0.0, 0.0];

    // сначала создаем массив из ВСЕХ полученных номиналов
    for (let lottery of tempReportTable) {
        for (let nominal of lottery.nominals) {
            if (availableNominals.findIndex(availableNominal => availableNominal === nominal.value) < 0) {
                availableNominals.push(nominal.value);
                // суммарное количество по номиналам
                amountsOfSoldNominals.push({
                    value: nominal.value,
                    sold: 0
                });
            }
        }
    }
    // сортировка от самого наименьшего номинала до самого наибольшего
    availableNominals.sort((lhs, rhs) => {
        return parseFloat(lhs) - parseFloat(rhs);
    });
    amountsOfSoldNominals.sort((lhs, rhs) => {
        return parseFloat(lhs.value) - parseFloat(rhs.value);
    });

    // теперь надо создать таблицу, где для каждого номинала будет информация
    // (если у какой-то лотереи нет какого-то номинала, тогда ставим "-")
    const reportData = [];
    for (let lottery of tempReportTable) {
        const tempNominals = [];
        for (let availableNominal of availableNominals) {
            const receivedNominal = lottery.nominals.find(nominal => nominal.value === availableNominal);
            if (receivedNominal) {
                tempNominals.push({value: receivedNominal.value, sold: receivedNominal.sold});
                const amountOfSoldNominal = amountsOfSoldNominals.find(amount => amount.value === receivedNominal.value);
                amountOfSoldNominal.sold += receivedNominal.sold;
            } else {
                tempNominals.push({value: availableNominal, sold: "-"});
            }
        }

        // вычисляем суммарную статистику по каждой лотерее, по каждому номиналу
        sumTotalSold += lottery.totalSold;
        sumTotalWin += lottery.totalWin;
        sumTotalTax += lottery.totalTax;

        // добавляем в итоговый массив преобразованные данные
        reportData.push({
            lotteryName: lottery.lotteryName,
            nominals: tempNominals,
            totalSold: +lottery.totalSold.toFixed(2),
            totalWin: +lottery.totalWin.toFixed(2),
            totalTax: +lottery.totalTax.toFixed(2)
        });
    }
    // округляем до двух знаков общее количество по лотереям
    sumTotalSold = +sumTotalSold.toFixed(2);
    sumTotalWin = +sumTotalWin.toFixed(2);
    sumTotalTax = +sumTotalTax.toFixed(2);
    const lotteriesData = [];
    for (let lottery of reportData) {
        const lotteryData = {
            lottery: lottery.lotteryName,
            sumTotalSold: lottery.totalSold,
            sumTotalWin: lottery.totalWin,
            sumTotalTax: lottery.totalTax
        };
        for (let nominalIndex in lottery.nominals) {
            lotteryData[availableNominals[nominalIndex]] = lottery.nominals[nominalIndex].sold;
        }
        lotteriesData.push(lotteryData);
    }

    // добавление итоговых сумм за период
    const totalForPeriod = {
        lottery: "Итого за период",
        sumTotalSold: sumTotalSold,
        sumTotalWin: sumTotalWin,
        sumTotalTax: sumTotalTax
    };
    for (let amountsOfSoldNominalsIndex in amountsOfSoldNominals) {
        totalForPeriod[availableNominals[amountsOfSoldNominalsIndex]] = amountsOfSoldNominals[amountsOfSoldNominalsIndex].sold;
    }
    lotteriesData.push(totalForPeriod);

    const workbook = new excel.Workbook();

    const worksheet = workbook.addWorksheet("globalReport");
    const worksheetColumns = [
        {header: "Лотерея", key: "lottery", width: 30},
        {header: "Общая сумма продажи", key: "sumTotalSold", width: 25},
    ];
    for (let nominal of availableNominals) {
        worksheetColumns.push({
            header: nominal,
            key: nominal,
            width: 8
        });
    }
    worksheetColumns.push({header: "Выплачено выигрышей", key: "sumTotalWin", width: 25});
    worksheetColumns.push({header: "НДФЛ удержано", key: "sumTotalTax", width: 20});
    worksheet.columns = worksheetColumns;
    worksheet.mergeCells("A1:A2");
    worksheet.mergeCells("B1:B2");
    worksheet.mergeCells(`C1:${LETTERS[1 + availableNominals.length]}1`);
    worksheet.mergeCells(`${LETTERS[2 + availableNominals.length]}1:${LETTERS[2 + availableNominals.length]}2`);
    worksheet.mergeCells(`${LETTERS[3 + availableNominals.length]}1:${LETTERS[3 + availableNominals.length]}2`);
    worksheet.getCell("C1").value = "Количество проданных лотерейных квитанций по номиналам";
    for (let nominalIndex in availableNominals) {
        worksheet.getCell(`${LETTERS[2 + parseInt(nominalIndex)]}2`).value = availableNominals[nominalIndex];
    }
    worksheet.addRows(lotteriesData);

    convertCell(worksheet.getCell("A1"));
    convertCell(worksheet.getCell("B1"));
    convertCell(worksheet.getCell("C1"));
    convertCell(worksheet.getCell(`${LETTERS[2 + availableNominals.length]}1`));
    convertCell(worksheet.getCell(`${LETTERS[3 + availableNominals.length]}1`));
    for (let i = 3; i < 3 + reportData.length; ++i) {
        convertCell(worksheet.getCell(`A${i}`));
    }
    convertCell(worksheet.getCell(`A${3 + reportData.length}`), "a0cfdf")

    for (let i = 2; i < 2 + availableNominals.length; ++i) {
        convertCell(worksheet.getCell(`${LETTERS[i]}2`), "96ff8f");
    }

    for (let j = 0; j < availableNominals.length + 4; ++j) {
        worksheet.getCell(`${LETTERS[j]}${3 + reportData.length}`).fill = FILL("b6eaff")
    }

    worksheet.eachRow(function (row) {
        row.eachCell(function (cell) {
            cell.border = BORDER;
            cell.alignment = {vertical: "middle", horizontal: "center"};
        });
    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "FiscalReport.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
    });
}

const createHistoryReport = async (req, res) => {
    const currentDate = req.query.date;
    const arrDate = currentDate.split("-").reverse();
    const actualDateString = `Дата: ${arrDate[0]}.${arrDate[1]}.${arrDate[2]}`;
    let tempHistoryData = "";
    const amountsOfAddedNominals = [];
    try {
        tempHistoryData = await dbConnection.models.pack.getHistory({date: currentDate});
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
        return;
    }

    // получить ВСЕ номиналы
    const availableNominals = [];
    for (let lottery of tempHistoryData) {
        for (let nominal of lottery.composition) {
            if (availableNominals.findIndex(availableNominal => availableNominal === nominal.value) < 0) {
                availableNominals.push(nominal.value);
                amountsOfAddedNominals.push({
                    value: nominal.value,
                    amount: 0
                });
            }
        }
    }
    // отсортировать список ВСЕХ номиналов от меньшего к большему
    availableNominals.sort((lhs, rhs) => {
        return parseFloat(lhs) - parseFloat(rhs);
    });
    amountsOfAddedNominals.sort((lhs, rhs) => {
        return parseFloat(lhs.value) - parseFloat(rhs.value);
    });
    amountsOfAddedNominals.push({
        value: "228",
        amount: 0
    });

    // сумма всех внесений по лотерее
    for (let lottery of tempHistoryData) {
        lottery.totalSumCirculation = lottery.composition.reduce((sum, elem) => {
            return sum + elem.amount;
        }, 0);
        amountsOfAddedNominals[amountsOfAddedNominals.length - 1].amount += lottery.totalSumCirculation;

        const tempRemainders = [];
        for (let availableNominal of availableNominals) {
            const receivedNominal = lottery.composition.find(remainder => remainder.value === availableNominal);
            if (receivedNominal) {
                tempRemainders.push({value: receivedNominal.value, amount: receivedNominal.amount});
                const amountOfAddedNominal = amountsOfAddedNominals.find(amount => amount.value === receivedNominal.value);
                amountOfAddedNominal.amount += receivedNominal.amount;
            } else {
                tempRemainders.push({value: availableNominal, amount: "-"});
            }
        }
        lottery.composition = tempRemainders;
    }

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("historyReport");

    const lotteriesData = [];
    for (let lottery of tempHistoryData) {
        const lotteryData = {
            lottery: lottery.lottery,
            totalSumCirculation: lottery.totalSumCirculation,
        };
        for (let nominalIndex in lottery.composition) {
            lotteryData[availableNominals[nominalIndex]] = lottery.composition[nominalIndex].amount;
        }
        lotteriesData.push(lotteryData);
    }
    console.log(amountsOfAddedNominals);
    const totalData = {
        lottery: "Итого:",
        totalSumCirculation: amountsOfAddedNominals[amountsOfAddedNominals.length - 1].amount
    };
    for (let nominalIndex in availableNominals) {
        totalData[availableNominals[nominalIndex]] = amountsOfAddedNominals[nominalIndex].amount;
    }
    lotteriesData.push(totalData);

    const worksheetColumns = [
        {header: "Лотерея", key: "lottery", width: 30},
    ];
    for (let nominal of availableNominals) {
        worksheetColumns.push({
            header: nominal,
            key: nominal,
            width: 9
        });
    }
    worksheetColumns.push({header: "Итого квитанций", key: "totalSumCirculation", width: 15});
    worksheet.columns = worksheetColumns;
    worksheet.mergeCells("A1:A2");
    worksheet.mergeCells(`B1:${LETTERS[availableNominals.length]}1`);
    worksheet.mergeCells(`${LETTERS[1 + availableNominals.length]}1:${LETTERS[1 + availableNominals.length]}2`);
    worksheet.getCell("B1").value = "Количество лотерейных квитанций по номиналам";
    for (let denominationIndex in availableNominals) {
        worksheet.getCell(`${LETTERS[1 + parseInt(denominationIndex)]}2`).value = availableNominals[denominationIndex];
    }
    worksheet.addRows(lotteriesData);

    convertCell(worksheet.getCell(`B1`));
    for (let i = 1; i <= 2 + tempHistoryData.length; ++i) {
        convertCell(worksheet.getCell(`A${i}`));
        convertCell(worksheet.getCell(`${LETTERS[1 + availableNominals.length]}${i}`));
    }
    convertCell(worksheet.getCell(`${LETTERS[1 + availableNominals.length]}${3 + tempHistoryData.length}`), "b6eaff");
    convertCell(worksheet.getCell(`A${3 + tempHistoryData.length}`), "b6eaff");

    for (let i = 2; i <= 1 + availableNominals.length; ++i) {
        convertCell(worksheet.getCell(`${LETTERS[i - 1]}2`), "96ff8f");
        convertCell(worksheet.getCell(`${LETTERS[i - 1]}${3 + tempHistoryData.length}`), "b6eaff");
    }

    worksheet.eachRow(function (row) {
        row.eachCell(function (cell) {
            cell.border = BORDER;
            cell.alignment = {vertical: "middle", horizontal: "center"};
        });
    });

    const dateStringCell = worksheet.getCell(`A${4 + tempHistoryData.length}`);
    dateStringCell.value = actualDateString;
    dateStringCell.border = BORDER;
    convertCell(dateStringCell);

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "CirculationsPerDay.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
    });
}

module.exports = {
    createRemaindersReport,
    createGlobalReport,
    createHistoryReport
};