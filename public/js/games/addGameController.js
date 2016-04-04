( function() {
    'use strict';
    angular.module( 'eventApp' )
        .controller( 'addGameController', [ 'gamesService', '$location', 'notificationService', '$window',
            function( Games, $location, toastr, $window ) {
                $window.parsley
                var vm = this;
                vm.errors = [];
                vm.parsley = $( '#addGameForm' )
                    .parsley();
                vm.submit = function() {
                    if ( vm.parsley.validate() ) Games.create( vm.data )
                        .then( function( response ) {
                            toastr.success( 'Game added.' );
                            $location.path( '/games' );
                        }, function( response ) {
                            if ( response.status == 500 ) vm.errors.push( {
                                message: 'Game alias must be unique, and a game already exists with that alias.'
                            } );
                            else vm.errors = response.errors;
                        } );
                }
            }
        ] );
}() );