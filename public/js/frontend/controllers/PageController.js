(function() {
    'use strict';
    angular.module('eventvods')
        .factory('NavService', ['$http', 'API_BASE_URL', function($http, API_BASE_URL) {
            return {
                get: function() {
                    return $http.get(API_BASE_URL + '/featured');
                }
            };
        }])
        .controller('PageController', ['SessionManager', '$rootScope', '$timeout', '$cookies', '$window', 'NavService', '$location', '$http', 'API_BASE_URL',
            function(SessionManager, $rootScope, $timeout, $cookies, $window, NavService, $location, $http, API) {
                var vm = this;
                var element_images = 17;
                vm.session = null;
                vm.nav = null;
                var now = new $window.Date(),
                    // this will set the expiration to 6 months
                    exp = new $window.Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
                var cookieSettings = {
                    expires: exp
                }
                vm.contentClass = $cookies.get('contentMode') || "light";
                vm.cookiesAccepted = ($cookies.get('cookieDisclaimer') === "true");
                vm.compact = ($cookies.get('compactDisplay') === "true");
                vm.contentClassSet = function() {
                    $cookies.put('contentMode', vm.contentClass, cookieSettings);
                };
                vm.acceptCookies = function() {
                    $cookies.put('cookieDisclaimer', true, cookieSettings);
                };
                vm.compactSet = function(compact) {
                    vm.compact = compact;
                    $cookies.put('compactDisplay', compact, cookieSettings);
                }
                $rootScope.$on('sessionUpdate', function() {
                    vm.session = SessionManager.get();
                    vm.inlineYoutube = inlineYoutube();
                    vm.inlineTwitch = inlineTwitch();
                    $('.dropdown-button#userProfile').dropdown({
                        hover: true,
                        belowOrigin: true,
                        alignment: "left"
                    });
                });
                vm.log = function(obj) {
                    console.log(obj);
                }
                vm.logout = function() {
                    SessionManager.logout();
                };
				function login(){
					var path = "/login?return=" + encodeURIComponent($location.path());
					return $location.url(path);
				}
                vm.init = function() {
                    $timeout(function() {
                        $('.evSlider.multiple').evSlider({
                            delay: 7500
                        });
                    }, 5);
                    $('.dropdown-button').dropdown({
                        hover: true,
                        belowOrigin: true,
                        alignment: "left"
                    });
                };
                vm.eventClass = function($index) {
                    if(vm.nav.orderedEvents[$index].game === null) return "border-top";
                    if ($index === 0 ||
                        vm.nav.orderedEvents[$index].game.name !== vm.nav.orderedEvents[$index - 1].game.name) return "border-top";
                    else return "";
                };
                vm.elementClass = function($index) {
                    var img = ($index % element_images) + 1;
                    return "element-" + img;
                }
                vm.following = function(id) {
                    if (vm.session == false || vm.session == null || vm.session.following == null) return false;
                    else if (vm.session.following.indexOf(id) > -1) return true;
                    else return false;
                }
                vm.toggleFollow = function(id) {
                    if (vm.session == false || vm.session == null) return login();
                    var index = vm.session.following == null ? -1 : vm.session.following.indexOf(id);
                    if (index > -1)
                        vm.session.following.splice(index, 1);
                    else vm.session.following.push(id);
                    SessionManager.following(vm.session.following);
                }
                vm.rate = function(id, rating, index, spoilerCheck){
                    if (vm.session == false || vm.session == null) return login();
                    $http.post(API+'/ratings', {
                        match: id,
                        rating: rating,
                        index: index
                    }, {
                        ignoreLoadingBar: true
                    });
                    $timeout(function(){
                        $('.ratings-popup').removeClass('show');
                    }, 1000);
                }
                var inlineYoutube = function() {
                    if (vm.session == null || vm.session == false) return true;
                    else return vm.session.settings.inline.youtube;
                }
                var inlineTwitch = function() {
                    if (vm.session == null || vm.session == false) return true;
                    else return vm.session.settings.inline.youtube;
                }
                NavService.get()
                    .then(function(res) {
                        vm.nav = res.data;
                        vm.init();
                    });
            }
        ]);
}());
