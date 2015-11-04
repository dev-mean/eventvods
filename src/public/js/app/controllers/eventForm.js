var app = angular.module('eventControllers');
app.controller('eventForm', function($scope, $http, $location, $window, Events) {
  $scope.isEdit = false;
  $scope.stage = 1;
  $scope.errors = [];
  $scope.data = {};

  $scope.$watch('eventId', function(newv, oldv) {
    if (!$scope.isEdit && typeof $scope.eventId !== "undefined") {
      $scope.isEdit = true;
      Events.getSingle($scope.eventId)
        .then(function(response) {
          $scope.data = response.data;
        }, function(response) {
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
    maxfilesexceeded: function(file) {
      this.removeAllFiles(true);
      this.addFile(file);
    },
  });
  $scope.upload = function() {
    console.dir($scope.dropzone);
    $scope.dropzone.processQueue();
  };

  // ===============

  $scope.prev = function() {
    if ($scope.stage > 1)
      $scope.stage--;
  };
  $scope.next = function() {
    if ($scope.stage < 3)
      $scope.stage++;
  };

  $scope.test = function() {
    console.dir($scope.data);
    console.dir($scope.flow);
  };

  $scope.submit = function() {
    $scope.errors = [];
    $scope.data.eventStartDate = new Date($scope.data.eventStartDate);
    $scope.data.eventEndDate = new Date($scope.data.eventEndDate);
    //TODO: Validation
    if ($scope.isEdit) {
      Events.update($scope.eventId, $scope.data)
        .then(function(response) {
          window.location.href = '../' + $scope.eventId;
        }, function(response) {
          if (response.status == 400) {
            $scope.errors.push(response.data.errors);
          } else {
            $scope.errors.push({
              'message': 'Unknown error occured. Please check console.'
            });
            console.dir(response);
          }
        });
    } else {
      Events.create($scope.data)
        .then(function(response) {
          window.location.href = '../../event/' + response.data.eventId;
        }, function(response) {
          if (response.status == 400) {
            $scope.errors.push(response.data.errors);
          } else {
            $scope.errors.push({
              'message': 'Unknown error occured. Please check console.'
            });
            console.dir(response);
          }
        });
    }
  };
});
