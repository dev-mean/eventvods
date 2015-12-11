(function() {
  'use strict';

  angular.module('eventApp').service('mainPageService', [
    'overviewResource',
    function(overviewResource) {
      var service = this;

      service.getOverview = overviewResource.getOverview.get;
    }
  ]);
}());
