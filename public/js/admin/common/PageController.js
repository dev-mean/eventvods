(function () {
	'use strict';
	angular.module('eventApp')
		.controller('PageController', function ($http, $interval, API_BASE_URL, $window, $rootScope, $cookies, $css) {
			var vm = this;
			vm.current = '/';
			vm.alerts = [];
			vm.setTheme = function(theme){
				vm.theme = theme;
				$css.removeAll();
				if(theme !== null){
					$css.add('https://bootswatch.com/'+theme+'/bootstrap.css');
					$cookies.put('theme', theme);
				}
				else $cookies.remove('theme');
			}
			vm.theme = $cookies.get('theme') || null;
			vm.setTheme(vm.theme);
			$http.get(API_BASE_URL + "/auth/session")
				.then(function (res) {
					vm.user = res.data;
					vm.isAdmin = (vm.user.userRights >= 4);
					vm.isUpdater = (vm.user.userRights >= 3);
					vm.loaded = true;
				});
			vm.logout = function () {
				$http.get(API_BASE_URL + '/auth/logout')
					.finally(function () {
						$window.location = '/';
					});
			};
			vm.closeAlert = function ($index) {
				vm.alerts.splice($index, 1);
			}
			$rootScope.$on('addAlert', function (event, alert) {
				vm.alerts.push(alert);
			});
			$rootScope.$on('$routeChangeSuccess', function (evt, current, pre) {
				vm.alerts = [];
				if (current.$$route.originalPath !== "undefined") vm.current = current.$$route.originalPath;
				if (vm.current === "/") vm.current = "/dashboard";
			});

			function getMail() {
				$http.get(API_BASE_URL + "/mail/unresolved", {
						ignoreLoadingBar: true
					})
					.then(function (res) {
						vm.mail = res.data;
					});
			}
			getMail();
			setInterval(getMail, 30000);
			$rootScope.$on('mailUpdated', getMail);
		});
}());
