(function() {
	'use strict';

	angular.module('eventApp').service('staffService', [
        'staffResource',
		function(staffResource) {
			var service = this;
			service.getCasters = staffResource.getCasters.query;
			service.getCaster = staffResource.getCaster.get;
			service.createCaster = staffResource.createCaster.save;
			service.updateCaster = staffResource.updateCaster.put;
			service.deleteCaster = staffResource.deleteCaster.delete;
		}
	]);
}());