(function() {
    'use strict';
    angular.module('eventvods')
        .controller('TeamController', ['$rootScope', '$routeParams', '$http', 'API_BASE_URL', '$location', '$timeout',
            function($rootScope, $routeParams, $http, API, $location, $timeout) {
                var vm = this;
                vm.data;
                vm.active = 0;
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
                vm.show = function($index) {
                    vm.active = $index;
                    $rootScope.meta.title = vm.data[$index].name + " - Eventvods - Esports on Demand";
                    $rootScope.meta.description = "Follow "+vm.data[$index].name+" matches across all the popular esports with Eventvods.";
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
                function timeToSeconds(time) {
                    time = /((\d+)h)?((\d+)m)?((\d+)s)?/i.exec(time);
                    for (var i = 0; i < time.length; i++) {
                        if (typeof time[i] === "undefined") time[i] = 0;
                    }
                    return (parseInt(time[2] * 3600) + parseInt(time[4] * 60) + parseInt(time[6]));
                }
                $http.get(API + '/teams/slug/' + $routeParams.slug)
                    .then(function(res) {
                        vm.data = res.data;
                        if(typeof $routeParams.game !== "undefined"){
                            for(var i=0; i < vm.data.length; i++){
                                if(vm.data[i].game.slug === $routeParams.game){
                                    vm.active = i;
                                    break;
                                }
                            }
                        }
                        $rootScope.meta.title = vm.data[vm.active].name + " - Eventvods - Esports on Demand";
                        $rootScope.meta.description = "Follow "+vm.data[vm.active].name+" matches across all the popular esports with Eventvods.";
                        $('.evSlider .image').addClass('loaded');
                        $timeout(function() {
                            $('.load-in').addClass('loaded');
                        }, 100);
                    })

            }
        ]);
}());