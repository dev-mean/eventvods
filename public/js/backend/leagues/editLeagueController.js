(function() {
    'use strict';
    angular.module('eventApp')
        .controller('editLeagueController', ['leaguesService', '$location', 'notificationService', 'API_BASE_URL', 'gamesService', '$routeParams',
            function(Leagues, $location, toastr, API_BASE_URL, Games, $routeParams) {
                var vm = this;
                vm.title = "Edit League";
                vm.errors = [];
                vm.data = {};
                var parsley = $('#addLeagueForm')
                    .parsley();
                Games.find()
                    .then(function(response) {
                        vm.games = response.data.map(function(obj) {
                            return {
                                "label": obj.gameAlias + " - " + obj.gameName,
                                "value": obj._id
                            }
                        })
                    });
                Leagues.findById($routeParams.id)
                    .then(function(response) {
                        vm.data = response.data;
                        jQuery('#leagueGame').val(response.data.leagueGame.gameAlias + " - " + response.data.leagueGame.gameName);
                        vm.data.leagueGame = response.data.leagueGame._id;
                    }, function(response) {
                        toastr.error('Invalid League ID.', {
                            closeButton: true
                        });
                        $location.path('/leagues');
                    });
                vm.submit = function() {
                    console.log(vm.data);
                    if (parsley.validate()) Leagues.update($routeParams.id, vm.data)
                        .then(function(response) {
                            toastr.success('League edited.', {
                                closeButton: true
                            });
                            $location.path('/leagues');
                        }, function(response) {
                            vm.errors = response.data.errors;
                        });
                }
            }
        ]);
}());
