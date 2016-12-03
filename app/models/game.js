var mongoose = require('mongoose-fill');
var Schema = mongoose.Schema;
var Event = require('./league');
var Team = require('./team');

var gameSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		required: true,
		unique: true
	},
	icon: String,
	header: String,
	header_blur: String,
	credits: String,
	simple_tables: {
		type: Boolean,
		default: false
	}
}, {
	id: false,
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
});
gameSchema.fill('events', function(cb){
    Event
        .find({game: this._id})
        .exec(cb);
});
gameSchema.fill('eventsCount', function(cb){
    Event
        .find({game: this._id})
        .count()
        .exec(cb);
});
gameSchema.fill('teams', function(cb){
    Team
        .find({game: this._id})
        .exec(cb);
});
gameSchema.fill('teamsCount', function(cb){
    Team
        .find({game: this._id})
        .count()
        .exec(cb);
});
var Game = mongoose.model('Game', gameSchema);
module.exports = Game;
module.exports.schema = gameSchema;
