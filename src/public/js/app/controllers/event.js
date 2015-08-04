angular.module('eventControllers', ['eventService'])
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
		vm.createEvent = function() {
      		//TODO: Validation
			Events.create(vm.eventData)
				.success(function(data) {
					$location.path('/events');
				});
        };
		vm.deleteEvent = function(id) { 
            Events.delete(id)
                .success(function(data) {
               		$location.path('/events');
             	});
        };
	});
