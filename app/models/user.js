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
		sent: {
			type: Boolean,
			default: false
		}
	},
	code: {
		type: String,
		default: shortid.generate()
	},
	profilePicture: {
		type: String,
		default: "http://i.imgur.com/tep1kEd.png",
	},
	settings: {
		inline: {
			twitch: {
				type: Boolean,
				default: true
			},
			youtube: {
				type: Boolean,
				default: true
			}
		},
		notifications: {
			game: {
				type: Boolean,
				default: false
			},
			event: {
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
	},
	social: {
		facebook: {
			type: String,
			//select: false
		},
		twitter: {
			type: String,
			//select: false
		},
		google: {
			type: String,
			//select: false
		}
	},
	following: {
		leagues: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'League'
		},
		tournaments: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'Tournament'
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
	selectFields: 'displayName _id social email userRights settings profilePicture following emailConfirmation',
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
