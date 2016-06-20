(function() {
    'use strict';
    angular.module('eventApp')
        .controller('newEventController', ['eventService',
            function(eventService) {
                var controller = this;
                controller.ui = {
                    stage: 1,
                    errors: {
                        s1: false,
                        s2: false,
                        s3: false,
                        s4: false,
                        s5: false,
                        s6: false
                    },
                    parsley: $('#newEventForm')
                        .parsley(),
                    data: {
                        media: [],
                    },
                };
                controller.options = {
                    format: 'yyyy-mm-dd'
                };
                controller.nextSection = function() {
                    if (controller.ui.stage < 6) controller.ui.stage++;
                    controller.validate();
                };
                controller.prevSection = function() {
                    if (controller.ui.stage > 1) controller.ui.stage--;
                    controller.validate();
                };
                controller.validate = function() {
                    controller.ui.errors.s1 = controller.ui.parsley.validate('s1');
                    controller.ui.errors.s2 = controller.ui.parsley.validate('s2');
                }
                controller.addMedia = function(){
                    controller.ui.data.media.push({type: '',name: '', url: ''});
                }
                controller.removeMedia = function(index){
                    controller.ui.data.media.splice(index, 1);
                }
                controller.test = function() {
                    console.log(controller.ui.data.media);
                }
            }
        ]);
}());
