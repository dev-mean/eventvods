angular.module('eventControllers', ['eventService'])
    .controller('eventList', function($scope, $http, Events) {
        // ================

        $scope.loaded = false;
        $scope.listView = true;
        $scope.showFilters = false;
        $scope.sort = {
            'field': 'date',
            'dir': 'asc'
        };
        $scope.filters = [];
        $scope.search = "";

        // ================

        $scope.itemsPerPage = 10;
        $scope.eventData = [];
        $scope.listData = [];
        $scope.pages = 1;
        $scope.page = 1;
        $scope.filteredData = [];
        $scope.sortedData = [];

        //fill events with event data
        Events.get()
            .success(function(data) {
                $scope.eventData = data;
                $scope.processList();
            });

        $scope.$watch('search', function(newVal, oldVal) {
            if (newVal === oldVal) return;
            else $scope.processList();
        });

        $scope.sorted = function(field, dir) {
            return ($scope.sort.field == field && $scope.sort.dir == dir);
        };

        $scope.setSort = function(field) {
            if ($scope.sort.field == field)
                $scope.sort.dir = ($scope.sort.dir == 'desc') ? 'asc' : 'desc';
            else {
                $scope.sort.field = field;
                $scope.sort.dir = 'asc';
            }
            $scope.processList();
        };

        $scope.processList = function() {
            $scope.filteredData = $scope.filter($scope.eventData);
            $scope.sortedData = $scope.sort($scope.filteredData);
            $scope.listData = $scope.paginate($scope.sortedData);
        };

        $scope.filter = function(data) {
            if (typeof data == "undefined" || data === null) return null;
            //no filters as of now.
            if ($scope.search !== "")
                data = data.filter(function(item) {
                    return ~item.eventTitle.toLowerCase().indexOf($scope.search.toLowerCase());
                });
            return data;
        };
        $scope.sort = function(data) {
            if (typeof data == "undefined" || data === null) return null;
            switch ($scope.sort.field) {
                case "date":
                    return data.sort(function(a, b) {
                        a = new Date(a.eventStartDate);
                        b = new Date(b.eventStartDate);
                        if (a.getTime() === b.getTime()) return 0;
                        else if ($scope.sort.dir == 'desc') return a > b ? 1 : -1;
                        else return a > b ? -1 : 1;
                    });
                case "title":
                    return data.sort(function(a, b) {
                        a = a.eventTitle;
                        b = b.eventTitle;
                        if (a == b) return 0;
                        else if ($scope.sort.dir == 'desc') return a > b ? 1 : -1;
                        else return a > b ? -1 : 1;
                    });
                case "game":
                    return data.sort(function(a, b) {
                        a = a.eventGame;
                        b = b.eventGame;
                        if (a == b) return 0;
                        else if ($scope.sort.dir == 'desc') return a > b ? 1 : -1;
                        else return a > b ? -1 : 1;
                    });
                case "user":
                    return data.sort(function(a, b) {
                        a = a.eventUser.username;
                        b = b.eventUser.username;
                        if (a == b) return 0;
                        else if ($scope.sort.dir == 'desc') return a > b ? 1 : -1;
                        else return a > b ? -1 : 1;
                    });
                case "status":
                    return data.sort(function(a, b) {
                        a = a.eventStatus;
                        b = b.eventStatus;
                        if (a == b) return 0;
                        else if ($scope.sort.dir == 'desc') return a > b ? 1 : -1;
                        else return a > b ? -1 : 1;
                    });
                default:
                    return data;
            }
        };
        $scope.paginate = function(data) {
            if (typeof data == "undefined" || data === null) return null;
            if (data.length > $scope.itemsPerPage)
                return data.slice(($scope.page - 1) * $scope.itemsPerPage, $scope.itemsPerPage);
            else return data;
        };
    })
    .controller('eventView', function($http, Events) {
        //Use ng-init to pass initial data? Messy but fast and user-friendly
    })
    .controller('eventForm', function($http, Events) {
        var vm = this;

        $scope.stage = 1;
        $scope.errors = [];

        $scope.validate = function(stage) {
            switch (stage) {
                case 1:
                    $scope.stage = 2;
                    break;
                case 2:
                    $scope.stage = 3;
                    break;
                case 3:
                    $scope.stage = 1;
                    break;
            }
        };
        $scope.test = function() {
            console.dir(vm);
        };
        $scope.createEvent = function() {
            //TODO: Validation
            Events.create($scope.eventData)
                .success(function(data) {
                    $location.path('/events');
                });
        };
    });