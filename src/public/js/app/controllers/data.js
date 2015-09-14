angular.module('dataControllers', ['dataServices'])
	.controller('dataOverview', function($http, $scope, Staff, Maps, Teams) {
	
		$scope.view = "Teams";
		$scope.showFilters = false;
			
		//=================
		$scope.test = function(){
			console.dir($scope);
		};
		
		$scope.teams = {
			sort: {
				field: 'tag',
            	dir: 'desc'
			},
			sorted: function(field, dir){
				return ($scope.teams.sort.field == field && $scope.teams.sort.dir == dir);
			},
			sortBy: function(field){
				if($scope.teams.sort.field == field) $scope.teams.sort.dir = $scope.teams.sort.dir == 'desc' ? 'asc' : 'desc';
				else $scope.teams.sort.field = field;
			},
		};
        $scope.staff = {
			sort: {
				field: 'name',
            	dir: 'desc'
			},
			sorted: function(field, dir){
				return ($scope.staff.sort.field == field && $scope.staff.sort.dir == dir);
			},
			sortBy: function(field){
				if($scope.staff.sort.field == field) $scope.staff.sort.dir = $scope.staff.sort.dir == 'desc' ? 'asc' : 'desc';
				else $scope.staff.sort.field = field;
			},
		};
		$scope.maps = {
			sort: {
				field: 'name',
            	dir: 'desc'
			},
			sorted: function(field, dir){
				return ($scope.maps.sort.field == field && $scope.maps.sort.dir == dir);
			},
			sortBy: function(field){
				if($scope.maps.sort.field == field) $scope.maps.sort.dir = $scope.maps.sort.dir == 'desc' ? 'asc' : 'desc';
				else $scope.maps.sort.field = field;
			},
		};
	
		
		//=================
	
        Staff.get()
            .then(function(response) {
               $scope.staff.data = response.data;
            });
		Maps.get()
            .then(function(response) {
               $scope.maps.data = response.data;
            });
		Teams.get()
            .then(function(response) {
               $scope.teams.data = response.data;
            });
	
		//=================
    });