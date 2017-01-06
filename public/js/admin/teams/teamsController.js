(function () {
	'use strict';
	angular.module('eventApp')
		.controller('teamsController', ['teamsService', '$uibModal', 'API_BASE_URL', '$timeout', 'notifier', 'gamesService',
			function (Teams, $modal, API, $timeout, notifier, Games) {
				var vm = this,
					parsley,
					mappedGames;
				vm.editing = false;
				vm.validating = false;
				vm.form = {
					stage: 0,
					media: []
				};
				vm.stages = ['Team Details', 'Social Media', 'Submit'];
				vm.teamsData = [];
				vm.filter = {};
				vm.sorts = {
					sortField: 'name',
					reverse: false
				}
				vm.paging = {
					itemsPerPage: 8,
					pages: function () {
						var pages = Math.ceil(vm.filterData.length / vm.paging.itemsPerPage);
						if (vm.paging.page > pages && pages > 0) vm.paging.page = pages;
						return pages;
					},
					page: 1
				};

				$('#slug').attr('data-parsley-remote', API + '/validate/teamsSlug/{value}');
				parsley = $('#addTeamForm').parsley();

				vm.prevPage = function(){
                    if(vm.paging.page > 1) vm.paging.page--;
                }
                vm.nextPage = function(){
                    if(vm.paging.page < vm.paging.pages()) vm.paging.page++;
                }

				vm.delete = function (teams) {
					$modal.open({
						templateUrl: 'deleteModal.html',
						controller: function ($scope) {
							$scope.item = teams.name;
							$scope.type = 'Team';
							$scope.ok = function () {
								Teams.delete(teams._id)
									.then(function () {
										notifier.success('Deleted ' + teams.name);
										$scope.$close();
										Teams.find()
											.then(function (res) {
												vm.teamsData = res.data;
											});
									})
							}
						}
					})
				}
				vm.initAdd = function () {
					vm.editing = false;
					parsley.destroy();
					parsley = $('#addTeamForm').parsley();
					vm.form = {
						stage: 0,
						media: []
					};
					$('#slug').attr('data-parsley-remote', API + '/validate/teamSlug/{value}/game/');
				}
				vm.edit = function (id) {
					vm.editing = true;
					parsley.destroy();
					parsley = $('#addTeamForm').parsley();
					Teams.findById(id)
						.then(function (res) {
							vm.form = res.data;
							vm.form.stage = 0;
							vm.form.game = vm.form.game._id;
							vm.setGame();
						})
				}
				vm.setGame = function(){
					if(typeof vm.form.game === "undefined") return;
					if(vm.editing)
						$('#slug').attr('data-parsley-remote', API + '/validate/teamSlug/{value}/'+vm.form._id+'/game/'+vm.form.game);
					else
						$('#slug').attr('data-parsley-remote', API + '/validate/teamSlug/{value}/game/'+vm.form.game);
					parsley.destroy();
                	parsley =  $( '#addTeamForm').parsley();
					vm.gameName="/" + mappedGames[vm.form.game].slug;
				}
				vm.nextStage = function () {
					if (vm.form.stage < vm.stages.length - 1) {
						vm.validating = true;
						parsley.whenValidate()
							.done(function () {
								$timeout(function () {
									if (vm.form.stage === vm.stages.length - 2) return submit();
									vm.form.stage = vm.form.stage + 1;
									vm.validating = false;
								}, 50);
							})
							.catch(function () {
								$timeout(function () {
									vm.validating = false;
								}, 50);
							})
					}

				}
				vm.prevStage = function () {
					if (vm.form.stage > 0) vm.form.stage = vm.form.stage - 1;
				}

				function submit() {
					if (vm.editing)
						Teams.update(vm.form._id, vm.form)
						.then(Teams.find)
						.then(function (res) {
							vm.teamsData = res.data;
							vm.form.stage = vm.form.stage + 1;
							vm.validating = false;
							notifier.success('Updated ' + vm.form.name);
						})
					else
						Teams.create(vm.form)
						.then(Teams.find)
						.then(function (res) {
							vm.teamsData = res.data;
							vm.form.stage = vm.form.stage + 1;
							vm.validating = false;
							notifier.success('Added '+vm.form.name);
						})
				}
				Teams.find()
					.then(function (res) {
						vm.teamsData = res.data;
					});
				Games.find()
					.then(function (res) {
						vm.games = res.data;
						mappedGames = res.data.reduce(function(result, item){
							result[item._id] = item;
							return result;
						}, {});
					});
			}
		]);
}());
