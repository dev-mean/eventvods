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

var Team = mongoose.model('teams', teamSchema);

module.exports = Team;
