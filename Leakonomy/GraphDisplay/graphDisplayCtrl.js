(function () {
    'use strict';

    google.setOnLoadCallback(function () {
        angular.bootstrap(document.body, ['leakonomy']);
    });

    google.load('visualization', '1', { packages: ['corechart'] });

    var controllerId = 'graphDisplayCtrl';
    angular.module(appName).controller(controllerId, ['resourceHandler', 'config', graphDisplayCtrl]);

    function graphDisplayCtrl(resourceHandler, config) {
        var vm = this;
        var eventTagLists, graphs, transactions;

        function showGraph(graph, datasets) {

            var dataTables = {};
            var data = new google.visualization.DataTable();



            //data.addColumn('string', 'Month');            
            //_.each(datasets, function (dataset) { data.addColumn('string', dataset.name); });

            //var data = google.visualization.arrayToDataTable([
            //  ['Year', 'Sales', 'Expenses'],
            //  ['2004', 1000, 400],
            //  ['2005', 1170,_ 460],
            //  ['2006', 660, 1120],
            //  ['2007', 1030, 540]
            //]);

            //if (graph.type.name == 'Pie') {
            data.addColumn('string', 'Dataset');
            data.addColumn('number', 'Values');

            _.each(datasets, function (dataset) {
                var sum = _.reduce(dataset.values, function (sum, value) { return sum + value; });
                data.addRow([dataset.name, sum]);
            });
                
            dataTables['Pie'] = data;
            //} else if (graph.type.name == 'Area') {

            data = new google.visualization.DataTable();


            if (vm.graph.timeInterval.name == 'Yearly') {
                // Not implementet
            } if (vm.graph.timeInterval.name == 'Monthly') {

                data.addColumn('string', 'Month');
                _.each(datasets, function (dataset) { data.addColumn('number', dataset.name); });

                var noOfMonths = parseInt(moment(graph.dateTo).format('MM')) - parseInt(moment(graph.dateFrom).format('MM'));
                var dateWrapper = moment(graph.dateFrom);
                dateWrapper.date(1);

                for (var i = 0; i < noOfMonths; i++) {
                    var dataItems = [];
                    dataItems.push(dateWrapper.format('MMMM'));

                    _.each(datasets, function (dataset) {
                        var value = dataset.values[dateWrapper.format('YYMM')];
                        value = value ? value : 0;
                        dataItems.push(parseFloat(value));
                    });

                    data.addRow(dataItems);
                    dateWrapper = dateWrapper.add('months', 1);
                }

            } else { // Daily

                data.addColumn('string', 'Date');
                _.each(datasets, function (dataset) { data.addColumn('number', dataset.name); });

                var fromDateWrapper = moment(graph.dateFrom);
                var toDateWrapper = moment(graph.dateTo);
                var noOfDays = toDateWrapper.diff(fromDateWrapper, 'days');

                for (var i = 0; i < noOfDays; i++) {
                    var dataItems = [];
                    dataItems.push(fromDateWrapper.format('YYMMDD'));

                    _.each(datasets, function (dataset) {
                        var value = dataset.values[fromDateWrapper.format('YYMMDD')];
                        value = value ? value : 0;
                        dataItems.push(parseFloat(value));
                    });

                    data.addRow(dataItems);
                    fromDateWrapper = fromDateWrapper.add('days', 1);
                }

            }



            dataTables['Area'] = data;
            dataTables['SteppedArea'] = data;
            //}

            var name = graph.name + '\n' + graph.dateFrom + ' - ' + graph.dateTo;
            var options = {
                title: name,
                is3D: true
            };

            vm.charts.push({ data: dataTables, options: options, type: _.find(vm.graphTypes, function(type) { return type.name == graph.type.name; })});

            //var chart = new google.visualization.PieChart(document.getElementById('chart' + chartIndex));
            //chart.draw(data, options);
        }

        function createGraph() {
            var datasets = [];

            _.each(vm.graph.datasets, function (storedDataset) {
                var name = _.reduce(storedDataset.tags, function (name, tag) { return name + ', ' + tag; });
                var dataset = { color: storedDataset.color, name: name, values: {} };

                // Retrieve included events
                var events = _.pluck(_.filter(eventTagLists, function (eventTagList) {
                    var intersect = _.intersection(eventTagList.tags, storedDataset.tags)
                    return intersect.length > 0;
                }), 'event');

                // Retrive transactions with selected events
                var includedTransactions = _.filter(transactions, function (transaction) { return _.contains(events, transaction.event); });

                // Group transactions (by month)
                function getYearFromTransaction(transaction) { return transaction.transactionDate.substring(0, 2) };
                function getMonthFromTransaction(transaction) { return transaction.transactionDate.substring(0, 4) };
                function getDateFromTransaction(transaction) { return transaction.transactionDate; };

                var dateGrouping;
                if (vm.graph.timeInterval.name == 'Yearly') {
                    dateGrouping = getYearFromTransaction;
                } if (vm.graph.timeInterval.name == 'Monthly') {
                    dateGrouping = getMonthFromTransaction;
                } else {
                    dateGrouping = getDateFromTransaction;
                }

                var transactionGroups = _.groupBy(includedTransactions, dateGrouping);

                // Summarize transactions
                _.each(transactionGroups, function (transactionGroup, key) {
                    var amounts = _.map(transactionGroup, function (transaction) { return parseInt(transaction.amount) });
                    dataset.values[key] = _.reduce(amounts, function (sum, transactionAmount) { return sum + transactionAmount; });
                });

                datasets.push(dataset);
            });

            //var index = vm.charts.length;
            //vm.charts.push({ index: index });
            showGraph(vm.graph, datasets);
        }

        function addGraphs(graphs) {
            vm.graphs = [];
            _.each(graphs, function (graph, key) {
                graph.key = key;
                graph.nameAndDate = graph.name + ' : ' + graph.dateFrom + ' - ' + graph.dateTo;
                vm.graphs.push(graph);
            });
        };

        function selectGraph() {
            createGraph();
        }

        function removeChart(index) {
            vm.charts.splice(index, 1);
        }

        function activate() {

            vm.charts = [];
            vm.selectGraph = selectGraph;
            vm.graphTypes = config.graphTypes;
            vm.removeChart = removeChart;

            // TODO: Use promises instead. Update on 'change'?
            resourceHandler.listGraphs().
                then(addGraphs).
                then(resourceHandler.listTags).
                then(function (data) { eventTagLists = data; }).
                then(resourceHandler.listTransactions).
                then(function (data) { transactions = data; });
        }
        activate();
    }
})();
