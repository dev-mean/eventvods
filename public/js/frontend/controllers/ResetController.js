(function() {
    'use strict';
    angular.module('eventvods')
        .controller('ResetController', ['SessionManager', '$timeout', function(SessionManager, $timeout) {
            var vm = this;
            vm.sent = false;
            vm.data = {};
            vm.reset = function() {
                $('#reset input[type!=checkbox]').each(function() {
                    if ($(this).val() === "") {
                        $(this).addClass('invalid');
                    }
                });
                var passwords_match = (vm.data.password === vm.data.password_confirm);
                var valid = (
                    $('#email')[0].checkValidity() &&
                    $('#password')[0].checkValidity() &&
                    $('#password_confirm')[0].checkValidity() &&
                    passwords_match
                );
                if (valid) SessionManager.reset(vm.data)
                    .then(function() {
                        vm.sent = true;
                    })
                else if (!passwords_match) {
                    $('#password_confirm').removeClass('valid').addClass('invalid');
                    $('#reset input.invalid').first().focus();
                } else $('#reset input.invalid').first().focus();
            };
            $timeout(function() {
                $('#reset input').first().focus();
                $('#reset input[type!=checkbox]').blur(function() {
                    if ($(this).val() === "") {
                        $(this).addClass('invalid');
                    }
                });
                $('#reset input').keydown(function(e) {
                    if (e.which == 13) {
                        vm.reset();
                    }
                });
            }, 500);
        }]);
}());