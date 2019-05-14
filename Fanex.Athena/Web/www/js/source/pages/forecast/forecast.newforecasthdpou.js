define(['jquery', 'common/site', 'common/querystring', 'components/refreshcountdown'], function ($, Site, QueryString, RefreshCountDown) {
    'use strict';

    const _me = {
        initialize: function () {
            Site.initialize();
            Site.unBlockUI();
            _me.initEvent();
            Site.addUserGuide({
                resourceName: 'ForecastNewHdpOu',
                title: Site.getSingleResource('Forecast') + ' ' + Site.getSingleResource('HandicapOverUnderLive')
            });

            RefreshCountDown.initialize();
            RefreshCountDown.initEvent();
        },
        initEvent: function () {
            $('#DdlLeagueId').on('change', function () {
                const leagueId = $(this).val();
                _me.loadMatchList(leagueId);
            });

            $('#reportContent').on('click', '.bet-list-link', function () {
                const $this = $(this);
                const betChoice = $this.data('betchoice');
                const param = $this.data('param');
                const bettype = $this.data('bettype');
                const handicap = $this.data('handicap');

                _me.openBetlist(betChoice, param, bettype, handicap);
            });

            $('#reportContent').on('click', '.collapsible-header', function () {
                _me.collapseExpand(this);
            });

            $('#SubmitButton').on('click', function () {
                _me.submit();
            });
        },
        collapseExpand: function (context) {
            const $this = $(context);
            const statusElement = $this.data('status');
            const dataBlockId = $this.data('content-id');
            const $bodyContent = $('#contentType-' + dataBlockId);

            // is expanding
            if ($this.hasClass('active')) {
                $bodyContent.stop(true, false).slideUp({
                    duration: 350, easing: 'easeOutQuart', queue: false, complete: function () {
                        $(this).css('height', '');
                    }
                });

                $this.removeClass('active');
                $('#' + statusElement).val(false);
            }
            else {
                $bodyContent.stop(true, false).slideDown({
                    duration: 350, easing: 'easeOutQuart', queue: false, complete: function () {
                        $(this).css('height', '');
                    }
                });

                $this.addClass('active');
                $('#' + statusElement).val(true);
            }
        },
        loadMatchList: function (leagueId) {
            let url = Site.resolveClientUrl('NewHandicapOverUnderForecast/GetMatchListByLeague');
            url = QueryString.setParam(url, 'LeagueId', leagueId);

            $.ajax({
                url: url,
                beforeSend: function () {
                    Site.blockUI();
                },
                success: function (data) {
                    Site.unBlockUI();
                    const $ddlMatchList = $('#DdlMatchId');
                    $ddlMatchList.html(data);
                    const matchId = $ddlMatchList.val();
                    if (matchId === undefined) {
                        $('#SubmitButton').prop('disabled', true);
                    } else {
                        $('#SubmitButton').removeAttr('disabled');
                    }
                },
                type: 'POST',
                async: true,
                dataType: 'html'
            });
        },
        submit: function () {
            Site.blockUI();
            $('#LeagueId').val($('#DdlLeagueId').val());
            $('#MatchId').val($('#DdlMatchId').val());
            $('#IsShowFt').val(true);
            $('#IsShowFh').val(true);
            $('#NewForecastHdpOuForm').submit();
        },
        openBetlist: function (betChoice, param, betType, handicap) {
            let url = Site.resolveClientUrl('RunningMatchChoiceBetList/Index');
            url = QueryString.setParam(url, 'betchoice', betChoice);
            url = QueryString.setParam(url, 'matchid', param.MatchId);
            url = QueryString.setParam(url, 'leagueid', param.LeagueId);
            url = QueryString.setParam(url, 'CurrencyId', param.CurrencyId);
            url = QueryString.setParam(url, 'CurrencyName', param.CurrencyName);
            url = QueryString.setParam(url, 'BaseCurrency', param.BaseCurrency);
            url = QueryString.setParam(url, 'bettype', betType);
            url = QueryString.setParam(url, 'handicap', handicap === undefined ? '' : handicap);

            const popH = $(window).height(), popW = $(window).width();
            const formatter = new Array(
                'resizable=no',
                'scrollbars=yes',
                'toolbar=no',
                'menubar=no',
                'location=no',
                'addressbar=no',
                'directories=no',
                'status=yes',
                'top=0',
                'left=0',
                'height=' + popH,
                'width=' + popW
        ).join(',');

            window.open(url, '_blank', '' + ',' + formatter);
        }
    };

    return _me;
});