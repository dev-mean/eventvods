(function() {
    'use strict';
    angular.module('eventApp')
        .controller('navController', function($http, $timeout, API_BASE_URL, $window) {
            var vm = this;
            vm.class = "initialising";
            $http.get(API_BASE_URL + "/auth/session")
                .then(function(res){
                    vm.user = res.data;
                    vm.isAdmin = (vm.user.userRights >= 4);
					vm.isUpdater = (vm.user.userRights >= 3);
                    $timeout(function(){
                        vm.class="loaded";
                    }, 1500);
                });
            vm.logout = function(){
                $http.get(API_BASE_URL + '/auth/logout')
                    .finally(function(){
                        $window.location = '/';
                    });
            };
        });
}());
