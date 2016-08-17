var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var articleSchema = new Schema({
    title: {
		type: String,
		required: true
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'Users'
	},
	slug: {
		type: String,
		required: true
	},
	tags: [{
		text: String
	}],
	content: String,
	header: String,
	published: {
		type: Boolean,
		default: false
	}

});
var Article = mongoose.model('Article', articleSchema);
module.exports = Article;
module.exports.schema = articleSchema;
