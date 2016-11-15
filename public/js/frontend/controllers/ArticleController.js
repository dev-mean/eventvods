(function() {
	'use strict';
	angular.module('eventvods')
		.controller('ArticleController', ['$rootScope', '$routeParams', '$http', 'API_BASE_URL', '$location', '$sce',
		function($rootScope, $routeParams, $http, API, $location, $sce) {
			var vm = this;
			vm.abs = $location.absUrl();
			vm.data;
			vm.parseArticle = function(){
				return (typeof vm.data.content === "undefined" ? false : $sce.trustAsHtml(vm.data.content));
			}
			$http.get(API + '/articles/slug/' + $routeParams.slug)
				.then(function(res){
					vm.data = res.data;
					vm.data.tagsList = res.data.tags.map(function(item){
						return item.text;
					}).join(", ");
					$rootScope.meta.title = vm.data.title + " - Eventvods - Esports on Demand"
					$('.evSlider .image').addClass('loaded');
				})

		}]);
}());
