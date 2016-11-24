(function() {
    'use strict';
    angular.module('eventvods')
        .service('SessionManager', ['$http', 'API_BASE_URL', '$q', '$rootScope', function($http, URL, $q, $rootScope) {
            var svc = this,
                session = null;
            svc.get = function() {
                return session;
            };
            svc.load = function() {
                $http.get(URL + '/auth/session')
                    .then(function(res) {
                        if (res.status === 200) session = res.data;
                        else session = false;
                        $rootScope.$broadcast('sessionUpdate');
                    })
                    .catch(function() {
                        session = false;
                        $rootScope.$broadcast('sessionUpdate');
                    });
            };
            svc.login = function(data) {
                var q = $q.defer();
                $http.post(URL + '/auth/login', data)
                    .then(function(res) {
                        session = res.data;
                        $rootScope.$broadcast('sessionUpdate');
                        q.resolve();
                    })
                    .catch(function(err) {
                        session = false;
                        $rootScope.$broadcast('sessionUpdate');
                        q.reject(err.data);
                    });
                return q.promise;
            };
            svc.register = function(data) {
                var q = $q.defer();
                $http.post(URL + '/auth/register', data)
                    .then(function(res) {
                        session = res.data;
                        $rootScope.$broadcast('sessionUpdate');
                        q.resolve();
                    })
                    .catch(function(errs) {
                        session = false;
                        $rootScope.$broadcast('sessionUpdate');
                        q.reject(errs.data);
                    });
                return q.promise;
            };
            svc.logout = function() {
                $http.get(URL + '/auth/logout')
                    .finally(function() {
                        session = false;
                        $rootScope.$broadcast('sessionUpdate');
                    });
            };
            svc.following = function(data) {
                $http.post(URL + '/user/following', data, {
                    ignoreLoadingBar: true
                })
            }
            svc.reset = function(data) {
                return $http.post(URL + '/user/reset', data);
            }
            $rootScope.$on('triggerSessionUpdate', svc.load);
            svc.load();
        }]);
}());