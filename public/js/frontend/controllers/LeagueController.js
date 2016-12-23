(function() {
    'use strict';
    angular.module('eventvods')
        .controller('LeagueController', ['$rootScope', '$routeParams', '$http', 'API_BASE_URL', '$location', '$anchorScroll', '$timeout',
            function($rootScope, $routeParams, $http, API, $location, $anchorScroll, $timeout) {
                var vm = this;
                vm.abs = $location.absUrl();
                vm.data;
                vm.simple_tables = false;
                vm.sectionIndex = parseInt($routeParams.s || 0);
                vm.moduleIndex = parseInt($routeParams.m || 0);
                vm.showDetails = false;
                vm.toggleDetails = function() {
                    vm.showDetails = !vm.showDetails;
                    if (!vm.showDetails) $anchorScroll("top");
                }
                vm.getIdentifier = function($index) {
                    var str = "",
                        counter = 0;
                    for (var i = 0; i < vm.sectionIndex; i++) {
                        counter += vm.data.contents[i].modules.length;
                    }
                    counter += vm.moduleIndex;
                    if (counter > 25) {
                        str += String.fromCharCode(64 + Math.floor(counter / 26))
                        str += String.fromCharCode(65 + (counter % 26)) + ($index + 1);
                    } else str = String.fromCharCode(65 + counter) + ($index + 1);
                    return str;
                }
                vm.jumpTo = function(sectionIndex, moduleIndex) {
                    vm.sectionIndex = sectionIndex;
                    vm.moduleIndex = moduleIndex;
                    $location.search('s', sectionIndex);
                    $location.search('m', moduleIndex);
                }
                vm.prevSection = function() {
                    vm.sectionIndex = vm.sectionIndex - 1;
                    $location.search('s', vm.sectionIndex);
                    vm.moduleIndex = 0;
                    $location.search('m', 0);
                }
                vm.nextSection = function() {
                    vm.sectionIndex = vm.sectionIndex + 1;
                    $location.search('s', vm.sectionIndex);
                    vm.moduleIndex = 0;
                    $location.search('m', 0);
                }
                vm.prevModule = function() {
                    vm.moduleIndex = vm.moduleIndex - 1;
                    $location.search('m', vm.moduleIndex);
                }
                vm.nextModule = function() {
                    vm.moduleIndex = vm.moduleIndex + 1;
                    $location.search('m', vm.moduleIndex);
                }
                vm.parseLink = function(match, link) {
                    if (match.placeholder) return "";
                    else return link;
                }
                vm.hasExtras = function(module, match) {
                    if (module.columns.length !== match.links.length) return false;
                    for (var i = 0; i < module.columns.length; i++) {
                        if (match.links[i].trim() !== "") return true;
                    }
                    return false;
                }
                vm.setHover = function(match, index, isHovered) {
                    if (match.placeholder) return;
                    if (index == 1)
                        match.team1H = isHovered;
                    else
                        match.team2H = isHovered;
                }

                function timeToSeconds(time) {
                    time = /((\d+)h)?((\d+)m)?((\d+)s)?/i.exec(time);
                    for (var i = 0; i < time.length; i++) {
                        if (typeof time[i] === "undefined") time[i] = 0;
                    }
                    return (parseInt(time[2] * 3600) + parseInt(time[4] * 60) + parseInt(time[6]));
                }
                $http.get(API + '/events/slug/' + $routeParams.slug)
                    .then(function(res) {
                        vm.data = res.data;
                        if (vm.data.game.slug === "csgo" || vm.data.game.slug === "overwatch") vm.simple_tables = true;
                        console.log(vm.data);
                        console.log(vm.simple_tables);
                        $rootScope.meta.title = vm.data.name + " - Eventvods - Esports on Demand";
                        $rootScope.meta.description = "Watch all " + vm.data.name + " vods and highlights on demand,  easily and spoiler-free. Rate, favorite and share matches of your favorite teams!";
                        $('.evSlider .image, .contents .details-toggle').addClass('loaded');
                        $timeout(function() {
                            $('.load-in').addClass('loaded');
                        }, 100);
                    })

            }
        ]);
}());