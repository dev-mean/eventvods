(function() {
    'use strict';
    angular.module('eventvods')
        .controller('LeagueController', ['$rootScope', '$routeParams', '$http', 'API_BASE_URL', '$location', '$anchorScroll', '$timeout',
            function($rootScope, $routeParams, $http, API, $location, $anchorScroll, $timeout) {
                var vm = this;
                vm.data;
                vm.simple_tables = false;
                vm.showDetails = false;
                vm.toggleDetails = function(){
                    vm.showDetails = !vm.showDetails;
                    $('.details').slideToggle();
                }
                vm.rating = {
                    hover: 0,
                    timeout: null,
                    stuck: false,
                    onHover: function(val){
                        if(vm.rating.timeout !== null)
                            $timeout.cancel(vm.rating.timeout);
                        vm.rating.hover = val;
                    },
                    onUnHover: function(){
                        if(!vm.rating.stuck) vm.rating.timeout = $timeout(function(){
                            vm.rating.hover = 0;
                        }, 50)
                    },
                    stick: function(val){
                        vm.rating.stuck = true;
                        vm.rating.hover = val;
                    }
                }
                vm.indexRating = {
                    hovers: {},
                    timeouts: {},
                    stucks: {},
                    hover: function(index){
                        return vm.indexRating.hovers[index];
                    },
                    onHover: function(index, val){
                        if(vm.indexRating.timeouts[index] !== null)
                            $timeout.cancel(vm.indexRating.timeouts[index]);
                        vm.indexRating.hovers[index] = val;
                    },
                    onUnHover: function(index){
                        if(!vm.indexRating.stucks[index]) vm.indexRating.timeouts[index] = $timeout(function(){
                            vm.indexRating.hovers[index] = 0;
                        }, 50)
                    },
                    show: function(index){
                        return vm.indexRating.hovers[index] > 0;
                    }
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
                        $rootScope.meta.title = vm.data.name + " - Eventvods - Esports on Demand";
                        $rootScope.meta.description = "Watch all " + vm.data.name + " vods and highlights on demand,  easily and spoiler-free. Rate, favorite and share matches of your favorite teams!";
                        $('.evSlider .image').addClass('loaded');
                        vm.sectionIndex = parseInt($routeParams.s || vm.data.contents.length - 1);
                        $timeout(function() {
                            $('.load-in').addClass('loaded');
                        }, 100);
                    })

            }
        ]);
}());