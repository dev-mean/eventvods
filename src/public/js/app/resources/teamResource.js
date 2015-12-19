(function() {
  'use strict';

  angular.module('eventApp').factory('teamResource', [
    '$resource', 'eventConstants',
    function($resource, eventConstants) {
      // TODO(Nick): Needs to be refactored
      return {
        getTeams: $resource(eventConstants.baseUri + 'teams'),
        createTeam: $resource(eventConstants.baseUri + 'teams'),
        updateTeam: $resource(eventConstants.baseUri + 'teams/:teamId' , { }, {
          'update': {
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
