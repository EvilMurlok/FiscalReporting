const LocalStrategy = require('passport-local').Strategy;
const config = require('./dbConfigLocal');
const bcrypt = require('bcrypt');

const dbConnection = require('../sequelize/dbConnection').getInstance({
    config: config,
    mode: 'development'
});


function initialize(passport) {
    passport.use('local',
        new LocalStrategy({usernameField: 'username', passwordField: 'password'}, (username, password, done) => {
            dbConnection.models.user.findOne({
                where: {username: username},
                attributes: ["id", "username", "role", "created", "password"],
            }).then(function (user) {
                    if (!user) {
                        return done(null, false, {text: 'Пользователя с таким никнеймом не существует!'});
                    } else {
                        bcrypt.compare(password, user.password, (err, isMatch) => {
                            if (err) {
                                console.log(err);
                            }
                            if (isMatch) {
                                return done(null, user.get());
                            } else {
                                return done(null, false, {text: 'Неправильный пароль!'});
                            }
                        });
                    }
                }
            );
        })
    );

    passport.serializeUser((user, done) => {
        // console.log('serializeUser');
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        dbConnection.models.user.findOne({
            where: {id: id},
            attributes: ["id", "username", "role", "created"]
        }).then(function (user) {
            if (user) {
                // console.log('deserializeUser');
                done(null, user.get());
            } else {
                done('Нет такого пользователя!', null);
            }
        });
    });
}

module.exports = initialize;