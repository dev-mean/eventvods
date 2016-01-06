(function() {
  'use strict';

  angular.module('eventApp').factory('staffResource', [
    '$resource', 'eventConstants',
    function($resource, eventConstants) {
      return {
        // TODO (Nick): Refactor
        getCasters: $resource(eventConstants.baseUri + 'casters'),
        getCaster: $resource(eventConstants.baseUri + 'casters/:casterId', { }, {
          'get': {
            method: 'GET',
            params: { casterId: '@casterId' }
          }
        }),
        createCaster: $resource(eventConstants.baseUri + 'casters'),
        updateCaster: $resource(eventConstants.baseUri + 'casters/:casterId', { }, {
          'put': {
            method: 'PUT',
            params: { casterId: '@casterId' }
          }
        }),
        deleteCaster: $resource(eventConstants.baseUri + 'casters/:casterId', { }, {
          'delete': {
            method: 'DELETE',
            params: { casterId: '@casterId' }
          }
        })
      };
    }
  ]);
}());
