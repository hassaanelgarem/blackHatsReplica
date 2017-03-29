const mongoose = require('mongoose');
const config = require('../config/database');

// Schema
const ReviewSchema = mongoose.Schema({
	comment: {
		type: String
	},
	rating: {
		type: Number,
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
    ref: "User",
		required: true
	},
	bussines: {
		type: Schema.Types.ObjectId,
    ref: "Bussines",
		required: true
	}
});

const Review = module.exports = mongoose.model('Review', ReviewSchema);
