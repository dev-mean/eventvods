(function() {
    'use strict';
    angular.module('eventApp').controller('newEventController', ['eventService',
        function(eventService) {
            var controller = this;
            controller.ui = {
                stage: 1,
                errors: {
                    s1: true,
                    s2: false,
                    s3: false,
                    s4: false,
                    s5: false,
                    s6: false
                },
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
            };
            controller.test = function() {
                var parsley = $('#newEventForm').parsley();
                console.log(parsley.validate());
            }
        }
    ]);
}());