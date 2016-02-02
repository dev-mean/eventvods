var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SocialMedia = require('./socialmedia').schema;
var Sponsor = require('./sponsor').schema;
var Team = require('./team').schema;
var Staff = require('./staff').schema;
var Map = require('./map').schema;
var Module = require('./module').schema;
var User = require('./user').schema;

var eventSchema = new Schema({
	eventGame: { type: String, required: true },
	eventTitle: { type: String, required: true },
	eventPermaLink: { type: String, required: true },
	eventAbbreviation: String,
	eventType: String,
	eventModules: [Module],
	eventLocation: { type: String, required: true },
	eventMedia: [SocialMedia],
	eventSponsors: [Sponsor],
	eventStartDate: { type: Date, required: true },
	eventEndDate: { type: Date, required: true },
	eventMaps: [Map],
	eventTeams: [Team],
	eventStaff: [Staff],
	eventUser: { type: Schema.ObjectId, ref: 'User' },
	eventImage: { type: String, default: 'default.png' }
});

var Event = mongoose.model('events', eventSchema);

module.exports = Event;
