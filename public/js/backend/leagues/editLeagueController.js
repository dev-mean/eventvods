(function() {
    'use strict';
    angular.module('eventApp')
        .controller('editLeagueController', ['leaguesService', '$location', 'notificationService', 'API_BASE_URL', 'gamesService', '$routeParams',
            function(Leagues, $location, toastr, API_BASE_URL, Games, $routeParams) {
                var vm = this;
                vm.title = "Edit League";
                vm.errors = [];
                vm.data = {};
				vm.tab = 1;
				$( '#slug' ).attr( 'data-parsley-remote', API_BASE_URL + '/validate/leagueSlug/{value}/'  + $routeParams.id );
				var startDate= new Pikaday({field: $('#startDate')[0], format: "dddd Do MMMM, YYYY" });
				var endDate = new Pikaday({field: $('#endDate')[0], format: "dddd Do MMMM, YYYY"  });
                var parsley = $('#addLeagueForm')
                    .parsley();
                Games.find()
                    .then(function(response) {
                        vm.games = response.data;
                    });
                Leagues.findById($routeParams.id)
                    .then(function(response) {
                        vm.data = response.data;
                        vm.data.game = response.data.game._id;
						startDate.setDate(response.data.startDate);
						endDate.setDate(response.data.endDate);
                    }, function(response) {
                        toastr.error('Invalid League ID.', {
                            closeButton: true
                        });
                        $location.path('/leagues');
                    });
				vm.goToTab = function(tabNumber) {
					for (var i = 1; i < tabNumber; i++) {
						if (!parsley.validate({
								group: i
							})) {
							return vm.tab = i;
						}
					}
					vm.tab = tabNumber;
				}
                vm.submit = function() {
					vm.data.startDate = startDate.getDate();
					vm.data.endDate = endDate.getDate();
                    if (parsley.validate()) Leagues.update($routeParams.id, vm.data)
                        .then(function(response) {
                            toastr.success('League edited.', {
                                closeButton: true
                            });
                            $location.path('/leagues');
                        }, function(response) {
                            vm.errors = response.data.errors;
                        });
					else for (var i = 1; i < 4; i++) {
						console.log(i);
						if (!parsley.validate({
								group: i
							})) {
							return vm.tab = i;
						}
					};
                };
            }
        ]);
}());
