const router = require('express').Router();
const validate = require('../middlewares/validate');
const Joi = require('joi');
const { register, login } = require('../controllers/auth.controller');

const authSchema = {
  register: Joi.object({
    body: Joi.object({
      name: Joi.string().min(2).max(60).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      role: Joi.string().valid('patient', 'driver', 'admin').default('patient')
    }),
    params: Joi.object({}),
    query: Joi.object({})
  }),
  login: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required()
    }),
    params: Joi.object({}),
    query: Joi.object({})
  })
};

router.post('/register', validate(authSchema.register), register);
router.post('/login', validate(authSchema.login), login);

module.exports = router;


