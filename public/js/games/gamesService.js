( function() {
    'use strict';
    angular.module( 'eventApp' )
        .factory( 'gamesService', [ '$http', 'API_BASE_URL', function( $http, API_BASE_URL ) {
            return {
                find: function() {
                    return $http.get( API_BASE_URL + '/games' );
                },
                findById: function( id ) {
                    return $http.get( API_BASE_URL + '/game/' + id );
                },
                create: function( data ) {
                    return $http.post( API_BASE_URL + '/games', data );
                },
                update: function( id, data ) {
                    return $http.put( API_BASE_URL + '/game/' + id, data );
                },
                delete: function( id ) {
                    return $http.delete( API_BASE_URL + '/game/' + id );
                }
            }
        } ] );
}() );