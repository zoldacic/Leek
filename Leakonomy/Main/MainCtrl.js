(function () {
    'use strict';

    var controllerId = 'mainCtrl';
    angular.module(appName).controller(controllerId, ['$location', '$route', 'routes', mainCtrl]);

    function mainCtrl($location, $route, routes) {
        var vm = this;

        function listRoutes(listRegisterRoutes) {
            return _.filter(routes, function (route) { return route.isVisible && ((listRegisterRoutes && route.isRegister) || (!listRegisterRoutes && !route.isRegister)); });
        }

        function isRouteActive(route) {
            return route.url == $location.url();
        }

        function navigateTo(path) {
            $location.path(path);
        }

        function showMenu() {
            return $location.url() != '/Main';
        }

        function activate() {
            vm.navigateTo = navigateTo;
            vm.listNonRegisterRoutes = function () { return listRoutes(false); };
            vm.listRegisterRoutes = function () { return listRoutes(true); };
            vm.isRouteActive = isRouteActive;
            vm.showMenu = showMenu;
        }

        activate();
    }
})();
