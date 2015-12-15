(function() {
  'use strict';

  angular.module('eventApp', ['ngAnimate', 'ngResource', 'ngRoute'])
    .constant('eventConstants', {
      baseUri: 'http://localhost:3000/api/'
    });
    //TODO (Nick): Have gulp compile jade files in to html files in build not on request from webservice.
    //Link: https://stackoverflow.com/questions/23944618/why-cant-i-use-angularjs-ng-view-and-routing-in-combination-with-jade
}());
