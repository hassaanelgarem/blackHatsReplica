const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  photos: [{
    type: String
  }],
  bookingsPerSlot: {
    type: Number,
    required: true
  },
  slots: [{
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    }
  }],
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  }]
});

mongoose.model('Activity', activitySchema);
