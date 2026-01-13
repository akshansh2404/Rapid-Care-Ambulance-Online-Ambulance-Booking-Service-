const Ambulance = require('../models/Ambulance');
const Booking = require('../models/Booking');
const asyncHandler = require('../utils/asyncHandler');

exports.createBooking = asyncHandler(async (req, res) => {
  const patientId = req.user.id;
  const { pickupLocation, dropLocation } = req.body;

  // Find an available ambulance (naive selection)
  const ambulance = await Ambulance.findOne({ status: 'available' });
  if (!ambulance) {
    return res.status(409).json({ success: false, message: 'No available ambulances' });
  }

  const booking = await Booking.create({
    patientId,
    ambulanceId: ambulance._id,
    pickupLocation,
    dropLocation,
    status: 'pending'
  });

  // set ambulance to busy once a booking is created
  ambulance.status = 'busy';
  await ambulance.save();

  res.status(201).json({ success: true, data: booking });
});

exports.myBookings = asyncHandler(async (req, res) => {
  const { role, id } = req.user;
  let filter = {};
  if (role === 'patient') filter.patientId = id;
  if (role === 'driver') {
    // find ambulance for this driver
    const ambulance = await Ambulance.findOne({ driverId: id });
    if (ambulance) filter.ambulanceId = ambulance._id;
  }
  const bookings = await Booking.find(filter)
    .populate('patientId', 'name email')
    .populate({ path: 'ambulanceId', populate: { path: 'driverId', select: 'name email' } })
    .sort({ createdAt: -1 });
  res.json({ success: true, data: bookings });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { bookingId, status } = req.body; // expected statuses: pending, accepted, on_the_way, completed, canceled
  const { role, id } = req.user;

  const booking = await Booking.findById(bookingId).populate('ambulanceId');
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  // Authorization: drivers can update for their own ambulance; patients can cancel their own; admin can update any
  if (role === 'driver') {
    const ambulance = await Ambulance.findOne({ driverId: id });
    if (!ambulance || String(ambulance._id) !== String(booking.ambulanceId._id)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
  } else if (role === 'patient') {
    if (String(booking.patientId) !== String(id)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    if (status !== 'canceled') {
      return res.status(400).json({ success: false, message: 'Patients may only cancel bookings' });
    }
  }

  booking.status = status;
  await booking.save();

  // Free ambulance when completed or canceled
  if (['completed', 'canceled'].includes(status)) {
    await Ambulance.findByIdAndUpdate(booking.ambulanceId._id, { status: 'available' });
  }

  res.json({ success: true, data: booking });
});


