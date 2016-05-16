( function() {
    'use strict';
    angular.module( 'eventApp' )
        .controller( 'addGameController', [ 'gamesService', '$location', 'notificationService', 'API_BASE_URL',
            function( Games, $location, toastr, API_BASE_URL ) {
                var vm = this;
                vm.title = "Add Game";
                vm.errors = [];
                $( 'input.force-caps' )
                    .attr( 'data-parsley-remote', API_BASE_URL + '/validate/gameAlias/{value}' )
                vm.parsley = $( '#addGameForm' )
                    .parsley();
                vm.submit = function() {
                    if ( vm.parsley.validate() ) Games.create( vm.data )
                        .then( function( response ) {
                            toastr.success( 'Game added.', {
                                closeButton: true
                            } );
                            $location.path( '/games' );
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