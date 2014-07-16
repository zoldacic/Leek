(function () {
    'use strict';

    google.setOnLoadCallback(function () {
        angular.bootstrap(document.body, ['leakonomy']);
    });

    google.load('visualization', '1', { packages: ['corechart'] });

    var controllerId = 'graphDisplayCtrl';
    angular.module(appName).controller(controllerId, ['resourceHandler', graphDisplayCtrl]);

    function graphDisplayCtrl(resourceHandler) {
        var vm = this;
        var eventTagLists, graphs, transactions;

        function showGraph(graph, datasets, chartIndex) {

            var data = new google.visualization.DataTable();

            // Create PieChart

            //data.addColumn('string', 'Month');            
            //_.each(datasets, function (dataset) { data.addColumn('string', dataset.name); });

            data.addColumn('string', 'Dataset');
            data.addColumn('number', 'Values');

            _.each(datasets, function (dataset) {
                var sum = _.reduce(dataset.values, function (sum, value) { return sum + value; });
                data.addRow([dataset.name, sum]);
            });


            //var data = google.visualization.arrayToDataTable([
            //  ['Year', 'Sales', 'Expenses'],
            //  ['2004', 1000, 400],
            //  ['2005', 1170,_ 460],
            //  ['2006', 660, 1120],
            //  ['2007', 1030, 540]
            //]);

            var options = {
                title: graph.name
            };

            var chart = new google.visualization.PieChart(document.getElementById('chart' + chartIndex));
            chart.draw(data, options);
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

                // Group transactions
                var transactionGroups = _.groupBy(includedTransactions, function (transaction) { return transaction.transactionDate.substring(0, 4) });

                // Summarize transactions
                _.each(transactionGroups, function (transactionGroup, key) {                    
                    var amounts = _.map(transactionGroup, function (transaction) { return parseInt(transaction.amount) });
                    dataset.values[key] = _.reduce(amounts, function (sum, transactionAmount) { return sum + transactionAmount; });
                });

                datasets.push(dataset);

                var index = vm.charts.length;
                vm.charts.push({ index: index });
                showGraph(vm.graph, datasets, index);
            });

        }

        function addGraphs(graphs) {
            vm.graphs = [];
            _.each(graphs, function (graph, key) {
                graph.key = key;
                vm.graphs.push(graph);
            });
        };

        function selectGraph() {
            createGraph();
        }

        function activate() {

            vm.charts = [];
            vm.selectGraph = selectGraph;

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
