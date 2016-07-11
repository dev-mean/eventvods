(function() {
	'use strict';
	angular.module('eventvods')
		 .factory( 'SettingsService', [ '$http', 'API_BASE_URL', function( $http, API_BASE_URL ) {
            return {
                get: function() {
                    return $http.get( API_BASE_URL + '/auth/session' );
                },
				validateName: function(name){
					return $http.get( API_BASE_URL + '/validate/displayName/'+name);
				},
				setName: function(name){
					return $http.post( API_BASE_URL + '/users/displayName', {
						Name: name
					});
				}
            };
        } ] )
		.controller('SettingsController', ['SettingsService', '$q', '$rootScope', function(SettingsService, $q, $rootScope) {
			var vm = this;
			SettingsService.get()
				.then(function(res){
					vm.data = res.data;
				});
			vm.validateName = function(name){
				var deferred = $q.defer();
				if(name == vm.data.displayName) deferred.resolve("You haven't changed your name.");
				else if(name.trim() === "") deferred.resolve("Name cannot be empty.");
				else if(name.length > 30) deferred.resolve("Name must be less than 30 charaters.");
				else SettingsService.validateName(name)
					.then(function(){
						deferred.resolve(true);
					})
					.catch(function(){
						deferred.resolve("Display Name already in use.");
					});
				return deferred.promise;
			};
			vm.updateName = function(){
				var deferred = $q.defer();
				SettingsService.setName(vm.data.displayName)
					.then(function(){
						deferred.resolve(true);
						$rootScope.$broadcast('triggerSessionUpdate');
					})
					.catch(function(err){
						deferred.resolve(err.data[0].message);
					});
				return deferred.promise;
			};
		}]);
}());
