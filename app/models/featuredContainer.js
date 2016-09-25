var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var featuredSchema = new Schema({
    games: {
		type: [Schema.Types.ObjectId],
		ref: 'Game'
	},
	leagues: {
		type: [Schema.Types.ObjectId],
		ref: 'League'
	},
	tournaments: {
		type: [Schema.Types.ObjectId],
		ref: 'Tournament'
	},
	articles: {
		type: [Schema.Types.ObjectId],
		ref: 'Article'
	},
});
var Featured = mongoose.model('Featured', featuredSchema);
module.exports = Featured;
module.exports.schema = featuredSchema;
