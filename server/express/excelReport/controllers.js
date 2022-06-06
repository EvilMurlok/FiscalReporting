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
    let remaindersData = "";
    try {
        remaindersData = await dbConnection.models.statByDay.getBalanceReport({date: currentDate});
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
        return;
    }
    const availableDenominations = remaindersData[0].remainders.map(remainder => parseFloat(remainder.value));
    const lotteries = [];
    for (let lottery of remaindersData) {
        const lotteryData = {lottery: lottery.lottery};
        for (let denominationIndex in availableDenominations) {
            lotteryData[String(availableDenominations[denominationIndex])] = parseInt(lottery["remainders"][denominationIndex].amount);
        }
        lotteries.push(lotteryData);
    }

    const workbook = new excel.Workbook();

    const worksheet = workbook.addWorksheet("remaindersReport");
    const worksheetColumns = [{header: "Лотерея Номинал", key: "lottery", width: 30,}];
    for (let denomination of availableDenominations) {
        worksheetColumns.push({
            header: denomination,
            key: denomination,
            width: 10
        });
    }
    worksheet.columns = worksheetColumns;

    worksheet.addRows(lotteries);

    for (let i = 0; i <= availableDenominations.length; ++i) {
        const requiredCell = worksheet.getCell(`${LETTERS[i]}1`);
        convertCell(requiredCell);
        if (i > 0 && i <= lotteries.length) {
            const lotteryCell = worksheet.getCell(`A${i + 1}`);
            lotteryCell.alignment = {vertical: 'bottom', horizontal: 'right'};
            lotteryCell.fill = FILL("ffff7b");
        }
    }

    worksheet.mergeCells(`A${lotteries.length + 2}:${LETTERS[availableDenominations.length]}${lotteries.length + 2}`);
    // worksheet.addRow({lottery: actualDateString});
    worksheet.getCell(`A${lotteries.length + 2}`).value = actualDateString;

    worksheet.eachRow(function (row) {
        row.eachCell(function (cell) {
            cell.border = BORDER;
        });
    });

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
    const availableDenominations = [0.1, 0.2, 0.3, 0.4, 0.5, 1, 2, 3, 4, 5, 10, 15, 20];
    const reportData = [
        {
            "lottery": "Гамбусаки Хушхол",
            "totalSum": 517.9,
            "denominations": [16010, 7638, 4432, 4441, 5097, 2843, 1141, 574, 9, 7, 2, 1, 1],
            "paidOutWinning": 447.91,
            "withheldTax": 58.23
        },
        {
            "lottery": "Дурдонаи Гаронбахо",
            "totalSum": 6.9,
            "denominations": [16108, 7623, 4287, 4403, 5042, 2751, 983, 383, 222, 140, 12, 2, 1],
            "paidOutWinning": 456.91,
            "withheldTax": 0.23
        },
        {
            "lottery": "Киссахои Помир",
            "totalSum": 32.9,
            "denominations": [4632, 2329, 1423, 1452, 1627, 980, 416, 185, 444, 234, 43, 3, 1],
            "paidOutWinning": 74.91,
            "withheldTax": 3.23
        },
        {
            "lottery": "Мевахо",
            "totalSum": 11.9,
            "denominations": [38364, 17808, 9746, 10032, 11610, 6062, 1948, 698, 432, 521, 87, 4, 1],
            "paidOutWinning": 532.91,
            "withheldTax": 5.23
        },
        {
            "lottery": "Рохи Абрешим",
            "totalSum": 2029.9,
            "denominations": [43242, 15432, 8864, 10032, 3435, 5232, 1948, 698, 432, 34, 2, 1, 1],
            "paidOutWinning": 53.91,
            "withheldTax": 65.23
        },
        {
            "lottery": "Хирадманди Хушхол",
            "totalSum": 30.9,
            "denominations": [12343, 9647, 5436, 4441, 5097, 2843, 1141, 574, 376, 125, 45, 7, 1],
            "paidOutWinning": 2.91,
            "withheldTax": 34.23
        },
        {
            "lottery": "Хоча Насриддин",
            "totalSum": 60.9,
            "denominations": [12525, 9432, 7453, 3264, 6532, 6436, 2321, 235, 124, 53, 54, 34, 1],
            "paidOutWinning": 52.91,
            "withheldTax": 9.23
        },
        {
            "lottery": "Хирадманди Хушхол",
            "totalSum": 30.9,
            "denominations": [12343, 9647, 5436, 4441, 5097, 2843, 1141, 574, 376, 125, 45, 7, 1],
            "paidOutWinning": 2.91,
            "withheldTax": 34.23
        },
        {
            "lottery": "Хоча Насриддин",
            "totalSum": 60.9,
            "denominations": [12525, 9432, 7453, 3264, 6532, 6436, 2321, 235, 124, 53, 54, 34, 1],
            "paidOutWinning": 52.91,
            "withheldTax": 9.23
        },
        {
            "lottery": "Хирадманди Хушхол",
            "totalSum": 30.9,
            "denominations": [12343, 9647, 5436, 4441, 5097, 2843, 1141, 574, 376, 125, 45, 7, 1],
            "paidOutWinning": 2.91,
            "withheldTax": 34.23
        },
        {
            "lottery": "Хоча Насриддин",
            "totalSum": 60.9,
            "denominations": [12525, 9432, 7453, 3264, 6532, 6436, 2321, 235, 124, 53, 54, 34, 1],
            "paidOutWinning": 52.91,
            "withheldTax": 9.23
        },
    ];
    let sumTotalSum = 0.0;
    let amountsOfDenominations = Array(availableDenominations.length).fill(0.0);
    let sumPaidOutWinning = 0.0;
    let sumWithheldTax = 0.0;
    for (let lottery of reportData) {
        sumTotalSum += lottery.totalSum;
        sumPaidOutWinning += lottery.paidOutWinning;
        sumWithheldTax += lottery.withheldTax;
        for (let indexDenominations in lottery["denominations"]) {
            amountsOfDenominations[indexDenominations] += lottery["denominations"][indexDenominations];
        }
    }
    const lotteriesData = [];
    for (let lottery of reportData) {
        const lotteryData = {
            lottery: lottery.lottery,
            totalSum: lottery.totalSum,
            paidOutWinning: lottery.paidOutWinning,
            withheldTax: lottery.withheldTax
        };
        for (let denominationIndex in lottery.denominations) {
            lotteryData[String(availableDenominations[denominationIndex])] = lottery.denominations[denominationIndex];
        }
        lotteriesData.push(lotteryData);
    }

    // добавление итоговых сумм за период
    const totalForPeriod = {
        lottery: "Итого за период",
        totalSum: sumTotalSum,
        paidOutWinning: sumPaidOutWinning,
        withheldTax: sumWithheldTax
    };
    for (let amountOfDenominationIndex in amountsOfDenominations) {
        totalForPeriod[String(availableDenominations[amountOfDenominationIndex])] = amountsOfDenominations[amountOfDenominationIndex];
    }
    lotteriesData.push(totalForPeriod);

    const workbook = new excel.Workbook();

    const worksheet = workbook.addWorksheet("globalReport");
    const worksheetColumns = [
        {header: "Лотерея", key: "lottery", width: 30},
        {header: "Общая сумма продажи", key: "totalSum", width: 25},
    ];
    for (let denomination of availableDenominations) {
        worksheetColumns.push({
            header: denomination,
            key: denomination,
            width: 7
        });
    }
    worksheetColumns.push({header: "Выплачено выигрышей", key: "paidOutWinning", width: 25});
    worksheetColumns.push({header: "НДФЛ удержано", key: "withheldTax", width: 20});
    worksheet.columns = worksheetColumns;
    worksheet.mergeCells("A1:A2");
    worksheet.mergeCells("B1:B2");
    worksheet.mergeCells(`C1:${LETTERS[1 + availableDenominations.length]}1`);
    worksheet.mergeCells(`${LETTERS[2 + availableDenominations.length]}1:${LETTERS[2 + availableDenominations.length]}2`);
    worksheet.mergeCells(`${LETTERS[3 + availableDenominations.length]}1:${LETTERS[3 + availableDenominations.length]}2`);
    worksheet.getCell("C1").value = "Количество проданных лотерейных квитанций по номиналам";
    for (let denominationIndex in availableDenominations) {
        worksheet.getCell(`${LETTERS[2 + parseInt(denominationIndex)]}2`).value = availableDenominations[denominationIndex];
    }
    worksheet.addRows(lotteriesData);

    convertCell(worksheet.getCell("A1"));
    convertCell(worksheet.getCell("B1"));
    convertCell(worksheet.getCell("C1"));
    convertCell(worksheet.getCell(`${LETTERS[2 + availableDenominations.length]}1`));
    convertCell(worksheet.getCell(`${LETTERS[3 + availableDenominations.length]}1`));
    for (let i = 3; i < 3 + reportData.length; ++i) {
        convertCell(worksheet.getCell(`A${i}`));
    }
    convertCell(worksheet.getCell(`A${3 + reportData.length}`), "a0cfdf")

    for (let i = 2; i < 2 + availableDenominations.length; ++i) {
        convertCell(worksheet.getCell(`${LETTERS[i]}2`), "96ff8f");
    }

    for (let j = 0; j < availableDenominations.length + 4; ++j) {
        worksheet.getCell(`${LETTERS[j]}${3 + reportData.length}`).fill = FILL("b6eaff")
    }

    worksheet.eachRow(function (row) {
        row.eachCell(function (cell) {
            cell.border = BORDER;
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
    let reportData = "";
    try {
        reportData =  await dbConnection.models.pack.getHistory({date: currentDate});
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
        return;
    }
    const availableDenominations = reportData[0].composition.map(remainder => parseFloat(remainder.value));
    for (let lottery of reportData) {
        lottery.totalSumCirculation = lottery.composition.reduce((sum, elem) => {
            return sum + elem.amount;
        }, 0);
    }

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("historyReport");

    const lotteriesData = [];
    let amountsOfDenominations = Array(availableDenominations.length + 1).fill(0.0);
    for (let lottery of reportData) {
        const lotteryData = {
            lottery: lottery.lottery,
            totalSumCirculation: lottery.totalSumCirculation,
        };
        for (let denominationIndex in lottery.composition) {
            lotteryData[String(availableDenominations[denominationIndex])] = lottery.composition[denominationIndex].amount;
            amountsOfDenominations[denominationIndex] += lottery.composition[denominationIndex].amount;
            amountsOfDenominations[lottery.composition.length] += lottery.totalSumCirculation;
        }
        lotteriesData.push(lotteryData);
    }
    const totalData = {
        lottery: "Итого:",
        totalSumCirculation: amountsOfDenominations[availableDenominations.length]
    };
    for (let denominationIndex in availableDenominations) {
        totalData[String(availableDenominations[denominationIndex])] = amountsOfDenominations[denominationIndex];
    }
    lotteriesData.push(totalData);
    const worksheetColumns = [
        {header: "Лотерея", key: "lottery", width: 30},
    ];
    for (let denomination of availableDenominations) {
        worksheetColumns.push({
            header: denomination,
            key: denomination,
            width: 9
        });
    }
    worksheetColumns.push({header: "Итого квитанций", key: "totalSumCirculation", width: 15});
    worksheet.columns = worksheetColumns;
    worksheet.mergeCells("A1:A2");
    worksheet.mergeCells(`B1:${LETTERS[availableDenominations.length]}1`);
    worksheet.mergeCells(`${LETTERS[1 + availableDenominations.length]}1:${LETTERS[1 + availableDenominations.length]}2`);
    worksheet.getCell("B1").value = "Количество лотерейных квитанций по номиналам";
    for (let denominationIndex in availableDenominations) {
        worksheet.getCell(`${LETTERS[1 + parseInt(denominationIndex)]}2`).value = availableDenominations[denominationIndex];
    }
    worksheet.addRows(lotteriesData);

    convertCell(worksheet.getCell(`B1`));
    for (let i = 1; i <= 2 + reportData.length; ++i) {
        convertCell(worksheet.getCell(`A${i}`));
        convertCell(worksheet.getCell(`${LETTERS[1 + availableDenominations.length]}${i}`));
    }
    convertCell(worksheet.getCell(`${LETTERS[1 + availableDenominations.length]}${3 + reportData.length}`), "b6eaff");
    convertCell(worksheet.getCell(`A${3 + reportData.length}`), "b6eaff");

    for (let i = 2; i <= 1 + availableDenominations.length; ++i) {
        convertCell(worksheet.getCell(`${LETTERS[i - 1]}2`), "96ff8f");
        convertCell(worksheet.getCell(`${LETTERS[i - 1]}${3 + reportData.length}`), "b6eaff");
    }

    worksheet.eachRow(function (row) {
        row.eachCell(function (cell) {
            cell.border = BORDER;
        });
    });

    const dateStringCell = worksheet.getCell(`A${4 + reportData.length}`);
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