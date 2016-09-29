(function() {
	'use strict';
	angular.module('eventvods')
		 .factory( 'SettingsService', [ '$http', 'API_BASE_URL', function( $http, API_BASE_URL ) {
            return {
				validateName: function(name){
					return $http.get( API_BASE_URL + '/validate/displayName/'+name);
				},
				setName: function(name){
					return $http.post( API_BASE_URL + '/user/displayName', {
						Name: name
					});
				},
				setSettings: function(settings){
					return $http.post( API_BASE_URL + '/user/settings', settings);
				},
				sendEmail: function(){
					return $http.get( API_BASE_URL + '/user/sendEmail', {
						ignoreLoadingBar: true
					});
				}
            };
        } ] )
		.controller('SettingsController', ['SettingsService','SessionManager', '$q', '$rootScope', '$location', '$timeout', '$routeParams',
		function(SettingsService, SessionManager, $q, $rootScope, $location, $timeout, $routeParams) {
			var vm = this;
			function getSession(){
				vm.data = SessionManager.get();
				if(vm.data === false) $location.path('/login');
				else if(vm.data === null) $timeout(getSession, 1000);
				else {
					if(vm.data.emailConfirmation.confirmed) vm.stage = 2;
					else if(vm.data.emailConfirmation.sent) vm.stage = 1;
					else vm.stage = 0;
				}
			}
			vm.tab = $routeParams.tab || 0;
			getSession();
			vm.save = function(){
				SettingsService.setSettings(vm.data.settings)
					.then(function(){
						console.log("success");
					});
			}
			vm.verifySend = function(){
				SettingsService.sendEmail()
					.then(function(){
						vm.stage = 1;
					});
			}
			vm.validateName = function(name){
				var deferred = $q.defer();
				if(name == vm.data.displayName) deferred.resolve("That's the same, silly.");
				else if(name.trim() === "") deferred.resolve("That's empty, silly.");
				else if(name.length > 30) deferred.resolve("30 Characters maximum.");
				else SettingsService.validateName(name.toUpperCase())
					.then(function(){
						deferred.resolve(true);
					})
					.catch(function(){
						deferred.resolve("That's already taken.");
					});
				return deferred.promise;
			};
			vm.updateName = function(){
				var deferred = $q.defer();
				SettingsService.setName(vm.data.displayName.toUpperCase())
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
