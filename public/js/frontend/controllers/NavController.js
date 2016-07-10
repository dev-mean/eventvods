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
				console.log($index);
				return (
					$index !== 0 &&
					vm.links.leagues[$index-1].leagueGame.gameIcon === vm.links.leagues[$index].leagueGame.gameIcon
					) ? "" : "border-top";
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
