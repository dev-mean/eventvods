( function() {
    'use strict';
    angular.module( 'eventApp' )
        .controller( 'addLeagueController', [ 'leaguesService', '$location', 'notificationService', 'API_BASE_URL', 'gamesService',
            function( Leagues, $location, toastr, API_BASE_URL, Games ) {
                var vm = this;
                vm.title = "Add League";
                vm.errors = [];
                vm.data = {};
                vm.parsley = $( '#addLeagueForm' )
                    .parsley();
                Games.find()
                    .then( function( response ) {
                        vm.games = response.data.reduce(function(obj, item){
                            obj[item.gameName] = item._id;
                            return obj;
                        }, {});
                        vm.gameSelect = new Awesomplete( document.getElementById( 'game' ), {
                            list: response.data.map( function( item ) {
                                return {
                                    label: item.gameAlias.toUpperCase() + " - " + item.gameName,
                                    value: item.gameName
                                };
                            } ),
                            minChars: 1
                        } );
                        $( '#game-caret' )
                            .click( function() {
                                if ( vm.gameSelect.ul.childNodes.length === 0 ) {
                                    vm.gameSelect.minChars = 0;
                                    vm.gameSelect.evaluate();
                                } else if ( vm.gameSelect.ul.hasAttribute( 'hidden' ) ) {
                                    vm.gameSelect.open();
                                } else {
                                    vm.gameSelect.close();
                                }
                            } )
                        $(document).on('awesomplete-selectcomplete', vm.selectGame);
                    } );
                vm.selectGame = function(){
                    vm.data.leagueGame = vm.games[$('#game').val()];
                }
                vm.submit = function() {
                    if ( vm.parsley.validate() ) Leagues.create( vm.data )
                        .then( function( response ) {
                            toastr.success( 'League added.', {
                                closeButton: true
                            } );
                            $location.path( '/leagues' );
                        }, function( response ) {
                            vm.errors = response.data.errors;
                        } );
                }
            }
        ] );
}() );