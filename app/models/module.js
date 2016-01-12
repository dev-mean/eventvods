var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Team = require('./team').schema;
var Match = require('./match').schema;

var moduleSchema =  new Schema ({
    moduleTitle: { type: String, required: true },
	moduleMatches: [Match],
    moduleTeams: [Team],
});

var Module = mongoose.model('modules', moduleSchema);

module.exports = Module;
module.exports.schema = moduleSchema;
