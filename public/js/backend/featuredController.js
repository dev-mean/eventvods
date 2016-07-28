( function() {
    'use strict';
    angular.module( 'eventApp' )
        .controller( 'featuredSelectController', function( $http, API_BASE_URL, gamesService ) {
            var vm = this;
			vm.tab = 1;
			vm.changed = false;
			vm.save = function(){
				console.log(vm.data);
			};
			vm.deleteGame = function(index){
				vm.data.games.splice(index, 1);
			};
			vm.addGame = function(){
				vm.data.games.push(vm.selectedGame);
			};
			$http.get(API_BASE_URL + '/featured')
				.then(function(res){
					vm.data = res.data;
				});
			gamesService.find()
				.then(function(res){
					vm.games = res.data;
				});
        } );
}() );
