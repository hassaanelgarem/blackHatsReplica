const mongoose = require('mongoose');


const bookingSchema = new mongoose.Schema({
    slot: {
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        }
    },
    activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
  		type: Date,
  		required: true
  	}
});

mongoose.model('Booking', bookingSchema);
