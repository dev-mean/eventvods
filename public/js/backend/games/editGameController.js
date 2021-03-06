(function() {
    'use strict';
    angular.module('eventApp')
        .controller('editGameController', ['gamesService', '$location', 'notificationService', '$routeParams', 'API_BASE_URL',
            function(Games, $location, toastr, $routeParams, API_BASE_URL) {
                var vm = this;
                vm.title = "Edit Game";
                vm.errors = [];
                Games.findById($routeParams.id)
                    .then(function(response) {
                        vm.data = response.data;
                        $('#slug')
                            .attr('data-parsley-remote', API_BASE_URL + '/validate/gameSlug/{value}/' + $routeParams.id);
                        vm.parsley = $('#addGameForm')
                            .parsley();
                    }, function(response) {
                        toastr.error('Invalid Game ID.', {
                            closeButton: true
                        });
                        $location.path('/games');
                    });
                vm.submit = function() {
                    if (vm.parsley.validate()) Games.update($routeParams.id, vm.data)
                        .then(function(response) {
                            toastr.success('Game edited.', {
                                closeButton: true
                            });
                            $location.path('/games');
                        }, function(response) {
                            if (response.status == 500) vm.errors.push({
                                message: 'Unexpected error. Please pass this on to the developers.'
                            });
                            else vm.errors = response.data.errors;
                        });
                };
            }
        ]);
}());