var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
var moment = require('moment');

var resetTokenSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    token: {
        type: String,
        default: shortid.generate()
    },
    expiry: {
        type: Date,
        default: moment().subtract(1, 'd').toDate()
    },
    newPassword: String
});

var ResetToken = mongoose.model('resetToken', resetTokenSchema);

module.exports = ResetToken;