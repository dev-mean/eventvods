(function() {
	'use strict';
	angular.module('eventvods')
		.controller('PlayerController', ['$rootScope', '$timeout', function($rootScope, $timeout) {
			var vm = this, player = null, type = null;
			vm.show = false;
			vm.match = null;
			vm.back = function(){
				vm.show = false;
				reset();
			}
			function reset(){
				player = null;
				type = null;
				$('#player').empty();
			}
			function timeToSeconds(time){
				time = /((\d+)h)?((\d+)m)?((\d+)s)?/i.exec(time);
				for(var i = 0; i < time.length; i++){
					if(typeof time[i] === "undefined") time[i] = 0;
				}
				return (parseInt(time[2] * 3600) + parseInt(time[4] * 60) + parseInt(time[6]));
			}
			function parseTwitch(link){
				var twitch = /http(s|):\/\/(www\.|)twitch\.tv\/(\S+)\/v\/(\S+)\?t=(\S+)?/i.exec(link);
				if(twitch === null) return false;
				else return {
					vid: "v"+twitch[4],
					time: timeToSeconds(twitch[5])
				}
			}
			vm.playYoutube = function(link, match){
				vm.show = true;
				vm.match = match;
			}
			vm.playTwitch = function(link, match){
				vm.show = true;
				vm.match = match;
				type = "twitch";
				var twitch = parseTwitch(link);
				if(twitch === false) window.location.url = link;
				var options = {
					width: window.innerWidth * 0.6,
					height: window.innerWidth * 0.6 * 9/16,
					video: twitch.vid
				};
				player = new Twitch.Player("player", options);
				player.seek(twitch.time);
				player.play();
				$timeout(function(){
					vm.loaded = true;
				}, 2500);
			}
			vm.picks = function(){
				if(type === "twitch"){
					var time = parseTwitch(vm.match.twitch.picksBans);
					if(time !== false) time = time.time;
					player.pause();
					player.seek(time);
					player.play();
				}
			}
			vm.start = function(){
				if(type === "twitch"){
					var time = parseTwitch(vm.match.twitch.gameStart);
					if(time !== false) time = time.time;
					player.pause();
					player.seek(time);
					player.play();
				}
			}
		}]);
}());
