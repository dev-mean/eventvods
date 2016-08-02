( function() {
    'use strict';
    angular.module( 'eventApp' )
        .controller( 'addStaffController', [ 'staffService', '$location', 'notificationService', 'API_BASE_URL',
            function( Staff, $location, toastr, API_BASE_URL ) {
                var vm = this;
                vm.title = "Add Staff";
                vm.errors = [];
				vm.data = {
					media: []
				};
				vm.tab = 1;
				$('#slug').attr('data-parsley-remote', API_BASE_URL + '/validate/staffSlug/{value}');
                var parsley = $( '#addStaffForm' )
                    .parsley();
                Staff.getRoles()
                    .then(function(res){
                        vm.staffRoles = res.data.map(function(item){
                            return {
                                label: item,
                                value: item
                            };
                        });
                    });
                vm.submit = function() {
                    if ( parsley.validate() ) Staff.create( vm.data )
                        .then( function( response ) {
                            toastr.success( 'Staff added.', {
                                closeButton: true
                            } );
                            $location.path( '/staff' );
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
