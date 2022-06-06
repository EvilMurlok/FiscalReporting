const express = require("express");

const allDailyChangesControllers = require("./allDailyChanges");
const {getBetTradeDataByYesterday} = require("./statsByDay");

const router = express.Router();

router.get('/make-daily-changes/', allDailyChangesControllers.makeDailyChanges);

module.exports = router;