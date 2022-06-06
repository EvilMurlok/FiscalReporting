// global requirements
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const schedule = require("node-schedule");

// local routes requirements
const excelReportsRouter = require("./excelReport/router");
const authRouter = require("./authorization/router");
const partnerRouter = require("./partner/router");
const coefficientRouter = require("./coefficient/router");
const packRouter = require("./pack/router");
const lotteryRouter = require("./lottery/router");
const statsRouter = require('./statByDay/router');
const dailyRouter = require('./dailyChanges/router');

// different utils
const {changeKqDaily} = require("../express/dailyChanges/coefficient");

// local auth requirements
const {SESSION_SECRET} = require("../config/sessionConfig");
const initializePassport = require("../config/passportConfig");


const app = express();

const allowCrossDomain = function (req, res, next) {
    // res.header('Access-Control-Allow-Origin', 'http://159.223.42.191:8080');
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "origin, content-type, accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
}
app.use(allowCrossDomain);

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 3600000, secure: false}
    })
);
app.use(passport.initialize({}));
// Store our variables to be persisted across the whole session.
// Works with app.use(Session) above
app.use(passport.session({}));
initializePassport(passport);

// using the middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());


schedule.scheduleJob("0 0 * * *", changeKqDaily);

app.use("/auth/", authRouter);
app.use("/excel-reports/", excelReportsRouter);
app.use("/partner/", partnerRouter);
app.use("/coefficient/", coefficientRouter);
app.use("/pack/", packRouter);
app.use("/lottery/", lotteryRouter);
app.use('/stats/', statsRouter);
app.use('/daily/', dailyRouter);

module.exports = app;