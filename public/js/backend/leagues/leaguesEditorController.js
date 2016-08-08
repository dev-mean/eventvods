(function() {
	'use strict';
	angular.module('eventApp')
		.controller('updateLeagueController', function($http, API_BASE_URL, leaguesService, $routeParams, notificationService) {
			var vm = this;
			var static_columns = 2;
			vm.tab = 0;
			vm.save = function() {
				leaguesService.update($routeParams.id, vm.data)
					.then(function(){
						notificationService.success('League updated');
					});
			};
			vm.addSection = function(){
				vm.data.contents.push({
					title: "New Section",
					modules: []
				});
				vm.tab = vm.data.contents.length -1;
			};
			vm.deleteSection = function(){
				vm.data.contents.splice(vm.tab, 1);
			}
			vm.tabSorted = function(a, b, c, $indexFrom, $indexTo){
				if(vm.tab == $indexFrom)	vm.tab = $indexTo;
			}
			vm.addModule = function(){
				vm.data.contents[vm.tab].modules.push({
					title: "New Module",
					columns: ["Team 1", "Team 2", "Picks & Bans", "Game Start"],
					matches: []
				});
			}
			vm.deleteModule = function($index){
				vm.data.contents[vm.tab].modules.splice($index, 1);
			}
			vm.addMatch = function($index){
				vm.data.contents[vm.tab].modules[$index].matches.push({
					links: Array(vm.data.contents[vm.tab].modules[$index].columns.length - static_columns).join(".").split(".")
				});
			}
			vm.addColumn = function($index){
				var module = vm.data.contents[vm.tab].modules[$index];
				module.columns.push("New Column");
				module.matches.forEach(function(match){
					if(module.columns.length > match.links.length + static_columns) match.links.push("");
				});
			}
			vm.deleteColumn = function(module, $index){
				module.columns.splice($index, 1);
				module.matches.forEach(function(match){
					match.links.splice($index-static_columns, 1);
				})
			}
			vm.deleteMatch = function(module, $index){
				module.matches.splice($index, 1);
			}
			vm.duplicateMatch = function(module, $index){
				module.matches.splice($index, 0, $.extend({}, module.matches[$index]));
			}
			leaguesService.findById($routeParams.id)
				.then(function(res) {
					vm.data = res.data;
				});
		});
}());
