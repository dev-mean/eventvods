var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema ({
	playerID: { type: Number, required: true, unique: true },
	playerName: { type: String, required: true },
	playerTeamID: { type: Number, required: true }
});

var Player = mongoose.model('Player', playerSchema);

module.exports = Player;
