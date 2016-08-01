(function () {
    'use strict';

    angular.module('eventApp').value('evToastr', toastr);

    angular.module('eventApp').factory('notificationService', function (evToastr) {
        return {
			success: evToastr.success,
			warning: evToastr.warning,
			error: evToastr.error
		}
    });
} ());
