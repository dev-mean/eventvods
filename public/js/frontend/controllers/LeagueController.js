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
                vm.showDetails = false;
                vm.toggleDetails = function() {
                    vm.showDetails = !vm.showDetails;
                    if (!vm.showDetails) $anchorScroll("top");
                }
                vm.getIdentifier = function($table, $index){
                    var counter = 0, str = "";
                    for(var i =0; i < vm.sectionIndex; i++){
                        for(var c =0; c < vm.data.contents[i].modules.length; c++){
                            counter += vm.data.contents[i].modules[c].matches2.length;
                        }
                    }
                    for(var c =0; c < $table; c++){
                        counter += vm.data.contents[vm.sectionIndex].modules[c].matches2.length;
                    }
                    counter += $index;
                    if(counter > 25){
                        str += String.fromCharCode(64 + Math.floor(counter / 26))
                        str += String.fromCharCode(65+(counter % 26));
                    }
                    else str = String.fromCharCode(65+counter);
                    return str;
                }
                vm.jumpTo = function(sectionIndex) {
                    vm.sectionIndex = sectionIndex;
                    $location.search('section', sectionIndex);
                }
                vm.prevSection = function() {
                    vm.sectionIndex = vm.sectionIndex - 1;
                    $location.search('s', vm.sectionIndex);
                }
                vm.nextSection = function() {
                    vm.sectionIndex = vm.sectionIndex + 1;
                    $location.search('s', vm.sectionIndex);
                }
                vm.parseLink = function(match, link) {
                    if (match.placeholder) return "";
                    else return link;
                }
                vm.hasExtras = function(module, game) {
                    if (module.columns.length !== game.links.length) return false;
                    for (var i = 0; i < module.columns.length; i++) {
                        if (game.links[i].trim() !== "") return true;
                    }
                    return false;
                }
                vm.setHover = function(match, index, isHovered) {
                    if (index == 1)
                        match.team1H = isHovered;
                    else
                        match.team2H = isHovered;
                }
                vm.description = function(title){
                    var titles = {
                        "Tiebreakers": "We always include placeholder tiebreaker games where they might happen, so you don't get spoiled."
                    }
                    return titles[title];
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