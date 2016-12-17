(function() {
    'use strict';
    angular.module('eventApp')
        .controller('articlesListController', ['articlesService', '$uibModal', 'API_BASE_URL', '$timeout', 'notifier',
            function(Articles, $modal, API, $timeout, notifier) {
                var vm = this, parsley;
                vm.validating = false;
                vm.articlesData = [];
                vm.form = {
					stage: 0
				};
                vm.stages = ['Info', 'Content', 'Graphics', 'Submit'];
                vm.filter = {};
                vm.sorts = [{
					name: 'Publish Date',
					sortField: 'publishDate',
					reverse: true
				}, {
					name: 'Article Title',
					sortField: 'title',
					reverse: false
				}, {
					name: 'URL Slug',
					sortField: 'slug',
					reverse: false
				}];
                vm.sort = vm.sorts[0];
                vm.paging = {
                    itemsPerPage: 6,
                    pages: function() {
                        var pages = Math.ceil(vm.filterData.length / vm.paging.itemsPerPage);
                        if (vm.paging.page > pages && pages > 0) vm.paging.page = pages;
                        return pages;
                    },
                    page: 1
                };

                $('#slug').attr('data-parsley-remote', API + '/validate/articleSlug/{value}');
				parsley = $('#addArticleForm').parsley();

                Articles.find()
                    .then(function(res) {
                        vm.articlesData = res.data;
                    });

                vm.prevPage = function(){
                    if(vm.paging.page > 1) vm.paging.page--;
                }
                vm.nextPage = function(){
                    if(vm.paging.page < vm.paging.pages()) vm.paging.page++;
                }
                vm.initAdd = function () {
					vm.editing = false;
					parsley.destroy();
					$('#slug').attr('data-parsley-remote', API + '/validate/articleSlug/{value}');
					parsley = $('#addArticleForm').parsley();
					vm.form = {
						stage: 0
					};
				}
				vm.edit = function (id) {
					vm.editing = true;
					parsley.destroy();
					$('#slug').attr('data-parsley-remote', API + '/validate/articleSlug/{value}/' + id);
					parsley = $('#addArticleForm').parsley();
					Articles.findById(id)
						.then(function (res) {
							vm.form = res.data;
							vm.form.stage = 0;
						})
				}
                vm.delete = function(article) {
                    $modal.open({
						templateUrl: 'deleteModal.html',
						controller: function ($scope) {
							$scope.item = article.title
							$scope.ok = function () {
								Articles.delete(article._id)
									.then(function () {
										notifier.success('Deleted ' + article.title);
										$scope.$close();
										Articles.find()
											.then(function (res) {
												vm.articlesData = res.data;
											});
									})
							}
						}
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
						Articles.update(vm.form._id, vm.form)
						.then(Articles.find)
						.then(function (res) {
							vm.articlesData = res.data;
							vm.form.stage = vm.form.stage + 1;
							vm.validating = false;
							notifier.success('Updated ' + vm.form.title);
						})
					else
						Articles.create(vm.form)
						.then(Articles.find)
						.then(function (res) {
							vm.articlesData = res.data;
							vm.form.stage = vm.form.stage + 1;
							vm.validating = false;
							notifier.success('Added ' + vm.form.title);
						})
				}
            }
        ]);
}());
