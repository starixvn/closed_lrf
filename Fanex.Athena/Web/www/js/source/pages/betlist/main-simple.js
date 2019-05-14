define(['./betlist', './commonbetlist'], function (BetList, CommonBetList) {
    'use strict';

    $(window).on('load', function () {
        CommonBetList.initialize();
    });
});