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
		.directive('fixFill', function($location) {
			var absUrl = 'url(' + $location.absUrl() + '#';
			return {
				restrict: 'A',
				link: function($scope, $element, $attrs) {
					$attrs.$set('fill', $attrs.fill.replace(/url\(#/g, absUrl));
				}
			};
		})
		.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
            $routeProvider
				.when('/_=_', {
					templateUrl: '/assets/views/frontend/home.html',
					meta: {
						title: 'Eventvods - Esports on Demand',
						description: 'Testing Meta Description'
					}
				})
                .when('/', {
                    templateUrl: '/assets/views/frontend/home.html',
					meta: {
						title: 'Eventvods - Esports on Demand',
						description: 'Testing Meta Description'
					}
                })
				.when('/login', {
                    templateUrl: '/assets/views/frontend/login.html',
					controller: 'LoginController',
					controllerAs: 'LoginController',
					meta: {
						title: 'Login - Eventvods - Esports on Demand',
						description: 'Meta Description'
					}
                })
				.when('/register', {
                    templateUrl: '/assets/views/frontend/register.html',
					controller: 'RegisterController',
					controllerAs: 'RegisterController',
					meta: {
						title: 'Register - Eventvods - Esports on Demand',
						description: 'Meta Description'
					}
                })
				.when('/about/cookies', {
                    templateUrl: '/assets/views/frontend/cookies.html',
					meta: {
						title: 'Cookie Policy - Eventvods - Esports on Demand',
						description: 'Meta Description'
					}
                })
				.when('/about/terms', {
                    templateUrl: '/assets/views/frontend/tos.html',
					meta: {
						title: 'Terms of Service - Eventvods - Esports on Demand',
						description: 'Meta Description'
					}
                });
			$locationProvider.html5Mode({
				enabled: true,
				requireBase: true
			});


		}]);
}());
