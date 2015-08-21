angular.module('overviewController', [])
	.controller('overviewDisplay', function($http){
		var vm = this;
		$http.get('/api/overview').success(function(response){
			vm.upcoming = response.upcoming;
			vm.ongoing = response.ongoing;
			vm.recent = response.recent;
			vm.casters = response.casters;
			vm.maps = response.maps;
			vm.teams = response.teams;
		});
	});