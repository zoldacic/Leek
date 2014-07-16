
// TODO: Graphs are not correctly updated in grid when a new graph is added

(function () {
    'use strict';

    var controllerId = 'graphsCtrl';
    angular.module(appName).controller(controllerId, ['resourceHandler', 'config', graphsCtrl]);

    function graphsCtrl(resourceHandler, config) {
        var transactionRef, tagsRef, graphsRef;
        var datasetColors;
        var vm = this;

        function setupGrids() {
            vm.graphGridOptions = {
                data: 'vm.graphs',
                enableCellSelection: false,
                enableRowSelection: true,
                multiSelect: false,
                afterSelectionChange: afterSelectionChange,
                keepLastSelected: true,
                enableCellEditOnFocus: false,
                showGroupPanel: true,
                showFilter: true,
                sortInfo: { fields: ['name'], directions: ['asc'] },
                columnDefs: [
                    { field: 'name', displayName: 'Name', enableCellEdit: false },
                    { field: 'description', displayName: 'Description', enableCellEdit: false },
                    { field: 'type.name', displayName: 'Type', enableCellEdit: false },
                    { width: '80px', field: '', cellTemplate: '<button class="btn btn-default btn-grid" ng-click="vm.deleteGraph(row)">Delete</button>' }
                ]
            };
        }

        function selectTag(tag) {
            if (tag.tagGroupId >= datasetColors.length) {
                tag.tagGroupId = 0;
            } else {
                tag.tagGroupId++;
            }

            tag.style = { 'background-color': datasetColors[tag.tagGroupId] };
        }

        function getGridHeight() {
            var noOfGraphs = vm.graphs ? vm.graphs.length : 0;
            return 70 + noOfGraphs * 30 + 'px';
        }

        function reset() {
            _.each(vm.tags, function (tag) {
                tag.tagGroupId = 0;
                tag.style = { 'background-color': datasetColors[tag.tagGroupId] };
            });

            vm.graph = {};
        }

        function afterSelectionChange(rowItem) {

            // Updated items if the new row has caused the event (i.e. afterSelectionChange may be called twice, for 'unselect' and for 'select')
            if (rowItem.selected) {
                reset();

                vm.graph = rowItem.entity;
                _.each(vm.graph.datasets, function(dataset) {
                    var tagGroupId = _.indexOf(datasetColors, dataset.color);

                    _.each(dataset.tags, function (datasetTag) {
                        var tag = _.find(vm.tags, function (vmTag) { return vmTag.name == datasetTag; });

                        if (tag) {
                            // TODO: What to do if the colors has changed?
                            tag.tagGroupId = tagGroupId;
                            tag.style = { 'background-color': datasetColors[tag.tagGroupId] };
                        } else {
                            // TODO: What to do if a tag has changed name?
                        }
                    });
                });
            } 
        }

        function addGraph() {
            var sourceKey = vm.graph.key;
            vm.graph.key = null;
            updateGraph();

            // vm.graph.key = undoKey;
            // undoGraph();
        }

        function updateGraph() {
            vm.graph.datasets = [];

            var tagGroups = _.groupBy(vm.tags, function (tag) { return tag.tagGroupId });
            _.each(tagGroups, function (tagGroup) {
                if (tagGroup[0].tagGroupId > 0) {
                    var dataset = {};
                    dataset.color = datasetColors[tagGroup[0].tagGroupId];

                    dataset.tags = [];
                    _.each(tagGroup, function (tag) {
                        dataset.tags.push(tag.name);
                    });

                    vm.graph.datasets.push(dataset);
                }
            });

            var isUpdate = false;
            if (vm.graph.key) {
                graphsRef.$remove(vm.graph.key);
                isUpdate = true;
            }

            graphsRef.$add(vm.graph).then(function (ref) {
                vm.graph.key = ref.name();

                if (!isUpdate) {
                    resourceHandler.getGraph(ref.name()).then(function (storedGraph) {
                        // TODO: Set key as property in resourceHandler
                        storedGraph.key = ref.name();
                        vm.graphs.push(storedGraph);
                    });                    
                }
            });

            reset();
        }

        function deleteGraph(row) {
            var graph = row.entity;
            var index = _.indexOf(vm.graphs, graph);
            vm.graphs.splice(index, 1);

            graphsRef.$remove(graph.key);
            reset();

            vm.graphGridOptions.selectAll(false);
        }

        function undoGraph() {
            resourceHandler.getGraph(vm.graph.key).then(function (storedGraph) {
                vm.graph.name = storedGraph.name;
                vm.graph.description = storedGraph.description;
                vm.graph.timeInterval = storedGraph.timeInterval;
                vm.graph.datasets = storedGraph.datasets;
                vm.graph.type = storedGraph.type;

                reset();
            });

        }

        function isInUpdate() {
            return vm.graph.key && vm.graph.key != '';
        }

        function activate() {

            tagsRef = resourceHandler.tagsRef;
            transactionRef = resourceHandler.transactionRef;
            graphsRef = resourceHandler.graphsRef;

            vm.graphs = [];
            vm.datasets = [];

            vm.graphTypes = config.graphTypes;
            vm.timeIntervals = config.timeIntervals;

            vm.getGridHeight = getGridHeight;
            vm.deleteGraph = deleteGraph;

            datasetColors = ['#555555', '#ff0000', '#00ff00', '#0000ff'];

            vm.selectTag = selectTag;

            resourceHandler.listGraphs().then(function (graphs) {
                _.each(graphs, function (graph, key) {
                    graph.key = key;
                    vm.graphs.push(graph);
                });
            });

            resourceHandler.listTags().then(function (eventTagLists) {
                var uniqueTags = [];
                var tags = _.flatten(_.pluck(eventTagLists, 'tags'));
                _.each(tags, function (tag) {
                    if (_.indexOf(uniqueTags, tag) < 0) {
                        uniqueTags.push(tag);
                    }
                }); 

                vm.tags = [];
                _.each(uniqueTags, function (tag) {
                    vm.tags.push({ tagGroupId: 0, name: tag, style: { 'background-color': datasetColors[0] } });
                });
            });

            setupGrids();

            vm.addGraph = addGraph;
            vm.updateGraph = updateGraph;
            vm.undoGraph = undoGraph;

            vm.graph = {};
            vm.isInUpdate = isInUpdate;
        }

        activate();
    }
})();
