( function() {
    'use strict';
    angular.module( 'eventApp' )
        .factory( 'tournamentsService', [ '$http', 'API_BASE_URL', function( $http, API_BASE_URL ) {
            return {
                find: function() {
                    return $http.get( API_BASE_URL + '/tournaments' );
                },
                findById: function( id ) {
                    return $http.get( API_BASE_URL + '/tournaments/' + id );
                },
                create: function( data ) {
                    return $http.post( API_BASE_URL + '/tournaments', data );
                },
                update: function( id, data ) {
                    return $http.put( API_BASE_URL + '/tournaments/' + id, data );
                },
                delete: function( id ) {
                    return $http.delete( API_BASE_URL + '/tournaments/' + id );
                }
            }
        } ] );
}() );
