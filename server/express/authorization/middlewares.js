const passport = require("passport");
const checkAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.send({
        messages: [{
            text: 'Вы уже вошли в систему!'
        }],
        status: 'warning',
        isLoggedIn: req.isAuthenticated()
    });
}

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send({
        messages: [{
            text: 'Для посещения этой страницы необходима авторизация! Возможные причины: сессия устарела (авторизуйтесь заново) ИЛИ вы не вошли на сайт'
        }],
        status: 'warning',
        isLoggedIn: req.isAuthenticated()
    });
}

function authenticate(strategy, options) {
    return function (req, res, next) {
        passport.authenticate(strategy, options, (error, user, info) => {
            // console.log('1',error);
            // console.log('2',user);
            // console.log('3',info);
            if (error) {
                return next(error);
            }
            if (!user) {
                res.send({status: 'warning',
                    messages: [info]
                });
                return next;
            }
            if (options.session) {
                return req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    return next();
                });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
    authenticate
}