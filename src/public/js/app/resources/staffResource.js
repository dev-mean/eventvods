(function() {
  'use strict';

  angular.module('eventApp').factory('staffResource', [
    '$resource', 'eventConstants',
    function($resource, eventConstants) {
      return {
        // TODO (Nick): Refactor
        getCasters: $resource(eventConstants.baseUri + 'casters'),
        createCaster: $resource(eventConstants.baseUri + 'casters'),
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
