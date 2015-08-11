var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var socialMediaSchema = new Schema({
    mediaType: { type: String, enum: ['Website', 'Twitter', 'Facebook', 'Twitch', 'Youtube', 'Stream', 'Other'], required: true },
	mediaName: { type: String },
    mediaURL: { type: String, required: true }
});

module.exports = mongoose.model('SocialMedia', socialMediaSchema);
module.exports.schema = socialMediaSchema;
