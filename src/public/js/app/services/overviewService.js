(function() {
  'use strict';

  angular.module('eventApp').service('overviewService', [
    'overviewResource',
    function(overviewResource) {
      var service = this;

      service.getOverview = overviewResource.getOverview.get();
    }
  ]);
}());
