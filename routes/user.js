const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUser, updateUserInfo } = require('../controllers/user');

router.get('/me', getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string(),
    name: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

module.exports = router;
