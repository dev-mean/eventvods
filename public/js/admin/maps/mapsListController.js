(function() {
    'use strict';
    angular.module('eventApp')
        .controller('mapsListController', ['mapsService', 'ngDialog', '$rootScope',
            function(Maps, dialog, $rootScope) {
                var vm = this;
                vm.loaded = false;
                vm.mapsData = [];
                vm.filter = {};
                vm.sort = {
                    sortField: 'mapName',
                    sortReverse: false
                };
                vm.paging = {
                    itemsPerPage: 6,
                    pages: function() {
                        var pages = Math.ceil(vm.filterData.length / vm.paging.itemsPerPage);
                        if (vm.paging.page > pages && pages > 0) vm.paging.page = pages;
                        return pages;
                    },
                    page: 1
                };
                Maps.find()
                    .then(function(response) {
                        vm.loaded = true;
                        vm.mapsData = response.data;
                    });

                vm.setSort = function(sortField) {
                    vm.sort.sortField = sortField;
                    if (vm.sort.sortField == sortField) vm.sort.sortReverse = !vm.sort.sortReverse;
                };
                vm.previousPage = function() {
                    vm.paging.page--;
                };
                vm.nextPage = function() {
                    vm.paging.page++;
                };
                vm.delete = function(id, confirm) {
                    dialog.open({
                        template: 'confirmDeleteTemplate',
                        className: 'ngdialog-ev',
                        controller: ['$scope', '$location', 'mapsService', 'notificationService', '$rootScope', function($scope, $location, Maps, toastr, $rootScope) {
                            $scope.delete = function() {
                                Maps.delete($scope.ngDialogData.mapID)
                                    .then(function() {
                                        toastr.success('Map deleted.');
                                        $scope.closeThisDialog();
                                        $rootScope.$broadcast('mapUpdated');
                                    })
                            }
                        }],
                        data: {
                            mapID: id,
                        }
                    });
                    $rootScope.$on('mapUpdated', function() {
                        Maps.find()
                            .then(function(response) {
                                vm.mapsData = response.data;
                            });
                    });
                }
            }
        ]);
}());
