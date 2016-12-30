//dev config
require('dotenv')
	.config({
		silent: false
	});
var mongoose = require('mongoose-fill');
var config = require('./config/config');
var Event = require('./app/models/event');
var Match = require('./app/models/match');
var q = require('q');
mongoose.Promise = q.Promise;
var extend = require('util')._extend;

function isset(item) {
	return typeof item !== "undefined";
}
function convertStrings(module){
	module.matches = module.matches.map(function(match){
		match.team1 = String(match.team1);
		match.team2 = String(match.team2);
		return match;
	});
	return module;
}
function groupMatches(module){
	module = convertStrings(module);
	var matches = [];
	var temp = [];
	var c = 0;
	for(var i = 0; i < module.matches.length; i++){
		var match = module.matches[i];
		var nextMatch = module.matches[i+1];
		var teamsMatch = (isset(nextMatch) && isset(match.team1) && isset(match.team2) && isset(nextMatch.team1) && isset(nextMatch.team2) &&
		 	(match.team1 == nextMatch.team1 && match.team2 == nextMatch.team2));
		var spoilersMatch = (isset(nextMatch) && isset(match.team1SpText) && isset(match.team2SpText) &&
			(match.team1SpText == nextMatch.team1SpText && match.team2SpText == nextMatch.team2SpText));
		if( (teamsMatch && !spoilersMatch) || (spoilersMatch && !teamsMatch) ){
			temp.push(match);
		}
		else if(temp.length > 0){
			temp.push(match);
			matches.push(temp);
			temp = [];
		}
		else
			matches.push([match]);
	}
	return matches;
}
function createMatches(module){
	matches = groupMatches(module);
	return q.all(matches.map(function(match){
		return createMatch(match);	
	}));
}
function createMatch(match){
	var $promise = q.defer();
	var team1 = match[0].team1;
	var team2 = match[0].team2;
	var t1Sp = match[0].team1SpText;
	var t2Sp = match[0].team1SpText;
	var data = {
		bestOf: match.length,
		team1: isset(team1) ? team1 : undefined,
		team2: isset(team2) ? team2 : undefined,
		team1Match: isset(t1Sp) ? t1Sp : undefined,
		team2Match: isset(t2Sp) ? t2Sp : undefined,
		spoiler: match[0].spoiler,
		title: match[0].title,
		data: []
	}
	match.forEach((m) => {
		data.data.push({
			links: m.links,
			twitch: m.twitch,
			youtube: m.youtube,
			placeholder: m.placeholder
		})
	})
	Match.create(data, (err, match) => {
		if(err) console.log(err);
		else $promise.resolve(match._id);
	});
	return $promise.promise;
}
function updateModule(module){
	var $promise = q.defer();
	createMatches(module)
		.then((ids) => {
			module.matches2 = ids;
			$promise.resolve(module);
		})
	return $promise.promise;
}
function updateSection(section){
	var $promise = q.defer();
	q.all(section.modules.map((module) => {
		var _p = q.defer();
		updateModule(module)
			.then((newModule) => {
				module = newModule;
				delete module.matches;
				_p.resolve(module);
			})
		return _p.promise;
	}))
	.then((res) => {
		section.modules = res;
		$promise.resolve(section);
	})
	return $promise.promise;
}
mongoose.connect(config.databaseUrl, function (err) {
	if (err) return console.log(err);
	console.log("MongoDB server online.");
	Event.find()
		.select('name contents')
		.lean()
		.exec((err, docs) => {
			if (err) console.log(err);
			docs.forEach(function (doc) {
				q.all(doc.contents.map((section) => {
					return updateSection(section);
				}))
				.then((res) => {
					doc.contents = res;
					doc.save((err) => {
						if (err) console.log(err);
						else console.log('Updated ' + doc.name);
					});
				})
				
			});
		})
});
