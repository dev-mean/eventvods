var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = new Schema({
	teamID: { type: Number, require: true, unique: true },
	teamGame: String,
	teamWebsite: String,
	teamTwitter: String,
	teamCountry: String,
	teamImage: String,
	teamIcon: String
});

var Team = mongoose.model('Team', teamSchema);

module.exports = Team;
