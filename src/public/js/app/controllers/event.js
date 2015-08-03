angular.module('eventControllers', ['eventService'])
	.controller('eventList', function($http, Events) {
        var vm = this;
		//Purely example format.
		//Will need to change slightly to json format
        vm.eventData = [{
			"date": "Dec 10",
			"game": "CSGO",
			"title": "Fragbite Masters - Season 4",
			"status": "Published",
		},{
			"date": "Dec 15",
			"game": "CSGO",
			"title": "Intel Extreme Masters",
			"status": "Draft",
		}];
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
    })
	.controller('eventView', function($http, Events) {
		//Use ng-init to pass initial data? Messy but fast and user-friendly
	})
	.controller('eventForm', function($http, Events) {
		var vm = this;
		//Below method seems.....hacky, tbd
		vm.isEdit = (typeof window.eventData !== undefined) ? true : false;
		
	});