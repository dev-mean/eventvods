(function() {
    'use strict';
    angular.module('eventvods')
        .controller('PlayerController', ['$rootScope', '$timeout', 'SessionManager', '$scope', function($rootScope, $timeout, SessionManager, $scope) {
            var vm = this,
                player = null;
            vm.show = false;
            vm.match = null;
            vm.type = null;
            vm.loaded = true;
            vm.playing = false;
            vm.sectionT = null;
            vm.moduleT = null;
            vm.back = function() {
                reset();
            }

            function reset() {
                player.destroy();
                player = null;
                vm.type = null;
                vm.match = null;
                $('#player').empty();
                vm.show = false;
            }

            function timeToSeconds(time) {
                if (typeof time === "undefined") return 0;
                time = /((\d+)h)?((\d+)m)?((\d+)s)?/i.exec(time);
                for (var i = 0; i < time.length; i++) {
                    if (typeof time[i] === "undefined") time[i] = 0;
                }
                return (parseInt(time[2] * 3600) + parseInt(time[4] * 60) + parseInt(time[6]));
            }

            function parseTwitch(link) {
                var twitch = /http(s|):\/\/(www\.|)twitch\.tv\/(\S+)\/v\/([0-9]+)(?:\?t=(\S+)|$)/i.exec(link);
                if (twitch == null) return false;
                else return {
                    vid: "v" + twitch[4],
                    time: timeToSeconds(twitch[5])
                }
            }

            function parseYoutube(link) {
                var yt = /http(s|):\/\/(www\.|)(youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)([&\?]t=(\S+)?)?/i.exec(link);
                if (yt == null) return false;
                else return {
                    vid: yt[4],
                    time: timeToSeconds(yt[6])
                }
            }
            vm.playYoutube = function(link, match, $event, sectionT, moduleT) {
                if (match.placeholder) return;
                var yt = parseYoutube(link);
                if (yt !== false) $event.preventDefault();
                vm.show = true;
                vm.match = match;
                vm.type = "youtube";
                vm.sectionT = sectionT;
                vm.moduleT = moduleT;
                var options = {
                    width: window.innerWidth * 0.6,
                    height: window.innerWidth * 0.6 * 9 / 16,
                    videoId: yt.vid,
                    playerVars: {
                        controls: 0,
                        showinfo: 0,
                        modestbranding: 1,
                        start: yt.time
                    },
                    events: {
                        "onReady": function(event) {
                            event.target.playVideo();
                            vm.playing = true;
                            vm.volSlider = event.target.getVolume();
                        },
                        "onStateChange": function(event) {
                            $scope.$apply(function() {
                                if (event.data === 1) vm.playing = true;
                                if (event.data === 2) vm.playing = false;
                            });
                        }
                    }
                };
                player = new YT.Player('player', options);
            }
            vm.playTwitch = function(link, match, $event, sectionT, moduleT) {
                if (match.placeholder) return;
                var twitch = parseTwitch(link);
                if (twitch !== false) $event.preventDefault();
                vm.loaded = false;
                vm.show = true;
                vm.match = match;
                vm.type = "twitch";
                vm.sectionT = sectionT;
                vm.moduleT = moduleT;
                var options = {
                    width: window.innerWidth * 0.6,
                    height: window.innerWidth * 0.6 * 9 / 16,
                    video: twitch.vid
                };
                player = new Twitch.Player("player", options);

                function init() {
                    vm.playing = true;
                    player.seek(twitch.time);
                    player.removeEventListener(Twitch.Player.READY, init);
                    $timeout(function() {
                        vm.loaded = true;
                    }, 1);
                }
                player.addEventListener(Twitch.Player.READY, init);
            }
            vm.picks = function() {
                if (vm.type === "twitch") {
                    var time = parseTwitch(vm.match.twitch.picksBans);
                    if (time !== false) time = time.time;
                    player.seek(time);
                }
                if (vm.type === "youtube") {
                    var time = parseYoutube(vm.match.youtube.picksBans);
                    if (time !== false) time = time.time;
                    player.seekTo(time);
                }
            }
            vm.start = function() {
                if (vm.type === "twitch") {
                    var time = parseTwitch(vm.match.twitch.gameStart);
                    if (time !== false) time = time.time;
                    player.seek(time);
                }
                if (vm.type === "youtube") {
                    var time = parseYoutube(vm.match.youtube.gameStart);
                    if (time !== false) time = time.time;
                    player.seekTo(time);
                }
            }
            vm.toggle = function() {
                if (vm.playing) player.pauseVideo();
                else player.playVideo();
            }
            vm.setVol = function(vol) {
                vm.volSlider = vol;
                player.setVolume(vol);
            }
            vm.skip = function(diff) {
                player.seekTo(player.getCurrentTime() + diff);
            }
        }]);
}());