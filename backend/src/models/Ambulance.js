const mongoose = require('mongoose');

const AmbulanceSchema = new mongoose.Schema(
  {
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleNumber: { type: String, required: true, unique: true, trim: true },
    status: { type: String, enum: ['available', 'busy'], default: 'available' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ambulance', AmbulanceSchema);


