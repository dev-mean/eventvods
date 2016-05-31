( function() {
    'use strict';
    angular.module( 'eventApp' )
        .controller( 'addMapController', [ 'mapsService', '$location', 'notificationService', 'API_BASE_URL', 'gamesService',
            function( Maps, $location, toastr, API_BASE_URL, Games ) {
                var vm = this;
                vm.title = "Add Map";
                vm.errors = [];
                var parsley = $( '#addMapForm' )
                    .parsley();
                Games.find()
                    .then(function(response) {
                        vm.games = response.data.map(function(obj) {
                            return {
                                "label": obj.gameAlias + " - " + obj.gameName,
                                "value": obj._id
                            }
                        })
                    });
                vm.submit = function() {
                    if ( parsley.validate() ) Maps.create( vm.data )
                        .then( function( response ) {
                            toastr.success( 'Map added.', {
                                closeButton: true
                            } );
                            $location.path( '/maps' );
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