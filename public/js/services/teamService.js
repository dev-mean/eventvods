(function() {
	'use strict';

	angular.module('eventApp').service('teamService', [
		'teamResource',
		function(teamResource) {
			var service = this;

			service.getTeams = teamResource.getTeams.query;
			service.getTeam = teamResource.getTeam.get;
			service.createTeam = teamResource.createTeam.save;
			service.updateTeam = teamResource.updateTeam.put;
			service.deleteTeam = teamResource.deleteTeam.delete;
		}
	]);
}());
