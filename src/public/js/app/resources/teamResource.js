(function() {
  'use strict';

  angular.module('eventApp').factory('teamResource', [
    '$resource', 'eventConstants',
    function($resource, eventConstants) {
      // TODO(Nick): Needs to be refactored
      return {
        getTeams: $resource(eventConstants.baseUri + 'teams'),
        getTeam: $resource(eventConstants.baseUri + 'teams/:teamId', { }, {
          'get': {
            method: 'GET',
            params: { teamId: '@teamId' }
          }
        }),
        createTeam: $resource(eventConstants.baseUri + 'teams'),
        updateTeam: $resource(eventConstants.baseUri + 'teams/:teamId', { }, {
          'put': {
            method: 'PUT',
            params: { teamId: '@teamId' }
          }
        }),
        deleteTeam: $resource(eventConstants.baseUri + 'teams/:teamId', { }, {
          'delete': {
            method: 'DELETE',
            params: { teamId: '@teamId' }
          }
        })
      };
    }
  ]);
}());
