(function () {
    'use strict';

    var serviceId = 'config';
    angular.module(appName).factory(serviceId, [config]);

    function config() {
        var service = {
            graphTypes: [{ name: 'Circle' },
                         { name: 'Bar' }],

            timeIntervals: [{ name: 'Yearly' },
                            { name: 'Monthly' },
                            { name: 'Daily' }]
        };

        return service;
    }
})();