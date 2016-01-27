(function() {
  'use strict';

  angular.module('eventApp')
  .config(function($routeProvider){
  	$routeProvider
            // route for the home page
            .when('/', {
                templateUrl : '/assets/views/overview.html',
                controller  : 'overviewController'
            })

  })
  .controller('layoutController', [
    function($scope) {
      
    }
  ]);
}());
