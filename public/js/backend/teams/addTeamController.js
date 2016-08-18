( function() {
    'use strict';
    angular.module( 'eventApp' )
        .controller( 'addTeamController', [ 'teamsService', '$location', 'notificationService', 'API_BASE_URL', 'gamesService',
            function( Teams, $location, toastr, API_BASE_URL, Games ) {
                var vm = this, mappedGames;
                vm.title = "Add Team";
                vm.errors = [];
				vm.tab = 1;
				vm.data = {
					media: []
				}
				vm.gameName = "";
				$('#slug').attr('data-parsley-remote', API_BASE_URL + '/validate/teamSlug/{value}');
                var parsley = $( '#addTeamForm' )
                    .parsley();
				Games.find()
					.then(function(res){
						vm.games = res.data;
						mappedGames = res.data.reduce(function(result, item){
							result[item._id] = item;
							return result;
						}, {});
					});
				vm.setGameName = function(){
					if(typeof vm.data.game === "undefined") return "";
					else vm.gameName="/" + mappedGames[vm.data.game].slug;
				}
                vm.submit = function() {
                    if ( parsley.validate() ) Teams.create( vm.data )
                        .then( function( response ) {
                            toastr.success( 'Team added.', {
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
