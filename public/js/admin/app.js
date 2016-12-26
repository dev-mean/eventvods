(function () {
	'use strict';
	angular.module('eventApp', ['ngAnimate', 'ngRoute', 'ngCookies', 'chart.js', 'ui.bootstrap', 'ngSanitize',
		 'textAngular', 'angular-loading-bar', 'ngDialog', 'angular-sortable-view', 'xeditable', 'ngTagsInput','angularCSS'])
		.constant('API_BASE_URL', '/api')
		// Set up titles on ngroute pages
		.run(['$rootScope', '$route', function ($rootScope, $route) {
			$rootScope.$on('$routeChangeSuccess', function () {
				if (typeof $route.current.title !== "undefined") document.title = "Eventvods - " + $route.current.title;
			});
		}])
		.run(function(editableOptions, editableThemes) {
			editableThemes.bs3.inputClass = 'input-sm';
			editableThemes.bs3.buttonsClass = 'btn-sm';
			editableOptions.theme = 'bs3';
		})
		// Offset filter for paging lists
		.filter('offset', function () {
			return function (input, start) {
				start = parseInt(start, 10);
				return input.slice(start);
			};
		})
		.directive("noNgAnimate", function ($animate) {
			return function (scope, element) {
				$animate.enabled(element, false);
			};
		})
		.run(["$templateCache", function ($templateCache) {
			$templateCache.put('deleteModal.html', '<div class="modal-header">\n' +
				'    <h3 class="modal-title" id="modal-title">Confirmation</h3>\n' +
				'</div>\n' +
				'<div class="modal-body" id="modal-body">\n' +
				'    <p>Are you sure you want to delete {{item}}?</p>\n' +
				'</div>\n' +
				'<div class="modal-footer">\n' +
				'    <button class="btn btn-danger" type="button" ng-click="ok()">Delete {{type}}</button>\n' +
				'    <button class="btn btn-default" type="button" ng-click="$close()">Cancel</button>\n' +
				'</div>');
		}])
		// $http interceptor to convert Date strings into js Date objects.
		.config(['$httpProvider', function ($httpProvider) {

			// ISO 8601 Date Pattern: YYYY-mm-ddThh:MM:ss
			var dateMatchPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

			var convertDates = function (obj) {
				for (var key in obj) {
					if (!obj.hasOwnProperty(key)) continue;

					var value = obj[key];
					var typeofValue = typeof (value);

					if (typeofValue === 'object') {
						// If it is an object, check within the object for dates.
						convertDates(value);
					} else if (typeofValue === 'string') {
						if (dateMatchPattern.test(value)) {
							obj[key] = new Date(value);
						}
					}
				}
			}

			$httpProvider.defaults.transformResponse.push(function (data) {
				if (typeof (data) === 'object') {
					convertDates(data);
				}
				return data;
			});
		}])
		// File upload handling adapted from
		// http://odetocode.com/blogs/scott/archive/2013/07/10/angularjs-drag-and-drop-photo-directive.aspx
		// and
		// http://webreflection.blogspot.co.uk/2010/12/100-client-side-image-resizing.html
		.factory('fileReader', ['$q', '$log', function ($q, $log) {
			var onLoad = function (reader, deferred, scope) {
				return function () {
					scope.$apply(function () {
						deferred.resolve(reader.result);
					});
				};
			};
			var onError = function (reader, deferred, scope) {
				return function () {
					scope.$apply(function () {
						deferred.reject(reader.result);
					});
				};
			};
			var onProgress = function (reader, scope) {
				return function (event) {
					scope.$broadcast("fileProgress", {
						total: event.total,
						loaded: event.loaded
					});
				};
			};
			var getReader = function (deferred, scope) {
				var reader = new FileReader();
				reader.onload = onLoad(reader, deferred, scope);
				reader.onerror = onError(reader, deferred, scope);
				reader.onprogress = onProgress(reader, scope);
				return reader;
			};
			var readAsDataURL = function (file, scope) {
				var deferred = $q.defer();
				var reader = getReader(deferred, scope);
				reader.readAsDataURL(file);
				return deferred.promise;
			};
			return {
				readAsDataUrl: readAsDataURL
			};
		}])
		.directive("imageDrop", ['fileReader', function (fileReader) {
			return {
				restrict: "E",
				replace: true,
				template: "<div class='well row image-drop'><div class='col-xs-6 controls'><p><br />Drag image, or click to select a file.</p><p><input type='file' /></p></div><div class='col-xs-6 image-container text-right'><img class='img-responsive preview' /></div></div>",
				scope: {
					model: "="
				},
				link: function ($scope, $element, $attrs) {
					$scope.dom = {
						preview: $element.children('.image-container')
							.children('.preview'),
						input: $element.children('.controls')
							.children('p')
							.children('input')
					};
					var width = $attrs.previewWidth;
					var height = $attrs.previewHeight;
					$scope.dom.preview.css({
						"max-width": width + "px",
						"max-height": height + "px"
					});
					$scope.dom.preview.attr('src', ($scope.model || "http://placehold.it/" + width + "x" + height + "?text=%20"));
					$('body')
						.on('dragover dragleave drop', function (e) {
							e.preventDefault();
						})
					$element.on("dragover", function (e) {
							e.preventDefault();
							$element.addClass("active");
						})
						.on("dragleave", function (e) {
							e.preventDefault();
							$element.removeClass("active");
						})
						.on("drop", function (e) {
							e.preventDefault();
							var file = e.originalEvent.dataTransfer.files[0];
							$element.removeClass("active");
							loadFile(file);
						});
					$scope.dom.input.on('change', function (e) {
						var file = e.target.files[0];
						loadFile(file);
					});
					$scope.$watch('model', function () {
						if (typeof $scope.model === "undefined") $scope.dom.preview.attr('src', "http://placehold.it/" + width + "x" + height + "?text=%20");
						if ($scope.model == null) return;
						else if (typeof $scope.model === "string") $scope.dom.preview.attr('src', $scope.model);
						else if (typeof $scope.model === "object" && $scope.model.changed) $scope.dom.preview.attr('src', $scope.model.data);
					})
					var loadFile = function (file) {
						fileReader.readAsDataUrl(file, $scope)
							.then(function (data) {
								$scope.dom.preview.attr('src', data);
								if (typeof $scope.model === "string") {
									var old = $scope.model;
									$scope.model = {
										oldURL: old,
										data: data,
										changed: true,
									}
								} else if (typeof $scope.model === "undefined" || $scope.model === null) {
									$scope.model = {
										data: data
									}
								} else $scope.model.data = data;
							})
					};
				}
			};
		}])
		.directive('staffSelect', function (staffService) {
			return {
				restrict: 'E',
				scope: {
					model: '='
				},
				replace: true,
				link: function ($scope) {
					$scope.data = {};
					staffService.find()
						.then(function (res) {
							$scope.data.staff = res.data;
							$scope.data.selectedStaff = res.data[0];
						});
					$scope.$add = function () {
						$scope.model.push($.extend(true, {}, $scope.data.selectedStaff));
						$scope.data.filter = "";
					}
					$scope.$remove = function ($index) {
						$scope.model.splice($index, 1);
					}
				},
				templateUrl: '/assets/views/admin/directives/staff-select.html'
			};
		})
		.directive('teamSelect', function (teamsService) {
			return {
				restrict: 'E',
				scope: {
					model: '=',
					game: '=?'
				},
				replace: true,
				link: function ($scope) {
					function filterTeams() {
						$scope.data.teams = $scope.teams.filter(function (team) {
							return (typeof team.game !== "undefined" && team.game !== null && team.game._id === $scope.game);
						});
						$scope.data.selectedTeam = $scope.data.teams[0];
					}
					$scope.teams = [];
					$scope.data = {};
					teamsService.find()
						.then(function (res) {
							$scope.teams = res.data;
							$scope.data.teams = res.data;
							$scope.data.selectedTeam = res.data[0];
							filterTeams();
						});
					$scope.$add = function () {
						$scope.model.push($.extend(true, {}, $scope.data.selectedTeam));
						$scope.data.filter = "";
					}
					$scope.$remove = function ($index) {
						$scope.model.splice($index, 1);
					}
					$scope.$watch('game', function (newVal, oldVal) {
						if (newVal !== oldVal) {
							filterTeams();
						}
					})
				},
				templateUrl: '/assets/views/admin/directives/team-select.html'
			};
		})
		.directive('mediaList', function ($http, API_BASE_URL) {
			return {
				restrict: 'E',
				scope: {
					model: '='
				},
				replace: true,
				link: function ($scope) {
					$http.get(API_BASE_URL + '/data/mediaTypes')
						.then(function (res) {
							$scope.types = res.data;
							$scope.data = {
								type: $scope.types[0]
							}
						});
					$scope.$name_changed = false;
					$scope.data = {};
					$scope.$add = function () {
						$scope.model.push({
							name: $scope.data.name,
							link: $scope.data.link,
							type: $scope.data.type
						});
						$scope.data = {
							type: $scope.types[0]
						}
						$scope.$name_changed = false;
					}
					$scope.$remove = function ($index) {
						$scope.model.splice($index, 1);
					}
					$scope.$change = function () {
						if (!$scope.$name_changed)
							$scope.data.name = $scope.data.type;
					}
					$scope.$changed = function () {
						$scope.$name_changed = true;
					}
				},
				templateUrl: '/assets/views/admin/directives/media-list.html'
			};
		})
		.config(function ($routeProvider, $locationProvider) {
			$locationProvider.html5Mode(true);
			$routeProvider
			// route for the home page
				.when('/', {
					templateUrl: '/assets/views/admin/dashboard.html',
					controller: 'overviewController',
					controllerAs: 'Overview',
					title: "Dashboard"
				})
				.when('/mail', {
					templateUrl: '/assets/views/admin/mail.html',
					controller: 'mailController',
					controllerAs: 'Mail',
					title: "Modmail"
				})
				.when('/games', {
					templateUrl: '/assets/views/admin/games.html',
					controller: 'gamesController',
					controllerAs: 'Games',
					title: "Games"
				})
				.when('/events', {
					templateUrl: '/assets/views/admin/events.html',
					controller: 'eventsController',
					controllerAs: 'Events',
					title: "Events"
				})
				.when('/staff', {
					templateUrl: '/assets/views/admin/staff.html',
					controller: 'staffController',
					controllerAs: 'Staff',
					title: "Staff"
				})
				.when('/teams', {
					templateUrl: '/assets/views/admin/teams.html',
					controller: 'teamsController',
					controllerAs: 'Teams',
					title: "Teams"
				})
				.when('/articles', {
					templateUrl: '/assets/views/admin/articles.html',
					controller: 'articlesListController',
					controllerAs: 'Articles',
					title: "Articles"
				})
				.when('/users', {
					templateUrl: '/assets/views/admin/user/list.html',
					controller: 'usersListController',
					controllerAs: 'usersListController',
					title: "Users"
				})
				.when('/user/:id/edit', {
					templateUrl: '/assets/views/admin/user/form.html',
					controller: 'editUserController',
					controllerAs: 'userFormController',
					title: "Edit User"
				})
				.when('/featured', {
					templateUrl: '/assets/views/admin/featured.html',
					controller: 'featuredSelectController',
					controllerAs: 'Featured',
					title: "Featured Content"
				})
		})
}());
