var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var shortid = require('shortid');

var userSchema = new Schema({
	displayName: String,
	signup: {
		date: {
			type: Date,
			default: Date.now
		},
		IP: String
	},
	userRights: {
		type: Number,
		default: 0
	},
	emailConfirmation: {
		confirmed: {
			type: Boolean,
			default: false
		},
		code: {
			type: String,
			default: shortid.generate()
		},
		sent: {
			type: Boolean,
			default: false
		}
	}
});

userSchema.plugin(passportLocalMongoose, {
	usernameField: 'email',
	limitAttempts: true,
	maxAttempts: 10,
	usernameLowerCase: true,
	errorMessages: {
		IncorrectUsernameError: "Incorrect username or password",
		IncorrectPasswordError: "Incorrect username or password",
		UserExistsError: "That email is already registered"
	}
});

var User = mongoose.model('users', userSchema);

module.exports = User;
module.exports.schema = userSchema;
