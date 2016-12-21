( function() {
    'use strict';
    angular.module( 'eventApp' )
        .controller( 'leaguesListController', [ 'leaguesService', 'ngDialog', '$rootScope',
            function( Leagues, dialog, $rootScope ) {
                var vm = this;
                vm.loaded = false;
                vm.leagueData = [];
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
                Leagues.find()
                    .then( function( response ) {
                        vm.loaded = true;
                        vm.leagueData = response.data;
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
                        controller: [ '$scope', '$location', 'leaguesService', 'notificationService', '$rootScope', function( $scope, $location, Leagues, toastr, $rootScope ) {
                            $scope.delete = function() {
                                Leagues.delete( $scope.ngDialogData.leagueID )
                                    .then( function() {
                                        toastr.success( 'League deleted.' );
                                        $scope.closeThisDialog();
                                        $rootScope.$broadcast('leaguesUpdated');
                                    } )
                            }
                        } ],
                        data: {
                            leagueID: id,
                        }
                    } );
                    $rootScope.$on( 'leaguesUpdated', function() {
                        Leagues.find()
                            .then( function( response ) {
                                vm.leagueData = response.data;
                            } );
                    } );
                }
            }
        ] );
}() );
