var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

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
	header_blur: String,
	published: {
		type: Boolean,
		default: false
	},
	publishDate: Date

}, {
	id: false,
	toJSON: {
		virtuals: true,
	},
	toObject: {
		virtual: true,
	}
});

articleSchema.virtual('when').get(function () {
  	return moment(this.publishDate).fromNow();
});

var Article = mongoose.model('Article', articleSchema);
module.exports = Article;
module.exports.schema = articleSchema;
