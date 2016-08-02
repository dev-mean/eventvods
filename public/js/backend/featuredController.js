(function() {
	'use strict';
	angular.module('eventApp')
		.controller('featuredSelectController', function($http, API_BASE_URL, gamesService, leaguesService) {
			var vm = this;
			vm.tab = 1;
			vm.save = function() {
				$http.post(API_BASE_URL + '/featured', vm.data)
					.then(function() {
						toastr.success('Featured content saved.');
					}, function() {
						toastr.error('Something went wrong. Please try again');
					});
			};
			vm.deleteGame = function(index) {
				vm.data.games.splice(index, 1);
			};
			vm.addGame = function() {
				vm.data.games.push(vm.selectedGame);
			};
			vm.deleteLeague = function(index) {
				vm.data.leagues.splice(index, 1);
			};
			vm.addLeague = function() {
				vm.data.leagues.push(vm.selectedLeague);
			};
			$http.get(API_BASE_URL + '/featured')
				.then(function(res) {
					vm.data = res.data;
					console.log(res.data);
				});
			gamesService.find()
				.then(function(res) {
					vm.games = res.data;
					vm.selectedGame = res.data[0];
				});
			leaguesService.find()
				.then(function(res) {
					vm.leagues = res.data;
					vm.selectedLeague = res.data[0];
				});
		});
}());
