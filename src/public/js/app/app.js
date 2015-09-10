angular.module('overview', ['ngAnimate', 'angular-loading-bar', 'overviewController']);
angular.module('event', ['ngAnimate', 'angular-loading-bar', 'eventControllers', 'eventService']);
angular.module('newEvent', ['ngAnimate', 'angular-loading-bar', 'eventControllers', 'eventService', 'angular-datepicker','flow']);
angular.module('data', ['ngAnimate', 'angular-loading-bar', 'dataControllers', 'dataServices']);