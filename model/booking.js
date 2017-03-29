const mongoose = require('mongoose');
const config = require('../config/database');

// Schema
const BookingSchema = mongoose.Schema({
  slot:{
    start-time: {
      type: String,
  		required: true
    },
    end-time: {
      type: String,
  		required: true
    }
  },
  activity: {
		type: Schema.Types.ObjectId,
    ref: "Activity",
		required: true
	},
  user: {
		type: Schema.Types.ObjectId,
    ref: "User",
		required: true
	}
});

const Booking = module.exports = mongoose.model('Booking', BookingSchema);
