(function() {
	'use strict';
	angular.module('eventvods')
		.controller('GameController', ['$routeParams', '$http', 'API_BASE_URL', function($routeParams, $http, API) {
			var vm = this;
			vm.data = {};
			var slug = $routeParams.slug;
			$http.get(API + '/games/slug/'+slug)
				.then(function(res){
					vm.data = res.data;
					$('.evSlider .image, .contents .details-toggle').addClass('loaded');
					$timeout(function(){
						$('.load-in').addClass('loaded');
					}, 100);
				})
		}]);
}());
