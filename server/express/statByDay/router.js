const express = require('express');
const passport = require('passport');

const authMiddlewares = require('../authorization/middlewares');
const statByDayControllers = require('./controllers');

const router = express.Router();

router.get('/balance-report/', authMiddlewares.checkNotAuthenticated, statByDayControllers.getBalanceReport);
router.get('/balance/:id/', authMiddlewares.checkNotAuthenticated, statByDayControllers.getBalanceReportForOneLottery)

module.exports = router;
