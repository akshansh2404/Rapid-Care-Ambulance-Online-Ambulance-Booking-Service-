const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ambulanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance', required: true },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'on_the_way', 'completed', 'canceled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);


