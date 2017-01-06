(function () {
	'use strict';
	angular.module('eventApp')
		.controller('staffController', ['staffService', '$uibModal', 'API_BASE_URL', '$timeout', 'notifier',
			function (Staff, $modal, API, $timeout, notifier) {
				var vm = this,
					parsley;
				vm.editing = false;
				vm.validating = false;
				vm.form = {
					stage: 0,
					media: []
				};
				vm.stages = ['Staff Details', 'Social Media', 'Submit'];
				vm.staffData = [];
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
					name: 'Alias',
					sortField: 'alias',
					reverse: false
				}, {
					name: 'Role',
					sortField: 'role',
					reverse: false
				}];
				vm.sort = vm.sorts[0];
				vm.paging = {
					itemsPerPage: 8,
					pages: function () {
						var pages = Math.ceil(vm.filterData.length / vm.paging.itemsPerPage);
						if (vm.paging.page > pages && pages > 0) vm.paging.page = pages;
						return pages;
					},
					page: 1
				};

				$('#slug').attr('data-parsley-remote', API + '/validate/staffSlug/{value}');
				parsley = $('#addStaffForm').parsley();

				vm.prevPage = function(){
                    if(vm.paging.page > 1) vm.paging.page--;
                }
                vm.nextPage = function(){
                    if(vm.paging.page < vm.paging.pages()) vm.paging.page++;
                }

				vm.delete = function (staff) {
					$modal.open({
						templateUrl: 'deleteModal.html',
						controller: function ($scope) {
							$scope.item = staff.name;
							$scope.type = 'Staff';
							$scope.ok = function () {
								Staff.delete(staff._id)
									.then(function () {
										notifier.success('Deleted ' + staff.name);
										$scope.$close();
										Staff.find()
											.then(function (res) {
												vm.staffData = res.data;
											});
									})
							}
						}
					})
				}
				vm.initAdd = function () {
					vm.editing = false;
					parsley.destroy();
					$('#slug').attr('data-parsley-remote', API + '/validate/staffSlug/{value}');
					parsley = $('#addStaffForm').parsley();
					vm.form = {
						stage: 0,
						media: []
					};
				}
				vm.edit = function (id) {
					vm.editing = true;
					parsley.destroy();
					$('#slug').attr('data-parsley-remote', API + '/validate/staffSlug/{value}/' + id);
					parsley = $('#addStaffForm').parsley();
					Staff.findById(id)
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
						Staff.update(vm.form._id, vm.form)
						.then(Staff.find)
						.then(function (res) {
							vm.staffData = res.data;
							vm.form.stage = vm.form.stage + 1;
							vm.validating = false;
							notifier.success('Updated ' + vm.form.name);
						})
					else
						Staff.create(vm.form)
						.then(Staff.find)
						.then(function (res) {
							vm.staffData = res.data;
							vm.form.stage = vm.form.stage + 1;
							vm.validating = false;
							notifier.success('Added '+vm.form.name);
						})
				}
				Staff.find()
					.then(function (res) {
						vm.staffData = res.data;
					});
				Staff.getRoles()
                    .then(function(res){
						vm.staffRoles = res.data;
                    });
			}
		]);
}());
