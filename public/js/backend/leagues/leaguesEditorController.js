(function () {
	'use strict';
	angular.module('eventApp')
		.controller('updateLeagueController', function ($http, API_BASE_URL, leaguesService, $routeParams, notificationService) {
			var vm = this;
			var static_columns = 0;
			vm.manage = true;
			vm.sectionIndex = 0;
			vm.moduleIndex = 0;
			vm.titles = ['', 'Tiebreakers', 'Quarterfinals', 'Semifinals', 'Winner\'s Finals', 'Loser\'s Round 1', 'Loser\'s Round 2', 'Loser\'s Round 3',
             'Loser\'s Finals', 'Grand Finals', 'Decider Match', 'Elimination Match', 'Opening Match'];
			vm.save = function () {
				leaguesService.update($routeParams.id, vm.data)
					.then(function () {
						notificationService.success('League updated');
					});
			};
			vm.getIdentifier = function ($parentIndex, $index) {
				var counter = 0,
					str = "";
				for (var i = 0; i < $parentIndex; i++) {
					counter += vm.data.contents[i].modules.length;
				}
				counter += $index;
				if (counter > 25) {
					str += String.fromCharCode(64 + Math.floor(counter / 26))
					str += String.fromCharCode(65 + (counter % 26));
				} else str = String.fromCharCode(65 + counter);
				return str;
			}
			vm.addSection = function () {
				vm.data.contents.push({
					title: "New Section",
					modules: []
				});
				vm.sectionIndex = vm.data.contents.length - 1;
				vm.moduleIndex = 0;
			};
			vm.deleteSection = function (index) {
				vm.data.contents.splice(index, 1);
				vm.sectionIndex = 0;
			}
			vm.addModule = function ($index) {
				vm.data.contents[$index].modules.push({
					title: "New Table",
					columns: [],
					matches: []
				});
				vm.moduleIndex = vm.data.contents[$index].modules.length - 1;
			}
			vm.deleteModule = function ($sectionIndex, $moduleIndex) {
				vm.data.contents[$sectionIndex].modules.splice($moduleIndex, 1);
			}
			vm.addMatch = function ($sectionIndex, $moduleIndex) {
				vm.data.contents[$sectionIndex].modules[$moduleIndex].matches.push({
					links: Array(vm.data.contents[$sectionIndex].modules[$moduleIndex].columns.length - static_columns).join(".").split(".")
				});
			}
			vm.addColumn = function ($sectionIndex, $moduleIndex) {
				var module = vm.data.contents[$sectionIndex].modules[$moduleIndex];
				module.columns.push("New Column");
				module.matches.forEach(function (match) {
					if (module.columns.length > match.links.length + static_columns) match.links.push("");
				});
			}
			vm.removeColumn = function ($sectionIndex, $moduleIndex, $index) {
				var module = vm.data.contents[$sectionIndex].modules[$moduleIndex];
				module.columns.splice($index, 1);
				module.matches.forEach(function (match) {
					match.links.splice($index - static_columns, 1);
				})
			}
			vm.removeMatch = function ($sectionIndex, $moduleIndex, $index) {
				vm.data.contents[$sectionIndex].modules[$moduleIndex].matches.splice($index, 1);
			}
			vm.duplicateMatch = function (module, $index) {
				var newMatch = $.extend({}, module.matches[$index]);
				newMatch.links = newMatch.links.slice(0);
				newMatch.team1 = $.extend({}, newMatch.team1);
				newMatch.team2 = $.extend({}, newMatch.team2);
				module.matches.splice($index, 0, newMatch);
			}
			leaguesService.findById($routeParams.id)
				.then(function (res) {
					vm.data = res.data;
					document.title = res.data.name + " - Eventvods";
				});
		});
}());
