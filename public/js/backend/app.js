(function() {
    'use strict';
    angular.module('eventApp', ['ngAnimate', 'ngResource', 'ngRoute', 'angular-loading-bar', 'ngDialog','angular-sortable-view'])
        .constant('eventConstants', {
            baseUri: '/api/'
        })
        .constant('API_BASE_URL', '/api')
        // Set up titles on ngroute pages
        .run(['$rootScope', '$route', function($rootScope, $route) {
            $rootScope.$on('$routeChangeSuccess', function() {
                document.title = "Eventvods - " + $route.current.title;
            });
        }])
        // Offset filter for paging lists
        .filter('offset', function() {
            return function(input, start) {
                start = parseInt(start, 10);
                return input.slice(start);
            };
        })
        .run(["$templateCache", function($templateCache) {
            $templateCache.put("confirmDeleteTemplate", "<center>\r\n    <p>\r\n        Are you sure you want to delete that?\r\n    </p><br />\r\n    <a class=\"btn lg solid icon warning\" ng-click=\"delete()\">\r\n        <i class=\"fa fa-trash\">\r\n        </i>\r\n        <span>\r\n            Confirm Delete\r\n        </span>\r\n    </a>\r\n    <a class=\"btn lg solid icon\" ng-click=\"closeThisDialog()\">\r\n        <i class=\"fa fa-undo\">\r\n        </i>\r\n        <span>\r\n            Cancel\r\n        </span>\r\n    </a></center>");
        }])
        // ng-typeahead adapted from
        // https://github.com/raymondmuller/ng-typeahead
        .filter("highlight", function($sce) {
            return function(item, search) {
                angular.forEach(item, function(input) {
                    var exp, highlightedInput, normalInput, words;
                    if (search) {
                        words = "(" + search.split(/\ /)
                            .join(" |") + "|" + search.split(/\ /)
                            .join("|") + ")";
                        exp = new RegExp(words, "gi");
                        normalInput = input.label.slice(search.length);
                        if (words.length) {
                            highlightedInput = input.label.slice(0, search.length)
                                .replace(exp, "<span class=\"ng-typeahead-highlight\">$1</span>");
                        }
                        return input.html = $sce.trustAsHtml(highlightedInput + normalInput);
                    }
                });
                return item;
            };
        })
        .filter("startsWith", function($log) {
            var strStartsWith;
            strStartsWith = function(suggestion, search) {
                if (!!suggestion && !!search) {
                    return suggestion.toLowerCase()
                        .indexOf(search.toLowerCase()) === 0;
                }
            };
            return function(suggestions, search, startFilter) {
                var filtered;
                if (startFilter) {
                    filtered = [];
                    angular.forEach(suggestions, function(suggestion) {
                        if (strStartsWith(suggestion.label, search)) {
                            return filtered.push(suggestion);
                        }
                    });
                    return filtered;
                } else {
                    return suggestions;
                }
            };
        })
        .directive('ngTypeahead', function($log, $timeout) {
            return {
                restrict: 'E',
                scope: {
                    data: '=',
                    delay: "=?",
                    forceSelection: "=?",
                    limit: '=?',
                    startFilter: "=?",
                    threshold: '=?',
                    onBlur: "=?",
                    onSelect: '=?',
                    onType: "=?"
                },
                require: "?ngModel",
                transclude: true,
                link: function(scope, elem, attrs, ngModel) {
                    var KEY, itemSelected, selectedLabel, selecting;
                    KEY = {
                        UP: 38,
                        DOWN: 40,
                        ENTER: 13,
                        TAB: 9,
                        ESC: 27
                    };
                    selectedLabel = scope.search;
                    selecting = void 0;
                    itemSelected = false;
                    scope.index = 0;
                    if (!scope.delay) {
                        scope.delay = 0;
                    }
                    scope.placeholder = attrs.placeholder;
                    scope.required = attrs.required ? true : false;
                    scope.container = (typeof attrs.container == "undefined") ? false : attrs.container;
                    scope.id = (typeof attrs.id == "undefined") ? "" : attrs.id;
					scope.group = (typeof attrs.group == "undefined") ? "" : attrs.group;
                    if (scope.startFilter === void 0) {
                        scope.startFilter = true;
                    }
                    if (scope.limit === void 0) {
                        scope.limit = Infinity;
                    }
                    if (scope.threshold === void 0) {
                        scope.threshold = 0;
                    }
                    if (scope.forceSelection === void 0) {
                        scope.forceSelection = false;
                    }
                    scope.$watch("search", function(v) {
                        scope.index = 0;
                        if(!scope.forceSelection) ngModel.$setViewValue(v);
                        if (v === selectedLabel) {
                            return;
                        }
                        itemSelected = false;
                        if (v !== void 0) {
                            if (scope.onType) {
                                scope.onType(scope.search);
                            }
                            return scope.showSuggestions = scope.suggestions.length && scope.search && scope.search.length > scope.threshold;
                        }
                    });
                    scope.$onBlur = function() {
                        if (!itemSelected && scope.forceSelection) {
                            scope.search = selectedLabel;
                        }
                        return scope.showSuggestions = false;
                    };
                    scope.$onSelect = function(item) {
                        selecting = true;
                        if(typeof item == undefined) return;
                        selectedLabel = item.label;
                        scope.search = item.label;
                        ngModel.$setViewValue(item.value);
                        itemSelected = true;
                        if (scope.onSelect) {
                            scope.onSelect(item);
                        }
                        scope.showSuggestions = false;
                        return $timeout(function() {
                            return selecting = false;
                        });
                    };
                    return scope.$onKeyDown = function(event) {
                        switch (event.keyCode) {
                            case KEY.UP:
                                if (scope.index > 0) {
                                    return scope.index--;
                                } else {
                                    return scope.index = scope.suggestions.length - 1;
                                }
                            case KEY.DOWN:
                                if (scope.index < (scope.suggestions.length - 1)) {
                                    return scope.index++;
                                } else {
                                    return scope.index = 0;
                                }
                            case KEY.ENTER:
                                return scope.$onSelect(scope.suggestions[scope.index]);
                            case KEY.TAB:
                                return scope.$onSelect(scope.suggestions[scope.index]);
                            case KEY.ESC:
                                return scope.showSuggestions = false;
                        }
                    };
                },
                template: "<input id=\"{{id}}\" ng-model=\"search\" placeholder=\"{{placeholder}}\" ng-keydown=\"$onKeyDown($event)\" ng-model-options=\"{ debounce: delay }\" ng-blur=\"$onBlur()\" class=\"ng-typeahead-input\" data-parsley-required=\"{{required}}\" data-parsley-errors-container=\"{{container}}\" data-parsley-group=\"{{group}}\" autocomplete=\"off\"/>\n<div class=\"ng-typeahead-wrapper\">\n  <ul class=\"ng-typeahead-list\" ng-show=\"showSuggestions\">\n    <li class=\"ng-typeahead-list-item\" ng-repeat=\"item in suggestions = (data | filter:search | startsWith:search:startFilter |limitTo: limit | highlight:search)\" ng-mousedown=\"$onSelect(item)\" ng-class=\"{'active': $index == index}\" ng-bind-html=\"item.html\"></li>\n    </ul>\n</div>\n<div ng-transclude>"
            };
        })
        // File upload handling adapted from
        // http://odetocode.com/blogs/scott/archive/2013/07/10/angularjs-drag-and-drop-photo-directive.aspx
        // and
        // http://webreflection.blogspot.co.uk/2010/12/100-client-side-image-resizing.html
        .factory('fileReader', ['$q', '$log', function($q, $log) {
            var onLoad = function(reader, deferred, scope) {
                return function() {
                    scope.$apply(function() {
                        deferred.resolve(reader.result);
                    });
                };
            };
            var onError = function(reader, deferred, scope) {
                return function() {
                    scope.$apply(function() {
                        deferred.reject(reader.result);
                    });
                };
            };
            var onProgress = function(reader, scope) {
                return function(event) {
                    scope.$broadcast("fileProgress", {
                        total: event.total,
                        loaded: event.loaded
                    });
                };
            };
            var getReader = function(deferred, scope) {
                var reader = new FileReader();
                reader.onload = onLoad(reader, deferred, scope);
                reader.onerror = onError(reader, deferred, scope);
                reader.onprogress = onProgress(reader, scope);
                return reader;
            };
            var readAsDataURL = function(file, scope) {
                var deferred = $q.defer();
                var reader = getReader(deferred, scope);
                reader.readAsDataURL(file);
                return deferred.promise;
            };
            return {
                readAsDataUrl: readAsDataURL
            };
        }])
        .directive("imageDrop", ['fileReader', function(fileReader) {
            return {
                restrict: "E",
                replace: true,
                template: "<div class='image-drop'><div class='image-container'><img class='preview' /></div><div class='controls-container'><p>Drag image, or click to select a file.</p><p><input type='file' /><a><i class='fa fa-file-image-o'></i><span>Select Image</span></a></p></div></div>",
                scope: {
                    model: "="
                },
                link: function($scope, $element, $attrs) {
                    $scope.dom = {
                        preview: $element.children('.image-container')
                            .children('.preview'),
                        input: $element.children('.controls-container')
                            .children('p')
                            .children('input'),
                        btn: $element.children('.controls-container')
                            .children('p')
                            .children('a')
                    };
                    var width = $attrs.previewWidth;
                    var height = $attrs.previewHeight;
                    $scope.dom.preview.css({
                        width: width + "px",
                        height: height + "px",
                    });
                    $scope.dom.preview.attr('src', ($scope.model || "http://placehold.it/" + width + "x" + height));
                    $scope.dom.btn.on('click', function(e) {
                        e.preventDefault();
                        $scope.dom.input.trigger('click');
                    })
                    $('body')
                        .on('dragover dragleave drop', function(e) {
                            e.preventDefault();
                        })
                    $element.on("dragover", function(e) {
                            e.preventDefault();
                            $element.addClass("dragOver");
                        })
                        .on("dragleave", function(e) {
                            e.preventDefault();
                            $element.removeClass("dragOver");
                        })
                        .on("drop", function(e) {
                            e.preventDefault();
                            var file = e.originalEvent.dataTransfer.files[0];
                            $element.removeClass("dragOver");
                            loadFile(file);
                        });
                    $scope.dom.input.on('change', function(e) {
                        var file = e.target.files[0];
                        loadFile(file);
                    });
                    $scope.$watch('model', function() {
                        if ($scope.model == null) return;
                        else if (typeof $scope.model === "string") $scope.dom.preview.attr('src', $scope.model);
                        else if (typeof $scope.model === "object" && $scope.model.changed) $scope.dom.preview.attr('src', $scope.model.data);
                    })
                    var loadFile = function(file) {
                        fileReader.readAsDataUrl(file, $scope)
                            .then(function(data) {
                                $scope.dom.preview.attr('src', data);
                                if (typeof $scope.model === "string") {
                                    var old = $scope.model;
                                    $scope.model = {
                                        oldURL: old,
                                        data: data,
                                        changed: true,
                                    }
                                } else if (typeof $scope.model === "undefined") {
                                    $scope.model = {
                                        data: data
                                    }
                                } else $scope.model.data = data;
                            })
                    };
                }
            };
        }])
        .config(function($routeProvider, $locationProvider) {
            $locationProvider.html5Mode(true);
            $routeProvider
            // route for the home page
                .when('/', {
                    templateUrl: '/assets/views/backend/dashboard.html',
                    controller: 'overviewController',
                    controllerAs: 'overviewController',
                    title: "Dashboard"
                })
                .when('/games', {
                    templateUrl: '/assets/views/backend/game/list.html',
                    controller: 'gamesListController',
                    controllerAs: 'gamesListController',
                    title: "Games"
                })
                .when('/games/new', {
                    templateUrl: '/assets/views/backend/game/form.html',
                    controller: 'addGameController',
                    controllerAs: 'gameFormController',
                    title: "Add Game"
                })
                .when('/game/:id/edit', {
                    templateUrl: '/assets/views/backend/game/form.html',
                    controller: 'editGameController',
                    controllerAs: 'gameFormController',
                    title: "Edit Game"
                })
                .when('/leagues', {
                    templateUrl: '/assets/views/backend/league/list.html',
                    controller: 'leaguesListController',
                    controllerAs: 'leaguesListController',
                    title: "Leagues"
                })
                .when('/leagues/new', {
                    templateUrl: '/assets/views/backend/league/form.html',
                    controller: 'addLeagueController',
                    controllerAs: 'leagueFormController',
                    title: "Add League"
                })
                .when('/league/:id/edit', {
                    templateUrl: '/assets/views/backend/league/form.html',
                    controller: 'editLeagueController',
                    controllerAs: 'leagueFormController',
                    title: "Edit League"
                })
                .when('/staff', {
                    templateUrl: '/assets/views/backend/staff/list.html',
                    controller: 'staffListController',
                    controllerAs: 'staffListController',
                    title: "Staff"
                })
                .when('/staff/new', {
                    templateUrl: '/assets/views/backend/staff/form.html',
                    controller: 'addStaffController',
                    controllerAs: 'staffFormController',
                    title: "New Staff"
                })
                .when('/staff/:id/edit', {
                    templateUrl: '/assets/views/backend/staff/form.html',
                    controller: 'editStaffController',
                    controllerAs: 'staffFormController',
                    title: "Edit Staff"
                })
                .when('/maps', {
                    templateUrl: '/assets/views/backend/maps/list.html',
                    controller: 'mapsListController',
                    controllerAs: 'mapsListController',
                    title: "Maps"
                })
                .when('/maps/new', {
                    templateUrl: '/assets/views/backend/maps/form.html',
                    controller: 'addMapController',
                    controllerAs: 'mapsFormController',
                    title: "New Maps"
                })
                .when('/maps/:id/edit', {
                    templateUrl: '/assets/views/backend/maps/form.html',
                    controller: 'editMapController',
                    controllerAs: 'mapsFormController',
                    title: "Edit Maps"
                })
                .when('/teams', {
                    templateUrl: '/assets/views/backend/teams/list.html',
                    controller: 'teamsListController',
                    controllerAs: 'teamsListController',
                    title: "Teams"
                })
                .when('/teams/new', {
                    templateUrl: '/assets/views/backend/teams/form.html',
                    controller: 'addTeamController',
                    controllerAs: 'teamsFormController',
                    title: "New Teams"
                })
                .when('/teams/:id/edit', {
                    templateUrl: '/assets/views/backend/teams/form.html',
                    controller: 'editTeamController',
                    controllerAs: 'teamsFormController',
                    title: "Edit Teams"
                })
				.when('/events', {
                    templateUrl: '/assets/views/backend/event/list.html',
                    controller: 'eventListController',
                    controllerAs: 'eventListController',
                    title: "Events"
                })
                .when('/events/new', {
                    templateUrl: '/assets/views/backend/event/form.html',
                    controller: 'newEventController',
                    controllerAs: 'newEventController',
                    title: "New Event"
                })
				.when('/featured', {
                    templateUrl: '/assets/views/backend/featured.html',
                    controller: 'featuredSelectController',
                    controllerAs: 'featuredSelectController',
                    title: "Featured Content"
                })
                .when('/events/new', {
                    templateUrl: '/assets/views/backend/event/form.html',
                    controller: 'newEventController',
                    controllerAs: 'newEventController',
                    title: "New Event"
                })
        })
}());
