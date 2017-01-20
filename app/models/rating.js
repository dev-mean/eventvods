var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ratingSchema = new Schema({
	user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    index: Number
});

var Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
module.exports.schema = ratingSchema;
