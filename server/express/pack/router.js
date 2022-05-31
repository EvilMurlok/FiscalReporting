const express = require('express');

const authMiddlewares = require('../authorization/middlewares');
const packControllers = require('./controllers');

const router = express.Router();

router.post('/make-pack/', authMiddlewares.checkNotAuthenticated, packControllers.makePack);
router.get('/history/', authMiddlewares.checkNotAuthenticated, packControllers.getHistory);

module.exports = router;
