( function() {
    'use strict';
    angular.module( 'eventApp' )
        .controller( 'editArticleController', [ 'articlesService', '$location', 'notificationService', '$routeParams', 'API_BASE_URL',
            function( Articles, $location, toastr, $routeParams, API_BASE_URL ) {
                var vm = this;
                vm.title = "Edit Article";
                vm.errors = [];
				vm.tab = 1;
				$( '#slug' ).attr( 'data-parsley-remote', API_BASE_URL + '/validate/articleSlug/{value}/'  + $routeParams.id );
                var parsley = $( '#addArticleForm' )
                            .parsley();
                Articles.findById( $routeParams.id )
                    .then( function( response ) {
                        vm.data = response.data;
                    }, function( response ) {
                        toastr.error( 'Invalid Article ID.', {
                            closeButton: true
                        } );
                        $location.path( '/articles' );
                    } );
                vm.submit = function() {
                    if ( parsley.validate() ) Articles.update( $routeParams.id, vm.data )
                        .then( function( response ) {
                            toastr.success( 'Article edited.', {
                                closeButton: true
                            } );
                            $location.path( '/articles' );
                        }, function( response ) {
                            if ( response.status == 500 ) vm.errors.push( {
                                message: 'Unexpected error. Please pass this on to the developers.'
                            } );
                            else vm.errors = response.data.errors;
                        } );
					else vm.tab = 1;
                }
            }
        ] );
}() );
