(function() {
	'use strict';
	angular.module('eventvods')
		 .factory( 'NavService', [ '$http', 'API_BASE_URL', function( $http, API_BASE_URL ) {
            return {
                get: function() {
                    return $http.get( API_BASE_URL + '/nav' );
                }
            };
        } ] )
		.controller('NavController', ['NavService', function(NavService) {
			var vm = this;
			vm.links = null;
			vm.leagueClass = function($index){
				if($index === 0 ||
					vm.links.orderedLeagues[$index].leagueGame.gameIcon !== vm.links.orderedLeagues[$index-1].leagueGame.gameIcon) return "border-top";
				else return "";
			};
			NavService.get()
				.then(function(res){
					vm.links = res.data;
					$('.dropdown-button').dropdown({
						hover: true,
						belowOrigin: true,
						alignment: "left"
					});
				})
				.catch(function(){
					vm.links = null;
				});
		}]);
}());
