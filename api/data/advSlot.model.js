const mongoose = require('mongoose');


const advSlotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  length: {
    type: Number
  },
  width: {
    type: Number
  },
  advSchedule: [{
    type: mongoose.Schema.Types.ObjectId,         //An array of bookings
    ref: "AdvBooking"
  }]
});

mongoose.model('AdvSlot', advSlotSchema);
