(function() {
	'use strict';
	angular.module('eventvods')
		.controller('LeagueController', ['$rootScope', '$routeParams', '$http', 'API_BASE_URL', '$location', '$anchorScroll',
		function($rootScope, $routeParams, $http, API, $location, $anchorScroll) {
			var vm = this;
			vm.abs = $location.absUrl();
			vm.data;
			vm.sectionIndex = 0;
			vm.leagueIndex = 0;
			vm.top = function(){
				$anchorScroll("top");
			}
			$http.get(API + '/leagues/slug/' + $routeParams.slug)
				.then(function(res){
					vm.data = res.data;
					console.log(res.data);
					$('.evSlider .image, .contents .details-toggle, .load-in').addClass('loaded');
				})

		}]);
}());
