define(['jquery', 'common/site', 'common/querystring', '../totalbetsbase', 'common/popup', 'components/refreshcountdown'],
    function ($, Site, QueryString, Totalbets, Popup, RefreshCountDown) {
        'use strict';

    const _me = {
        initialize: function () {
            Site.initialize();
            Totalbets.initialize();
            _me.initEvent();
            Site.addUserGuide({
                resourceName: 'TotalBetsHdpOu',
                title: Site.getSingleResource('TotalBets') + ' - ' + Site.getSingleResource('HandicapOverUnderLive')
            });

            RefreshCountDown.initEvent();

            _me.registerGlobalFunctions();
        },
        initEvent: function () {
            $('#SubmitButton').on('click', function () {
                _me.submit();
            });

            $('#reportContent').on('click', '.button-add', function () {
                const matchId = $(this).attr('data-match-id');
                const betType = $(this).attr('data-bet-type');
                _me.viewForecast(matchId, betType);
            });
        },
        viewNewForecast: function (leagueId, matchId, currencyId, baseCurrency) {
            let url = Site.resolveClientUrl('NewHandicapOverUnderForecast/Index');
            url = QueryString.setParam(url, 'leagueId', leagueId);
            url = QueryString.setParam(url, 'matchId', matchId);
            url = QueryString.setParam(url, 'currencyId', currencyId);
            url = QueryString.setParam(url, 'baseCurrency', baseCurrency);

            Site.redirect(url);
        },
        viewForecast: function (matchId, betType) {
            let url = Site.resolveClientUrl('AhForecast/Index?matchid=' + matchId + '&bettype=' + betType);
            url = Site.setLicenseeOptionOriginalParam(url);

            const popH = 250, popW = 700;
            Popup.openPopupWithIframe(url, { width: popW, height: popH, title: Site.getSingleResource('Forecast'), id: 'forecast-dialog' });
        },
        submit: function () {
            Site.blockUI();
            $('#HandicapOUForm').submit();
        },
        registerGlobalFunctions: function () {
            window.viewNewForecast = _me.viewNewForecast;
        }
    };

    return _me;
});