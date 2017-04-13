const mongoose = require('mongoose');

const supportRequestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String,
        required: true,
        lowercase: true
    },
    contactPhoneNumber: String,
    accountType: {
        type: String,
        required: true
    },
    registeredEmail: {
        type: String,
        required: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('SupportRequest', supportRequestSchema);
