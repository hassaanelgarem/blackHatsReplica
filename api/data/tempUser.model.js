const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const tempUserSchema = new mongoose.Schema({
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
	createdAt: {
		type: Date,
		default: Date.now
	},
	verificationToken: String,
	verificationTokenExpiry: Date
});

tempUserSchema.statics.createUser = function (newUser, callback) {
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

mongoose.model('TempUser', tempUserSchema);