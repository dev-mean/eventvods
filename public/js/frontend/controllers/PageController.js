(function() {
	'use strict';
	angular.module('eventvods')
		.factory('NavService', ['$http', 'API_BASE_URL', function($http, API_BASE_URL) {
			return {
				get: function() {
					return $http.get(API_BASE_URL + '/featured');
				}
			};
		}])
		.controller('PageController', ['SessionManager', '$rootScope', '$timeout', '$cookies', '$window', 'NavService', '$location',
			function(SessionManager, $rootScope, $timeout, $cookies, $window, NavService, $location) {
				var vm = this;
				var element_images = 3;
				vm.nav = null;
				var now = new $window.Date(),
					// this will set the expiration to 6 months
					exp = new $window.Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
				var cookieSettings = {
					expires: exp
				}
				vm.contentClass = $cookies.get('contentMode') || "light";
				vm.cookiesAccepted = ($cookies.get('cookieDisclaimer') === "true");
				vm.contentClassSet = function() {
					$cookies.put('contentMode', vm.contentClass, cookieSettings);
				};
				vm.acceptCookies = function() {
					$cookies.put('cookieDisclaimer', true, cookieSettings);
				};
				$rootScope.$on('sessionUpdate', function() {
					vm.session = SessionManager.get();
					$('.dropdown-button#userProfile').dropdown({
						hover: true,
						belowOrigin: true,
						alignment: "left"
					});
				});

				vm.logout = function() {
					SessionManager.logout();
				};
				vm.init = function() {
					$('.evSlider.multiple').evSlider({
						delay: 7500
					});
					$('.dropdown-button').dropdown({
						hover: true,
						belowOrigin: true,
						alignment: "left"
					});
				};
				vm.leagueClass = function($index) {
					if ($index === 0 ||
						vm.nav.orderedLeagues[$index].game.name !== vm.nav.orderedLeagues[$index - 1].game.name) return "border-top";
					else return "";
				};
				vm.tournamentClass = function($index) {
					if ($index === 0 ||
						vm.nav.orderedTournaments[$index].game.name !== vm.nav.orderedTournaments[$index - 1].game.name) return "border-top";
					else return "";
				};
				vm.elementClass = function($index) {
					var img = element_images % ($index + 1) + 1;
					return "element-" + img;
				}
				vm.following = function(id) {
					if (vm.session == false || vm.session == null) return false;
					else if (vm.session.following.leagues.indexOf(id) > -1) return true;
					else if (vm.session.following.tournaments.indexOf(id) > -1) return true;
					else return false;
				}
				vm.toggleFollow = function(id, type) {
					if (vm.session == false || vm.session == null) return $location.path('/login');
					var index = vm.session.following[type].indexOf(id);
					if (index > -1)
						vm.session.following[type].splice(index, 1);
					else vm.session.following[type].push(id);
					SessionManager.following(vm.session.following);
				}
				NavService.get()
					.then(function(res) {
						vm.nav = res.data;
						vm.init();
					})
					.catch(function() {
						vm.nav = null;
					});
			}
		]);
}());
