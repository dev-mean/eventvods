(function() {
	'use strict';
	angular.module('eventvods')
		.controller('ArticleController', ['$rootScope', '$routeParams', '$http', 'API_BASE_URL', '$location',
		function($rootScope, $routeParams, $http, API, $location) {
			var vm = this;
			vm.abs = $location.absUrl();
			vm.data;
			$http.get(API + '/articles/slug/' + $routeParams.slug)
				.then(function(res){
					vm.data = res.data;
					vm.data.tagsList = res.data.tags.map(function(item){
						return item.text;
					}).join(", ");
					$('.evSlider .image').addClass('loaded');
				})

		}]);
}());
