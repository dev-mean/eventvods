(function() {
  'use strict';

  angular.module('eventApp', ['ngAnimate', 'ngResource', 'ngRoute'])
    .constant('eventConstants', {
      baseUri: 'http://localhost:3000/api/'
    });
}());
