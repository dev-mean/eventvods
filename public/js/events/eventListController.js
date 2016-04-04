(function() {
    'use strict';
    angular.module('eventApp')
        .controller('eventListController', ['eventService',
            function(Events) {
                var vm = this;
                vm.ui = {
                    showFilters: false,
                    sortType: 'eventStartDate',
                    sortReverse: false,
                    search: '',
                    itemsPerPage: 10,
                    pages: 1,
                    page: 1
                };
                Events.find()
                    .then(function(response) {
                        vm.eventData = response.data;
                        vm.ui.listData = vm.paginate(response.data);
                    });
                vm.paginate = function(data) {
                    data = vm.filter(data);
                    data = vm.sort(data);
                    vm.ui.pages = Math.ceil(data.length / vm.ui.itemsPerPage);
                    if (data.length > vm.ui.itemsPerPage) {
                        var start = (vm.ui.page - 1) * vm.ui.itemsPerPage;
                        var end = start + vm.ui.itemsPerPage;
                        return data.slice(start, end);
                    } else return data;
                };
                vm.setSort = function(sortType) {
                    vm.ui.sortType = sortType;
                    vm.ui.sortReverse = !vm.ui.sortReverse;
                    vm.ui.listData = vm.paginate(vm.eventData);
                };
                vm.filter = function(data) {
                    if (vm.ui.search !== "") {
                        data = data.filter(function(item) {
                            return ~item.eventTitle.toLowerCase()
                                .indexOf(vm.ui.search.toLowerCase());
                        });
                    }
                    return data;
                };
                vm.sort = function(data) {
                    switch (vm.ui.sortType) {
                        case "eventStartDate":
                            return data.sort(function(a, b) {
                                a = new Date(a.eventStartDate);
                                b = new Date(b.eventStartDate);
                                if (a.getTime() === b.getTime()) return 0;
                                else if (vm.ui.sortReverse) return a > b ? 1 : -1;
                                else return a > b ? -1 : 1;
                            });
                        case "eventEndDate":
                            return data.sort(function(a, b) {
                                a = new Date(a.eventEndDate);
                                b = new Date(b.eventEndDate);
                                if (a.getTime() === b.getTime()) return 0;
                                else if (vm.ui.sortReverse) return a > b ? 1 : -1;
                                else return a > b ? -1 : 1;
                            });
                        case "eventTitle":
                            return data.sort(function(a, b) {
                                a = a.eventTitle;
                                b = b.eventTitle;
                                if (a == b) return 0;
                                else if (vm.ui.sortReverse) return a > b ? 1 : -1;
                                else return a > b ? -1 : 1;
                            });
                        case "eventGame":
                            return data.sort(function(a, b) {
                                a = a.eventGame;
                                b = b.eventGame;
                                if (a == b) return 0;
                                else if (vm.ui.sortReverse) return a > b ? 1 : -1;
                                else return a > b ? -1 : 1;
                            });
                        case "eventStatus":
                            return data.sort(function(a, b) {
                                a = a.eventStatus;
                                b = b.eventStatus;
                                if (a == b) return 0;
                                else if (vm.ui.sortReverse) return a > b ? 1 : -1;
                                else return a > b ? -1 : 1;
                            });
                        default:
                            return data;
                    }
                }
                vm.previousPage = function() {
                    vm.ui.page = vm.ui.page - 1;
                    vm.ui.listData = vm.paginate(vm.eventData);
                };
                vm.nextPage = function() {
                    vm.ui.page = vm.ui.page + 1;
                    vm.ui.listData = vm.paginate(vm.eventData);
                };
                vm.filterChange = function() {
                    vm.ui.listData = vm.paginate(vm.eventData);
                }
            }
        ]);
}());