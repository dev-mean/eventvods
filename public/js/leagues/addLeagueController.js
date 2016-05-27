(function() {
    'use strict';
    angular.module('eventApp')
        .controller('addLeagueController', ['leaguesService', '$location', 'notificationService', 'API_BASE_URL', 'gamesService',
            function(Leagues, $location, toastr, API_BASE_URL, Games) {
                var vm = this;
                vm.title = "Add League";
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
                vm.submit = function() {
                    console.log(vm.data);
                    if (parsley.validate()) Leagues.create(vm.data)
                        .then(function(response) {
                            toastr.success('League added.', {
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