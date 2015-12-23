(function() {
  'use strict';

  angular.module('eventApp', ['ngAnimate', 'ngResource', 'ngRoute'])
    .constant('eventConstants', {
      baseDevUri: 'http://localhost:3000/api/',
      baseUri: 'https://stormy-earth-6103.herokuapp.com/api/'
    });
}());
