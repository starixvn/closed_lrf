define(['../common/thirdpartywinloss', './colossusbetswinloss.option'],
    function (ThirdPartyWinLoss, ColossusBetsWinLossOption) {
        'use strict';
        function initialize() {
            ThirdPartyWinLoss.initialize({
                UserGuideResourceName: 'ColossusBetsWL',
                UserGuideTitle: 'ColossusBetsWinLoss',
                ValidMonthRange: 0,
                ReportTitle: 'ColossusBetsWinLoss',
                GridOption: ColossusBetsWinLossOption
            });
        }

        const _me = {
            initialize: initialize
        };

        return _me;
    });