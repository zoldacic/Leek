(function () {
    'use strict';

    var controllerId = 'datasetsCtrl';
    angular.module(appName).controller(controllerId, [datasetsCtrl]);

    function datasetsCtrl($scope) {
        var vm = this;

        function setupGrids() {
            vm.datasetGridOptions = {
                data: 'vm.datasets',
                enableCellSelection: false,
                enableRowSelection: false,
                enableCellEditOnFocus: false,
                columnDefs: [
                    { field: 'name', displayName: 'Name', enableCellEdit: false },
                    { field: 'tags', displayName: 'Tags', enableCellEdit: false },
                    { field: 'color.name', displayName: 'Color', enableCellEdit: false }
                ]
            };
        }

        function addDataset() {
            var tagList = _.filter(vm.tags, function (tag) { return tag.selected });
            var tags = '';

            if (tagList) {
                _.each(tagList, function (tag) {
                    tags += tags.length == 0 ? tag.name : ', ' + tag.name;
                });
            }

            vm.datasets.push({ name: vm.datasetName, color: vm.color, tags: tags, tagList: _.pluck(tagList, 'name') });

            _.each(vm.tags, function (tag) { tag.selected = false; });
            vm.datasetName = '';
            vm.color = null;
        }
        

        function activate() {
            tagsRef = resourceHandler.tagsRef;
            transactionRef = resourceHandler.transactionRef;

            vm.addDataset = addDataset;

            vm.colors = [{ name: "Red", code: "#FF0000" },
                { name: "Green", code: "#00FF00" },
                { name: "Blue", code: "#0000FF" }];

            tagsRef.$on('loaded', function (eventTagLists) {
                var uniqueTags = [];
                var tags = _.flatten(_.pluck(eventTagLists, 'tags'));
                _.each(tags, function (tag) {
                    if (_.indexOf(uniqueTags, tag) < 0) {
                        uniqueTags.push(tag);
                    }
                });

                vm.tags = [];
                _.each(uniqueTags, function (tag) {
                    vm.tags.push({ name: tag, selected: false });
                });

            });
        }

        activate();
    }
})();
