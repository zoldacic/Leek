(function () {
    'use strict';

    var controllerId = 'transactionInputCtrl';
    angular.module(appName).controller(controllerId, ['resourceHandler', transactionInput]);

    function transactionInput(resourceHandler) {
        var vm = this;
        var currentPhase;
        var tagsRef;
        var transactionRef;

        function parseRawText() {
            var rawTransactions = vm.rawText.split("\n");

            vm.transactions = [];
            vm.uniqueEvents = [];
            angular.forEach(rawTransactions, function (rawTransaction, key) {
                if (rawTransaction.trim().length > 0) {
                    var textParts = rawTransaction.split(" ");

                    var event = '';
                    for (var i = 1; i < textParts.length - 1; i++) {
                        event += ' ' + textParts[i];
                    }

                    event = event.trim();

                    var transaction = { transactionDate: textParts[0], event: event, amount: textParts[textParts.length - 1] };
                    vm.transactions.push(transaction);

                    if (_.indexOf(vm.uniqueEvents, event) < 0) {
                        vm.uniqueEvents.push(event);
                    }
                }
            });

            tagsRef.$on('loaded', function (eventTagLists) {
                vm.eventTagLists = [];
                _.each(eventTagLists, function (eventTagList, key) {
                    var tags = '';
                    var uniqueEventIndex = _.indexOf(vm.uniqueEvents, eventTagList.event);
                    if (uniqueEventIndex >= 0) {
                        _.each(eventTagList.tags, function (tag) {
                            tags += tags.length == 0 ? tag : ', ' + tag;
                        });

                        vm.eventTagLists.push({ key: key, event: eventTagList.event, tags: tags });
                        vm.uniqueEvents.splice(uniqueEventIndex, 1);
                    }
                });

                _.each(vm.uniqueEvents, function (event) {
                    vm.eventTagLists.push({ event: event, tags: '' });
                });
            });

            currentPhase = vm.Phases.STEP2;
        }

        function addTransactions() {
            _.each(vm.transactions, function (transaction) { transactionRef.$add(transaction); });
            currentPhase = vm.Phases.STEP3;
        };

        function addTags() {
            var tags = [];
            var events = [];
            _.each(vm.eventTagLists, function (eventTagList) {                

                if (eventTagList.key && eventTagList.key.length > 0) {
                    tagsRef.$remove(eventTagList.key);
                }

                var eventTags = _.map(eventTagList.tags.split(','), function (eventTag) { return eventTag.trim() });
                eventTags = _.filter(eventTags, function (eventTag) { return eventTag && eventTag.length > 0 });

                if (eventTags && eventTags.length > 0) {
                    tagsRef.$add({ event: eventTagList.event, tags: eventTags });
                }
            });

            clearAll();
            currentPhase = vm.Phases.STEP1;
        }

        function isInPhase(phase) {
            return currentPhase == phase;
        }

        function setActive(phase) {
            if (currentPhase != phase) {
                currentPhase = phase;
            }            
        }

        function clearAll() {
            vm.rawText = '';
            vm.transactions = [];
            vm.uniqueEvents = [];
            vm.eventTagLists = [];

        }

        function setupGrids() {
            vm.gridOptions = {
                data: 'vm.transactions',
                enableCellSelection: true,
                enableRowSelection: false,
                enableCellEditOnFocus: true,
                columnDefs: [
                    { field: 'transactionDate', displayName: 'TransactionDate', enableCellEdit: true },
                    { field: 'event', displayName: 'Event', enableCellEdit: false },
                    { field: 'amount', displayName: 'Amount', enableCellEdit: false }
                ]
            };

            vm.tagGridOptions = {
                data: 'vm.eventTagLists',
                enableCellSelection: true,
                enableRowSelection: false,
                enableCellEditOnFocus: true,
                columnDefs: [
                    { field: 'event', displayName: 'Event', enableCellEdit: false },
                    { field: 'tags', displayName: 'Tags', enableCellEdit: true }]
            };
        }

        function activate() {
            tagsRef = resourceHandler.tagsRef;
            transactionRef = resourceHandler.transactionRef;

            vm.parseRawText = parseRawText;
            vm.addTransactions = addTransactions;
            vm.addTags = addTags;

            vm.isInPhase = isInPhase;
            vm.setActive = setActive;

            vm.Phases = { STEP1: 1, STEP2: 2, STEP3: 3, STEP4: 4 };

            currentPhase = vm.Phases.STEP1;

            vm.rawText = '140507 MAX I SKELLEFTEA, SKELLEFTEA 161,00';

            setupGrids();
        };

        activate();
    }
})();
