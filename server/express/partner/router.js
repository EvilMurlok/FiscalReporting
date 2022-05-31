const express = require("express");

const authMiddlewares = require('../authorization/middlewares');

const partnerControllers = require("./controllers");

const router = express.Router();

router.get('/get-all-partners/', authMiddlewares.checkNotAuthenticated, partnerControllers.getAllPartners);

module.exports = router;