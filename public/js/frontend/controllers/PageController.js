(function() {
	'use strict';
	angular.module('eventvods')
		.controller('PageController', ['SessionManager', '$rootScope', '$timeout', '$cookies', function(SessionManager, $rootScope, $timeout, $cookies) {
			var vm = this;
			//Dark / light mode cookie
			vm.contentClass = $cookies.get('contentMode') || "light";
            vm.cookiesAccepted = ($cookies.get('cookieDisclaimer') === "true");
			vm.contentClassSet = function(){
				$cookies.put('contentMode', vm.contentClass);
			};
            vm.acceptCookies = function(){
                $cookies.put('cookieDisclaimer', true);
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
