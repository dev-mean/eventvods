( function() {
    'use strict';
    angular.module( 'eventApp' )
        .controller( 'editTeamController', [ 'teamsService', '$location', 'notificationService', '$routeParams', 'API_BASE_URL',
            function( Teams, $location, toastr, $routeParams, API_BASE_URL ) {
                var vm = this;
                vm.title = "Edit Team";
                vm.errors = [];
                var parsley = $( '#addTeamForm' )
                            .parsley();
                Teams.findById( $routeParams.id )
                    .then( function( response ) {
                        vm.data = response.data;
                    }, function( response ) {
                        toastr.error( 'Invalid Team ID.', {
                            closeButton: true
                        } );
                        $location.path( '/teams' );
                    } );
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
                }
            }
        ] );
}() );
