( function() {
    'use strict';
    angular.module( 'eventApp' )
        .controller( 'tournamentsListController', [ 'tournamentsService', 'ngDialog', '$rootScope',
            function( Tournaments, dialog, $rootScope ) {
                var vm = this;
                vm.loaded = false;
                vm.tournamentData = [];
                vm.filter = {};
                vm.sort = {
                    sortField: 'name',
                    sortReverse: false
                };
                vm.paging = {
                    itemsPerPage: 6,
                    pages: function() {
                        var pages = Math.ceil( vm.filterData.length / vm.paging.itemsPerPage );
                        if ( vm.paging.page > pages && pages > 0 ) vm.paging.page = pages;
                        return pages;
                    },
                    page: 1
                };
                Tournaments.find()
                    .then( function( response ) {
                        vm.loaded = true;
                        vm.tournamentData = response.data;
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
                        controller: [ '$scope', '$location', 'tournamentsService', 'notificationService', '$rootScope', function( $scope, $location, Tournaments, toastr, $rootScope ) {
                            $scope.delete = function() {
                                Tournaments.delete( $scope.ngDialogData.tournamentID )
                                    .then( function() {
                                        toastr.success( 'Tournament deleted.' );
                                        $scope.closeThisDialog();
                                        $rootScope.$broadcast('tournamentsUpdated');
                                    } )
                            }
                        } ],
                        data: {
                            tournamentID: id,
                        }
                    } );
                    $rootScope.$on( 'tournamentsUpdated', function() {
                        Tournaments.find()
                            .then( function( response ) {
                                vm.tournamentData = response.data;
                            } );
                    } );
                }
            }
        ] );
}() );
