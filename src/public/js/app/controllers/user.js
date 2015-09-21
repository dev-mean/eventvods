angular.module('userControllers', ['userService'])
    .controller('userList', function($scope, $http, Users) {
    $scope.sortOn = 'username';
    $scope.sortReverse = true;
    $scope.searchTerm = '';
    $scope.showFilters = false;
    
    Users.get()
        .then(function(response) {
            $scope.userData = response.data;
        });
});