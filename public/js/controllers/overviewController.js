(function() {
  'use strict';

  angular.module('eventApp').controller('overviewController', [
    'overviewService',
    function(overviewService) {
      var controller = this;

      overviewService.getOverview().$promise.then(function(result) {
        var data = cleanResponse(result);
        controller.overviewData = data;
        console.log(data);
      });

      function cleanResponse(resp) {
        return JSON.parse(angular.toJson(resp));
      }
    }
  ]);
}());
