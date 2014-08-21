(function () {
    'use strict';

    var controllerId = 'transactionsCtrl';

    angular.module(appName).controller(controllerId, ['resourceHandler', transactionsCtrl]);

    function transactionsCtrl(resourceHandler) {
        var vm = this;

        function setupGrids() {
            vm.transactionGridOptions = {
                data: 'vm.transactions',
                enableCellSelection: false,
                enableRowSelection: true,
                multiSelect: false,
                keepLastSelected: true,
                enableCellEditOnFocus: false,
                showGroupPanel: true,
                showFilter: true,
                sortInfo: { fields: ['transactionDate', ' event'], directions: ['asc', 'asc'] },
                columnDefs: [
                    { width: '100px', field: 'transactionDate', displayName: 'Date', enableCellEdit: false },
                    { field: 'event', displayName: 'Event', enableCellEdit: false },
                    { width: '100px', field: 'amount', displayName: 'Amount', enableCellEdit: false }
                ]
            };
        }

        function listTransactions() {
            resourceHandler.listTransactions().then(function (transactions) {
                vm.transactions = [];

                // TODO: Move to resourcehandler
                _.each(transactions, function (transaction) {
                    vm.transactions.push(transaction);
                });
            });
        }

        function getGridHeight() {
            var noOfTransactions = vm.transactions ? vm.transactions.length : 0;
            return 70 + noOfTransactions * 30 + 'px';
        }

        function activate() {
            listTransactions();
            setupGrids();

            vm.getGridHeight = getGridHeight;

            //$scope.$on('ngGridEventEndCellEdit', function (data) {
            //    var eventTagList = data.targetScope.row.entity;

            //    resourceHandler.transactionsRef.$remove(eventTagList.key);
            //    resourceHandler.transactionsRef.$add({ event: eventTagList.event, tags: eventTags }).then(function (ref) {
            //        eventTagList.key = ref.name();
            //    });
            //});
        }

        activate();
    }
})();
