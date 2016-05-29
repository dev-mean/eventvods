( function() {
    'use strict';
    angular.module( 'eventApp' )
        .controller( 'editStaffController', [ 'staffService', '$location', 'notificationService', '$routeParams', 'API_BASE_URL',
            function( Staff, $location, toastr, $routeParams, API_BASE_URL ) {
                var vm = this;
                vm.title = "Edit Staff";
                vm.errors = [];
                var parsley = $( '#addStaffForm' )
                            .parsley();
                Staff.findById( $routeParams.id )
                    .then( function( response ) {
                        vm.data = response.data;
                        $('#staffRole').val(response.data.staffRole);
                    }, function( response ) {
                        toastr.error( 'Invalid Staff ID.', {
                            closeButton: true
                        } );
                        $location.path( '/staff' );
                    } );
                vm.submit = function() {
                    if ( parsley.validate() ) Staff.update( $routeParams.id, vm.data )
                        .then( function( response ) {
                            toastr.success( 'Staff edited.', {
                                closeButton: true
                            } );
                            $location.path( '/staff' );
                        }, function( response ) {
                            if ( response.status == 500 ) vm.errors.push( {
                                message: 'Unexpected error. Please pass this on to the developers.'
                            } );
                            else vm.errors = response.data.errors;
                        } );
                }
            }
        ] );
}() );