(function() {
  'use strict';

  angular.module('eventApp').service('dataFormService', [
    'mapResource', 'staffResource', 'teamResource',
    function(mapResource, staffResource, teamResource) {
      var service = this;

      service.createMap = mapResource.createMap;
      service.createCaster = staffResource.createCaster;
      service.createTeam = teamResource.createTeam;
    }
  ]);
}());
