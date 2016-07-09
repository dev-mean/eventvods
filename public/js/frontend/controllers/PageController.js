(function() {
	'use strict';

	function repositionWithinScreen(x, y, width, height) {
		var newX = x
		var newY = y;

		if (newX < 0) {
			newX = 4;
		} else if (newX + width > window.innerWidth) {
			newX -= newX + width - window.innerWidth;
		}

		if (newY < 0) {
			newY = 4;
		} else if (newY + height > window.innerHeight + $(window).scrollTop) {
			newY -= newY + height - window.innerHeight;
		}

		return {
			x: newX,
			y: newY
		};
	}
	angular.module('eventvods')
		.service('SessionManager', ['$http', 'API_BASE_URL', '$q', '$rootScope', function($http, URL, $q, $rootScope) {
			var svc = this,
				session = null;
			svc.get = function() {
				return session;
			};
			svc.load = function() {
				$http.get(URL + '/auth/session')
					.then(function(res) {
						if (res.status === 200) session = res.data;
						else session = false;
						$rootScope.$broadcast('sessionUpdate');
					})
					.catch(function() {
						session = false;
						$rootScope.$broadcast('sessionUpdate');
					});
			};
			svc.login = function(data) {
				var q = $q.defer();
				$http.post(URL + '/auth/login', data)
					.then(function(res) {
						session = res.data;
						$rootScope.$broadcast('sessionUpdate');
						q.resolve();
					})
					.catch(function(err) {
						session = false;
						$rootScope.$broadcast('sessionUpdate');
						q.reject(err.data);
					});
				return q.promise;
			};
			svc.register = function(data) {
				var q = $q.defer();
				$http.post(URL + '/auth/register', data)
					.then(function(res) {
						session = res.data;
						$rootScope.$broadcast('sessionUpdate');
						q.resolve();
					})
					.catch(function(errs) {
						session = false;
						$rootScope.$broadcast('sessionUpdate');
						q.reject(errs.data);
					});
				return q.promise;
			}
			svc.logout = function() {
				$http.get(URL + '/auth/logout')
					.finally(function() {
						session = false;
						$rootScope.$broadcast('sessionUpdate');
					});
			}
			svc.load();
		}])
		.controller('PageController', ['SessionManager', '$rootScope', '$timeout', '$cookies', function(SessionManager, $rootScope, $timeout, $cookies) {
			var vm = this;
			//Dark / light mode cookie
			vm.contentClass = $cookies.get('contentMode') || "light";
			vm.contentClassSet = function(){
				$cookies.put('contentMode', vm.contentClass);
			};
			//Login Register dialog
			//false = login, true = register
			vm.register = false;
			vm.session = SessionManager.get();
			vm.data = {
				login: {
					remember: true,
				},
				register: {
					remember: true,
				},
				errors: []
			};
			$rootScope.$on('sessionUpdate', function() {
				vm.session = SessionManager.get();
			});
			vm.login = function() {
				vm.data.errors = [];
				$('#login input[type!=checkbox]').each(function() {
					if ($(this).val() == "") {
						$(this).addClass('invalid');
					}
				});
				var valid = (
					$('#login input[type=email]')[0].checkValidity() &&
					$('#login input[type=password]')[0].checkValidity()
				);
				if (!valid) {
					$('#login .invalid:first').focus();
				} else
					SessionManager.login(vm.data.login)
					.then(function() {
						$('#loginRegister').closeModal();
					})
					.catch(function(err) {
						vm.data.errors = [{
							message: err
						}];
					});
			};
			vm.signup = function() {
				vm.data.errors = [];
				var $tos = $('#register #tos-agree');
				if ($tos.is(':checked'))
					$tos.removeClass('invalid').addClass('valid');
				else
					$tos.removeClass('valid').addClass('invalid');
				$('#register input[type!=checkbox]').each(function() {
					if ($(this).val() == "") {
						$(this).addClass('invalid');
					}
				});
				var valid = (
					$('#register #email')[0].checkValidity() &&
					$('#register #password')[0].checkValidity() &&
					$('#register #name')[0].checkValidity() &&
					$('#register #password_confirm')[0].checkValidity() &&
					$('#register #tos-agree').is(':checked')
				);
				if (!valid) {
					$('#register .invalid:first').focus();
				} else
					SessionManager.register(vm.data.register)
					.then(function() {
						$('#loginRegister').closeModal();
					})
					.catch(function(errors) {
						vm.data.errors = errors;
					});
			};
			vm.logout = function() {
				SessionManager.logout();
			};
			vm.focus = function() {
				$('.tabs').tabs();
				$('#register input[type!=checkbox], #login input[type!=checkbox]').blur(function() {
					if ($(this).val() == "") {
						$(this).addClass('invalid');
					}
				});
				$('#register input').keydown(function(e) {
					if (e.which == 13) {
						vm.signup();
					}
				});
				$('#login input').keydown(function(e) {
					if (e.which == 13) {
						vm.login();
					}
				});
				$('input[type!=checkbox]').on('focus', function() {
					$(this).trigger('mouseenter');
				});
				$('input[type=checkbox]').on('focus', function() {
					$(this).next('label').trigger('mouseenter');
				});
				$('input[type!=checkbox]').on('focusout', function() {
					$(this).trigger('mouseleave');
				});
				$('input[type=checkbox]').on('focusout', function() {
					$(this).next('label').trigger('mouseleave');
				});
				$timeout(function() {
					if (vm.register)
						$('#register input').first().focus();
					else
						$('#login input').first().focus();

				}, 500);
			};
			vm.init = function() {
				$('.button-collapse').sideNav();
				$('#banner').evSlider({
					delay: 5000
				});
				$('.dropdown-button').dropdown({
					hover: true,
					belowOrigin: true,
					alignment: "right"
				});
			};
		}]);
}());