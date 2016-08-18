( function() {
    'use strict';
    angular.module( 'eventApp' )
        .controller( 'editTeamController', [ 'teamsService', '$location', 'notificationService', '$routeParams', 'API_BASE_URL', 'gamesService',
            function( Teams, $location, toastr, $routeParams, API_BASE_URL, Games ) {
                var vm = this, mappedGames;
                vm.title = "Edit Team";
                vm.errors = [];
				vm.tab = 1;
				$( '#slug' ).attr( 'data-parsley-remote', API_BASE_URL + '/validate/teamSlug/{value}/'  + $routeParams.id );
                var parsley = $( '#addTeamForm' )
                            .parsley();
                Teams.findById( $routeParams.id )
                    .then( function( response ) {
                        vm.data = response.data;
						vm.data.game = vm.data.game._id;
						vm.setGameName();
                    }, function( response ) {
                        toastr.error( 'Invalid Team ID.', {
                            closeButton: true
                        } );
                        $location.path( '/teams' );
                    } );
				Games.find()
					.then(function(res){
						vm.games = res.data;
						mappedGames = res.data.reduce(function(result, item){
							result[item._id] = item;
							return result;
						}, {});
						vm.setGameName();
					});
				vm.setGameName = function(){
					if(typeof vm.data.game === "undefined" || typeof mappedGames === "undefined") return "";
					else vm.gameName="/" + mappedGames[vm.data.game].slug;
				}
                vm.submit = function() {
                    if ( parsley.validate() ) Teams.update( $routeParams.id, vm.data )
                        .then( function( response ) {
                            toastr.success( 'Team edited.', {
                                closeButton: true
                            } );
                            $location.path( '/teams' );
                        }, function( response ) {
                            if ( response.status == 500 ) vm.errors.push( {
                                message: 'Unexpected error. Please pass this on to the developers.'
                            } );
                            else vm.errors = response.data.errors;
                        } );
					else vm.tab = 1;
                }
            }
        ] );
}() );
