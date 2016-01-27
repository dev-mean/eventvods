(function() {
  'use strict';

  angular.module('eventApp')
  .config(function($routeProvider){
  	$routeProvider
            // route for the home page
            .when('/', {
                templateUrl : '/assets/views/overview.html',
                controller  : 'overviewController',
                controllerAs  : 'overviewController'
            })
            .when('/events', {
                templateUrl : '/assets/views/events.html',
                controller  : 'eventListController',
                controllerAs  : 'eventListController'
            })

  })
  .controller('layoutController', [
    function($scope) {
      
    }
  ]);
}());
