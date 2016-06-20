(function() {
  'use strict';

  angular.module('eventApp').controller('staffListController', [
    'staffService',
    function(staffService, $route, $scope, $routeParams) {
      var controller = this;

      controller.ui = {
          showFilters: true,
          sortType: 'casterName',
          sortReverse: false,
          pages: 1,
          page: 1,
          listView: true,
          itemsPerPage: 10,
          search: ''
      };

      staffService.getCasters().$promise.then(function(result) {
        var data = cleanResponse(result);
        controller.casterData = data;
        controller.casterListData = controller.paginate(data);
      });

      function cleanResponse(resp) {
        return JSON.parse(angular.toJson(resp));
      }

      controller.setStaffSort = function(sortType) {
        controller.ui.sortType = sortType;
        controller.ui.sortReverse = !controller.ui.sortReverse;
      };

      //TODO Sorting
      controller.paginate = function (data) {
        //   data = controller.filter(data);
        //   data = controller.sort(data);
          controller.ui.pages = Math.ceil(data.length / controller.ui.itemsPerPage);
          if (data.length > controller.ui.itemsPerPage) {
              var start = (controller.ui.page - 1) * controller.ui.itemsPerPage;
              var end = start + controller.ui.itemsPerPage;
              return data.slice(start, end);
          } else return data;
      };

      controller.previousPage = function () {
          controller.ui.page = controller.ui.page - 1;
          controller.casterListData = controller.paginate(controller.casterData);
      };
      controller.nextPage = function () {
          controller.ui.page = controller.ui.page + 1;
          controller.casterListData = controller.paginate(controller.casterData);
      };
    }
  ]);
}());
