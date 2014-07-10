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

            //vm.tagOptions = tagOptions;
            vm.selectTag = selectTag;

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

            //vm.showGraph = function () {
            //    _.each(vm.datasets, function (dataset) {

            //        // Retrieve events from tags in dataset
            //        var events = [];
            //        tagsRef.$on('loaded', function (eventTagLists) { // on change?
            //            events = _.filter(eventTagLists, function (eventTagList) {
            //                var foundTags = _.filter(eventTagList.tags, function (tag) {
            //                    return _.contains(dataset.tagList, tag);
            //                });

            //                return foundTags.length > 0;
            //            });

            //            // Retrieve transactions from events and date
            //            // TODO: Hur hitta utan att läsa upp allt?
            //            var transactions = [];
            //            transactionRef.$on('loaded', function (transactionsInStore) {
            //                var eventNames = _.pluck(events, 'event');
            //                transactions = _.filter(transactionsInStore, function (transaction) {
            //                    return _.contains(eventNames, transaction.event); // TODO: Kolla även datum. Format på datum?
            //                });

            //                // Group transactions
            //                var transactionGroups = _.groupBy(transactions, function (transaction) { return transaction.transactionDate.substring(0, 4) });

            //                // Summarize transactions
            //                var amountSums = [];
            //                _.each(transactionGroups, function (transactionGroup) {
            //                    var tags = transactionGroup
            //                    var amounts = _.map(transactionGroup, function (transaction) { return parseInt(transaction.amount) });
            //                    amountSums.push(_.reduce(amounts, function (sum, transactionAmount) {
            //                        return sum + transactionAmount;
            //                    }));
            //                });

            //                //var data = new google.visualization.DataTable();
            //                //data.addColumn('string', 'Topping');

            //                //var data = google.visualization.arrayToDataTable([
            //                //  ['Year', 'Sales', 'Expenses'],
            //                //  ['2004', 1000, 400],
            //                //  ['2005', 1170, 460],
            //                //  ['2006', 660, 1120],
            //                //  ['2007', 1030, 540]
            //                //]);
            //                //var options = {
            //                //    title: 'Company Performance'
            //                //};
            //                //var chart = new google.visualization.PieChart(document.getElementById('chart_div'));

            //                //chart.draw(data, options);
            //            });
            //        });
            //    });

            //}
        }

        activate();
    }
})();
