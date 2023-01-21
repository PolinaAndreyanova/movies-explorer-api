const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { checkAuth } = require('../middlewares/auth');

const { login, createUser } = require('../controllers/user');

const userRouter = require('./user');
const movieRouter = require('./movie');

const NotFoundError = require('../errors/not-found-error');

router.use('/users', checkAuth, userRouter);

router.use('/movies', checkAuth, movieRouter);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Путь не найден'));
});

module.exports = router;
