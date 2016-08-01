(function() {
	'use strict';
	angular.module('eventvods', ['ngAnimate', 'ngRoute', 'ngCookies', 'angular-loading-bar', 'ui.materialize','xeditable'])
		.constant('DOMAIN', 'http://simon.eventvods.com')
		.constant('API_BASE_URL', '/api')
		.run(function(editableOptions, editableThemes, $rootScope, $anchorScroll, DOMAIN) {
			editableOptions.theme = 'default';
			editableThemes.default.buttonsClass = 'btn waves-effect waves-light';
			$rootScope.$on('$routeChangeSuccess', function (evt, current, previous) {
				$anchorScroll("top");
				if(current != previous && typeof current !== "undefined"){
					current.$$route.meta.url = DOMAIN + current.$$route.originalPath;
					$rootScope.meta = current.$$route.meta;
				}
			});
		})
		.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/assets/views/frontend/home.html',
					meta: {
						title: 'Eventvods - Esports on Demand',
						description: 'Testing Meta Description'
					}
                })
				.when('/about/cookies', {
                    templateUrl: '/assets/views/frontend/cookies.html',
					meta: {
						title: 'Cookie Policy - Eventvods - Esports on Demand',
						description: 'Meta Description'
					}
                });
			$locationProvider.html5Mode({
				enabled: true,
				requireBase: true
			});


		}])
		.directive('fixFill', function($location) {
			var absUrl = 'url(' + $location.absUrl() + '#';
			return {
				restrict: 'A',
				link: function($scope, $element, $attrs) {
					$attrs.$set('fill', $attrs.fill.replace(/url\(#/g, absUrl));
				}
			};
		});
}());
