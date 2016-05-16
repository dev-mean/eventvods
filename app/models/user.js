var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	userEmail: String,
	lastLogin: {
		type: Date,
		default: Date.now
	},
	signupDate: {
		type: Date,
		default: Date.now
	},
	signupIP: String,
	lastIP: String,
	userRights: {
		type: Number,
		default: 0
	},
	userPreferences: String,
	emailConfirmed: Boolean,
	emailConfirmation: String,
	emailSent: Boolean
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model('users', userSchema);

module.exports = User;
module.exports.schema = userSchema;
