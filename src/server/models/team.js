var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = new Schema({
	name: { type: String, required: true },
	country: { type: String, required: true },
	website: String,
	twitterPage: String,
	logoImage: String
});

var Team = mongoose.model('Team', teamSchema);

module.exports = Team;