(function() {
	'use strict';
	angular.module('eventvods')
		.controller('LeagueController', ['$rootScope', '$routeParams', '$http', 'API_BASE_URL', '$location', '$anchorScroll', '$timeout',
		function($rootScope, $routeParams, $http, API, $location, $anchorScroll, $timeout) {
			var vm = this;
			vm.abs = $location.absUrl();
			vm.data;
			vm.sectionIndex = 0;
			vm.moduleIndex = 0;
			vm.showDetails = false;
			vm.toggleDetails = function(){
				vm.showDetails = !vm.showDetails;
				if(!vm.showDetails) $anchorScroll("top");
			}
			vm.getIdentifier = function($index){
				var str = "", counter = 0;
				for(var i =0; i < vm.sectionIndex; i++){
					counter += vm.data.contents[i].modules.length;
				}
				counter += vm.moduleIndex;
				if(counter > 25){
					str += String.fromCharCode(64 + Math.floor(counter / 26))
					str += String.fromCharCode(65+(counter % 26)) + ($index+1);
				}
				else str = String.fromCharCode(65+counter) + ($index+1);
				return str;
			}
			function timeToSeconds(time){
				time = /((\d+)h)?((\d+)m)?((\d+)s)?/i.exec(time);
				for(var i = 0; i < time.length; i++){
					if(typeof time[i] === "undefined") time[i] = 0;
				}
				return (parseInt(time[2] * 3600) + parseInt(time[4] * 60) + parseInt(time[6]));
			}
			$http.get(API + '/leagues/slug/' + $routeParams.slug)
				.then(function(res){
					vm.data = res.data;
					$rootScope.meta.title = vm.data.name + " - Eventvods - Esports on Demand";
					$rootScope.meta.description = "Watch all " + vm.data.name + " vods and highlights on demand,  easily and spoiler-free. Rate, favorite and share matches of your favorite teams!";
					$('.evSlider .image, .contents .details-toggle').addClass('loaded');
					$timeout(function(){
						$('.load-in').addClass('loaded');
					}, 100);
				})

		}]);
}());
