(function() {
	'use strict';
	angular.module('eventApp')
		.controller('editorController', function($http, API_BASE_URL, eventsService, $routeParams, notifier, $uibModal) {
			var vm = this;
			var static_columns = 0;
			var toDelete = [];
			vm.svOpts = {"containment": ".list-group-root"};
			vm.titles = ['', 'Tiebreakers', 'Quarterfinals', 'Semifinals', 'Winners\' Finals', 'Winners\' Match', 'Losers\' Round 1', 'Losers\' Round 2', 'Losers\' Round 3',
             'Losers\' Finals', 'Grand Finals', 'Decider Match', 'Elimination Match', 'Opening Match', 'Group A', 'Group B', 'Group C', 'Group D','1v1 Finals'];
			function reset(){
				vm.active = null;
				vm.$section = null;
				vm.$index = null;
				vm.$table = null;
			}
			reset();
			vm.save = function() {
				// Ugly hack to force Angular from array-objects to arrays for newly defined matches
				vm.data.contents.forEach(function(section){
					section.modules.forEach(function(module){
						module.matches2.forEach(function(match){
							match.data.forEach(function(game){
								game.links = $.map(game.links, function(value, index) {
									console.log(value);
									return [value];
								});
							})
						})
					})
				})
				eventsService.update($routeParams.id, vm.data)
					.then(function(){
						notifier.success('League updated');
					});
				for(var i = 0; i < toDelete.length; i++){
					eventsService.deleteMatch(toDelete[i]);
					toDelete.splice(i, 1);
				}
			};
			vm.setActive = function(item, $index, $section, $table){
				vm.active = item;
				vm.$index = $index;
				vm.$section = $section;
				vm.$table = $table;
			}
			vm.isActive = function(item){
				return (vm.active == item);
			}
			vm.collection = function(number){
				return Array(number).join(".").split(".")
			}
			vm.propagateDates = function(){
				for(var i = 0; i < vm.active.matches2.length; i++)
					vm.active.matches2[i].date = vm.active.date;
			}
			vm.getIdentifier = function($index){
				var counter = 0, str = "";
				for(var i =0; i < vm.$section; i++){
					for(var c =0; c < vm.data.contents[i].modules.length; c++){
						counter += vm.data.contents[i].modules[c].matches2.length;
					}
				}
				for(var c =0; c < vm.$index; c++){
					counter += vm.data.contents[vm.$section].modules[c].matches2.length;
				}
				counter += $index;
				if(counter > 25){
					str += String.fromCharCode(64 + Math.floor(counter / 26))
					str += String.fromCharCode(65+(counter % 26));
				}
				else str = String.fromCharCode(65+counter);
				return str;
			}
			vm.addSection = function(){
				vm.data.contents.push({
					title: "New Section",
					modules: []
				});
			};
			vm.deleteSection = function(index){
				var section = vm.data.contents.splice(index, 1)[0];
				reset();
			}
			vm.addModule = function(section){
				section.modules.push({
					title: "New Table",
					columns: [],
					matches2: []
				});
			}
			vm.deleteModule = function(section, $index){
				$uibModal.open({
						templateUrl: 'deleteModal.html',
						controller: function ($scope) {
							$scope.item = 'that';
							$scope.type = 'Table';
							$scope.ok = function () {
								var module = section.modules.splice($index, 1)[0];
								module.matches2.forEach(function(match){
									if(match._id) toDelete.push(match._id);
								})
								$scope.$close();
							}
						}
					})
			}
			vm.addMatch = function(){
				vm.active.matches2.push({
					data: [{
						links: Array(vm.active.columns.length - static_columns).join(".").split(".")
					}],
					bestOf: 1
				});
			}
			vm.addColumn = function(){
				vm.active.columns.push("Column");
			}
			vm.removeColumn = function($index){
				vm.active.columns.splice($index, 1);
				vm.active.matches2.forEach(function(match){
					match.data.forEach(function(data){
						data.links.splice($index-static_columns, 1);
					})
				})
			}
			vm.removeMatch = function($index){
				var match = vm.active.matches2.splice($index, 1)[0];
				if(match._id) toDelete.push(match._id);
			}
			vm.duplicateMatch = function(module, $index){
				var newMatch = $.extend({}, module.matches2[$index]);
				newMatch.links = newMatch.links.slice(0);
				newMatch.team1 = $.extend({}, newMatch.team1);
				newMatch.team2 = $.extend({}, newMatch.team2);
				module.matches.splice($index, 0, newMatch);
			}
			eventsService.findById($routeParams.id)
				.then(function(res) {
					vm.data = res.data;
					document.title = res.data.name + " - Eventvods - Editor";
				});
		});
}());
