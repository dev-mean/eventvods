angular.module('eventService', [])
	.factory('Events', function($http) {
		return {
			get: function() {
				return $http.get('/api/events');
			},
			getSingle: function(id) {
				return $http.get('/api/event/' + id);
			},
			create: function(eventData) {
				return $http.post('/api/events', eventData);
			},
			update: function(id, eventData) {
				return $http.put('/api/event/' + id, eventData);
			},
			delete: function(id) {
				return $http.delete('/api/events/' + id);
			}
		};
	});
angular.module('eventControllers', ['eventService']);