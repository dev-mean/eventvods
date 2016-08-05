(function() {
    'use strict';
    angular.module('eventApp')
        .controller('articlesListController', ['articlesService', 'ngDialog', '$rootScope',
            function(Articles, dialog, $rootScope) {
                var vm = this;
                vm.loaded = false;
                vm.articlesData = [];
                vm.filter = {};
                vm.sort = {
                    sortField: 'title',
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
                Articles.find()
                    .then(function(response) {
                        vm.loaded = true;
                        vm.articlesData = response.data;
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
                        controller: ['$scope', '$location', 'articlesService', 'notificationService', '$rootScope', function($scope, $location, Articles, toastr, $rootScope) {
                            $scope.delete = function() {
                                Articles.delete($scope.ngDialogData.articleID)
                                    .then(function() {
                                        toastr.success('Article deleted.');
                                        $scope.closeThisDialog();
                                        $rootScope.$broadcast('articlesUpdated');
                                    })
                            }
                        }],
                        data: {
                            articleID: id,
                        }
                    });
                    $rootScope.$on('articlesUpdated', function() {
                        Articles.find()
                            .then(function(response) {
                                vm.teamsData = response.data;
                            });
                    });
                }
            }
        ]);
}());
