(function() {
	'use strict';
	angular.module('eventvods')
		 .factory( 'NavService', [ '$http', 'API_BASE_URL', function( $http, API_BASE_URL ) {
            return {
                get: function() {
                    return $http.get( API_BASE_URL + '/featured' );
                }
            };
        } ] )
		.controller('NavController', ['NavService', function(NavService) {
			var vm = this;
			vm.links = null;
			vm.leagueClass = function($index){
				if($index === 0 ||
					vm.links.orderedLeagues[$index].game.name !== vm.links.orderedLeagues[$index-1].game.name) return "border-top";
				else return "";
			};
			vm.tournamentClass = function($index){
				if($index === 0 ||
					vm.links.orderedTournaments[$index].game.name !== vm.links.orderedTournaments[$index-1].game.name) return "border-top";
				else return "";
			};
			NavService.get()
				.then(function(res){
					vm.links = res.data;
					vm.init();
				})
				.catch(function(){
					vm.links = null;
				});
			vm.init = function(){
				$('.dropdown-button').dropdown({
						hover: true,
						belowOrigin: true,
						alignment: "left"
					});
			}
		}]);
}());
