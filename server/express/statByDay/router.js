const express = require('express');

const authMiddlewares = require('../authorization/middlewares');
const statByDayControllers = require('./controllers');

const router = express.Router();

router.get('/balance-report/', authMiddlewares.checkNotAuthenticated, statByDayControllers.getBalanceReport);
router.get('/balance/:id/', authMiddlewares.checkNotAuthenticated, statByDayControllers.getCurrentBalanceForOneLottery)
router.get('/sells-report/', authMiddlewares.checkNotAuthenticated, statByDayControllers.getSellsReport);

module.exports = router;
