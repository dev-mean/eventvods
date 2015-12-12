(function() {
  'use strict';

  angular.module('eventApp').factory('eventResource', [
    '$resource', 'eventConstants',
    function($resource, eventConstants) {
      return {
        getEvents: $resource(eventConstants.baseUri + 'events'),
        getEvent: $resource(eventConstants.baseUri + 'event/:eventId', { }, {
          'get': {
            method: 'GET',
            params: { eventId: '@eventId' }
          }
        }),
        createEvent: $resource(eventConstants.baseUri + 'events'),
        updateEvent: $resource(eventConstants.baseUri + 'event/:eventId', { },{
          'save': {
            method: 'POST',
            params: { eventId: '@eventId' }
          }
        }),
        deleteEvent: $resource(eventConstants.baseUri + 'events/:eventId', { }, {
          'delete': {
            method: 'DELETE',
            params: { eventId: '@eventId' }
          }
        })
      };
    }
  ]);
}());
