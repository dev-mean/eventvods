(function () {
	'use strict';
	angular.module('eventApp')
		.controller('eventsController', ['eventsService', 'gamesService', '$uibModal', 'API_BASE_URL', '$timeout', 'notifier',
			function (Events, Games, $modal, API, $timeout, notifier) {
				var vm = this,
					parsley;
				vm.editing = false;
				vm.validating = false;
				vm.form = {
					stage: 0,
					media: [],
					teams: [],
					staff: []
				};
				vm.stages = ['Details', 'Extras', 'Teams', 'Staff', 'Media', 'Graphics', 'Submit'];
				vm.eventsData = [];
				vm.filter = {};
				vm.sorts = [{
					name: 'Event Date',
					sortField: 'endDate',
					reverse: true
				}, {
					name: 'Followers',
					sortField: 'followers',
					reverse: true
				}, {
					name: 'Teams',
					sortField: 'teams.length',
					reverse: true
				},{
					name: 'Staff',
					sortField: 'staff.length',
					reverse: true
				},{
					name: 'Event Title',
					sortField: 'name',
					reverse: false
				}, {
					name: 'URL Slug',
					sortField: 'slug',
					reverse: false
				}];
				vm.sort = vm.sorts[0];
				vm.paging = {
					itemsPerPage: 7,
					pages: function () {
						var pages = Math.ceil(vm.filterData.length / vm.paging.itemsPerPage);
						if (vm.paging.page > pages && pages > 0) vm.paging.page = pages;
						return pages;
					},
					page: 1
				};

                $('#slug').attr('data-parsley-remote', API + '/validate/eventSlug/{value}');
				parsley = $('#addEventForm').parsley();
                
                vm.delete = function (event) {
					$modal.open({
						templateUrl: 'deleteModal.html',
						controller: function ($scope) {
							$scope.item = event.name;
							$scope.type = 'Event';
							$scope.ok = function () {
								Events.delete(event._id)
									.then(function () {
										notifier.success('Deleted ' + event.name);
										$scope.$close();
										Events.find()
											.then(function (res) {
												vm.eventsData = res.data;
											});
									})
							}
						}
					})
				}

                vm.prevPage = function(){
                    if(vm.paging.page > 1) vm.paging.page--;
                }
                vm.nextPage = function(){
                    if(vm.paging.page < vm.paging.pages()) vm.paging.page++;
                }

                vm.initAdd = function () {
					vm.editing = false;
					parsley.destroy();
					$('#slug').attr('data-parsley-remote', API + '/validate/eventSlug/{value}');
					parsley = $('#addEventForm').parsley();
					vm.form = {
						stage: 0
					};
				}
				vm.edit = function (id) {
					vm.editing = true;
					parsley.destroy();
					$('#slug').attr('data-parsley-remote', API + '/validate/eventSlug/{value}/' + id);
					parsley = $('#addEventForm').parsley();
					Events.findById(id)
						.then(function (res) {
							vm.form = res.data;
							vm.form.stage = 0;
							vm.form.game = res.data.game._id;
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
						Events.update(vm.form._id, vm.form)
						.then(Events.find)
						.then(function (res) {
							vm.eventsData = res.data;
							vm.form.stage = vm.form.stage + 1;
							vm.validating = false;
							notifier.success('Updated ' + vm.form.name);
						})
					else
						Events.create(vm.form)
						.then(Events.find)
						.then(function (res) {
							vm.eventsData = res.data;
							vm.form.stage = vm.form.stage + 1;
							vm.validating = false;
							notifier.success('Added '+vm.form.name);
						})
				}
				Events.find()
					.then(function (res) {
						vm.eventsData = res.data;
						
					});
				Games.find()
					.then(function (res) {
						vm.games = res.data;
					});
			}
		]);
}());
