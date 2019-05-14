define(['common/querystring', 'common/site', './helper'], function (QueryString, Site, Helper) {
    'use strict';

    function initialize() {
        Site.initialize();
        initEvent();
    }

    function initEvent() {
        $('body').on('click', '.match-detail-link', function () {
            viewMatchBetList(this);
        });
    }

    function viewMatchBetList(target) {
        let url = Site.resolveClientUrl('LiveReportBetList/Match');

        const currencyName = $('#CurrencyName').attr('data-original');
        let data = $(target).attr('data-drill-down');
        data = $.parseJSON(data);
        url = Site.setLicenseeOptionOriginalParam(url);
        url = Site.setDateRangeOriginalParam(url);
        url = QueryString.setParam(url, 'CurrencyName', currencyName);
        url = QueryString.setParam(url, 'MatchId', data.MatchId);
        url = QueryString.setParam(url, 'HomeId', data.HomeId);
        url = QueryString.setParam(url, 'AwayId', data.AwayId);
        url = QueryString.setParam(url, 'BetType', data.BetType);
        url = QueryString.setParam(url, 'LiveIndicator', data.LiveIndicator);
        url = Helper.setSumParams(url, data);

        const productOptions = Helper.getMatchListProductOption($('#SportId').val(), $('#ProductCode').val());

        url = Site.setProductCodeListParam(url, productOptions);

        Site.blockUI();
        Site.redirect(url);
    }

    return {
        initialize: initialize
    };
});