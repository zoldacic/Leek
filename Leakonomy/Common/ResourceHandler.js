(function () {
    'use strict';

    var serviceId = 'resourceHandler';
    angular.module(appName).factory(serviceId, ['$firebase', '$q', resourceHandler]);

    function resourceHandler($firebase, $q) {

        var baseRef, transactionsRef, tagsRef, graphsRef, homeUpgradesRef;

        function list(ref) {
            var deferred = $q.defer();

            ref.$on('loaded', function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        function activate() {
            baseRef = 'https://leakonomy.firebaseio.com/';
            transactionsRef = $firebase(new Firebase(baseRef + '/transactions'));
            tagsRef = $firebase(new Firebase(baseRef + '/tags'));
            graphsRef = $firebase(new Firebase(baseRef + '/graphs'));
            homeUpgradesRef = $firebase(new Firebase(baseRef + '/homeUpgrades'));
        }

        activate();

        var service = {
            listTransactions: function () { return list(transactionsRef); },
            listTags: function () { return list(tagsRef); },
            listGraphs: function () { return list(graphsRef); },
            listHomeUpgrades: function () { return list(homeUpgradesRef); },

            getGraph: function (key) { return list($firebase(new Firebase(baseRef + '/graphs/' + key))); },
            getHomeUpgrade: function (key) { return list($firebase(new Firebase(baseRef + '/homeUpgrades/' + key))); },

            baseRef: baseRef,
            transactionsRef: transactionsRef,

            // TODO: Remove ref below
            transactionRef: transactionsRef,
            tagsRef: tagsRef,
            graphsRef: graphsRef,
            homeUpgradesRef: homeUpgradesRef
        };

        return service;
    }
})();