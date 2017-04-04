const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    slot: {
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
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
    }
});

mongoose.model('Booking', bookingSchema);
