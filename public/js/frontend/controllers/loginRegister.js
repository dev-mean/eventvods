(function() {
	'use strict';
	angular.module('eventvods')
		.service('SessionManager', ['$http', 'API_BASE_URL', '$q', '$rootScope', function($http, URL, $q, $rootScope) {
			var svc = this,
				session = null;
			svc.get = function() {
				return session;
			};
			svc.load = function() {
				$http.get(URL + '/auth/session')
					.then(function(res) {
						if(res.data.success) session = res.data;
						else session = null;
					})
					.catch(function() {
						session = null;
					});
			};
			svc.login = function(data) {
				return $http.post(URL + '/auth/login', data);
			};
			svc.register = function(data) {
				return $http.post(URL + '/auth/register', data);
			};
			svc.load();
			$rootScope.$on('sessionUpdate', svc.load);
		}])
		.controller('UserController', ['SessionManager', '$rootScope', function(SessionManager, $rootScope) {
			var vm = this;
			//false = login, true = register
			vm.register = false;
			vm.session = function() {
				return SessionManager.get();
			};
		}]);
}());
