( function() {
    'use strict';
    angular.module( 'eventApp' )
        .controller( 'addTeamController', [ 'teamsService', '$location', 'notificationService', 'API_BASE_URL',
            function( Teams, $location, toastr, API_BASE_URL ) {
                var vm = this;
                vm.title = "Add Team";
                vm.errors = [];
                var parsley = $( '#addTeamForm' )
                    .parsley();
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
                }
            }
        ] );
}() );