angular.module('eventApp', ['ngAnimate', 'ngResource'])
    .constant('eventConstants', {
      baseUri: 'http://localhost:3000/api'
});

/*
angular.module('overview', ['ngAnimate', 'angular-loading-bar', 'overviewController']);
angular.module('event', ['ngAnimate', 'angular-loading-bar', 'eventControllers', 'eventService']);
angular.module('newEvent', ['ngAnimate', 'angular-loading-bar', 'eventControllers', 'eventService', 'angular-datepicker']);
angular.module('data', ['ngAnimate', 'angular-loading-bar', 'dataControllers', 'dataServices']);
angular.module('user', ['ngAnimate', 'angular-loading-bar', 'userControllers', 'userService']);
*/
