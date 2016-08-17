(function() {
    'use strict';
    angular.module('eventApp')
        .controller('navController', function($http, $timeout, API_BASE_URL, $window, $rootScope) {
            var vm = this;
            vm.class = "initialising";
			vm.current = '/';
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
			$rootScope.$on('$routeChangeSuccess', function(evt, current, pre) {
				if(current != pre) vm.current = current.$$route.originalPath;
				if(vm.current == "/") vm.current = "/dashboard";
			});
        });
}());
