(function() {
    'use strict';
    angular.module('eventApp').controller('newEventController', ['eventService',
        function(eventFormService) {
            var controller = this;
            controller.ui = {
                stage: 1,
                errors: [],
                data: {},
            };
            controller.options = {
                format: 'yyyy-mm-dd'
            };
            controller.nextSection = function() {
                if (controller.ui.stage < 6) controller.ui.stage++;
            };
            controller.prevSection = function() {
                if (controller.ui.stage > 1) controller.ui.stage--;
            }
        }
    ]);
}());