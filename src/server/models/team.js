var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = new Schema({
	teamGame: String,
	teamWebsite: String,
	teamTwitter: String,
	teamCountry: String,
	teamImage: String,
	teamIcon: String
});

var Team = mongoose.model('Team', teamSchema);

module.exports = Team;
