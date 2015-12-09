(function() {
  'use strict';

  angular.module('eventApp').factory('overviewResource', [
    '$resource', 'eventConstants',
    function($resource, eventConstants) {
      return {
        getOverview: $resource(config.baseUri + 'overview')
      };
    }
  ]);
}());
