(function() {
	'use strict';
	angular.module('eventvods')
		.controller('PageController', ['SessionManager', '$rootScope', '$timeout', '$cookies', '$window', function(SessionManager, $rootScope, $timeout, $cookies, $window) {
			var vm = this;
			var now = new $window.Date(),
			// this will set the expiration to 6 months
			exp = new $window.Date(now.getFullYear(), now.getMonth()+6, now.getDate());
			var cookieSettings = {
				expires: exp
			}
			vm.contentClass = $cookies.get('contentMode') || "light";
            vm.cookiesAccepted = ($cookies.get('cookieDisclaimer') === "true");
			vm.contentClassSet = function(){
				$cookies.put('contentMode', vm.contentClass, cookieSettings);
			};
            vm.acceptCookies = function(){
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
		}]);
}());
