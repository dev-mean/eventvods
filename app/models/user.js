var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({

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
