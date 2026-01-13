const router = require('express').Router();
const Joi = require('joi');
const validate = require('../middlewares/validate');
const { authenticate, authorizeRoles } = require('../middlewares/auth');
const { createBooking, myBookings, updateStatus } = require('../controllers/booking.controller');

const schemas = {
  create: Joi.object({
    body: Joi.object({
      pickupLocation: Joi.string().min(3).required(),
      dropLocation: Joi.string().min(3).required()
    }),
    params: Joi.object({}),
    query: Joi.object({})
  }),
  update: Joi.object({
    body: Joi.object({
      bookingId: Joi.string().required(),
      status: Joi.string().valid('pending', 'accepted', 'on_the_way', 'completed', 'canceled').required()
    }),
    params: Joi.object({}),
    query: Joi.object({})
  })
};

router.post('/create', authenticate, authorizeRoles('patient'), validate(schemas.create), createBooking);
router.get('/my', authenticate, myBookings);
router.patch('/update-status', authenticate, validate(schemas.update), updateStatus);

module.exports = router;


