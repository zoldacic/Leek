﻿(function () {
    'use strict';

    var serviceId = 'config';
    angular.module(appName).factory(serviceId, [config]);

    function config() {
        var service = {
            graphTypes: [{ name: 'Pie' },
                         { name: 'Area' },
                         { name: 'SteppedArea' }],

            timeIntervals: [{ name: 'Yearly' },
                            { name: 'Monthly' },
                            { name: 'Daily' }]
        };

        return service;
    }
})();