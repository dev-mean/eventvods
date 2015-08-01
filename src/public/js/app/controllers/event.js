angular.module('eventControllers', ['eventService']).controller('eventList', function($http, Events) {
        var vm = this;
		vm.fields = ["Event Name", "Game", "Priority", "Todo: Ascertain headers"];
        vm.eventData = [["Event Example 1", "No db connect", "....yet", "...soontm"],["Event Example 2", "No db connect", "....yet", "...soontm"],["Event Example 3", "No db connect", "....yet", "...soontm"]];
        /*
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
        
        $scope.deleteEvent = function(id) { 
            Events.delete(id)
                .success(function(data) {
                    $scope.todos = data;
                });
        };*/
    });