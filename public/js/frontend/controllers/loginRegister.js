(function() {
    'use strict';
    angular.module('eventvods')
        .factory('loginRegisterService', ['$http', 'API_BASE_URL', function($http, URL){
            return {
                session: function(){
                    return $http.get(URL+'/auth/session');
                },
                login: function(data){
                    return $http.post(URL+'/auth/login', data);
                },
                register: function(data){
                    return $http.post(URL+'/auth/register', data); 
                }
            };
        }])
        .controller('loginRegisterController', ['loginRegisterService', function(Service){
            //false = login, true = register
            var register = false;
        }]);
}());