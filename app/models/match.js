var mongoose = require('mongoose-fill');
var Schema = mongoose.Schema;
var Event = require('./event');
var moduleSchema = require('./section').moduleSchema;

var matchSchema = new Schema({
    identifier: String,
    team1Match: String,
    team2Match: String,
    bestOf: {
        type: Number,
        default: 1
    },
	team1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teams',
        required: false
    },
	team2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teams',
        required: false
    },
    title: String,
	spoiler1: {
		type: Boolean,
		default: false
	},
    spoiler2: {
		type: Boolean,
		default: false
	},
    date: Date,
    data: [{
        links: [String],
        twitch: {
            picksBans: String,
            gameStart: String,
        },
        youtube: {
            picksBans: String,
            gameStart: String
        },
        placeholder: {
            type: Boolean,
            default: false
        },
        rating: Number
    }]
}, {
	id: false,
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true 
	}
});
matchSchema.fill('event', function(cb){
    mongoose.model('League', Event.eventSchema).findOne({
        "contents.modules.matches2": this._id
    })
    .select('shortTitle')
    .exec(cb);
});

var Match = mongoose.model('Match', matchSchema);
module.exports = Match;
module.exports.schema = matchSchema;