(function() {
  'use strict';

  angular.module('eventApp').factory('staffResource', [
    '$resource', 'eventConstants',
    function($resource, eventConstants) {
      return {
        // TODO (Nick): Refactor
        getCasters: $resource(eventConstants.baseUri + 'staff'),
        getCaster: $resource(eventConstants.baseUri + 'staff/:staffId', { }, {
          'get': {
            method: 'GET',
            params: { casterId: '@staffId' }
          }
        }),
        createCaster: $resource(eventConstants.baseUri + 'staff'),
        updateCaster: $resource(eventConstants.baseUri + 'staff/:staffId', { }, {
          'put': {
            method: 'PUT',
            params: { casterId: '@staffId' }
          }
        }),
        deleteCaster: $resource(eventConstants.baseUri + 'staff/:staffId', { }, {
          'delete': {
            method: 'DELETE',
            params: { casterId: '@staffId' }
          }
        })
      };
    }
  ]);
}());
