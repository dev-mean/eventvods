(function() {
    'use strict';
    angular.module('eventApp')
        .controller('editTournamentController', ['tournamentsService', '$location', 'notificationService', 'API_BASE_URL', 'gamesService', '$routeParams',
            function(Tournaments, $location, toastr, API_BASE_URL, Games, $routeParams) {
                var vm = this;
                vm.title = "Edit Tournament";
                vm.errors = [];
                vm.data = {};
				vm.tab = 1;
				$( '#slug' ).attr( 'data-parsley-remote', API_BASE_URL + '/validate/tournamentSlug/{value}/'  + $routeParams.id );
				var startDate= new Pikaday({field: $('#startDate')[0], format: "dddd Do MMMM, YYYY" });
				var endDate = new Pikaday({field: $('#endDate')[0], format: "dddd Do MMMM, YYYY"  });
                var parsley = $('#addTournamentForm')
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
                Tournaments.findById($routeParams.id)
                    .then(function(response) {
                        vm.data = response.data;
                        jQuery('#tournamentGame').val(response.data.game.slug + " - " + response.data.game.name);
                        vm.data.game = response.data.game._id;
						startDate.setDate(response.data.startDate);
						endDate.setDate(response.data.endDate);
                    }, function(response) {
                        toastr.error('Invalid Tournament ID.', {
                            closeButton: true
                        });
                        $location.path('/tournaments');
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
                    if (parsley.validate()) Tournaments.update($routeParams.id, vm.data)
                        .then(function(response) {
                            toastr.success('Tournament edited.', {
                                closeButton: true
                            });
                            $location.path('/tournaments');
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
