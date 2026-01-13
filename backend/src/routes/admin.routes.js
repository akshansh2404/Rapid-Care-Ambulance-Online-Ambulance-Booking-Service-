const router = require('express').Router();
const { authenticate, authorizeRoles } = require('../middlewares/auth');
const { listUsers, listBookings, listAmbulances } = require('../controllers/admin.controller');

router.use(authenticate, authorizeRoles('admin'));

router.get('/users', listUsers);
router.get('/bookings', listBookings);
router.get('/ambulances', listAmbulances);

module.exports = router;


