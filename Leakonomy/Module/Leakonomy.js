
var appName = 'leakonomy';

(function () {
    'use strict';    

    var app = angular.module(appName, [
        // Angular modules 
        //'ngAnimate',    
        'ngRoute',                

        // 3rd Party Modules
        'ngGrid',
        'firebase'
    ]);

    // TODO: Use these routes to create the start page

    var routes = [
        { name: 'Main', text: 'Home', url: 'Main/Main.html', isVisible: false },
        { name: 'TransactionInput', text: 'Add', url: 'TransactionInput/TransactionInput.html', isVisible: true, isRegister: false },
        { name: 'GraphDisplay', text: 'View', url: 'GraphDisplay/GraphDisplay.html', isVisible: true, isRegister: false },
        { name: 'GraphRegister', text: 'Graphs', url: 'Registers/Graphs/Graphs.html', isVisible: true, isRegister: true },
        { name: 'TagRegister', text: 'Tags', url: 'Registers/Tags/Tags.html', isVisible: true, isRegister: true },
        { name: 'TransactionRegister', text: 'Transactions', url: 'Registers/Transactions/Transactions.html', isVisible: true, isRegister: true },
        { name: 'HomeUpgradeRegister', text: 'Home Upgrades', url: 'Registers/HomeUpgrades/HomeUpgrades.html', isVisible: true, isRegister: true },
    ];

    app.value('routes', routes);

    // Execute bootstrapping code and any dependencies.
    // TODO: inject services as needed.
    //app.run(['$q', '$rootScope',
    //    function ($q, $rootScope) {

    //    }]);

    app.config(['$routeProvider', function ($routeProvider) {

            _.each(routes, function (route) {
                $routeProvider.when('/' + route.name, { templateUrl: route.url });
            });

            $routeProvider.otherwise({ redirectTo: '/Main' });

            //$routeProvider.
            //when('/Main', {
            //    templateUrl: 'Main/Main.html',
            //    controller: 'mainCtrl'
            //}).
            //when('/TransactionInput', {
            //    templateUrl: 'TransactionInput/TransactionInput.html',
            //    controller: 'transactionInputCtrl'
            //}).
            //when('/GraphDisplay', {
            //    templateUrl: 'GraphDisplay/GraphDisplay.html',
            //    controller: 'graphDisplayCtrl'
            //}).
            //when('/GraphRegister', {
            //    templateUrl: 'Registers/Graphs/Graphs.html',
            //    controller: 'graphsCtrl'
            //}).
            //when('/DatasetRegister', {
            //    templateUrl: 'Registers/Graphs/Datasets.html',
            //    controller: 'datasetsCtrl'
            //}).
            //otherwise({
            //    redirectTo: '/Main'
            //});
        }]);
})();