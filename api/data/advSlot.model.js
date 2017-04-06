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
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  // Array of advertisements that will be shown on this slot
  advSchedule: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdvBooking"
  }]
});

mongoose.model('AdvSlot', advSlotSchema);
