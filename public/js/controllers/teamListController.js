(function() {
  'use strict';

  angular.module('eventApp').controller('teamListController', [
    'teamService',
    function(teamService) {
      var controller = this;

      controller.ui = {
          showFilters: true,
          sortType: 'teamTag',
          sortReverse: false,
          pages: 1,
          page: 1,
          listView: true,
          itemsPerPage: 10,
          search: ''
      };

      teamService.getTeams().$promise.then(function(result) {
        var data = cleanResponse(result);
        controller.teamData = data;
        controller.teamListData = controller.paginate(data);
      });

      function cleanResponse(resp) {
        return JSON.parse(angular.toJson(resp));
      }

      controller.setTeamSort = function(sortType) {
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
          controller.teamListData = controller.paginate(controller.teamData);
      };
      controller.nextPage = function () {
          controller.ui.page = controller.ui.page + 1;
          controller.teamListData = controller.paginate(controller.teamData);
      };
    }
  ]);
}());
