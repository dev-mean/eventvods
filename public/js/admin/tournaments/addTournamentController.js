(function() {
	'use strict';
	angular.module('eventApp')
		.controller('addTournamentController', ['tournamentsService', '$location', 'notificationService', 'API_BASE_URL',
			function(Tournaments, $location, toastr, API_BASE_URL) {
				var vm = this;
				vm.title = "Add Tournament";
				vm.errors = [];
				vm.data = {
					staff: [],
					media: [],
					teams: []
				};
				vm.tab = 1;
				$('#slug').attr('data-parsley-remote', API_BASE_URL + '/validate/tournamentSlug/{value}');
				var startDate = new Pikaday({
					field: $('#startDate')[0],
					format: "dddd Do MMMM, YYYY",
					onClose: function(){
						setTimeout(function(){
							$('#startDate').focus();
						}, 0);
					}
				});
				var endDate = new Pikaday({
					field: $('#endDate')[0],
					format: "dddd Do MMMM, YYYY",
					onClose: function(){
						setTimeout(function(){
							$('#endDate').focus();
						}, 0);
					}
				});
				var parsley = $('#addTournamentForm').parsley();
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
					console.log(vm.data.teams);
					if (parsley.validate()) Tournaments.create(vm.data)
						.then(function(response) {
							toastr.success('Tournament added.', {
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
