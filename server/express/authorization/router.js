const express = require('express');

const authMiddlewares = require('./middlewares');
const authControllers = require('./controllers');

const router = express.Router();

router.post('/register/', authControllers.userRegisterPost);
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
router.post('/edit/', authMiddlewares.checkNotAuthenticated, authControllers.userEdition);
router.post('/change-password/', authMiddlewares.checkNotAuthenticated, authControllers.userChangePassword);
router.get(/info/, authMiddlewares.checkNotAuthenticated, authControllers.userRetrieve);
router.get('/logout/', authMiddlewares.checkNotAuthenticated, authControllers.userLogout);

// Вызывается при каждой переадресации со страницы на страницу
router.get('/user-profile/', authMiddlewares.checkNotAuthenticated,
    (req, res) => {
        res.send({
            status: 'success',
            user: req.user
        });
    });

router.get('/delete/', authMiddlewares.checkNotAuthenticated, authControllers.userDeletion);

module.exports = router;
