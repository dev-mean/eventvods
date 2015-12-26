(function() {
  'use strict';

  angular.module('eventApp').controller('dataFormController', [
    'dataFormService', '$window',
    function(dataFormService, $window) {
      var controller = this;

      controller.ui = {
        casterModel: new dataFormService.createCaster(),
        mapModel: new dataFormService.createMap(),
        teamModel: new dataFormService.createTeam()
      };
      
      controller.goTo = function(name) {
          $window.location.href = 'data/new/' + name;
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
