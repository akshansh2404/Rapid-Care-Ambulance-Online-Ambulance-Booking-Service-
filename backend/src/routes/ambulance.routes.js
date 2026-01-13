const router = require('express').Router();
const Joi = require('joi');
const validate = require('../middlewares/validate');
const { authenticate, authorizeRoles } = require('../middlewares/auth');
const { addAmbulance, listAmbulances, updateStatus } = require('../controllers/ambulance.controller');

const schemas = {
  add: Joi.object({
    body: Joi.object({ vehicleNumber: Joi.string().min(3).max(30).required() }),
    params: Joi.object({}),
    query: Joi.object({})
  }),
  updateStatus: Joi.object({
    body: Joi.object({ status: Joi.string().valid('available', 'busy').required() }),
    params: Joi.object({}),
    query: Joi.object({})
  })
};

router.post('/add', authenticate, authorizeRoles('driver'), validate(schemas.add), addAmbulance);
router.get('/list', authenticate, listAmbulances);
router.patch('/update-status', authenticate, authorizeRoles('driver'), validate(schemas.updateStatus), updateStatus);

module.exports = router;


