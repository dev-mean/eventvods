(function () {
    'use strict';

    angular.module('eventApp').value('evToastr', toastr);

    angular.module('eventApp').service('notificationService', function (evToastr) {
        var service = this;

            service.success = evToastr.success;
            service.error = evToastr.error;

            service.warning = evToastr.warning;
    });
} ());
