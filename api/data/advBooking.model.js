const mongoose = require('mongoose');


const advBookingSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true
  },
  //Advertisement slot that displays this booking
  advSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdvSlot",
    required: true
  },
  image:{
    type: String,
    required: true
  },
  startTime: {
      type: Date,
      required: true
    },
  endTime: {
      type: Date,
      required: true
    }
});

mongoose.model('AdvBooking', advBookingSchema);
