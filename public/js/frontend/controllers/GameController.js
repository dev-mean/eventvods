(function() {
	'use strict';
	angular.module('eventvods')
		.controller('GameController', ['$routeParams', '$http', 'API_BASE_URL', '$timeout', function($routeParams, $http, API, $timeout) {
			var vm = this;
			vm.data = {};
			var slug = $routeParams.slug;
			$http.get(API + '/games/slug/'+slug)
				.then(function(res){
					vm.data = res.data;
					$('.evSlider .image').addClass('loaded');
					$timeout(function(){
						$('.load-in').addClass('loaded');
					}, 100);
				})
		}]);
}());
