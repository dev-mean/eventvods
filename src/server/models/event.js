var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
	format: { type: String, required: true },
	beginDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	tournamentLocation: { type: String, required: true },
	casters: String,
	panel: String
});

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;