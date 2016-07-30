(function() {
    'use strict';
    angular.module('eventApp')
        .controller('addLeagueController', ['leaguesService', '$location', 'notificationService', 'API_BASE_URL', 'gamesService',
            function(Leagues, $location, toastr, API_BASE_URL, Games) {
                var vm = this;
                vm.title = "Add League";
                vm.errors = [];
                vm.data = {};
				vm.tab = 1;
				$( '#slug' ).attr( 'data-parsley-remote', API_BASE_URL + '/validate/leagueSlug/{value}');
				var startDate= new Pikaday({field: $('#startDate')[0], format: "dddd Do MMMM, YYYY" });
				var endDate = new Pikaday({field: $('#endDate')[0], format: "dddd Do MMMM, YYYY"  });
                var parsley = $('#addLeagueForm')
                    .parsley();
                Games.find()
                    .then(function(response) {
                        vm.games = response.data.map(function(obj) {
                            return {
                                "label": obj.slug + " - " + obj.name,
                                "value": obj._id
                            };
                        });
                    });
				vm.goToTab = function(tabNumber){
					for(var i=1;i < tabNumber; i++){
						if(!parsley.validate({group: i})){
							return vm.tab = i;
						}
					}
					vm.tab = tabNumber;
				}
                vm.submit = function() {
					vm.data.startDate = startDate.getDate();
					vm.data.endDate = endDate.getDate();
                    if (parsley.validate()) Leagues.create(vm.data)
                        .then(function(response) {
                            toastr.success('League added.', {
                                closeButton: true
                            });
                            $location.path('/leagues');
                        }, function(response) {
                            vm.errors = response.data.errors;
                        });
                };
            }
        ]);
}());
