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
    teams: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Teams'
    },
    logo: String,
    header: String,
    header_blur: String,
    contents: [Section],
    credits: String,
    updatedAt: Date
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
eventSchema.virtual('updated').get(function(){
    return moment(this.updatedAt).fromNow();
})
eventSchema.virtual('status').get(function(){
    var now = moment();
    if( moment(this.startDate).isAfter(now) ) return "Upcoming";
    else if( moment(this.endDate).isBefore(now) ) return "Complete";
    else return "Ongoing";
})

//Leave model name as League so as to keep old data.
//Eventually we'll want to rename the collection
var Event = mongoose.model('League', eventSchema);

module.exports = Event;
module.exports.schema = eventSchema;