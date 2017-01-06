( function() {
    'use strict';
    angular.module( 'eventApp' )
        .controller( 'editUserController', [ 'usersService', '$location', 'notificationService', '$routeParams', 'API_BASE_URL',
            function( Users, $location, toastr, $routeParams, API_BASE_URL ) {
                var vm = this;
                vm.title = "Edit User";
                vm.errors = [];
				vm.roleOptions = [
					{rights: 1, title: "Registered User"},
					{rights: 2, title: "Writer"},
					{rights: 3, title: "Updater"},
					{rights: 4, title: "Administrator"},
					{rights: 5, title: "Developer"},
				];
                Users.findById( $routeParams.id )
                    .then( function( response ) {
                        vm.data = response.data;
                         $( '#name' )
                    		.attr( 'data-parsley-remote', API_BASE_URL + '/validate/displayName/{value}/'  + $routeParams.id );
						$( '#email' )
                    		.attr( 'data-parsley-remote', API_BASE_URL + '/validate/email/{value}/'  + $routeParams.id );
                        vm.parsley = $( '#addUserForm' )
                            .parsley();
                    }, function( response ) {
                        toastr.error( 'Invalid User ID.', {
                            closeButton: true
                        } );
                        $location.path( '/users' );
                    } );
                vm.submit = function() {
                    if ( vm.parsley.validate() ) Users.update( $routeParams.id, vm.data )
                        .then( function( response ) {
                            toastr.success( 'User edited.', {
                                closeButton: true
                            } );
                            $location.path( '/users' );
                        }, function( response ) {
                            if ( response.status == 500 ) vm.errors.push( {
                                message: 'Unexpected error. Please pass this on to the developers.'
                            } );
                            else vm.errors = response.data.errors;
                        } );
                };
            }
        ] );
}() );
