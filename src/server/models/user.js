var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Scheuma({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	admin: Boolean,
	perferences: string
});

var User = mongoose.model('User', userSchema);

module.exports = User;