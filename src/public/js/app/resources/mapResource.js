(function() {
  'use strict';

  angular.module('eventApp').factory('mapResource', [
    '$resource', 'eventConstants',
    function($resource, eventConstants) {
      return {
        // TODO (Nick): Refactor
        getMaps: $resource(eventConstants.baseUri + 'maps'),
        getMap: $resource(eventConstants.baseUri + 'maps/:mapId', { }, {
          'get': {
            method: 'GET',
            params: { mapId: '@mapId' }
          }
        }),
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
