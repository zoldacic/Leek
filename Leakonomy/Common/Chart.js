(function() {
    'use strict';

    angular.module(appName).directive('chart', [chart]);
    
    function chart($window) {

        var directive = {
            link: link,
            restrict: 'E',
            replace: true,
            scope: {
                chartData: '='
            },
            template: '<div class="chart"></div>'
        };

        function link(scope, element, attrs) {
            //var chart = new google.visualization.PieChart(element[0]);
            
            scope.$watch('chartData', function (chartData) {
                var chart = new google.visualization[chartData.type.name + 'Chart'](element[0]);
                chart.draw(chartData.data, chartData.options);
            }, true);
        }

        return directive;
    }

})();
