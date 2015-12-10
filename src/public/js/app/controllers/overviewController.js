angular.module('eventApp').controller('overviewController', [
  'mainPageService',
  function(mainPageService) {
    console.log(mainPageService.overviewData);
  }
]);
