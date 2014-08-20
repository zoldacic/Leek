
// TODO: Graphs are not correctly updated in grid when a new graph is added. APPLIES TO HOME UPGRADE ASWELL?

(function () {
    'use strict';

    var controllerId = 'homeUpgradesCtrl';
    angular.module(appName).controller(controllerId, ['resourceHandler', 'config', homeUpgradesCtrl]);

    function homeUpgradesCtrl(resourceHandler, config) {
        var transactionRef, tagsRef, homeUpgradesRef;
        var datasetColors;
        var vm = this;

        function setupGrids() {
            vm.graphGridOptions = {
                data: 'vm.homeUpgrades',
                enableCellSelection: false,
                enableRowSelection: true,
                multiSelect: false,
                afterSelectionChange: afterSelectionChange,
                keepLastSelected: true,
                enableCellEditOnFocus: false,
                showGroupPanel: true,
                showFilter: true,
                sortInfo: { fields: ['name'], directions: ['asc'] },
                columnDefs: [
                    { field: 'title', displayName: 'Title', enableCellEdit: false },
                    { field: 'dateOfPurchase', displayName: 'Date of Purchase', enableCellEdit: false },
                    { width: '80px', field: '', cellTemplate: '<button class="btn btn-default btn-grid" ng-click="vm.deleteHomeUpgrade(row)">Delete</button>' }
                ]
            };
        }
        
        function getGridHeight() {
            var noOfItems = vm.homeUpgrades ? vm.homeUpgrades.length : 0;
            return 70 + noOfItems * 30 + 'px';
        }

        function reset() {
            vm.homeUpgrade = {};
        }

        function afterSelectionChange(rowItem) {

            // Updated items if the new row has caused the event (i.e. afterSelectionChange may be called twice, for 'unselect' and for 'select')
            if (rowItem.selected) {
                reset();

                vm.homeUpgrade = rowItem.entity;
                //_.each(vm.graph.datasets, function (dataset) {
                //    var tagGroupId = _.indexOf(datasetColors, dataset.color);

                //    _.each(dataset.tags, function (datasetTag) {
                //        var tag = _.find(vm.tags, function (vmTag) { return vmTag.name == datasetTag; });

                //        if (tag) {
                //            // TODO: What to do if the colors has changed?
                //            tag.tagGroupId = tagGroupId;
                //            tag.style = { 'background-color': datasetColors[tag.tagGroupId] };
                //        } else {
                //            // TODO: What to do if a tag has changed name?
                //        }
                //    });
                //});
            } 
        }

        function addHomeUpgrade() {
            var sourceKey = vm.homeUpgrade.key;
            vm.homeUpgrade.key = null;
            updateHomeUpgrade();

            // vm.graph.key = undoKey;
            // undoGraph();
        }

        function updateHomeUpgrade() {

            var isUpdate = false;
            if (vm.graph.key) {
                homeUpgradesRef.$remove(vm.homeUpgrade.key);
                isUpdate = true;
            }

            homeUpgradesRef.$add(vm.homeUpgrade).then(function (ref) {
                vm.homeUpgrade.key = ref.name();

                if (!isUpdate) {
                    resourceHandler.getHomeUpgrade(ref.name()).then(function (storedItem) {
                        // TODO: Set key as property in resourceHandler
                        storedItem.key = ref.name();
                        vm.homeUpgrades.push(storedItem);
                    });                    
                }
            });

            reset();
        }

        function deleteHomeUpgrade(row) {
            var item = row.entity;
            var index = _.indexOf(vm.homeUpgrades, item);
            vm.homeUpgrades.splice(index, 1);

            homeUpgeradesRef.$remove(homeUpgrade.key);
            reset();

            vm.homeUpgradeGridOptions.selectAll(false);
        }

        function undoHomeUpgrade() {
            resourceHandler.getHomeUpgrade(vm.homeUpgrade.key).then(function (storedItem) {
                vm.homeUpgrade.title = storedItem.title;
                vm.homeUpgrade.dateOfPurchase = storedItem.dateOfPurchase;
                vm.homeUpgrade.info = storedItem.info;

                reset();
            });

        }

        function isInUpdate() {
            return vm.homeUpgrade.key && vm.homeUpgrade.key != '';
        }

        function activate() {

            tagsRef = resourceHandler.tagsRef;
            transactionRef = resourceHandler.transactionRef;
            homeUpgradesRef = resourceHandler.homeUpgradesRef;

            vm.homeUpgrades = [];

            vm.getGridHeight = getGridHeight;
            vm.deleteHomeUpgrade = deleteHomeUpgrade;

            resourceHandler.listHomeUpgrades().then(function (items) {
                _.each(homeUpgrades, function (item, key) {
                    item.key = key;
                    vm.homeUpgrades.push(item);
                });
            });

            setupGrids();

            vm.addHomeUpgrade = addHomeUpgrade;
            vm.updateHomeUpgrade = updateHomeUpgrade;
            vm.undoHomeUpgrade = undoHomeUpgrade;

            vm.homeUpgrade = {};
            vm.isInUpdate = isInUpdate;
        }

        activate();
    }
})();
