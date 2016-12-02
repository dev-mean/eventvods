var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Staff = require('./staff').schema;
var Media = require('./socialmedia').schema;
var Team = require('./team').schema;
var slug = require('slug');
var Section = require('./section').schema;
var moment = require('moment');
var leagueSchema = new Schema({
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
    //teams: [Team],
    teams: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Teams'
    },
    teams_new: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Teams'
    },
    logo: String,
    header: String,
    header_blur: String,
    contents: [Section],
    credits: String
});


var League = mongoose.model('League', leagueSchema);

module.exports = League;
module.exports.schema = leagueSchema;