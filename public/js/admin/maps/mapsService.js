( function() {
    'use strict';
    angular.module( 'eventApp' )
        .factory( 'mapsService', [ '$http', 'API_BASE_URL', function( $http, API_BASE_URL ) {
            return {
                find: function() {
                    return $http.get( API_BASE_URL + '/maps' );
                },
                findById: function( id ) {
                    return $http.get( API_BASE_URL + '/maps/' + id );
                },
                create: function( data ) {
                    return $http.post( API_BASE_URL + '/maps', data );
                },
                update: function( id, data ) {
                    return $http.put( API_BASE_URL + '/maps/' + id, data );
                },
                delete: function( id ) {
                    return $http.delete( API_BASE_URL + '/maps/' + id );
                }
            }
        } ] );
}() );
