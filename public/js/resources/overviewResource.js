(function() {
  'use strict';

  angular.module('eventApp').factory('overviewResource', [
    '$resource', 'eventConstants',
    function($resource, eventConstants) {
      return {
        getOverview: $resource(eventConstants.baseUri + 'overview')
      };
    }
  ]);
}());
