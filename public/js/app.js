(function() {
    'use strict';
    angular.module('eventApp', ['ngAnimate', 'ngResource', 'ngRoute', 'angular-datepicker', 'angular-loading-bar','ngDialog'])
        .constant('eventConstants', {
            baseUri: '/api/'
        })
        .constant('API_BASE_URL', '/api')
        // Set up titles on ngroute pages
        .run(['$rootScope', '$route', function($rootScope, $route) {
            $rootScope.$on('$routeChangeSuccess', function() {
                document.title = "eventVODs - " + $route.current.title;
            });
        }])
        // Offset filter for paging lists
        .filter('offset', function() {
            return function(input, start) {
                start = parseInt(start, 10);
                return input.slice(start);
            };
        })
        .config(function($routeProvider) {
            $routeProvider
            // route for the home page
                .when('/', {
                    templateUrl: '/assets/views/dashboard.html',
                    controller: 'overviewController',
                    controllerAs: 'overviewController',
                    title: "Dashboard"
                })
                .when('/games', {
                    templateUrl: '/assets/views/game/list.html',
                    controller: 'gamesListController',
                    controllerAs: 'gamesListController',
                    title: "Games"
                })
                .when('/games/new', {
                    templateUrl: '/assets/views/game/form.html',
                    controller: 'addGameController',
                    controllerAs: 'gameFormController',
                    title: "Add Game"
                })
                .when('/game/:id/edit', {
                    templateUrl: '/assets/views/game/form.html',
                    controller: 'editGameController',
                    controllerAs: 'gameFormController',
                    title: "Edit Game"
                })
                .when('/leagues', {
                    templateUrl: '/assets/views/league/list.html',
                    controller: 'leagueListController',
                    controllerAs: 'gameListController',
                    title: "Leagues"
                })
                .when('/events', {
                    templateUrl: '/assets/views/event/list.html',
                    controller: 'eventListController',
                    controllerAs: 'eventListController',
                    title: "Events"
                })
                .when('/events/new', {
                    templateUrl: '/assets/views/event/form.html',
                    controller: 'newEventController',
                    controllerAs: 'newEventController',
                    title: "New Event"
                })
                .when('/staff', {
                    templateUrl: '/assets/views/staff.html',
                    controller: 'staffListController',
                    controllerAs: 'staffListController',
                    title: "Staff"
                })
                .when('/maps', {
                    templateUrl: '/assets/views/maps.html',
                    controller: 'mapListController',
                    controllerAs: 'mapListController',
                    title: "Maps"
                })
                .when('/teams', {
                    templateUrl: '/assets/views/teams.html',
                    controller: 'teamListController',
                    controllerAs: 'teamListController',
                    title: "Teams"
                })
        })
}());