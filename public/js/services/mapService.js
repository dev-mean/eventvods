(function() {
	'use strict';

	angular.module('eventApp').service('mapService', [
		'mapResource',
		function(mapResource) {
			var service = this;

			service.getMaps = mapResource.getMaps.query;
			service.getMap = mapResource.getMap.get;
			service.createMap = mapResource.createMap.save;
			service.updateMap = mapResource.updateMap.put;
			service.deleteMap = mapResource.deleteMap.delete;
		}
	]);
}());
