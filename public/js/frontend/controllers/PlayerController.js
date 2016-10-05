(function() {
	'use strict';
	angular.module('eventvods')
		.controller('PlayerController', ['$rootScope', '$timeout', function($rootScope, $timeout) {
			var vm = this, player = null;
			vm.show = false;
			vm.match = null;
			vm.type = null;
			vm.back = function(){
				vm.show = false;
				reset();
			}
			function reset(){
				player = null;
				vm.type = null;
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
				reset();
				console.log(link);
				console.log(match);
				vm.show = true;
				vm.match = match;
				vm.type = "twitch";
				var twitch = parseTwitch(link);
				if(twitch === false) window.location.url = link;
				var options = {
					width: window.innerWidth * 0.6,
					height: window.innerWidth * 0.6 * 9/16,
					video: twitch.vid
				};
				console.log(options);
				player = new Twitch.Player("player", options);
				function init(){
					player.seek(twitch.time);
					player.removeEventListener(Twitch.Player.READY, init);
					$timeout(function(){
						vm.loaded = true;
					}, 1);
				}
				player.addEventListener(Twitch.Player.READY, init);
			}
			vm.picks = function(){
				if(vm.type === "twitch"){
					var time = parseTwitch(vm.match.twitch.picksBans);
					if(time !== false) time = time.time;
					player.seek(time);
				}
			}
			vm.start = function(){
				if(vm.type === "twitch"){
					var time = parseTwitch(vm.match.twitch.gameStart);
					if(time !== false) time = time.time;
					player.seek(time);
				}
			}
		}]);
}());
