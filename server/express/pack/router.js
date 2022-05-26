const express = require('express');
const passport = require('passport');

const packMiddlewares = require('./middlewares');
const packControllers = require('./controllers');

const router = express.Router();

router.post('/register/', authControllers.user_register_post);
router.post('/login/', authMiddlewares.authenticate('local', {session: true}),
    function (req, res) {
        res.send({
            status: 'success',
            user: req.user,
            messages: [{
                text: `Добро пожаловать ${req.user.username}`
            }]
        });
    }
);
router.post('/edit/', authMiddlewares.checkNotAuthenticated, authControllers.user_edition);
router.post('/change-password/', authMiddlewares.checkNotAuthenticated, authControllers.user_change_password);
router.get(/info/, authMiddlewares.checkNotAuthenticated, authControllers.user_retrieve);
router.get('/logout/', authMiddlewares.checkNotAuthenticated, authControllers.user_logout);

// Вызывается при каждой переадресации со страницы на страницу
router.get('/user-profile/', authMiddlewares.checkNotAuthenticated,
    (req, res) => {
        res.send({
            status: 'success',
            user: req.user
        });
    });

router.get('/delete/', authMiddlewares.checkNotAuthenticated, authControllers.user_deletion);

module.exports = router;
