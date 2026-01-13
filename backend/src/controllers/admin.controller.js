const User = require('../models/User');
const Booking = require('../models/Booking');
const Ambulance = require('../models/Ambulance');
const asyncHandler = require('../utils/asyncHandler');

exports.listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

exports.listBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('patientId', 'name email')
    .populate({ path: 'ambulanceId', populate: { path: 'driverId', select: 'name email' } })
    .sort({ createdAt: -1 });
  res.json({ success: true, data: bookings });
});

exports.listAmbulances = asyncHandler(async (req, res) => {
  const ambulances = await Ambulance.find().populate('driverId', 'name email');
  res.json({ success: true, data: ambulances });
});


