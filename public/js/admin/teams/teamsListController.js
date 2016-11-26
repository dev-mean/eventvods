(function() {
    'use strict';
    angular.module('eventApp')
        .controller('teamsListController', ['teamsService', 'ngDialog', '$rootScope',
            function(Teams, dialog, $rootScope) {
                var vm = this;
                vm.loaded = false;
                vm.teamsData = [];
                vm.filter = {};
                vm.sort = {
                    sortField: 'tag',
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
                Teams.find()
                    .then(function(response) {
                        vm.loaded = true;
                        vm.teamsData = response.data;
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
                        controller: ['$scope', '$location', 'teamsService', 'notificationService', '$rootScope', function($scope, $location, Teams, toastr, $rootScope) {
                            $scope.delete = function() {
                                Teams.delete($scope.ngDialogData.teamID)
                                    .then(function() {
                                        toastr.success('Team deleted.');
                                        $scope.closeThisDialog();
                                        $rootScope.$broadcast('teamUpdated');
                                    })
                            }
                        }],
                        data: {
                            teamID: id,
                        }
                    });
                    $rootScope.$on('teamUpdated', function() {
                        Teams.find()
                            .then(function(response) {
                                vm.teamsData = response.data;
                            });
                    });
                }
            }
        ]);
}());
