(function () {
	'use strict';
	angular.module('eventApp')
		.controller('gamesController', ['gamesService', '$uibModal', 'API_BASE_URL', '$timeout', 'notifier',
			function (Games, $modal, API, $timeout, notifier) {
				var vm = this,
					parsley;
				vm.editing = false;
				vm.validating = false;
				vm.form = {
					stage: 0
				};
				vm.stages = ['Game Details', 'Graphics', 'Submit'];
				vm.gameData = [];
				vm.filter = {};
				vm.sorts = [{
					name: 'Name',
					sortField: 'name',
					reverse: false
				}, {
					name: 'URL Slug',
					sortField: 'slug',
					reverse: false
				}, {
					name: 'Events',
					sortField: 'eventsCount',
					reverse: true
				}, {
					name: 'Teams',
					sortField: 'teamsCount',
					reverse: true
				}];
				vm.sort = vm.sorts[0];
				vm.paging = {
					itemsPerPage: 10,
					pages: function () {
						var pages = Math.ceil(vm.filterData.length / vm.paging.itemsPerPage);
						if (vm.paging.page > pages && pages > 0) vm.paging.page = pages;
						return pages;
					},
					page: 1
				};

				$('#slug').attr('data-parsley-remote', API + '/validate/gameSlug/{value}');
				parsley = $('#addGameForm').parsley();

				vm.delete = function (game) {
					$modal.open({
						templateUrl: 'deleteModal.html',
						controller: function ($scope) {
							$scope.item = game.name;
							$scope.ok = function () {
								Games.delete(game._id)
									.then(function () {
										notifier.success('Deleted ' + game.name);
										$scope.$close();
										Games.find()
											.then(function (res) {
												vm.gameData = res.data;
											});
									})
							}
						}
					})
				}
				vm.initAdd = function () {
					vm.editing = false;
					parsley.destroy();
					$('#slug').attr('data-parsley-remote', API + '/validate/gameSlug/{value}');
					parsley = $('#addGameForm').parsley();
					vm.form = {
						stage: 0
					};
				}
				vm.edit = function (id) {
					vm.editing = true;
					parsley.destroy();
					$('#slug').attr('data-parsley-remote', API + '/validate/gameSlug/{value}/' + id);
					parsley = $('#addGameForm').parsley();
					Games.findById(id)
						.then(function (res) {
							vm.form = res.data;
							vm.form.stage = 0;
						})
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
						Games.update(vm.form._id, vm.form)
						.then(Games.find)
						.then(function (res) {
							vm.gameData = res.data;
							vm.form.stage = vm.form.stage + 1;
							vm.validating = false;
							notifier.success('Updated ' + vm.form.name);
						})
					else
						Games.create(vm.form)
						.then(Games.find)
						.then(function (res) {
							vm.gameData = res.data;
							vm.form.stage = vm.form.stage + 1;
							vm.validating = false;
							notifier.success('Added '+vm.form.name);
						})
				}
				Games.find()
					.then(function (res) {
						vm.gameData = res.data;
					});
			}
		]);
}());
