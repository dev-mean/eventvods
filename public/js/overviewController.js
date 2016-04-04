(function() {
    'use strict';
    angular.module('eventApp')
        .controller('overviewController', function($http, API_BASE_URL) {
            var vm = this;
            $http.get(API_BASE_URL + '/overview')
                .then(function(response) {
                    vm.overviewData = response.data;
                })
        });
}());