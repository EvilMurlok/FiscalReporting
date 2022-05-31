const express = require('express');

const authMiddlewares = require('../authorization/middlewares');
const lotteryControllers = require('./controllers');

const router = express.Router();

router.get('/get-all-lotteries/', authMiddlewares.checkNotAuthenticated, lotteryControllers.allLotteries);

module.exports = router;