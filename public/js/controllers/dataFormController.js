(function () {
    'use strict';

    angular.module('eventApp').controller('dataFormController', [
        'dataFormService', '$window', 'notificationService', 'dataListService',
        function (dataFormService, $window, notificationService, dataListService) {
            var controller = this;
            
            //Edit mode --> TODO: Refactor with Route/RouteParams
            var isEdit = $window.location.href.indexOf('edit') > 0; //Check for id on model instead?

            if (isEdit) {
                var pathSplit = $window.location.pathname.split('/');
                var itemId = pathSplit[pathSplit.length - 1];
                var type = getType(pathSplit);
                getEditData(type, itemId);
            }

            function getType(pathSplit) {
                return pathSplit[pathSplit.length - 2];
            }

            function getEditData(type, itemId) {
                switch (type) {
                    case "teams":
                        getTeam(itemId);
                        break;
                    case "maps":
                        getMap(itemId);
                        break;
                    case "staff":
                        getCaster(itemId);
                        break;

                    default:
                        break;
                }
            }

            controller.ui = {
                casterModel: new dataFormService.createCaster(),
                mapModel: new dataFormService.createMap(),
                teamModel: new dataFormService.createTeam()
            };

            controller.goTo = function (name) {
                $window.location.href = 'data/new/' + name;
            };

            controller.saveStaff = function (casterModel) {
                if (isEdit) {
                    dataListService.updateCaster({ casterId: casterModel._id }, casterModel).$promise.then(function (result) {
                        if (result._id) {
                            notificationService.success('Caster updated');
                        } else {
                            notificationService.error('Error updating caster.');
                        }
                    });
                } else {
                    casterModel.$save(function (user, headers) {
                        notificationService.success('Caster created');
                    }, function (error) {
                        notificationService.error('Error creating caster.'); //TODO: Show specific error?
                        return false;
                    });
                }
            };

            controller.saveMap = function (mapModel) {
                if (validateForm() === true) {
                    if (isEdit) { //mapModel.id ?
                        dataListService.updateMap({ mapId: mapModel._id }, mapModel).$promise.then(function (result) {
                            if (result._id) {
                                notificationService.success('Map updated');
                            } else {
                                notificationService.error('Error updating map.');
                            }
                        });
                    } else {
                        mapModel.$save(function (user, headers) {
                            notificationService.success('Map created');
                        }, function (error) {
                            notificationService.error('Error creating map.'); //TODO: Show specific error?
                            return false;
                        });
                    }
                }
            };

            controller.saveTeam = function (teamModel) {
                if (validateForm() === true) {
                    if (isEdit) {
                        dataListService.updateTeam({ teamId: teamModel._id }, teamModel).$promise.then(function (result) {
                            if (result._id) {
                                notificationService.success('Team updated');
                            } else {
                                notificationService.error('Error updating team.');
                            }
                        });
                    } else {
                        teamModel.$save(function (user, headers) {
                            notificationService.success('Team created');
                        }, function (error) {
                            notificationService.error('Error creating team.'); //TODO: Show specific error?
                            return false;
                        });
                    }
                }
            };

            function getTeam(id) {
                dataListService.getTeam({ teamId: id }).$promise.then(function (result) {
                    var data = cleanResponse(result);
                    controller.ui.teamModel = data;
                });
            }

            function getCaster(id) {
                dataListService.getCaster({ casterId: id }).$promise.then(function (result) {
                    var data = cleanResponse(result);
                    controller.ui.casterModel = data;
                });
            }

            function getMap(id) {
                dataListService.getMap({ mapId: id }).$promise.then(function (result) {
                    var data = cleanResponse(result);
                    controller.ui.mapModel = data;
                });
            }

            function cleanResponse(resp) {
                return JSON.parse(angular.toJson(resp));
            }

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