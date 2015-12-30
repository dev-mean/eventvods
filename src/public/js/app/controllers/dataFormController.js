(function() {
  'use strict';

  angular.module('eventApp').controller('dataFormController', [
    'dataFormService', '$window', 'notificationFactory',
    function(dataFormService, $window, notificationFactory) {
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
        casterModel.$save(function (user, headers) {
                    notificationFactory.success('Caster created');
                }, function (error) {
                    notificationFactory.error('Error creating caster.'); //TODO: Show specific error?
                });
      };

      controller.saveMap = function(mapModel) {
        mapModel.$save(function (user, headers) {
                    notificationFactory.success('Map created');
                }, function (error) {
                    notificationFactory.error('Error creating map.'); //TODO: Show specific error?
                });
      };

      controller.saveTeam = function(teamModel) {
        teamModel.$save(function (user, headers) {
                    notificationFactory.success('Team created');
                }, function (error) {
                    notificationFactory.error('Error creating team.'); //TODO: Show specific error?
                });
      };
    }
  ]);
}());
