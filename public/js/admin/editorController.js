(function() {
	'use strict';
	angular.module('eventApp')
		.controller('editorController', function($http, API_BASE_URL, eventsService, $routeParams, notifier) {
			var vm = this;
			var static_columns = 0;
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
				eventsService.update($routeParams.id, vm.data)
					.then(function(){
						notifier.success('League updated');
					});
			};
			vm.setActive = function(item, $index, $section, $table){
				vm.active = item;
				vm.$index = $index;
				vm.$section = $section;
				vm.$table = $table;
				console.log(vm.getIdentifier());
			}
			vm.isActive = function(item){
				return (vm.active == item);
			}
			vm.getIdentifier = function($index){
				var counter = 0, str = "";
				for(var i =0; i < vm.$section; i++){
					for(var c =0; c < vm.data.contents[i].modules.length; c++){
						counter += vm.data.contents[i].modules[c].matches2.length;
					}
				}
				for(var c =0; c < vm.$table; c++){
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
					matches: []
				});
			}
			vm.deleteModule = function(section, $index){
				var module = section.modules.splice($index, 1)[0];
				reset();
			}
			vm.addMatch = function(){
				vm.active.matches.push({
					data: [{
						links: Array(vm.data.contents[$sectionIndex].modules[$moduleIndex].columns.length - static_columns).join(".").split(".")
					}],
					bestOf: 1
				});
			}
			vm.addColumn = function(){
				vm.active.columns.push("New Column");
				vm.active.matches.forEach(function(match){
					if(module.columns.length > match.links.length + static_columns) match.links.push("");
				});
			}
			vm.removeColumn = function($index){
				vm.active.columns.splice($index, 1);
				vm.active.matches.forEach(function(match){
					match.links.splice($index-static_columns, 1);
				})
			}
			vm.removeMatch = function($sectionIndex, $moduleIndex, $index){
				vm.data.contents[$sectionIndex].modules[$moduleIndex].matches.splice($index, 1);
			}
			vm.duplicateMatch = function(module, $index){
				var newMatch = $.extend({}, module.matches[$index]);
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
