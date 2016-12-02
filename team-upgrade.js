//dev config
require('dotenv')
	.config({
		silent: false
	});
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var config = require('./config/config');
var League = require('./app/models/league');
var Match = require('./app/models/section').matchSchema;
var stage = 2;
function isset(item){
	return typeof item !== "undefined";
}
mongoose.connect(config.databaseUrl, function(err) {
	if (err) console.log(err);
	else if (stage === 1){
		console.log("MongoDB server online.");
		League.find({})
			.select('teams teams_new name contents')
			.exec((err, docs) => {
				if(err) console.log(err);
				docs.forEach(function(doc){
					// doc.teams_new = doc.teams.map((team) => {
					// 	return team._id;
					// })
					doc.contents.forEach((section) => {
						section.modules.forEach((mod) =>{
							mod.matches.forEach((match) => {
								if(isset(match.team1)) match.team1_2 = match.team1._id;
								if(isset(match.team2)) match.team2_2 = match.team2._id;
							});
						});
					});
					doc.save((err) => {
						if(err) console.log(err);
						else console.log('Updated '+doc.name);
					});
				});
			})
	}
	else if (stage === 2){
		console.log("MongoDB server online.");
		League.find({})
			.select('teams teams_new name contents')
			.populate({
				path: 'teams_new',
				model: 'Teams'
			})
			.exec((err, docs) => {
				if(err) console.log(err);
				docs.forEach(function(doc){
					// doc.teams = doc.teams_new;
					// doc.teams_new = undefined;
					doc.contents.forEach((section) => {
						section.modules.forEach((mod) =>{
							mod.matches.forEach((match) => {
								if(isset(match.team1_2)) match.team1 = match.team1_2;
								if(isset(match.team2_2)) match.team2 = match.team2_2;
								console.log(match);
							});
						});
					});
					doc.save((err) => {
						if(err) console.log(err);
						else console.log('Updated '+doc.name);
					});
				});
			})
	}
});