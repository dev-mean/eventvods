(function() {
  'use strict';

  angular.module('eventApp').controller('teamListController', [
    'teamService',
    function(teamService) {
      var controller = this;

      controller.ui = {
          showFilters: true,
          sortType: 'teamTag',
          sortReverse: false,
          pages: 1,
          page: 1,
          listView: true,
          itemsPerPage: 10,
          search: ''
      };

      teamService.getTeams().$promise.then(function(result) {
        var data = cleanResponse(result);
        controller.teamData = data;
        controller.teamListData = controller.paginate(data);
      });

      function cleanResponse(resp) {
        return JSON.parse(angular.toJson(resp));
      }
      
      controller.setTeamSort = function(sortType) {
        controller.ui.sortType = sortType;
        controller.ui.sortReverse = !controller.ui.sortReverse;
      };
// 
//        controller.paginate = function(data) {
//         if (controller.ui.listView === false) {
//           controller.ui.itemsPerPage = 6;
//         }
// 
//         controller.ui.sort.pages = Math.ceil(data.length / controller.ui.itemsPerPage);
// 
//         if (data.length > controller.ui.itemsPerPage) {
//           var start = (controller.ui.sort.page - 1) * controller.ui.itemsPerPage;
//           var end = start + controller.ui.itemsPerPage;
//           return data.slice(start, end);
//         } else {
//           return data;
      //         }
      //       };

      controller.paginate = function (data) {
        //   data = controller.filter(data);
        //   data = controller.sort(data);
          controller.ui.pages = Math.ceil(data.length / controller.ui.itemsPerPage);
          if (data.length > controller.ui.itemsPerPage) {
              var start = (controller.ui.page - 1) * controller.ui.itemsPerPage;
              var end = start + controller.ui.itemsPerPage;
              return data.slice(start, end);
          } else return data;
      };

      controller.previousPage = function () {
          controller.ui.page = controller.ui.page - 1;
          controller.teamListData = controller.paginate(controller.teamData);
      };
      controller.nextPage = function () {
          controller.ui.page = controller.ui.page + 1;
          controller.teamListData = controller.paginate(controller.teamData);
      };
    }
  ]);
}());

