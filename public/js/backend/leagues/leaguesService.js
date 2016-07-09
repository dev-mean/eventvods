( function() {
    'use strict';
    angular.module( 'eventApp' )
        .factory( 'leaguesService', [ '$http', 'API_BASE_URL', function( $http, API_BASE_URL ) {
            return {
                find: function() {
                    return $http.get( API_BASE_URL + '/leagues' );
                },
                findById: function( id ) {
                    return $http.get( API_BASE_URL + '/leagues/' + id );
                },
                create: function( data ) {
                    return $http.post( API_BASE_URL + '/leagues', data );
                },
                update: function( id, data ) {
                    return $http.put( API_BASE_URL + '/leagues/' + id, data );
                },
                delete: function( id ) {
                    return $http.delete( API_BASE_URL + '/leagues/' + id );
                }
            }
        } ] );
}() );
