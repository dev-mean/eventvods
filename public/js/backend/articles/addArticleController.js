( function() {
    'use strict';
    angular.module( 'eventApp' )
        .controller( 'addArticleController', [ 'articlesService', '$location', 'notificationService', 'API_BASE_URL',
            function( Articles, $location, toastr, API_BASE_URL ) {
                var vm = this;
                vm.title = "Add Article";
                vm.errors = [];
				vm.tab = 1;
				vm.data = {};
				var publishDate = new Pikaday({
					field: $('#publishDate')[0],
					format: "dddd Do MMMM, YYYY",
					onClose: function(){
						setTimeout(function(){
							$('#publishDate').focus();
						}, 0);
					}
				});
				$('#slug').attr('data-parsley-remote', API_BASE_URL + '/validate/articleSlug/{value}');
                var parsley = $( '#addArticleForm' )
                    .parsley();
                vm.submit = function() {
					vm.data.publishDate = publishDate.getDate();
                    if ( parsley.validate() ) Articles.create( vm.data )
                        .then( function( response ) {
                            toastr.success( 'Article added.', {
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
