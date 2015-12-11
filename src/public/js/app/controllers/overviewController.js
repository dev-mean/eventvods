(function() {
  'use strict';

  angular.module('eventApp').controller('overviewController', [
    'mainPageService',
    function(mainPageService) {
      var controller = this;

      console.log(mainPageService.overviewData);

    }
  ]);
}());
