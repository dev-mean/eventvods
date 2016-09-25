(function() {
	'use strict';
	angular.module('eventvods', ['ngAnimate', 'ngRoute', 'ngCookies', 'angular-loading-bar', 'ui.materialize','xeditable'])
		.constant('DOMAIN', 'http://beta.eventvods.com')
		.constant('API_BASE_URL', '/api')
		.run(function(editableOptions, editableThemes, $rootScope, $anchorScroll, DOMAIN) {
			editableOptions.theme = 'default';
			$rootScope.$on('$routeChangeSuccess', function (evt, current, previous) {
				$anchorScroll("top");
				if(current != previous && typeof current !== "undefined"){
					current.$$route.meta.url = DOMAIN + current.$$route.originalPath;
					$rootScope.meta = current.$$route.meta;
				}
			});
		})
		.directive("noNgAnimate", function ($animate) {
			return function (scope, element) {
				$animate.enabled(element, false);
			};
		})
		.directive('fixFill', function($location) {
			var absUrl = 'url(' + $location.absUrl() + '#';
			return {
				restrict: 'A',
				link: function($scope, $element, $attrs) {
					$attrs.$set('fill', $attrs.fill.replace("url(#", absUrl));
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
				.when('/league/:slug', {
                    templateUrl: '/assets/views/frontend/league.html',
					controller: 'LeagueController',
					controllerAs: 'League',
					meta: {
						title: 'View League - Eventvods - Esports on Demand'
					}
                })
				.when('/article/:slug', {
                    templateUrl: '/assets/views/frontend/article.html',
					controller: 'ArticleController',
					controllerAs: 'Article',
					meta: {
						title: 'View Article - Eventvods - Esports on Demand'
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
