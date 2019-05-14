define(['jquery', '../common/thirdpartywinloss', './golddeluxewinloss.option'],
    function ($, ThirdPartyWinLoss, GoldDeluxeWinLossOption) {
        'use strict';
        function initialize() {
            GoldDeluxeWinLossOption.licenseeId = parseInt($('#drillDownLicenseeId').val(), 10);

            ThirdPartyWinLoss.initialize({
                UserGuideResourceName: 'GoldDeluxeWL',
                UserGuideTitle: 'GoldDeluxeWinLoss',
                ValidMonthRange: 3,
                ReportTitle: 'GoldDeluxeWinLoss',
                GridOption: GoldDeluxeWinLossOption
            });
        }

        const _me = {
            initialize: initialize
        };

        return _me;
    });