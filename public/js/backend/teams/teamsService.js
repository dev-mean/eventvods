( function() {
    'use strict';
    angular.module( 'eventApp' )
        .factory( 'teamsService', [ '$http', 'API_BASE_URL', function( $http, API_BASE_URL ) {
            return {
                find: function() {
                    return $http.get( API_BASE_URL + '/teams' );
                },
                findById: function( id ) {
                    return $http.get( API_BASE_URL + '/teams/' + id );
                },
                create: function( data ) {
                    return $http.post( API_BASE_URL + '/teams', data );
                },
                update: function( id, data ) {
                    return $http.put( API_BASE_URL + '/teams/' + id, data );
                },
                delete: function( id ) {
                    return $http.delete( API_BASE_URL + '/teams/' + id );
                }
            }
        } ] );
}() );
