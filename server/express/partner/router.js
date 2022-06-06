const express = require("express");

const authMiddlewares = require('../authorization/middlewares');

const partnerControllers = require("./controllers");
const {checkForPartnersUpdatesDaily} = require("../dailyChanges/partner");

const router = express.Router();

router.get('/get-all-partners/', authMiddlewares.checkNotAuthenticated, partnerControllers.getAllPartners);
router.get('/get-betTrade-partners/', checkForPartnersUpdatesDaily);

module.exports = router;