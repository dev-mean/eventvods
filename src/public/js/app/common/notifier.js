(function () {
    'use strict';

    angular.module('eventApp').value('evToastr', toastr);

    angular.module('eventApp').service('notificationService', function (evToastr) {
        var service = this;

            service.success = function (text) {
                evToastr.success(text);
            };
            service.error = function (text) {
                evToastr.error(text);
            };
    });
} ());
