angular.module('eventControllers', ['eventService'])
	.controller('eventList', function($scope, $http, Events) {
        var vm = this;
	
		// ================
	
		vm.listView = true;
		vm.sort = "";
		vm.filters = [];
		vm.search = "";		
		
		// ================
	
		vm.itemsPerPage = 10;
        vm.eventData = [];
		vm.listData = [];
		vm.pages = 1;
		vm.page = 1;
	

        //fill events with event data
        Events.get()
            .success(function(data) {
                vm.eventData = data;
				vm.listData = vm.paginate(data);
            });
	
		$scope.$watch(vm.eventData+vm.sort+vm.filters+vm.search, function(newVal, oldVal){
			if(newVal !== oldVal){
				vm.itemsPerPage = vm.listView ? 10 : 6;
				vm.listData = vm.paginate(vm.eventData);
			}
		});
		vm.filter = function(data){
			//
		};
		vm.sort = function(data){
			//
		};
		vm.paginate = function(data){
			if(data.length > vm.itemsPerPage)
				return data.slice((vm.page-1) * vm.itemsPerPage, vm.itemsPerPage);
			else return data;
		};
            
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
