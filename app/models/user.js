var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var shortid = require('shortid');
var auth = require('../controllers/auth');

var userSchema = new Schema({
	displayName: {
		type: String,
		uppercase: true
	},
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
				default: true
			},
			team: {
				type: Boolean,
				default: true
			}
		},
		emails: {
			daily: {
				type: Boolean,
				default: false
			},
			weekly: {
				type: Boolean,
				default: true
			},
			monthly: {
				type: Boolean,
				default: true
			},
			featured: {
				type: Boolean,
				default: false
			},
		}
	}
}, {
	id: false,
	toObject: {
		virtuals: true,
	},
	toJSON: {
		virtuals: true,
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
userSchema.virtual('role').get(function () {
	return auth.roles[this.userRights];
});
var User = mongoose.model('Users', userSchema);

module.exports = User;
module.exports.schema = userSchema;
