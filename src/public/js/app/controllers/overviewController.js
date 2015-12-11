(function() {
  'use strict';

  angular.module('eventApp').controller('overviewController', [
    'mainPageService',
    function(mainPageService) {
      var controller = this;

      mainPageService.getOverview.$promise.then(function(result) {
        var data = cleanResponse(result);
        controller.overviewData = data;
      });

      function cleanResponse(resp) {
        return JSON.parse(angular.toJson(resp));
      }
    }
  ]);
}());
