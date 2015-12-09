(function() {
  'use strict';

  angular.module('eventApp').service('overviewService', [
    'overviewResource',
    function(overviewResource) {
      var service = this;

      overviewResource.$promise.then(function(result) {
        var data = JSON.parse(angular.toJson(result));
        console.log(data);
      });
    }]);
}());
