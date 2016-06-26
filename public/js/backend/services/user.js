angular.module('userService', [])
	.factory('Users', function($http) {
		return {
			get: function() {
				return $http.get('/api/users');
			},
			getSingle: function(id) {
				return $http.get('/api/users/' + id);
			},
			create: function(userData) {
				return $http.post('/api/users', userData);
			},
			update: function(id, userData) {
				return $http.put('/api/users/' + id, userData);
			},
			delete: function(id) {
				return $http.delete('/api/users/' + id);
			}
		};
	});
angular.module('userControllers', ['userService']);
