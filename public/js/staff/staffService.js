( function() {
    'use strict';
    angular.module( 'eventApp' )
        .factory( 'staffService', [ '$http', 'API_BASE_URL', function( $http, API_BASE_URL ) {
            return {
                getRoles: function(){
                    return $http.get( API_BASE_URL + '/data/staffRoles' );
                },
                find: function() {
                    return $http.get( API_BASE_URL + '/staff' );
                },
                findById: function( id ) {
                    return $http.get( API_BASE_URL + '/staff/' + id );
                },
                create: function( data ) {
                    return $http.post( API_BASE_URL + '/staff', data );
                },
                update: function( id, data ) {
                    return $http.put( API_BASE_URL + '/staff/' + id, data );
                },
                delete: function( id ) {
                    return $http.delete( API_BASE_URL + '/staff/' + id );
                }
            }
        } ] );
}() );