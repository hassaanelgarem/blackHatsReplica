const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumbers: [{
    type: String
  }],
  workingDays: [{
    type: String
  }],
  workingHours: {
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
  location : {
    address : String,
    // Always store coordinates longitude (East/West), latitude (North/South) order.
    coordinates : {
      type : [Number],
      index : '2dsphere'
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity"
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
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
  paymentRequired: {
    type: Number
  },
  deposit: {
    type: Number
  },
  logo: {
    type: String
  },
  resetPasswordToken : String,
  resetPasswordTokenExpiry : Date
});

mongoose.model('Business', businessSchema);