var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tournamentSchema = new Schema ({
	userID: { type: Number, required: true, unique: true },
	format: { type: String, required: true },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true }
});

var Tournament = mongoose.model('Tournament', tournamentSchema);

module.exports = Tournament;
