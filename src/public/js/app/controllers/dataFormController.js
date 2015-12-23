(function() {
  'use strict';

  angular.module('eventApp').controller('dataFormController', [
    'dataFormService',
    function(dataFormService) {
      var controller = this;

      controller.ui = {
        view: 'team',
        casterModel: new dataFormService.createCaster(),
        mapModel: new dataFormService.createMap(),
        teamModel: new dataFormService.createTeam()
      };

      controller.saveStaff = function(casterModel) {
        casterModel.$save();
      };

      controller.saveMap = function(mapModel) {
        mapModel.$save();
      };

      controller.saveTeam = function(teamModel) {
        teamModel.$save();
      };
    }
  ]);
}());
