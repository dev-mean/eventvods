(function() {
  'use strict';

  angular.module('eventApp').controller('eventFormController', [
    'eventFormService',
    function( eventFormService) {
      var controller = this;

      controller.ui = {
        isEdit: false,
        stage: 1,
        error: [],
        data: { },
      };

      controller.options = {
          format: 'yyyy-mm-dd',
          onClose: function(e) {
            
          }
      };
    }
  ]);
}());
