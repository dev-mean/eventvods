(function() {
  'use strict';

  angular.module('eventApp').controller('dataFormController', [
    'dataFormService',
    function(dataFormService) {
      var controller = this;

      controller.ui = {
        view: 'team'
      };
    }
  ]);
}());
