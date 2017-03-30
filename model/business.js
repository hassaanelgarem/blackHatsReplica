const mongoose = require('mongoose');
const config = require('../config/database');

// Schema
const BusinessSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
  phone_numbers: [{
    type: String
  }],
  working_days: [{
    type: String
  }],
  working_hours:{
    from: {
      type: String
    },
    to: {
      type: String
    }
  },
  address: {
    type: String
  },
  // TODO: decide on location data type
  location: {
    longitude: {
      type: Number
    },
    latitude: {
      type: Number
    }
  },
  tags: [{
    type: String
  }],
  category: {
    type: String
  },
  description: {
    type: String,
		required: true
  },
  interactivity: {
    type: Number,
    default: 0
  },
  activities: [{
    type: Schema.Types.ObjectId,
    ref: "Activity"
  }],
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }],
  photos: [{
    type: String
  }],
  /*
    1: Full payment needed
    2: Deposit needed
    3: No payment needed
  */
  payment_required: {
    type: Number
  },
  deposit: {
    type: Number
  },
	logo: {
		type: String
	}
});

const Bussines = module.exports = mongoose.model('Bussines', BusinessSchema);
