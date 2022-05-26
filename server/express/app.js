// global requirements
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');

// local routes requirements
const authRouter = require('./authorization/router');

// local auth requirements
const {SESSION_SECRET} = require('../config/sessionConfig');
const initializePassport = require('../config/passportConfig');


const app = express();

const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.header('Access-Control-Allow-Credentials', true);
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
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());


// include all routes
app.use('/auth', authRouter);

module.exports = app;