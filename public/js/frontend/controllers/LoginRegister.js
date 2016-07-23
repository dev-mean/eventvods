(function() {
	'use strict';
	angular.module('eventvods')
		.controller('LoginRegisterController', ['SessionManager', '$rootScope', '$timeout', '$cookies', function(SessionManager, $rootScope, $timeout, $cookies) {
			var vm = this;
			//Login Register dialog
			vm.show = 'login';
			vm.data = {
				login: {
					remember: true,
				},
				register: {
					remember: true,
				}
			};

			vm.login = function() {
				$('#login input[type!=checkbox]').each(function() {
					if ($(this).val() === "") {
						$(this).addClass('invalid');
					}
				});
				var valid = (
					$('#login input[type=email]')[0].checkValidity() &&
					$('#login input[type=password]')[0].checkValidity()
				);
				if (valid)
					SessionManager.login(vm.data.login)
					.then(function() {
						$('#loginRegister').closeModal();
					})
					.catch(function(err) {
						$('#login #password').focus();
						$('#login #password').removeClass('valid').addClass('invalid').val('');
						$('#login #password_label').attr('data-error', 'Incorrect email or password.').removeClass('active');
					});
			};
			vm.signup = function() {
				var $tos = $('#register #tos-agree');
				if ($tos.is(':checked'))
					$tos.removeClass('invalid');
				else
					$tos.addClass('invalid').focus();
				$('#register input[type!=checkbox]').each(function() {
					if ($(this).val() === "") {
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
				if (valid) SessionManager.register(vm.data.register)
					.then(function() {
						$('#loginRegister').closeModal();
						$('#emailConfirm').showModal();
					})
					.catch(function(errs) {
						errs.forEach(function(err) {
							$(err.field).val('').removeClass('valid').addClass('invalid').next('label').attr('data-error', err.message).removeClass('active');
						});
					});
				else $('.invalid').val('').next('label').removeClass('active');
			};
			vm.loginDialogOpen = function() {
				$('.tabs').tabs();
				$('#register input[type!=checkbox], #login input[type!=checkbox]').blur(function() {
					if ($(this).val() === "") {
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
				vm.focus();
			};
			vm.focus = function() {
					$timeout(function() {
						if (vm.show == 'login')
							$('#register input').first().focus();
						else if (vm.show == 'register')
							$('#login input').first().focus();

					}, 500);
				};
		}]);
}());
