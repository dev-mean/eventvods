(function() {
    'use strict';
    angular.module('eventApp')
        .controller('featuredSelectController', function($http, API_BASE_URL, gamesService, eventsService, articlesService, notifier, teamsService) {
            var vm = this;
            vm.tab = 0;
            vm.save = function() {
                $http.post(API_BASE_URL + '/featured', vm.data)
                    .then(function() {
                        notifier.success('Featured content updated.');
                    }, function() {
                        notifier.error('Something went wrong. Please try again');
                    });
            };
            vm.deleteGame = function(index) {
                vm.data.games.splice(index, 1);
            };
            vm.select = function(selected) {
                vm.selectedGame = selected;
            }
            vm.addGame = function() {
                vm.data.games.push(vm.selectedGame);
            };
            vm.deleteEvent = function(index) {
                vm.data.events.splice(index, 1);
            };
            vm.addEvent = function() {
                vm.data.events.push(vm.selectedEvent);
            };
            vm.deleteArticle = function(index) {
                vm.data.articles.splice(index, 1);
            };
            vm.addArticle = function() {
                vm.data.articles.push(vm.selectedArticle);
            };
            vm.deleteTeam = function(index) {
                vm.data.teams.splice(index, 1);
            };
            vm.addTeam = function() {
                vm.data.teams.push(vm.selectedTeam);
            };
            $http.get(API_BASE_URL + '/featured')
                .then(function(res) {
                    vm.data = res.data;
                });
            gamesService.find()
                .then(function(res) {
                    vm.games = res.data;
                    vm.selectedGame = res.data[0];
                });
            eventsService.find()
                .then(function(res) {
                    vm.events = res.data;
                    vm.selectedEvent = res.data[0];
                });
            articlesService.find()
                .then(function(res) {
                    vm.articles = res.data;
                    vm.selectedArticle = res.data[0];
                });
            teamsService.find()
                .then(function(res) {
                    vm.teams = res.data;
                    vm.selectedTeam = res.data[0];
                });
        });
}());