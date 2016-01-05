(function() {
	'use strict';

	angular.module('eventApp').service('dataListService', [
		'mapResource', 'staffResource', 'teamResource',
		function(mapResource, staffResource, teamResource) {
			var service = this;

			service.getMaps = mapResource.getMaps.query;
			service.getMap = mapResource.getMap.get;
			service.createMap = mapResource.createMap.save;
			service.deleteMap = mapResource.deleteMap.delete;

			service.getCasters = staffResource.getCasters.query;
			service.getCaster = staffResource.getCaster.get;
			service.createCaster = staffResource.createCaster.save;
			service.deleteCaster = staffResource.deleteCaster.delete;

			service.getTeams = teamResource.getTeams.query;
			service.getTeam = teamResource.getTeam.get;
			service.createTeam = teamResource.createTeam.save;
			service.deleteTeam = teamResource.deleteTeam.delete;
		}
	]);
}());


/*
angular.module('dataServices', [])
	.factory('Staff', function($http) {
		return {
			get: function() {
				return $http.get('/api/casters');
			},
			create: function(staffData) {
				return $http.post('/api/casters', staffData);
			},
			delete: function(id) {
				return $http.delete('/api/casters/' + id);
			}
		};
	})
	.factory('Maps', function($http) {
		return {
			get: function() {
				return $http.get('/api/maps');
			},
			create: function(mapData) {
				return $http.post('/api/maps', mapData);
			},
			delete: function(id) {
				return $http.delete('/api/maps/' + id);
			}
		};
	})
	.factory('Teams', function($http) {
		return {
			get: function() {
				return $http.get('/api/teams');
			},
			create: function(teamDate) {
				return $http.post('/api/teams', teamData);
			},
			delete: function(id) {
				return $http.delete('/api/events/' + id);
			}
		};
	});
angular.module('dataControllers', ['dataServices']);
*/
