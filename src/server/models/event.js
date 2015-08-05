var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
	eventTitle: { type: String, require: true },
	eventPermaLink: { type: String, require: true },
	eventAbbreviation: String,
	eventFormat: { type: String, required: true },
	eventType: String,
	eventModules: String,
	eventLocation: { type: String, required: true },
	eventWebsite: String,
	eventTwitter: String,
	eventStream: String,
	eventOwner: String,
	eventGroup: String,
	eventSponsors: String,
	eventStartDate: { type: Date, required: true },
	eventEndDate: { type: Date, required: true },
	eventMaps: String,
	eventTeams: String,
	eventCasters: String,
	eventPanel: String,
	eventCustomGroup1: Array,
	eventCustomField1: Array,
	eventCustomURL1: Array
});

var Event = mongoose.model('events', eventSchema);

module.exports = Event;
