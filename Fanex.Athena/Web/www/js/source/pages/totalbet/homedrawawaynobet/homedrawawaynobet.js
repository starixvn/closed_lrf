define(['jquery', 'common/site', '../totalbetsbase', 'components/refreshcountdown'], function ($, Site, Totalbets, RefreshCountDown) {
    'use strict';

    const _me = {
        initialize: function () {
            Site.initialize();
            Totalbets.initialize();
            _me.initEvent();
            Site.addUserGuide({
                resourceName: 'TotalBetsHomeDrawAwayNoBet',
                title: Site.getSingleResource('TotalBets') + ' - ' + Site.getSingleResource('HomeDrawAwayNoBet')
            });

            RefreshCountDown.initEvent();
        },
        initEvent: function () {
            $('#SubmitButton').on('click', function () {
                _me.submit();
            });

            $('#reportContent').on('click', '.team', function () {
                const matchId = $(this).attr('data-match-id');
                Totalbets.viewRunningBetListMatch(matchId, 14);
            });
        },
        submit: function () {
            Site.blockUI();
            $('#HomeDrawAwayNoBetForm').submit();
        }
    };

    return _me;
});