/*
angular.module('eventApp').controller('dataList', function ($http, $scope, Staff, Maps, Teams) {

		$scope.view = "Teams";
		$scope.showFilters = false;
		//=================
		$scope.test = function () {
			console.dir($scope);
		};

		$scope.$watch('teams.search', function (newVal, oldVal) {
			if (newVal === oldVal) return;
			$scope.teams.page = 1;
			$scope.teams.process();
		});

		$scope.$watch('staff.search', function (newVal, oldVal) {
			if (newVal === oldVal) return;
			$scope.staff.page = 1;
			$scope.staff.process();
		});

		$scope.$watch('maps.search', function (newVal, oldVal) {
			if (newVal === oldVal) return;
			$scope.maps.page = 1;
			$scope.maps.process();
		});

		$scope.teams = {
			data: {},
			list: {},
			sort: {
				field: 'tag',
				dir: 'desc'
			},
			//
			page: 1,
			search: "",
			sorted: function (field, dir) {
				return ($scope.teams.sort.field == field && $scope.teams.sort.dir == dir);
			},
			sortBy: function (field) {
				if ($scope.teams.sort.field == field) $scope.teams.sort.dir = $scope.teams.sort.dir == 'desc' ? 'asc' : 'desc';
				else $scope.teams.sort.field = field;
			},
			process: function () {
				$scope.teams.list = $scope.teams.paginate($scope.teams.sortdata($scope.teams.filter($scope.teams.data)));
			},
			paginate: function (data) {
				if (typeof data == "undefined" || data === null) return null;
				$scope.teams.pages = Math.ceil(data.length / 10);
				if (data.length > 10) {
					var start = ($scope.page - 1) * 10;
					var end = start + 10;
					return data.slice(start, end);
				} else return data;
			},
			filter: function (data) {
				if (typeof data == "undefined" || data === null) return null;
				//no filters as of now.
				if ($scope.teams.search !== "")
					data = data.filter(function (item) {
						return (~item.teamTag.toLowerCase().indexOf($scope.teams.search.toLowerCase())) ||
							(~item.teamName.toLowerCase().indexOf($scope.teams.search.toLowerCase())) ||
							(~item.teamCountry.toLowerCase().indexOf($scope.teams.search.toLowerCase()));
					});
				return data;
			},
			sortdata: function (data) {
				if (typeof data == "undefined" || data === null) return null;
				switch ($scope.teams.sort.field) {
					case "tag":
						return data.sort(function (a, b) {
							a = a.teamTag;
							b = b.teamTag;
							if (a == b) return 0;
							else if ($scope.teams.sort.dir == 'desc') return a > b ? 1 : -1;
							else return a > b ? -1 : 1;
						});
					case "name":
						return data.sort(function (a, b) {
							a = a.teamName;
							b = b.teamName;
							if (a == b) return 0;
							else if ($scope.teams.sort.dir == 'desc') return a > b ? 1 : -1;
							else return a > b ? -1 : 1;
						});
					case "country":
						return data.sort(function (a, b) {
							a = a.teamCountry;
							b = b.teamCountry;
							if (a == b) return 0;
							else if ($scope.teams.sort.dir == 'desc') return a > b ? 1 : -1;
							else return a > b ? -1 : 1;
						});
				}
			},
			nextPage: function () {
				$scope.teams.pages++;
			},
			prevPage: function () {
				$scope.teams.pages--;
			}
		};
		$scope.staff = {
			data: {},
			list: {},
			sort: {
				field: 'name',
				dir: 'desc'
			},
			//
			page: 1,
			search: "",
			sorted: function (field, dir) {
				return ($scope.staff.sort.field == field && $scope.staff.sort.dir == dir);
			},
			sortBy: function (field) {
				if ($scope.staff.sort.field == field) $scope.staff.sort.dir = $scope.staff.sort.dir == 'desc' ? 'asc' : 'desc';
				else $scope.staff.sort.field = field;
			},
			process: function () {
				$scope.staff.list = $scope.staff.paginate($scope.staff.sortdata($scope.staff.filter($scope.staff.data)));
			},
			paginate: function (data) {
				if (typeof data == "undefined" || data === null) return null;
				$scope.staff.pages = Math.ceil(data.length / 10);
				if (data.length > 10) {
					var start = ($scope.page - 1) * 10;
					var end = start + 10;
					return data.slice(start, end);
				} else return data;
			},
			filter: function (data) {
				if (typeof data == "undefined" || data === null) return null;
				//no filters as of now.
				if ($scope.staff.search !== "")
					data = data.filter(function (item) {
						return (~item.casterName.toLowerCase().indexOf($scope.staff.search.toLowerCase())) ||
							(~item.casterAlias.toLowerCase().indexOf($scope.staff.search.toLowerCase())) ||
							(~item.casterCountry.toLowerCase().indexOf($scope.staff.search.toLowerCase()));
					});
				return data;
			},
			sortdata: function (data) {
				if (typeof data == "undefined" || data === null) return null;
				switch ($scope.staff.sort.field) {
					case "alias":
						return data.sort(function (a, b) {
							a = a.casterAlias;
							b = b.casterAlias;
							if (a == b) return 0;
							else if ($scope.staff.sort.dir == 'desc') return a > b ? 1 : -1;
							else return a > b ? -1 : 1;
						});
					case "name":
						return data.sort(function (a, b) {
							a = a.casterName;
							b = b.casterName;
							if (a == b) return 0;
							else if ($scope.staff.sort.dir == 'desc') return a > b ? 1 : -1;
							else return a > b ? -1 : 1;
						});
					case "country":
						return data.sort(function (a, b) {
							a = a.casterCountry;
							b = b.casterCountry;
							if (a == b) return 0;
							else if ($scope.staff.sort.dir == 'desc') return a > b ? 1 : -1;
							else return a > b ? -1 : 1;
						});
				}
			},
			nextPage: function () {
				$scope.staff.pages++;
			},
			prevPage: function () {
				$scope.staff.pages--;
			}

		};
		$scope.maps = {
			data: {},
			list: {},
			sort: {
				field: 'name',
				dir: 'desc'
			},
			//
			page: 1,
			search: "",
			sorted: function (field, dir) {
				return ($scope.maps.sort.field == field && $scope.maps.sort.dir == dir);
			},
			sortBy: function (field) {
				if ($scope.maps.sort.field == field) $scope.maps.sort.dir = $scope.maps.sort.dir == 'desc' ? 'asc' : 'desc';
				else $scope.maps.sort.field = field;
			},
			process: function () {
				$scope.maps.list = $scope.maps.paginate($scope.maps.sortdata($scope.maps.filter($scope.maps.data)));
			},
			paginate: function (data) {
				if (typeof data == "undefined" || data === null) return null;
				$scope.maps.pages = Math.ceil(data.length / 10);
				if (data.length > 10) {
					var start = ($scope.page - 1) * 10;
					var end = start + 10;
					return data.slice(start, end);
				} else return data;
			},
			filter: function (data) {
				if (typeof data == "undefined" || data === null) return null;
				//no filters as of now.
				if ($scope.maps.search !== "")
					data = data.filter(function (item) {
						return (~item.mapName.toLowerCase().indexOf($scope.maps.search.toLowerCase()));
					});
				return data;
			},
			sortdata: function (data) {
				if (typeof data == "undefined" || data === null) return null;
				return data.sort(function (a, b) {
					a = a.mapName;
					b = b.mapName;
					if (a == b) return 0;
					else if ($scope.maps.sort.dir == 'desc') return a > b ? 1 : -1;
					else return a > b ? -1 : 1;
				});
			},
			nextPage: function () {
				$scope.maps.pages++;
			},
			prevPage: function () {
				$scope.maps.pages--;
			}
		};


		//=================

		Staff.get()
			.then(function (response) {
				$scope.staff.data = response.data;
				$scope.staff.process();
			});
		Maps.get()
			.then(function (response) {
				$scope.maps.data = response.data;
				$scope.maps.process();
			});
		Teams.get()
			.then(function (response) {
				$scope.teams.data = response.data;
				$scope.teams.process();
				$scope.teams.process();
			});

		//=================
	});

*/
