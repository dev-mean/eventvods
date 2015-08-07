angular.module('dataServices', [])
    .factory('Casters', function($http) {
        return {
            get : function() {
                return $http.get('/api/casters');
            },
            create : function(casterData) {
                return $http.post('/api/casters', casterData);
            },
            delete : function(id) {
                return $http.delete('/api/casters/' + id);
            }
        };
    })
	.factory('Maps', function($http) {
        return {
            get : function() {
                return $http.get('/api/maps');
            },
            create : function(mapData) {
                return $http.post('/api/maps', mapData);
            },
            delete : function(id) {
                return $http.delete('/api/maps/' + id);
            }
        };
    })
	.factory('Teams', function($http) {
        return {
            get : function() {
                return $http.get('/api/teams');
            },
            create : function(teamDate) {
                return $http.post('/api/teams', teamData);
            },
            delete : function(id) {
                return $http.delete('/api/events/' + id);
            }
        };
    });