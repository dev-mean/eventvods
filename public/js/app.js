( function() {
    'use strict';
    angular.module( 'eventApp', [ 'ngAnimate', 'ngResource', 'ngRoute', 'angular-loading-bar', 'ngDialog' ] )
        .constant( 'eventConstants', {
            baseUri: '/api/'
        } )
        .constant( 'API_BASE_URL', '/api' )
        // Set up titles on ngroute pages
        .run( [ '$rootScope', '$route', function( $rootScope, $route ) {
            $rootScope.$on( '$routeChangeSuccess', function() {
                document.title = "eventVODs - " + $route.current.title;
            } );
        } ] )
        // Offset filter for paging lists
        .filter( 'offset', function() {
            return function( input, start ) {
                start = parseInt( start, 10 );
                return input.slice( start );
            };
        } )
        // File upload handling adapted from
        // http://odetocode.com/blogs/scott/archive/2013/07/10/angularjs-drag-and-drop-photo-directive.aspx
        // and
        // http://webreflection.blogspot.co.uk/2010/12/100-client-side-image-resizing.html
        .factory( 'fileReader', [ '$q', '$log', function( $q, $log ) {
            var onLoad = function( reader, deferred, scope ) {
                return function() {
                    scope.$apply( function() {
                        deferred.resolve( reader.result );
                    } );
                };
            };
            var onError = function( reader, deferred, scope ) {
                return function() {
                    scope.$apply( function() {
                        deferred.reject( reader.result );
                    } );
                };
            };
            var onProgress = function( reader, scope ) {
                return function( event ) {
                    scope.$broadcast( "fileProgress", {
                        total: event.total,
                        loaded: event.loaded
                    } );
                };
            };
            var getReader = function( deferred, scope ) {
                var reader = new FileReader();
                reader.onload = onLoad( reader, deferred, scope );
                reader.onerror = onError( reader, deferred, scope );
                reader.onprogress = onProgress( reader, scope );
                return reader;
            };
            var readAsDataURL = function( file, scope ) {
                var deferred = $q.defer();
                var reader = getReader( deferred, scope );
                reader.readAsDataURL( file );
                return deferred.promise;
            };
            return {
                readAsDataUrl: readAsDataURL
            };
        } ] )
        .directive( "imageDrop", [ 'fileReader', function( fileReader) {
            return {
                restrict: "E",
                replace: true,
                template: "<div class='image-drop'><div class='image-container'><img class='preview' /></div><div class='controls-container'><p>Drag image, or click to select a file.</p><p><input type='file' /><a><i class='fa fa-file-image-o'></i><span>Select Image</span></a></p></div></div>",
                scope: {
                    model: "="
                },
                link: function( $scope, $element, $attrs ) {
                    $scope.dom = {
                        preview: $element
                            .children('.image-container')
                            .children( '.preview' ),
                        input: $element
                            .children('.controls-container')
                            .children( 'p' )
                            .children( 'input' ),
                        btn: $element
                            .children('.controls-container')
                            .children( 'p' )
                            .children( 'a' )
                    };
                    var width = $attrs.previewWidth;
                    var height = $attrs.previewHeight;
                    $scope.dom.preview.css( {
                        width: width + "px",
                        height: height + "px",
                    } );
                    $scope.dom.preview.attr('src', ($scope.model || "http://placehold.it/"+width+"x"+height ));
                    $scope.dom.btn.on('click', function(e){
                        e.preventDefault();
                        $scope.dom.input.trigger('click');
                    })
                    $( 'body' )
                        .on( 'dragover dragleave drop', function( e ) {
                            e.preventDefault();
                        } )
                    $element.on( "dragover", function( e ) {
                            e.preventDefault();
                            $element.addClass( "dragOver" );
                        } )
                        .on( "dragleave", function( e ) {
                            e.preventDefault();
                            $element.removeClass( "dragOver" );
                        } )
                        .on( "drop", function( e ) {
                            e.preventDefault();
                            var file = e.originalEvent.dataTransfer.files[ 0 ];
                            $element.removeClass( "dragOver" );
                            loadFile( file );
                        } );
                    $scope.dom.input.on( 'change', function( e ) {
                        var file = e.target.files[ 0 ];
                        loadFile( file );
                    } );
                    $scope.$watch('model', function(){
                        $scope.dom.preview.attr('src', $scope.model);
                    })
                    var loadFile = function( file ) {
                        fileReader.readAsDataUrl( file, $scope )
                            .then( function( data ) {
                                $scope.dom.preview.attr( 'src', data );
                                $scope.model = data;
                            } )
                    };
                }
            };
        } ] )
        .config( function( $routeProvider, $locationProvider ) {
            $locationProvider.html5Mode(true);
            $routeProvider
            // route for the home page
                .when( '/', {
                    templateUrl: '/assets/views/dashboard.html',
                    controller: 'overviewController',
                    controllerAs: 'overviewController',
                    title: "Dashboard"
                } )
                .when( '/games', {
                    templateUrl: '/assets/views/game/list.html',
                    controller: 'gamesListController',
                    controllerAs: 'gamesListController',
                    title: "Games"
                } )
                .when( '/games/new', {
                    templateUrl: '/assets/views/game/form.html',
                    controller: 'addGameController',
                    controllerAs: 'gameFormController',
                    title: "Add Game"
                } )
                .when( '/game/:id/edit', {
                    templateUrl: '/assets/views/game/form.html',
                    controller: 'editGameController',
                    controllerAs: 'gameFormController',
                    title: "Edit Game"
                } )
                .when( '/leagues', {
                    templateUrl: '/assets/views/league/list.html',
                    controller: 'leaguesListController',
                    controllerAs: 'leaguesListController',
                    title: "Leagues"
                } )
                .when( '/leagues/new', {
                    templateUrl: '/assets/views/league/form.html',
                    controller: 'addLeagueController',
                    controllerAs: 'leagueFormController',
                    title: "Add League"
                } )
                .when( '/league/:id/edit', {
                    templateUrl: '/assets/views/league/form.html',
                    controller: 'editLeagueController',
                    controllerAs: 'leagueFormController',
                    title: "Edit League"
                } )
                .when( '/events', {
                    templateUrl: '/assets/views/event/list.html',
                    controller: 'eventListController',
                    controllerAs: 'eventListController',
                    title: "Events"
                } )
                .when( '/events/new', {
                    templateUrl: '/assets/views/event/form.html',
                    controller: 'newEventController',
                    controllerAs: 'newEventController',
                    title: "New Event"
                } )
                .when( '/staff', {
                    templateUrl: '/assets/views/staff.html',
                    controller: 'staffListController',
                    controllerAs: 'staffListController',
                    title: "Staff"
                } )
                .when( '/maps', {
                    templateUrl: '/assets/views/maps.html',
                    controller: 'mapListController',
                    controllerAs: 'mapListController',
                    title: "Maps"
                } )
                .when( '/teams', {
                    templateUrl: '/assets/views/teams.html',
                    controller: 'teamListController',
                    controllerAs: 'teamListController',
                    title: "Teams"
                } )
        } )
}() );