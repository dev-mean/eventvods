( function() {
    'use strict';
    angular.module( 'eventApp', [ 'ngAnimate', 'ngResource', 'ngRoute', 'angular-datepicker', 'angular-loading-bar', 'ngDialog' ] )
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
        .factory( 'imageResizer', [ '$q', function( $q ) {
            var resample = function( imageData, width, height, scope ) {
                var deferred = $q.defer();
                _Resample( imageData, width, height, function( result ) {
                    scope.$apply( function() {
                        deferred.resolve( result );
                    } );
                } );
                return deferred.promise;
            };
            var _Resample = ( function( canvas ) {
                // (C) WebReflection Mit Style License
                // Resample function, accepts an image
                // as url, base64 string, or Image/HTMLImgElement
                // optional width or height, and a callback
                // to invoke on operation complete
                function Resample( img, width, height, onresample ) {
                    var
                    // check the image type
                        load = typeof img == "string",
                        // Image pointer
                        i = load || img;
                    // if string, a new Image is needed
                    if ( load ) {
                        i = new Image;
                        // with propers callbacks
                        i.onload = onload;
                        i.onerror = onerror;
                    }
                    // easy/cheap way to store info
                    i._onresample = onresample;
                    i._width = width;
                    i._height = height;
                    // if string, we trust the onload event
                    // otherwise we call onload directly
                    // with the image as callback context
                    load ? ( i.src = img ) : onload.call( img );
                }
                // just in case something goes wrong
                function onerror() {
                    throw ( "not found: " + this.src );
                }
                // called when the Image is ready
                function onload() {
                    var
                    // minifier friendly
                        img = this,
                        // the desired width, if any
                        width = img._width,
                        // the desired height, if any
                        height = img._height,
                        // the callback
                        onresample = img._onresample;
                    // if width and height are both specified
                    // the resample uses these pixels
                    // if width is specified but not the height
                    // the resample respects proportions
                    // accordingly with orginal size
                    // same is if there is a height, but no width
                    width == null && ( width = round( img.width * height / img.height ) );
                    height == null && ( height = round( img.height * width / img.width ) );
                    // remove (hopefully) stored info
                    delete img._onresample;
                    delete img._width;
                    delete img._height;
                    // when we reassign a canvas size
                    // this clears automatically
                    // the size should be exactly the same
                    // of the final image
                    // so that toDataURL ctx method
                    // will return the whole canvas as png
                    // without empty spaces or lines
                    canvas.width = width;
                    canvas.height = height;
                    // drawImage has different overloads
                    // in this case we need the following one ...
                    context.drawImage(
                        // original image
                        img,
                        // starting x point
                        0,
                        // starting y point
                        0,
                        // image width
                        img.width,
                        // image height
                        img.height,
                        // destination x point
                        0,
                        // destination y point
                        0,
                        // destination width
                        width,
                        // destination height
                        height );
                    // retrieve the canvas content as
                    // base4 encoded PNG image
                    // and pass the result to the callback
                    onresample( canvas.toDataURL( "image/png" ) );
                }
                var
                // point one, use every time ...
                    context = canvas.getContext( "2d" ),
                    // local scope shortcut
                    round = Math.round;
                return Resample;
            }(
                // lucky us we don't even need to append
                // and render anything on the screen
                // let's keep this DOM node in RAM
                // for all resizes we want
                document.createElement( "canvas" ) ) );
            return {
                resample: resample
            };
        } ] )
        .directive( "imageDrop", [ 'fileReader', 'imageResizer', '$parse', function( fileReader, imageResizer, $parse ) {
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
        .directive( "imageUpload", [ '$parse', 'fileReader', 'imageResizer', function( $parse, fileReader, resampler ) {
            return {
                restrict: "EA",
                link: function( scope, element, attrs ) {
                    var expression = attrs.imageDrop;
                    var accesor = $parse( expression );
                    var onDragOver = function( e ) {
                        e.preventDefault();
                        element.addClass( "dragOver" );
                    };
                    var onDragEnd = function( e ) {
                        e.preventDefault();
                        element.removeClass( "dragOver" );
                    };
                    var placeImage = function( imageData ) {
                        accesor.assign( scope, imageData );
                    };
                    var resampleImage = function( imageData ) {
                        return resampler.resample( imageData, element.width(), element.height(), scope );
                    };
                    var loadFile = function( file ) {
                        fileReader.readAsDataUrl( file, scope )
                            .then( resampleImage )
                            .then( placeImage );
                    };
                    element.on( "dragover", onDragOver )
                        .on( "dragleave", onDragEnd )
                        .on( "drop", function( e ) {
                            e.preventDefault();
                        } );
                    scope.$watch( expression, function() {
                        element.attr( "src", accesor( scope ) );
                    } );
                }
            };
        } ] )
        .config( function( $routeProvider ) {
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
                    controller: 'leagueListController',
                    controllerAs: 'gameListController',
                    title: "Leagues"
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