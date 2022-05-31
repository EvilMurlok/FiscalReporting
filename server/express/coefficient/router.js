const express = require("express");

const authMiddlewares = require('../authorization/middlewares');

const coefficientControllers = require("./controllers");

const router = express.Router();

router.post("/change-kq/", authMiddlewares.checkNotAuthenticated, coefficientControllers.changeKq);
router.post("/addInspection/", authMiddlewares.checkNotAuthenticated, coefficientControllers.createInspection);

module.exports = router;