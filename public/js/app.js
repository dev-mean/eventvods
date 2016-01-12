(function() {
  'use strict';

  angular.module('eventApp', ['ngAnimate', 'ngResource', 'ngRoute', 'angular-datepicker'])
    .constant('eventConstants', {
      baseUri: 'http://localhost:5000/api/'
    });
}());
