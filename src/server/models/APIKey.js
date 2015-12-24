var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var apiKeySchema = new Schema({
	apiKeyOwner: {
		name: String,
		url: String,
		email: String
	},
	apiKey: String,
});

var APIKey = mongoose.model('APIKey', apiKeySchema);

module.exports = APIKey;
module.exports.schema = apiKeySchema;
