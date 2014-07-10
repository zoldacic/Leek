(function () {
    'use strict';

    var controllerId = 'mainCtrl';
    angular.module(appName).controller(controllerId, ['$location', mainCtrl]);

    function mainCtrl($location) {
        var vm = this;

        function navigateTo(path) {
            $location.path(path);
        }

        function activate() {
            vm.navigateTo = navigateTo;
        }

        activate();
    }
})();
