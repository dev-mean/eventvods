(function() {
	'use strict';
	angular.module('eventvods', ['ngAnimate', 'ngRoute', 'ngCookies', 'ngSanitize', 'angular-loading-bar', 'ui.materialize','xeditable'])
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
		// Available BB code snippets
		.value('snippets', {
			"b": "<b>$1</b>", // Bolded text
			"u": "<u>$1</u>", // Underlined text
			"i": "<i>$1</i>", // Italicized text
			"s": "<s>$1</s>", // Strikethrough text
			"br": "<br />",
			"hr": "<hr />",
			"center": "<center>$1</center>", //Center text
			"left": "<left>$1</left>", //Center text
			"right": "<right>$1</right>", //Center text
			"h1": "<h1>$1</h1>",
			"h2": "<h2>$1</h2>",
			"h3": "<h3>$1</h3>",
			"h4": "<h4>$1</h4>",
			"h5": "<h5>$1</h5>",
			"img": "<img src=\"$1\" />", // Image without title
			"img=([^\\[\\]<>]+?)": "<img src=\"$2\" width=\"$1\" />", // Image with width
			"url": "<a href=\"$1\" target=\"_blank\" title=\"$1\">$1</a>", // Simple URL
			"url=([^\\[\\]<>]+?)": "<a href=\"$1\" target=\"_blank\" title=\"$2\">$2</a>", // URL with title
		})
		// Format BB code
		.directive('ksBbcode', ['snippets', function(snippets) {
			return {
				"restrict": "A",
				"link": function($scope, $element, $attrs) {
					$scope.$watch(function() {
						var contents = $element.html().replace(/^\s+|\s+$/i, '');

						for (var i in snippets) {
							var regexp = new RegExp('\\[' + i + '\\](.+?)\\[\/' + i.replace(/[^a-z0-9]/g, '') + '\\]', 'gi');

							contents = contents.replace(regexp, snippets[i]);
						}

						$element.html(contents);
					});
				}
			};
		}])
		// Format new lines
		.directive('ksNl2br', [function() {
			return {
				"restrict": "A",
				"link": function($scope, $element, $attrs) {
					$scope.$watch(function() {
						var contents = $element.html().replace(/^\s+|\s+$/i, '');

						contents = contents.replace(/(?:\r\n|\n|\r)/gi, '<br>');

						$element.html(contents);
					});
				}
			};
		}])
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
				.when('/about/team', {
                    templateUrl: '/assets/views/frontend/team.html',
					meta: {
						title: 'Meet the Team - Eventvods - Esports on Demand',
						description: 'Meta Description'
					}
                })
				.when('/about/get-in-touch', {
                    templateUrl: '/assets/views/frontend/contact.html',
					meta: {
						title: 'Get in Touch - Eventvods - Esports on Demand',
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
