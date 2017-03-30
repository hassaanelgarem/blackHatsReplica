const mongoose = require('mongoose');
const config = require('../config/database');

// Schema

const UserSchema = mongoose.Schema({
	first_name: {
		type: String,
		required: true
	},
  last_name: {
    type: String,
    required: true
  },
	email: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	profile_picture:{
		type: String
	},
  birth_date: {
    type: Date
  },
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: "Bussines"
  }],
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }],
  bookings: [{
    type: Schema.Types.ObjectId,
    ref: "Booking"
  }]
});

const User = module.exports = mongoose.model('User', UserSchema);
