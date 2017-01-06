( function() {
    'use strict';
    angular.module( 'eventApp' )
        .factory( 'articlesService', [ '$http', 'API_BASE_URL', function( $http, API_BASE_URL ) {
            return {
                find: function() {
                    return $http.get( API_BASE_URL + '/articles' );
                },
                findById: function( id ) {
                    return $http.get( API_BASE_URL + '/articles/' + id );
                },
                create: function( data ) {
                    return $http.post( API_BASE_URL + '/articles', data );
                },
                update: function( id, data ) {
                    return $http.put( API_BASE_URL + '/articles/' + id, data );
                },
                delete: function( id ) {
                    return $http.delete( API_BASE_URL + '/articles/' + id );
                }
            }
        } ] );
}() );
