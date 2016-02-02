(function() {
    angular.module('eventApp').controller('eventListController', ['eventService',
        function(eventService) {
            var controller = this;
            controller.ui = {
                showFilters: false,
                sortType: 'eventStartDate',
                sortReverse: false,
                search: '',
                itemsPerPage: 10,
                pages: 1,
                page: 1
            };
            eventService.getEvents().$promise.then(function(result) {
                var data = cleanResponse(result);
                controller.eventData = data;
                controller.listData = controller.paginate(data);
            });

            function cleanResponse(resp) {
                return JSON.parse(angular.toJson(resp));
            }
            controller.paginate = function(data) {
                data = controller.filter(data);
                data = controller.sort(data);
                controller.ui.pages = Math.ceil(data.length / controller.ui.itemsPerPage);
                if (data.length > controller.ui.itemsPerPage) {
                    var start = (controller.ui.page - 1) * controller.ui.itemsPerPage;
                    var end = start + controller.ui.itemsPerPage;
                    return data.slice(start, end);
                } else return data;
            };
            controller.setSort = function(sortType) {
                controller.ui.sortType = sortType;
                controller.ui.sortReverse = !controller.ui.sortReverse;
                controller.listData = controller.paginate(controller.eventData);
            };
            controller.filter = function(data) {
                if (controller.ui.search !== "") {
                    data = data.filter(function(item) {
                        return ~item.eventTitle.toLowerCase().indexOf(controller.ui.search.toLowerCase());
                    });
                }
                return data;
            };
            controller.sort = function(data) {
                switch (controller.ui.sortType) {
                    case "eventStartDate":
                    	console.log("sorting by eventstart");
                        return data.sort(function(a, b) {
                            a = new Date(a.eventStartDate);
                            b = new Date(b.eventStartDate);
                            if (a.getTime() === b.getTime()) return 0;
                            else if (controller.ui.sortReverse) return a > b ? 1 : -1;
                            else return a > b ? -1 : 1;
                        });
                    case "eventEndDate":
                        return data.sort(function(a, b) {
                            a = new Date(a.eventEndDate);
                            b = new Date(b.eventEndDate);
                            if (a.getTime() === b.getTime()) return 0;
                            else if (controller.ui.sortReverse) return a > b ? 1 : -1;
                            else return a > b ? -1 : 1;
                        });
                    case "eventTitle":
                        return data.sort(function(a, b) {
                            a = a.eventTitle;
                            b = b.eventTitle;
                            if (a == b) return 0;
                            else if (controller.ui.sortReverse) return a > b ? 1 : -1;
                            else return a > b ? -1 : 1;
                        });
                    case "eventGame":
                        return data.sort(function(a, b) {
                            a = a.eventGame;
                            b = b.eventGame;
                            if (a == b) return 0;
                            else if (controller.ui.sortReverse) return a > b ? 1 : -1;
                            else return a > b ? -1 : 1;
                        });
                    case "eventStatus":
                        return data.sort(function(a, b) {
                            a = a.eventStatus;
                            b = b.eventStatus;
                            if (a == b) return 0;
                            else if (controller.ui.sortReverse) return a > b ? 1 : -1;
                            else return a > b ? -1 : 1;
                        });
                    default:
                        return data;
                }
            }
            controller.previousPage = function() {
                controller.ui.page = controller.ui.page - 1;
                controller.listData = controller.paginate(controller.eventData);
            };
            controller.nextPage = function() {
                controller.ui.page = controller.ui.page + 1;
                controller.listData = controller.paginate(controller.eventData);
            };
            controller.filterChange = function() {
                controller.listData = controller.paginate(controller.eventData);
            }
        }
    ]);
}());