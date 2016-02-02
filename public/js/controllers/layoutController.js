(function() {
  'use strict';

  angular.module('eventApp')
  .config(function($routeProvider){
  	$routeProvider
            // route for the home page
            .when('/', {
                templateUrl : '/assets/views/dashboard.html',
                controller  : 'overviewController',
                controllerAs  : 'overviewController',
                title : "Dashboard"
            })
            .when('/events', {
                templateUrl : '/assets/views/events.html',
                controller  : 'eventListController',
                controllerAs  : 'eventListController',
                title : "Events"
            })
            .when('/staff', {
                templateUrl : '/assets/views/staff.html',
                controller  : 'staffListController',
                controllerAs  : 'staffListController',
                title : "Staff"
            })
            .when('/maps', {
                templateUrl : '/assets/views/maps.html',
                controller  : 'mapListController',
                controllerAs  : 'mapListController',
                title : "Maps"
            })
            .when('/teams', {
                templateUrl : '/assets/views/teams.html',
                controller  : 'teamListController',
                controllerAs  : 'teamListController',
                title : "Teams"
            })

  })
// .controller('layoutController', [
//   function($scope) {
    
//   }
// ]);
}());
