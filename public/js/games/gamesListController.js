(function() {
    'use strict';
    angular.module('eventApp')
        .controller('gamesListController', ['gamesService',
            function(Games) {
                var vm = this;
                vm.gameData = [];
                vm.filter = {};
                vm.sort = {
                    sortField: 'gameName',
                    sortReverse: false
                };
                vm.paging = {
                    itemsPerPage: 10,
                    pages: function() {
                        var pages = Math.ceil(vm.filterData.length / vm.paging.itemsPerPage);
                        if(vm.paging.page > pages && pages > 0) vm.paging.page = pages;
                        return pages;
                    },
                    page: 1
                };
                Games.find()
                    .then(function(response) {
                        vm.gameData = response.data;
                    });
                vm.setSort = function(sortField) {
                    vm.sort.sortField = sortField;
                    if(vm.sort.sortField == sortField) vm.sort.sortReverse = !vm.sort.sortReverse;
                };
                vm.previousPage = function() {
                   vm.paging.page--;
                };
                vm.nextPage = function() {
                    vm.paging.page++;
                };
            }
        ]);
}());