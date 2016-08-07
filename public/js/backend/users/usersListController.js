( function() {
    'use strict';
    angular.module( 'eventApp' )
        .controller( 'usersListController', [ 'usersService', 'ngDialog', '$rootScope',
            function( Users, dialog, $rootScope ) {
                var vm = this;
                vm.loaded = false;
                vm.userData = [];
                vm.filter = {};
                vm.sort = {
                    sortField: 'userRights',
                    sortReverse: true
                };
                vm.paging = {
                    itemsPerPage: 10,
                    pages: function() {
                        var pages = Math.ceil( vm.filterData.length / vm.paging.itemsPerPage );
                        if ( vm.paging.page > pages && pages > 0 ) vm.paging.page = pages;
                        return pages;
                    },
                    page: 1
                };
                Users.find()
                    .then( function( response ) {
                        vm.loaded = true;
                        vm.userData = response.data;
                    } );
                vm.setSort = function( sortField ) {
                    vm.sort.sortField = sortField;
                    vm.sort.sortReverse = !vm.sort.sortReverse;
                };
                vm.previousPage = function() {
                    vm.paging.page--;
                };
                vm.nextPage = function() {
                    vm.paging.page++;
                };
                vm.delete = function( id, confirm ) {
                    dialog.open( {
                        template: 'confirmDeleteTemplate',
                        className: 'ngdialog-ev',
                        controller: [ '$scope', '$location', 'usersService', 'notificationService', '$rootScope', function( $scope, $location, Users, toastr, $rootScope ) {
                            $scope.delete = function() {
                                Users.delete( $scope.ngDialogData.userID )
                                    .then( function() {
                                        toastr.success( 'User deleted.' );
                                        $scope.closeThisDialog();
                                        $rootScope.$broadcast('usersUpdated');
                                    } )
                            }
                        } ],
                        data: {
                            userID: id,
                        }
                    } );
                    $rootScope.$on( 'usersUpdated', function() {
                        Users.find()
                            .then( function( response ) {
                                vm.userData = response.data;
                            } );
                    } );
                }
            }
        ] );
}() );
