var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var featuredSchema = new Schema({
    games: {
		type: [Schema.Types.ObjectId],
		ref: 'Game'
	},
	events: {
		type: [Schema.Types.ObjectId],
		ref: 'League'
	},
	articles: {
		type: [Schema.Types.ObjectId],
		ref: 'Article'
	},
	teams: {
		type: [Schema.Types.ObjectId],
		ref: 'Teams'
	}
},{
	strict: true
});
var Featured = mongoose.model('Featured', featuredSchema);
module.exports = Featured;
module.exports.schema = featuredSchema;
