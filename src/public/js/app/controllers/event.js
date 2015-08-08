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
	
		vm.stage = 1;
		vm.errors = [];
	
		vm.validate = function(stage){
			switch(stage){
				case 1:
					vm.stage = 2;
				break;
				case 2:
					vm.stage = 3;
				break;
				case 3:
					vm.stage = 1;
				break;
			}
		};
		vm.test = function(){
			console.dir(vm);
		};
		vm.createEvent = function() {
      		//TODO: Validation
			Events.create(vm.eventData)
				.success(function(data) {
					$location.path('/events');
				});
        };
	});
