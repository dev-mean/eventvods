(function() {
	'use strict';
	angular.module('eventvods', ['ngAnimate', 'ngRoute', 'ngCookies', 'angular-loading-bar', 'ui.materialize','xeditable'])
		.constant('API_BASE_URL', '/api')
		.run(function(editableOptions, editableThemes) {
			// set `default` theme
			editableOptions.theme = 'default';
			editableThemes.default.buttonsClass = 'btn waves-effect waves-light';
		})
		.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/assets/views/frontend/home.html',
                    controller: 'NavController'
                });
			$locationProvider.html5Mode({
				enabled: true,
				requireBase: true
			});


		}])
		.filter('capitalize', function() {
			return function(input) {
				return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
			};
		})
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
