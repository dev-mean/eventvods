(function() {
  angular.module('eventApp').service('mainPageService', [
    'overviewResource',
    function(overviewResource) {
      var service = this;
      service.overviewData = [];

      service.promise = overviewResource.getOverview.get().$promise.then(
        function(result) {
          var data = JSON.parse(angular.toJson(result));
          console.log(data);

          service.overviewData = data;
        });

      return service;
    }
  ]);
}());
