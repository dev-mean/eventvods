(function() {
    'use strict';
    angular.module('eventApp')
        .controller('PageController', function($http, $timeout, API_BASE_URL, $window, $rootScope) {
            var vm = this;
            vm.current = '/';
            vm.alerts = [];
            $http.get(API_BASE_URL + "/auth/session")
                .then(function(res) {
                    vm.user = res.data;
                    vm.isAdmin = (vm.user.userRights >= 4);
                    vm.isUpdater = (vm.user.userRights >= 3);
                    vm.loaded = true;
                });
            vm.logout = function() {
                $http.get(API_BASE_URL + '/auth/logout')
                    .finally(function() {
                        $window.location = '/';
                    });
            };
            vm.closeAlert = function($index) {
                vm.alerts.splice($index, 1);
            }
            $rootScope.$on('addAlert', function(event, alert) {
                vm.alerts.push(alert);
            });
            $rootScope.$on('$routeChangeSuccess', function(evt, current, pre) {
                vm.alerts = [];
                if (current.$$route.originalPath !== "undefined") vm.current = current.$$route.originalPath;
                if (vm.current === "/") vm.current = "/dashboard";
            });
        });
}());