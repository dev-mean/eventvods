(function() {
    'use strict';
    angular.module('eventApp')
        .controller('overviewController', function($http, API_BASE_URL) {
            var vm = this;
            $http.get(API_BASE_URL + '/overview')
                .then(function(response) {
                    vm.data = response.data;
                    vm.colors = ['#1A192B', '#0CD97E']
                    vm.options = {
                        legend: {
                            display: true,
                            position: "top",
                            fullwidth: true
                        }
                    }
                })
        });
}());