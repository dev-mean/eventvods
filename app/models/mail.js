var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var mailSchema = new Schema({
	resolved: {
        type: Boolean,
        default: false
    },
    sentTime: {
        type: Date,
        default: Date.now
    },
    subject: String,
    contents: String,
    name: String,
    email: String
}, {
	id: false,
	toObject: {
		virtuals: true,
	},
	toJSON: {
		virtuals: true,
	}
});
mailSchema.virtual('when').get(function(){
    return moment(this.sentTime).fromNow();
});
var Mail = mongoose.model('Mail', mailSchema);

module.exports = Mail;
module.exports.schema = mailSchema;
