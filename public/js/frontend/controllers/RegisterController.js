(function() {
	'use strict';
	angular.module('eventvods')
		.controller('RegisterController', ['SessionManager', '$rootScope', '$timeout', '$location', '$routeParams',
		function(SessionManager, $rootScope, $timeout, $location, $routeParams) {
			var vm = this;
			vm.data = {
				flow_create: $routeParams.flow_create,
				email: $routeParams.email,
				displayName: $routeParams.name
			};
			vm.register = function() {
				$('#tos + label').removeClass('err');
				$('#register input[type!=checkbox]').each(function() {
					if ($(this).val() === "") {
						$(this).addClass('invalid');
					}
				});
				var valid = (
					$('#email')[0].checkValidity() &&
					$('#password')[0].checkValidity() &&
					$('#password_confirm')[0].checkValidity() &&
					$('#name')[0].checkValidity &&
					vm.data.tos
				);
				if(!vm.data.tos)
					$('#tos + label').addClass('err');
				if (valid)
					SessionManager.register(vm.data)
					.then(function(){
						$location.path('/user/settings?tab=1');
					})
					.catch(function(errs) {
						errs.forEach(function(err){
							var field = $(err.field);
							field.focus();
							field.removeClass('valid').addClass('invalid').val('');
							field.next('label').attr('data-error', err.message).removeClass('active');
							field.one('keydown', function(){
								field.next('label').addClass('active').attr('data-error', field.next('label').attr('data-error-original'));
							})
						});
					});
				else $('#register input.invalid').first().focus();
			};
			$timeout(function() {
				$('#register input[type!=checkbox]').blur(function() {
					if ($(this).val() === "") {
						$(this).addClass('invalid');
					}
				});
				$('#register input').keydown(function(e) {
					if (e.which == 13) {
						vm.register();
					}
				});
			}, 500);
		}]);
}());
