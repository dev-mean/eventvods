angular.module('userControllers', ['userService'])
    .controller('userList', function($scope, $http, Users) {
    Users.get()
        .then(function(response) {
            $scope.userData = response.data;
        });
});