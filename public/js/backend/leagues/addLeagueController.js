(function() {
	'use strict';
	angular.module('eventApp')
		.controller('addLeagueController', ['leaguesService', '$location', 'notificationService', 'API_BASE_URL', 'gamesService',
			function(Leagues, $location, toastr, API_BASE_URL, Games) {
				var vm = this;
				vm.title = "Add League";
				vm.errors = [];
				vm.data = {
					staff: [],
					media: [],
					teams: []
				};
				vm.tab = 1;
				$('#slug').attr('data-parsley-remote', API_BASE_URL + '/validate/leagueSlug/{value}');
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
				var parsley = $('#addLeagueForm').parsley();
				Games.find()
					.then(function(response) {
						vm.games = response.data;
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
					if (parsley.validate()) Leagues.create(vm.data)
						.then(function(response) {
							toastr.success('League added.', {
								closeButton: true
							});
							$location.path('/leagues');
						}, function(response) {
							vm.errors = response.data.errors;
						});
					else vm.tab = 1;
				};
			}
		]);
}());
