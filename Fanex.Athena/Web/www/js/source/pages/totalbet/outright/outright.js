define(['jquery', 'common/site', '../totalbetsbase', 'components/refreshcountdown'], function ($, Site, Totalbets, RefreshCountDown) {
    'use strict';

    const _me = {
        initialize: function () {
            Site.initialize();
            Totalbets.initialize();
            _me.initEvent();
            Site.addUserGuide({
                resourceName: 'TotalBetsOutright',
                title: Site.getSingleResource('TotalBets') + ' - ' + Site.getSingleResource('Outright')
            });

            RefreshCountDown.initEvent();
        },
        initEvent: function () {
            $('#SubmitButton').on('click', function () {
                _me.submit();
            });

            $('#reportContent').on('click', '.team', function () {
                const matchId = $(this).attr('data-match-id');
                Totalbets.viewRunningBetListMatch(matchId, 10);
            });
        },
        submit: function () {
            Site.blockUI();
            $('#OutrightForm').submit();
        }
    };

    return _me;
});