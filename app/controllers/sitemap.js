var moment = require('moment');
var Q = require('q');
var Game = require('../models/game');
var Article = require('../models/article');
var Event = require('../models/event');
var Team = require('../models/team');

var EOL = "\r\n";
var lastUpdated = moment(1483909981066);
var s = function(link){
    return "https://eventvods.com"+link;
};
var u = function(link, lastMod, updateFreq, priority){
    if(lastMod == null || typeof lastMod == "undefined") lastMod = lastUpdated;
    return "<url><loc>"+s(link)+"</loc><lastmod>"+moment(lastMod).format('YYYY-MM-DD')+"</lastmod><changefreq>"+updateFreq+"</changefreq><priority>"+priority+"</priority></url>";
};
var ar = function(arrayIn, mod, freq, priority){
    return arrayIn.reduce((c, i) => {
        return c + u(i, mod, freq, priority);
    }, "");
}
function games(){
    var $promise = Q.defer();
    Game.find()
        .select('slug')
        .exec((err, games) => {
            if(err) $promise.reject(err);
            else $promise.resolve(games.reduce((c, i) => {
                return c + u("/game/"+i.slug, null, "daily", 0.7);
            }, ""));
        });
    return $promise.promise;
}
function articles(games){
    var $promise = Q.defer();
    Article.find()
        .select('slug')
        .exec((err, articles) => {
            if(err) $promise.reject(err);
            else $promise.resolve(games + articles.reduce((c, i) => {
                return c + u("/article/"+i.slug, i.updatedAt, "weekly", 0.8);
            }, ""));
        });
    return $promise.promise;
}
function events(articles){
    var $promise = Q.defer();
    Event.find()
        .select('slug updatedAt')
        .exec((err, events) => {
            if(err) $promise.reject(err);
            else $promise.resolve(articles + events.reduce((c, i) => {
                return c + u("/event/"+i.slug, i.updatedAt, "weekly", 0.8);
            }, ""));
        });
    return $promise.promise;
}
function teams(events){
    var $promise = Q.defer();
    Team.find()
        .select('slug')
        .exec((err, teams) => {
            if(err) $promise.reject(err);
            else $promise.resolve(events + teams.reduce((c, i) => {
                return c + u("/team/"+i.slug, null, "weekly", 0.7);
            }, ""));
        });
    return $promise.promise;
}
var important = ["/"];
var standard = [ "/about/team", "/login","/register", "/about/beta-feedback","/about/cookies"];
var useless = ["/about/cookies", "/about/terms", "/user/settings", "/reset", "/error"];

module.exports.sitemap = function(){
    var $promise = Q.defer();
    var str = "";
    str += '<?xml version="1.0" encoding="UTF-8"?>';
    str += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    str += ar(important, lastUpdated, "daily", 0.7);
    str += ar(standard, lastUpdated, "weekly", 0.5);
    str += ar(useless, lastUpdated, "monthly", 0.3);
    games()
    .then(articles)
    .then(events)
    .then(teams)
    .then((res) => {
        str += res;
        str += '</urlset> ';
        $promise.resolve(str);
    })
    .catch((err) => {
        console.log(err);
        $promise.reject(err);
    })
    return $promise.promise;
}