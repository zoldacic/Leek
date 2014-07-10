(function () {
    'use strict';

    var serviceId = 'resourceHandler';
    angular.module(appName).factory(serviceId, ['$firebase', resourceHandler]);

    function resourceHandler($firebase) {

        var baseRef, transactionRef, tagsRef, graphsRef;

        function activate() {
            baseRef = 'https://leakonomy.firebaseio.com/';
            transactionRef = $firebase(new Firebase(baseRef + '/transactions'));
            tagsRef = $firebase(new Firebase(baseRef + '/tags'));
            graphsRef = $firebase(new Firebase(baseRef + '/graphs'));
        }

        activate();

        var service = {
            baseRef: baseRef,
            transactionRef: transactionRef,
            tagsRef: tagsRef,
            graphsRef: graphsRef
        };

        return service;
    }
})();