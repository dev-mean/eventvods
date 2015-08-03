angular.module('eventControllers', ['eventService'])
	.controller('eventOverview', function($http, Events){
		var vm = this;
		vm.eventData = [];
	})
	.controller('eventList', function($http, Events) {
        var vm = this;
	
        vm.eventData = [];
	
        //fill events with event data
        Events.get()
            .success(function(data) {
               vm.eventData = data;
            });
            
    })
	.controller('eventView', function($http, Events) {
		//Use ng-init to pass initial data? Messy but fast and user-friendly
	})
	.controller('eventForm', function($http, Events) {
		var vm = this;
		//Below method seems.....hacky, tbd
		vm.isEdit = (typeof window.eventData !== undefined) ? true : false;
		
	});

//Code for refactoring
/*
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