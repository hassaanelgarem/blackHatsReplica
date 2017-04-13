const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


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
		required: true,
		lowercase: true,
		unique: true
	},
	username: {
		type: String,
		required: true,
		lowercase: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	profilePicture: {
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
	admin: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	resetPasswordToken: String,
	resetPasswordTokenExpiry: Date
});


userSchema.statics.createUser = function (newUser, callback) {
	bcrypt.genSalt(10, function (err, salt) {
		if (err)
			callback(err, null);
		else {
			if (salt)
				bcrypt.hash(newUser.password, salt, function (err, hash) {
					if (err)
						callback(err, null);
					else {
						if (hash) {
							newUser.password = hash;
							newUser.save(callback(null, newUser));
						} else {
							callback(null, null);
						}
					}
				});
		}
	});
};


userSchema.statics.getUserByUsername = function (username, callback) {
	var query = {
		username: username
	};
	this.findOne(query, callback);
};


userSchema.statics.getUserById = function (id, callback) {
	this.findById(id, callback);
};


userSchema.statics.comparePassword = function (candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
		callback(err, isMatch);
	});
};

mongoose.model('User', userSchema);