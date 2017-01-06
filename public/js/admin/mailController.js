(function() {
    'use strict';
    angular.module('eventApp')
        .controller('mailController', function($http, API_BASE_URL, $rootScope) {
            var vm = this;
            vm.data = [];
            vm.selected = null;
            vm.paging = {
                itemsPerPage: 10,
                pages: function() {
                    var pages = Math.ceil(vm.data.length / vm.paging.itemsPerPage);
                    if (vm.paging.page > pages && pages > 0) vm.paging.page = pages;
                    return pages;
                },
                page: 1
            };
            vm.prevPage = function(){
                if(vm.paging.page > 1) vm.paging.page--;
            }
            vm.nextPage = function(){
                if(vm.paging.page < vm.paging.pages()) vm.paging.page++;
            }
            $http.get(API_BASE_URL + '/mail')
                .then(function(res) {
                    vm.data = res.data;
                })
            vm.show = function($index){
                vm.selected = vm.data[$index];
                vm.selected.index = $index;
            }
            vm.resolve = function($index, _id){
                $http.get(API_BASE_URL + '/mail/' + _id + '/resolve', {
                    ignoreLoadingBar: true
                })
                .then(function(res){
                    vm.data[$index] = res.data;
                    vm.data[$index].resolved = true;
                    $rootScope.$broadcast('mailUpdated');
                })
            }
        });
}());