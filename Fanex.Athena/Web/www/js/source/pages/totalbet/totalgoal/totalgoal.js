define(['jquery', 'common/site', '../totalbetsbase', 'components/refreshcountdown'], function ($, Site, Totalbets, RefreshCountDown) {
    'use strict';

    const _me = {
        initialize: function () {
            Site.initialize();
            Totalbets.initialize();
            _me.initEvent();
            Site.addUserGuide({
                resourceName: 'TotalBetsTotalGoal',
                title: Site.getSingleResource('TotalBets') + ' - ' + Site.getSingleResource('TotalGoal')
            });

            RefreshCountDown.initEvent();
        },
        initEvent: function () {
            const totalGoalBettype = 6, firstHalfTotalGoal = 126;
            const bettypeParameter = totalGoalBettype + ',' + firstHalfTotalGoal;

            $('#SubmitButton').on('click', function () {
                _me.submit();
            });

            $('#reportContent').on('click', '.team', function () {
                const matchId = $(this).attr('data-match-id');
                Totalbets.viewRunningBetListMultiBettype(matchId, bettypeParameter);
            });
        },
        submit: function () {
            Site.blockUI();
            $('#TotalGoalForm').submit();
        }
    };

    return _me;
});