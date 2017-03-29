const mongoose = require('mongoose');
const config = require('../config/database');

// Schema
const ActivitySchema = mongoose.Schema({
  name: {
    type: String,
		required: true
  },
  price: {
    type: Number,
		required: true
  }
  description: {
    type: String,
		required: true
  },
  photos: [{
    type: String
  }],
  bookings_per_slot: {
    type: Number,
		required: true
  },
  slots: [{
    start-time: {
      type: String,
  		required: true
    },
    end-time: {
      type: String,
  		required: true
    }
  }],
  bussines: {
		type: Schema.Types.ObjectId,
    ref: "Bussines",
		required: true
	},
  bookings: [{
    type: Schema.Types.ObjectId,
    ref: "Booking"
  }]


});

const Activity = module.exports = mongoose.model('Activity', ActivitySchema);
