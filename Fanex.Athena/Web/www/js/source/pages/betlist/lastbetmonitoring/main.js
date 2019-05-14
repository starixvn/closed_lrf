define(['./lastbet.filter', './lastbet.grid'], function (LastBetFilter, LastBetGrid) {
    'use strict';

    $(function () {
        LastBetFilter.initialize();
        LastBetGrid.initialize();

        LastBetGrid.startMonitor();
    });

    $(window).on('unload', function () {
        LastBetGrid.stopMonitor();
    });
});