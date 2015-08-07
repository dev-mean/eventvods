angular.module('dataControllers', ['dataServices'])
	.controller('dataOverview', function($http, Casters, Maps, Teams) {
        var vm = this;
	
        vm.casters = [];
		vm.maps = [];
		vm.teams = [];
	
        Casters.get()
            .success(function(data) {
               vm.casters = data;
            });
		Maps.get()
            .success(function(data) {
               vm.maps = data;
            });
		Teams.get()
            .success(function(data) {
               vm.teams = data;
            });
            
    })
	.controller('casterList', function($http, Casters) {
        var vm = this;
	
        vm.casters = [];
		
        Casters.get()
            .success(function(data) {
               vm.casters = data;
            });
    })
	.controller('mapList', function($http, Maps) {
        var vm = this;
	
		vm.maps = [];
		
		Maps.get()
            .success(function(data) {
               vm.maps = data;
            });
            
    })
	.controller('teamList', function($http, Teams) {
        var vm = this;

		vm.teams = [];
	
		Teams.get()
            .success(function(data) {
               vm.teams = data;
            });
            
    });