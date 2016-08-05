var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var articleSchema = new Schema({
    title: {
		type: String,
		required: true
	},
	author: {
		type: [Schema.Types.ObjectId],
		ref: 'User'
	},
	slug: {
		type: String,
		required: true
	},
	tags: [String],
	content: String,
	header: String

});
var Article = mongoose.model('Article', articleSchema);
module.exports = Article;
module.exports.schema = articleSchema;
