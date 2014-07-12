(function () {
    'use strict';

    var controllerId = 'graphsCtrl';
    angular.module(appName).controller(controllerId, ['resourceHandler', graphsCtrl]);

    function graphsCtrl(resourceHandler) {
        var transactionRef, tagsRef, graphsRef;
        var datasetColors;
        var vm = this;

        function setupGrids() {
            vm.graphGridOptions = {
                data: 'vm.graphs',
                enableCellSelection: false,
                enableRowSelection: false,
                enableCellEditOnFocus: false,
                columnDefs: [
                    { field: 'name', displayName: 'Name', enableCellEdit: false },
                    { field: 'description', displayName: 'Description', enableCellEdit: false },
                    { field: 'type.name', displayName: 'Type', enableCellEdit: false },
                    { field: 'type.name', displayName: 'Type', enableCellEdit: false }
                ]
            };
        }

        //function tagOptions(tag) {
        //    var options = [];
        //    _.each(datasetColors, function (datasetColor) {
        //        options.push({ id: datasetColor.id, color: datasetColor.color, tag: tag, text: '<rectangle></rectangle>' });
        //    });

        //    return options;
        //}

        function selectTag(tag) {
            if (tag.tagGroupId >= datasetColors.length) {
                tag.tagGroupId = 0;
            } else {
                tag.tagGroupId++;
            }

            tag.style = { 'background-color': datasetColors[tag.tagGroupId] };
        }

        function activate() {

            tagsRef = resourceHandler.tagsRef;
            transactionRef = resourceHandler.transactionRef;
            graphsRef = resourceHandler.graphsRef;

            vm.graphs = [];
            vm.datasets = [];

            vm.graphTypes = [{ name: 'Circle' },
                             { name: 'Bar' }];

            vm.timeIntervals = [{ name: 'Yearly' },
                                { name: 'Monthly' },
                                { name: 'Weekly' },
                                { name: 'Daily' }];

            datasetColors = ['#ffffff', '#ff0000', '#00ff00', '#0000ff'];

            vm.selectTag = selectTag;

            resourceHandler.listGraphs().then(function (graphs) {
                _.each(graphs, function (graph) {
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

            vm.addGraph = function () {
                var graph = { name: vm.graphName, description: vm.description, type: vm.graphType, datasets: [] };

                var tagGroups = _.groupBy(vm.tags, function (tag) { return tag.tagGroupId });
                _.each(tagGroups, function (tagGroup) {
                    if (tagGroup[0].tagGroupId > 0) {
                        var dataset = {};
                        dataset.color = datasetColors[tagGroup[0].tagGroupId];

                        dataset.tags = [];
                        _.each(tagGroup, function (tag) {
                            dataset.tags.push(tag.name);
                        });

                        graph.datasets.push(dataset);
                    }
                });

                graphsRef.$add(graph); 
                vm.graphs.push(graph);
            }
        }

        activate();
    }
})();
