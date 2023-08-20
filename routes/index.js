const router = require('express').Router();
const routesUsers = require('./users');
const routesCards = require('./cards');
const routesSignUp = require('./signup');
const routesSignIn = require('./signin');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.use('/signup', routesSignUp);
router.use('/signin', routesSignIn);
router.use(auth);
router.use('/users', routesUsers);
router.use('/cards', routesCards);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
});

module.exports = router;
