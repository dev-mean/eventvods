var mongoose = require('mongoose-fill');
var Schema = mongoose.Schema;
var Media = require('./socialmedia').schema;
var Event = require('./event');
var Match = require('./match');

var teamSchema = new Schema({
	name: {
		type: String
	},
	tag: {
		type: String
	},
	slug: {
		type: String,
		required: true
	},
	game: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Game',
		required: true
	},
	media: [Media],
	icon: String,
	updatedAt: Date
}, {
	id: false,
	strict: true,
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true 
	}
});
teamSchema.fill('matches', function(cb){
	Match.find({
	$or: [
		{team1: this._id},
		{team2: this._id}
	]
	})
	.fill('event')
	.populate({
		path: 'team1 team2',
		model: 'Teams',
		select: 'name tag icon'
	})
	.sort({date: 'desc', team1: 'desc', team2: 'desc'})
	.exec(cb);
})
var Team = mongoose.model('Teams', teamSchema);

module.exports = Team;
module.exports.schema = teamSchema;
