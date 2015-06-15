angular.module('eventService', [])
    .factory('Events', function($http) {
        return {
            get : function() {
                //return {thing : 'lol'};
                return $http.get('api/events');
            },
            create : function(eventData) {
                return $http.post('/api/events', eventData);
            }
        };
    });