(function () {
    'use strict';

    google.setOnLoadCallback(function () {
        angular.bootstrap(document.body, ['leakonomy']);
    });

    google.load('visualization', '1', { packages: ['corechart'] });

    var controllerId = 'graphDisplayCtrl';
    angular.module(appName).controller(controllerId, [graphDisplayCtrl]);

    function graphDisplayCtrl() {
        var vm = this;

        vm.showGraph = function () {

            var data = google.visualization.arrayToDataTable([
              ['Year', 'Sales', 'Expenses'],
              ['2004', 1000, 400],
              ['2005', 1170, 460],
              ['2006', 660, 1120],
              ['2007', 1030, 540]
            ]);

            var options = {
                title: 'Company Performance'
            };

            var chart = new google.visualization.LineChart(document.getElementById('chartdiv'));

            chart.draw(data, options);
        }

        function activate() {
            vm.showGraph();



        }
        activate();
    }
})();
