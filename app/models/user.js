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
	},
	profilePicture: {
		type: String,
		default: "http://i.imgur.com/tep1kEd.png",
	},
	settings: {
		notifications: {
			game: {
				type: Boolean,
				default: false
			},
			league: {
				type: Boolean,
				default: false
			},
			team: {
				type: Boolean,
				default: false
			}
		},
		emails: {
			daily: {
				type: Boolean,
				default: false
			},
			weekly: {
				type: Boolean,
				default: false
			},
			monthly: {
				type: Boolean,
				default: false
			},
			featured: {
				type: Boolean,
				default: false
			},
		}
	}
});

userSchema.plugin(passportLocalMongoose, {
	usernameField: 'email',
	limitAttempts: true,
	maxAttempts: 5,
	usernameLowerCase: true,
	errorMessages: {
		IncorrectUsernameError: "Incorrect email or password.",
		IncorrectPasswordError: "Incorrect email or password.",
		UserExistsError: "That email is already registered."
	}
});

var User = mongoose.model('users', userSchema);

module.exports = User;
module.exports.schema = userSchema;
