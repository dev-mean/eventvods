(function() {
  'use strict';

  angular.module('eventApp', ['ngAnimate', 'ngResource'])
    .constant('eventConstants', {
      baseUri: 'http://localhost:3000/api/'
    });
}());
