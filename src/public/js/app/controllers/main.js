angular.module('eventController', [])
    .controller('mainController', function($scope, $http, Events) {
        
        $scope.eventData = {};
        
        //fill events with event data
        Events.get()
            .success(function(data) {
                $scope.events = data;
            });
            
        //post todo using API
        $scope.createEvent = function() {
            if(!$.isEmptyObject($scope.eventData)) {    //if the form isn't empty, create a new event
                Events.create($scope.eventData)
                    .success(function(data) {
                        $scope.eventData = {}; //clear form for new data
                        $scope.events = data; //load new list of events
                    });
            }
        };
        
        
    });