(function() {
  'use strict';

  angular.module('eventApp').service('dataFormService', [
    'mapResource', 'staffResource', 'teamResource',
    function(mapResource, staffResource, teamResource) {
      var service = this;

      service.createMap = mapResource.createMap.save;
      service.createCaster = staffResource.createCaster.save;
      service.createTeam = teamResource.createTeam.save;
    }
  ]);
}());
