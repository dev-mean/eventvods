(function () {
    'use strict';
    
    angular.module('eventApp').value('evToastr', toastr);

    angular.module('eventApp').factory('notificationFactory', function (evToastr) {
        return {
            success: function (text) {
                evToastr.success(text);
            },
            error: function (text) {
                evToastr.error(text);
            }
        };
    });
} ());