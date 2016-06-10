(function() {
    'use strict';
    angular.module('eventApp')
        .controller('navController', function($http, $timeout, API_BASE_URL) {
            var vm = this;
            vm.class = "initialising";
            $http.get(API_BASE_URL + "/session")
                .then(function(res){
                    vm.user = res.data;
                    vm.isAdmin = (vm.user.rights >= 3);
                    vm.user.username="superduperduperduperduperlongadhasdahname";
                    $timeout(function(){
                        vm.class="loaded";
                    }, 1000);
                })
        });
}());