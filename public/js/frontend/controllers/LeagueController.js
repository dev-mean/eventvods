(function() {
	'use strict';
	angular.module('eventvods')
		.controller('LeagueController', ['$rootScope', '$routeParams', '$http', 'API_BASE_URL',
		function($rootScope, $routeParams, $http, API) {
			var vm = this;
			vm.data;
			$http.get(API + '/leagues/slug/' + $routeParams.slug)
				.then(function(res){
					vm.data = res.data;
					$('.evSlider .image').addClass('loaded');
				})

		}]);
}());
