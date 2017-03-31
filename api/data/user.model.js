const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
  lastName: {
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
	profilePicture:{
		type: String
	},
  birthDate: {
    type: Date
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business"
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review"
  }],
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  }],
  resetPasswordToken : String,
  resetPasswordTokenExpiry : Date
});

mongoose.model('User', userSchema);
