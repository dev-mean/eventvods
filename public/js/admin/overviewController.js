(function() {
    'use strict';
    angular.module('eventApp')
        .controller('overviewController', function($http, API_BASE_URL, $interval) {
            var vm = this;
            vm.data = {};
            $http.get(API_BASE_URL + '/overview')
                .then(function(response) {
                    vm.data = response.data;
                    vm.colors = ['#0CD97E', '#3C3C62']
                    vm.options = {
                        legend: {
                            display: true,
                            position: "top",
                            fullwidth: true
                        }
                    }
                    vm.minimal = {
                        scales: {
                            yAxes: [{
                                gridLines: {
                                    display: false
                                }
                            }],
                            xAxes: [{
                                gridLines: {
                                    display: false
                                }
                            }]
                        }
                    }
                })
            $interval(function() {
                $http.get(API_BASE_URL + '/overview/active', {
                        ignoreLoadingBar: true
                    })
                    .then(function(response) {
                        vm.data.active = response.data;
                    });
            }, 60000)
        });
}());