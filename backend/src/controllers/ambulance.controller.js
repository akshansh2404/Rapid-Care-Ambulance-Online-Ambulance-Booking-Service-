const Ambulance = require('../models/Ambulance');
const asyncHandler = require('../utils/asyncHandler');

exports.addAmbulance = asyncHandler(async (req, res) => {
  const driverId = req.user.id;
  const { vehicleNumber } = req.body;
  const exists = await Ambulance.findOne({ vehicleNumber });
  if (exists) {
    return res.status(409).json({ success: false, message: 'Vehicle number already registered' });
  }
  const ambulance = await Ambulance.create({ driverId, vehicleNumber });
  res.status(201).json({ success: true, data: ambulance });
});

exports.listAmbulances = asyncHandler(async (req, res) => {
  const ambulances = await Ambulance.find().populate('driverId', 'name email');
  res.json({ success: true, data: ambulances });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const driverId = req.user.id;
  const { status } = req.body; // 'available' | 'busy'
  const ambulance = await Ambulance.findOneAndUpdate({ driverId }, { status }, { new: true });
  if (!ambulance) {
    return res.status(404).json({ success: false, message: 'Ambulance not found for driver' });
  }
  res.json({ success: true, data: ambulance });
});


