angular.module('eventApp').service('mainPageService', [
  'overviewResource',
  function(overviewResource) {
    var service = this;

    service.overviewData = overviewResource.getOverview.query();
    /*
    overviewResource.getOverview.query().$promise.then(function(result) {
      var service.overviewData = JSON.parse(angular.toJson(result));
      console.log(data);
    });
    */
  }
]);
