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
				var counter = 0;
				for(var i =0; i < vm.sectionIndex; i++){
					counter += vm.data.contents[i].modules.length;
				}
				counter += vm.moduleIndex;
				return String.fromCharCode(65+counter) + ($index+1);
			}
			$http.get(API + '/leagues/slug/' + $routeParams.slug)
				.then(function(res){
					vm.data = res.data;
					$rootScope.meta.title = vm.data.name + " - Eventvods - Esports on Demand"
					$('.evSlider .image, .contents .details-toggle').addClass('loaded');
					$timeout(function(){
						$('.load-in').addClass('loaded');
					}, 100);
				})

		}]);
}());
