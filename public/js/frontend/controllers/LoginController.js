(function() {
    'use strict';
    angular.module('eventvods')
        .controller('LoginController', ['SessionManager', '$rootScope', '$timeout', '$location', '$routeParams', function(SessionManager, $rootScope, $timeout, $location, $routeParams) {
            var vm = this;
            vm.data = {};
            vm.login = function() {
                $('#login input[type!=checkbox]').each(function() {
                    if ($(this).val() === "") {
                        $(this).addClass('invalid');
                    }
                });
                var valid = (
                    $('#email')[0].checkValidity() &&
                    $('#password')[0].checkValidity()
                );
                if (valid) {
                    SessionManager.login(vm.data)
                        .then(function() {
                            $location.path($routeParams.return || '/');
                        })
                        .catch(function(err) {
                            $('#login #password').focus();
                            $('#login #password').removeClass('valid').addClass('invalid').val('');
                            $('#login #password_label').attr('data-error', 'Incorrect email or password.').removeClass('active');
                        });
                }
            };
            $timeout(function() {
                $('#login input[type!=checkbox]').blur(function() {
                    if ($(this).val() === "") {
                        $(this).addClass('invalid');
                    }
                });
                $('#login input').keydown(function(e) {
                    if (e.which == 13) {
                        vm.login();
                    }
                });
            }, 500);
        }]);
}());
