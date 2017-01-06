( function() {
    'use strict';
    angular.module( 'eventApp' )
        .factory( 'usersService', [ '$http', 'API_BASE_URL', function( $http, API_BASE_URL ) {
            return {
                find: function() {
                    return $http.get( API_BASE_URL + '/users' );
                },
                findById: function( id ) {
                    return $http.get( API_BASE_URL + '/users/' + id );
                },
                create: function( data ) {
                    return $http.post( API_BASE_URL + '/users', data );
                },
                update: function( id, data ) {
                    return $http.put( API_BASE_URL + '/users/' + id, data );
                },
                delete: function( id ) {
                    return $http.delete( API_BASE_URL + '/users/' + id );
                }
            }
        } ] );
}() );
