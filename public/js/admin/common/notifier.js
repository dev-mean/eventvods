(function() {
    'use strict';
    angular.module('eventApp').factory('notifier', function($rootScope) {
        return {
            success: function(msg) {
                $rootScope.$emit('addAlert', {
                    type: 'success',
                    msg: msg
                });
            },
            info: function(msg) {
                $rootScope.$emit('addAlert', {
                    type: 'info',
                    msg: msg
                });
            },
            warning: function(msg) {
                $rootScope.$emit('addAlert', {
                    type: 'warning',
                    msg: msg
                });
            },
            danger: function(msg) {
                $rootScope.$emit('addAlert', {
                    type: 'danger',
                    msg: msg
                });
            }
        }
    });
}());