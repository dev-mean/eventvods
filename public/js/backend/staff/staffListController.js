(function() {
    'use strict';
    angular.module('eventApp')
        .controller('staffListController', ['staffService', 'ngDialog', '$rootScope',
            function(Staff, dialog, $rootScope) {
                var vm = this;
                vm.loaded = false;
                vm.staffData = [];
                vm.filter = {};
                vm.sort = {
                    sortField: 'name',
                    sortReverse: false
                };
                vm.paging = {
                    itemsPerPage: 10,
                    pages: function() {
                        var pages = Math.ceil(vm.filterData.length / vm.paging.itemsPerPage);
                        if (vm.paging.page > pages && pages > 0) vm.paging.page = pages;
                        return pages;
                    },
                    page: 1
                };
                Staff.find()
                    .then(function(response) {
                        vm.loaded = true;
                        vm.staffData = response.data;
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
                        controller: ['$scope', '$location', 'staffService', 'notificationService', '$rootScope', function($scope, $location, Staff, toastr, $rootScope) {
                            $scope.delete = function() {
                                Staff.delete($scope.ngDialogData.staffID)
                                    .then(function() {
                                        toastr.success('Staff deleted.');
                                        $scope.closeThisDialog();
                                        $rootScope.$broadcast('staffUpdated');
                                    })
                            }
                        }],
                        data: {
                            staffID: id,
                        }
                    });
                    $rootScope.$on('staffUpdated', function() {
                        Staff.find()
                            .then(function(response) {
                                vm.staffData = response.data;
                            });
                    });
                }
            }
        ]);
}());
