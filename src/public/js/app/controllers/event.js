angular.module('eventControllers', ['eventService'])
	.controller('eventList', function ($scope, $http, Events) {
		// ================

		$scope.loaded = false;
		$scope.listView = true;
		$scope.showFilters = false;
		$scope.sort = {
			field: 'date',
			dir: 'asc'
		};
		$scope.search = "";

		// ================

		$scope.itemsPerPage = 10;
		$scope.eventData = [];
		$scope.listData = [];
		$scope.pages = 1;
		$scope.page = 1;

		//fill events with event data
		Events.get()
			.then(function (response) {
				$scope.eventData = response.data;
				$scope.processList();
			});

		$scope.$watch('search', function (newVal, oldVal) {
			if (newVal === oldVal) return;
			else $scope.processList();
		});
		$scope.$watch('listView', function (newVal, oldVal) {
			if (newVal === oldVal) return;
			$scope.page = 1;
			$scope.processList();
		});
		$scope.sorted = function (field, dir) {
			return ($scope.sort.field == field && $scope.sort.dir == dir);
		};

		$scope.setSort = function (field) {
			if ($scope.sort.field == field)
				$scope.sort.dir = ($scope.sort.dir == 'desc') ? 'asc' : 'desc';
			else
				$scope.sort.field = field;
			$scope.processList();
		};

		$scope.processList = function () {
			var data = $scope.filter($scope.eventData);
			data = $scope.sortdata(data);
			$scope.listData = $scope.paginate(data);
		};

		$scope.filter = function (data) {
			if (typeof data == "undefined" || data === null) return null;
			//no filters as of now.
			if ($scope.search !== "")
				data = data.filter(function (item) {
					return ~item.eventTitle.toLowerCase().indexOf($scope.search.toLowerCase());
				});
			return data;
		};
		$scope.sortdata = function (data) {
			if (typeof data == "undefined" || data === null) return null;
			switch ($scope.sort.field) {
				case "date":
					return data.sort(function (a, b) {
						a = new Date(a.eventStartDate);
						b = new Date(b.eventStartDate);
						if (a.getTime() === b.getTime()) return 0;
						else if ($scope.sort.dir == 'desc') return a > b ? 1 : -1;
						else return a > b ? -1 : 1;
					});
				case "title":
					return data.sort(function (a, b) {
						a = a.eventTitle;
						b = b.eventTitle;
						if (a == b) return 0;
						else if ($scope.sort.dir == 'desc') return a > b ? 1 : -1;
						else return a > b ? -1 : 1;
					});
				case "game":
					return data.sort(function (a, b) {
						a = a.eventGame;
						b = b.eventGame;
						if (a == b) return 0;
						else if ($scope.sort.dir == 'desc') return a > b ? 1 : -1;
						else return a > b ? -1 : 1;
					});
				case "user":
					return data.sort(function (a, b) {
						a = a.eventUser.username;
						b = b.eventUser.username;
						if (a == b) return 0;
						else if ($scope.sort.dir == 'desc') return a > b ? 1 : -1;
						else return a > b ? -1 : 1;
					});
				case "status":
					return data.sort(function (a, b) {
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
		$scope.paginate = function (data) {
			if (typeof data == "undefined" || data === null) return null;
			$scope.itemsPerPage = $scope.listView ? 10 : 6;
			$scope.pages = Math.ceil(data.length / $scope.itemsPerPage);
			if (data.length > $scope.itemsPerPage) {
				var start = ($scope.page - 1) * $scope.itemsPerPage;
				var end = start + $scope.itemsPerPage;
				return data.slice(start, end);
			} else return data;
		};
		$scope.prevPage = function () {
			$scope.page--;
			$scope.processList();
		};
		$scope.nextPage = function () {
			$scope.page++;
			$scope.processList();
		};
	})
	.controller('eventView', function ($http, Events) {
		//Use ng-init to pass initial data? Messy but fast and user-friendly
	})
	.controller('eventForm', function ($scope, $http, $location, $window, Events) {
		$scope.isEdit = false;
		$scope.stage = 1;
		$scope.errors = [];
		$scope.data = {};

		$scope.$watch('eventId', function (newv, oldv) {
			if (!$scope.isEdit && typeof $scope.eventId !== "undefined") {
				$scope.isEdit = true;
				Events.getSingle($scope.eventId)
					.then(function (response) {
						$scope.data = response.data;
					}, function (response) {
						if (response.status == 400 || response.status == 404)
							$scope.errors.push(response.data.errors);
						else {
							$scope.errors.push({
								'message': 'Unknown error occured. Please check console.'
							});
							console.dir(response);
						}
					});
			}
		});

		// ===============

		$scope.dateOpts = {
			format: 'dd mmm, yyyy',
			formatSubmit: 'yyyy/mm/dd',
			hiddenName: true,
		};

		// ===============
		$window.Dropzone.options.imageUpload = false;
		$scope.dropzone = new Dropzone("div#image_upload", {
			url: "/api/images/events/test",
			autoProcessQueue: false,
			maxFilesize: 30,
			maxFiles: 1,
			acceptedFiles: "image/*",
			previewsContainer: '#image_thumbnail',
			addRemoveLinks: true,
			dictDefaultMessage: "Drag an image here, or click here to select an image.",
			dictInvalidFileType: "Sorry, only images are allowed.",
			dictRemoveFile: "",
			maxfilesexceeded: function (file) {
				this.removeAllFiles(true);
				this.addFile(file);
			},
		});
		$scope.upload = function () {
			console.dir($scope.dropzone);
			$scope.dropzone.processQueue();
		};

		// ===============

		$scope.prev = function () {
			if ($scope.stage > 1)
				$scope.stage--;
		};
		$scope.next = function () {
			if ($scope.stage < 3)
				$scope.stage++;
		};

		$scope.test = function () {
			console.dir($scope.data);
			console.dir($scope.flow);
		};
		$scope.submit = function () {
			$scope.errors = [];
			$scope.data.eventStartDate = new Date($scope.data.eventStartDate);
			$scope.data.eventEndDate = new Date($scope.data.eventEndDate);
			//TODO: Validation
			if ($scope.isEdit) {
				Events.update($scope.eventId, $scope.data)
					.then(function (response) {
						window.location.href = '../' + $scope.eventId;
					}, function (response) {
						if (response.status == 400)
							$scope.errors.push(response.data.errors);
						else {
							$scope.errors.push({
								'message': 'Unknown error occured. Please check console.'
							});
							console.dir(response);
						}
					});
			} else {
				Events.create($scope.data)
					.then(function (response) {
						window.location.href = '../../event/' + response.data.eventId;
					}, function (response) {
						if (response.status == 400)
							$scope.errors.push(response.data.errors);
						else {
							$scope.errors.push({
								'message': 'Unknown error occured. Please check console.'
							});
							console.dir(response);
						}
					});
			}
		};
	});
