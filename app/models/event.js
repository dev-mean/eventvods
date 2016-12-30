var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Staff = require('./staff').schema;
var Media = require('./socialmedia').schema;
var Team = require('./team').schema;
var slug = require('slug');
var Section = require('./section').schema;
var moment = require('moment');
var User = require('./user');
var eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    subtitle: String,
    shortTitle: String,
    textOrientation: String,
    patch: String,
    prize: String,
    format: String,
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    startDate: Date,
    endDate: Date,
    staff: [Staff],
    media: [Media],
    youtubeStream: String,
    twitchStream: String,
    //Stage 1-2
    // teams: [Team],
    teams_new: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Teams'
    },
    //Stage 3
    teams: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Teams'
    },
    
    logo: String,
    header: String,
    header_blur: String,
    contents: [Section],
    credits: String
}, {
	id: false,
	toObject: {
		virtuals: true,
	},
	toJSON: {
		virtuals: true,
	}
});
eventSchema.fill('followers', function(cb){
    User
        .find({
            "following": this._id
        })
        .count()
        .exec(cb);
});

//Leave model name as League so as to keep old data.
//Eventually we'll want to rename the collection
var Event = mongoose.model('League', eventSchema);

module.exports = Event;
module.exports.schema = eventSchema;