(function () {
    'use strict';

    var controllerId = 'tagsCtrl';

    angular.module(appName).controller(controllerId, ['$scope', 'resourceHandler', tagsCtrl]);

    function tagsCtrl($scope, resourceHandler) {
        var vm = this;

        function setupGrids() {
            vm.tagGridOptions = {
                data: 'vm.tags',
                enableCellSelection: true,
                enableRowSelection: true,
                multiSelect: false,
                keepLastSelected: true,
                enableCellEditOnFocus: true,
                showGroupPanel: true,
                showFilter: true,
                sortInfo: { fields: ['event',' tags'], directions: ['asc', 'asc']},
                columnDefs: [
                    { field: 'event', displayName: 'Event', enableCellEdit: false },
                    { field: 'tags', displayName: 'Tags', enableCellEdit: true }
                ]
            };
        }

        function listTags() {
            resourceHandler.listTags().then(function (tags) {
                vm.tags = [];

                // TODO: Move to resourcehandler
                _.each(tags, function (tag, key) {
                    tag.key = key;
                    tag.tags = _.reduce(tag.tags, function (text, tagName) { return text + ', ' + tagName; });
                    vm.tags.push(tag);
                });
            });
        }

        function getGridHeight() {
            var noOfTags = vm.tags ? vm.tags.length : 0;
            return 70 + noOfTags * 30 + 'px';
        }

        function activate() {
            listTags();
            setupGrids();

            vm.getGridHeight = getGridHeight;

            $scope.$on('ngGridEventEndCellEdit', function (data) {
                var eventTagList = data.targetScope.row.entity;

                // TODO: Same code exists in TransactionInput
                var eventTags = _.map(eventTagList.tags.split(','), function (eventTag) { return eventTag.trim() });
                eventTags = _.filter(eventTags, function (eventTag) { return eventTag && eventTag.length > 0 });

                resourceHandler.tagsRef.$remove(eventTagList.key);
                resourceHandler.tagsRef.$add({ event: eventTagList.event, tags: eventTags }).then(function (ref) {
                    eventTagList.key = ref.name();
                });                
            });
            
        }

        activate();
    }
})();
