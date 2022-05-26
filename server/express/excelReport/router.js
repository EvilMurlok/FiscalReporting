const express = require("express");

const excelReportsControllers = require("./controllers");

const router = express.Router();

router.get('/create-remainders-report/', excelReportsControllers.createRemaindersReport);
router.get('/create-global-report/', excelReportsControllers.createGlobalReport);
router.get('/create-history-report/', excelReportsControllers.createHistoryReport);

module.exports = router;