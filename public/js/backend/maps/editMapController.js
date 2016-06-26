( function() {
    'use strict';
    angular.module( 'eventApp' )
        .controller( 'editMapController', [ 'mapsService', '$location', 'notificationService', '$routeParams', 'API_BASE_URL', 'gamesService',
            function( Maps, $location, toastr, $routeParams, API_BASE_URL, Games ) {
                var vm = this;
                vm.title = "Edit Map";
                vm.errors = [];
                var parsley = $( '#addMapForm' )
                            .parsley();
                Maps.findById( $routeParams.id )
                    .then( function( response ) {
                        vm.data = response.data;
                        $('#mapGame').val(response.data.mapGame.gameAlias + " - " + response.data.mapGame.gameName);
                    }, function( response ) {
                        toastr.error( 'Invalid Map ID.', {
                            closeButton: true
                        } );
                        $location.path( '/maps' );
                    } );
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
                    if ( parsley.validate() ) Maps.update( $routeParams.id, vm.data )
                        .then( function( response ) {
                            toastr.success( 'Map edited.', {
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
