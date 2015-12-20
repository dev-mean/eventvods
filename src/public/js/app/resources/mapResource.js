(function() {
  'use strict';

  angular.module('eventApp').factory('mapResource', [
    '$resource', 'eventConstants',
    function($resource, eventConstants) {
      return {
        // TODO (Nick): Refactor
        getMaps: $resource(eventConstants.baseUri + 'maps'),
        createMap: $resource(eventConstants.baseUri + 'maps'),
        deleteMap: $resource(eventConstants.baseUri + 'maps/:mapId', { }, {
            'delete': {
              method: 'DELETE',
              params: { mapId: '@mapId' }
            }
        })
      };
    }
  ]);
}());
