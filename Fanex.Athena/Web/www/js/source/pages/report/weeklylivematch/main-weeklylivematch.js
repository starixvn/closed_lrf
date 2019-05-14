define(['./weeklylivematch'], function (WeeklyLiveMatch) {
    'use strict';

    $(function () {
        WeeklyLiveMatch.initialize();

        $(window).on('resize', WeeklyLiveMatch.resizeGrid);

        $(window).on('unload', function () {
            $(window).off('resize');
        });
    });
});