
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

    // Execute bootstrapping code and any dependencies.
    // TODO: inject services as needed.
    //app.run(['$q', '$rootScope',
    //    function ($q, $rootScope) {

    //    }]);

    app.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
            when('/Main', {
                templateUrl: 'Main/Main.html',
                controller: 'mainCtrl'
            }).
            when('/TransactionInput', {
                templateUrl: 'TransactionInput/TransactionInput.html',
                controller: 'transactionInputCtrl'
            }).
            when('/GraphDisplay', {
                templateUrl: 'GraphDisplay/GraphDisplay.html',
                controller: 'graphDisplayCtrl'
            }).
            when('/GraphRegister', {
                templateUrl: 'Registers/Graphs/Graphs.html',
                controller: 'graphsCtrl'
            }).
            when('/DatasetRegister', {
                templateUrl: 'Registers/Graphs/Datasets.html',
                controller: 'datasetsCtrl'
            }).
            otherwise({
                redirectTo: '/Main'
            });
        }]);
})();