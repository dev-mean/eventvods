(function() {
    'use strict';
    angular.module('eventApp')
        .controller('gamesListController', ['gamesService', 'ngDialog', '$rootScope',
            function(Games, dialog, $rootScope) {
                var vm = this;
                vm.loaded = false;
                vm.gameData = [];
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
                Games.find()
                    .then(function(response) {
                        vm.loaded = true;
                        vm.gameData = response.data;
                    });
                vm.setSort = function(sortField) {
                    vm.sort.sortField = sortField;
                    vm.sort.sortReverse = !vm.sort.sortReverse;
                };
                vm.previousPage = function() {
                    if (vm.paging.page > 1) vm.paging.page--;
                };
                vm.nextPage = function() {
                    if (vm.paging.page < vm.paging.pages()) vm.paging.page++;
                };
                vm.delete = function(id, confirm) {
                    dialog.open({
                        template: 'confirmDeleteTemplate',
                        className: 'ngdialog-ev',
                        controller: ['$scope', 'gamesService', 'notifier', '$rootScope', function($scope, Games, notifier, $rootScope) {
                            $scope.delete = function() {
                                Games.delete($scope.ngDialogData.gameID)
                                    .then(function() {
                                        notifier.success('Game deleted.');
                                        $scope.closeThisDialog();
                                        $rootScope.$broadcast('gamesUpdated');
                                    })
                            }
                        }],
                        data: {
                            gameID: id,
                        }
                    });
                    $rootScope.$on('gamesUpdated', function() {
                        Games.find()
                            .then(function(response) {
                                vm.gameData = response.data;
                            });
                    });
                }
            }
        ]);
}());