(function () {
    'use strict';

    angular.module('eventApp').controller('dataFormController', [
        'dataFormService', '$window', 'notificationService',
        function (dataFormService, $window, notificationService) {
            var controller = this;

            controller.ui = {
                casterModel: new dataFormService.createCaster(),
                mapModel: new dataFormService.createMap(),
                teamModel: new dataFormService.createTeam()
            };

            controller.goTo = function (name) {
                $window.location.href = 'data/new/' + name;
            };

            controller.saveStaff = function (casterModel) {
                if (validateForm() === true) {
                    casterModel.$save(function (user, headers) {
                        notificationService.success('Caster created');
                    }, function (error) {
                        notificationService.error('Error creating caster.'); //TODO: Show specific error?
                    });
                }
            };

            controller.saveMap = function (mapModel) {
                if (validateForm() === true) {
                    mapModel.$save(function (user, headers) {
                        notificationService.success('Map created');
                    }, function (error) {
                        notificationService.error('Error creating map.'); //TODO: Show specific error?
                        return false;
                    });
                }
            };

            controller.saveTeam = function (teamModel) {
                if (validateForm() === true) {
                    teamModel.$save(function (user, headers) {
                        notificationService.success('Team created');
                    }, function (error) {
                        notificationService.error('Error creating team.'); //TODO: Show specific error?
                    });
                }
            };
            
            function validateForm() {
                var parsley = $('#dataForm').parsley();
                var val = parsley.validate();
                if (val === false) {
                    notificationService.error('Validation error. Check the form for error message(s)');
                }
                return val;
            }
        }
    ]);
} ());
