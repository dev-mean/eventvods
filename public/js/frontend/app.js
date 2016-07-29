(function() {
	'use strict';
	angular.module('eventvods', ['ngAnimate', 'ngRoute', 'ngCookies', 'angular-loading-bar', 'ui.materialize','xeditable'])
		.constant('API_BASE_URL', '/api')
		.run(function(editableOptions, editableThemes, $rootScope, $anchorScroll) {
			// set `default` theme
			editableOptions.theme = 'default';
			editableThemes.default.buttonsClass = 'btn waves-effect waves-light';
			 $rootScope.$on('$locationChangeSuccess', function () {
				$anchorScroll("top");
			 });
		})
		.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/assets/views/frontend/home.html'
                })
				.when('/about/cookies', {
                    templateUrl: '/assets/views/frontend/cookies.html'
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
