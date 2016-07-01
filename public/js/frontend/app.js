(function() {
    'use strict';
    angular.module('eventvods', ['ngAnimate', 'ngRoute', 'angular-loading-bar', 'ui.materialize'])
        .constant('API_BASE_URL', '/api')
        .config(['$locationProvider', function($locationProvider) {

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });

        }])
}());