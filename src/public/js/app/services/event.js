angular.module('eventService', [])
    .factory('Events', function($http) {
        return {
            get : function() {
                return $http.get('api/events');
            },
            create : function(eventData) {
                return $http.post('/api/events', eventData);
            },
            delete : function(id) {
                return $http.delete('/api/events/' + id);
            }
        };
    });