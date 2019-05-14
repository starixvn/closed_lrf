define(['jquery', 'common/site', 'common/querystring', 'lib/jquery.cookie', 'vendor-materialize'],
    function ($, Site, QueryString) {
    'use strict';

    let curCountDown = 0;
    let countDownTimer = null;
    let cookieName = null;
    let countDownId = null;
    let defaultCountDown = 0;

    const _me = {
        initialize: function () {
            $('.menu-item').on('click', function () {
                const selectedCountDown = parseInt($(this).attr('data-count-down'), 10);
                _me.setCountDown(selectedCountDown, true);
            });

            $('.button-refresh').on('click', function () {
                _me.refresh();
            });

            const $hiddenCountdown = $('#count-down-of');
            countDownId = $hiddenCountdown.attr('name');

            // Get default count down
            defaultCountDown = parseInt($hiddenCountdown.attr('data-default-value'), 10);
        },
        initEvent: function () {
            cookieName = 'RefeshCountDown' + countDownId;
            //read countdown from cookie
            const countDownFromCookie = $.cookie(cookieName);
            if (countDownFromCookie && Number(countDownFromCookie) !== 0) {
                _me.setCountDown(countDownFromCookie, false);
            } else {
                _me.setCountDown(defaultCountDown, true);
            }
        },
        setCountDown: function (countDown, isSetToCookie) {
            const countDownInt = parseInt(countDown, 10);
            if (isSetToCookie) {
                $.cookie(cookieName, countDownInt);
            }
            curCountDown = countDownInt;
            _me.setMenuStatus();
            _me.tick();
        },
        setMenuStatus: function () {
            const index = curCountDown;
            $('#countdown-menu .menu-item').removeClass('menu-selected');
            $('#option-' + index).addClass('menu-selected');
        },
        tick: function () {
            document.getElementById('count').innerHTML = curCountDown;
            curCountDown--;
            if (countDownTimer !== null) {
                clearTimeout(countDownTimer);
            }
            countDownTimer = setTimeout(_me.tick, 1000);
            if (curCountDown < -1) {
                _me.refresh();
            }
        },
        refresh: function () {
            let oldScrollTop;
            if ($('.body-content').length) {
                oldScrollTop = $('.body-content').scrollTop();
            }

            if (countDownTimer !== null) {
                clearTimeout(countDownTimer);
            }
            document.getElementById('count').innerHTML = '...';

            // Get param before load data
            const url = _me.calculateUrl();

            Site.blockUI();
            $('#reportContent').load(url, {
                noncache: new Date().getTime()
            }, function () {
                Site.unBlockUI();
                _me.initEvent();
                
                // Currency constraint
                Site.currencyConstraint();

                $(window).resize();

                // Scrollbar still kept current position
                if ($('.body-content').length) {
                    $('.body-content').scrollTop(oldScrollTop);
                }
            });

            return true;
        },
        calculateUrl: function () {
            const leagueId = $('#LeagueId').val();
            const matchId = $('#MatchId').val();
            const betType = $('#BetType').val();
            const currentScore = $('#CurrentScore').val();
            const isShowFt = $('#IsShowFt').val();
            const isShowFh = $('#IsShowFh').val();
            const homeName = $('#HomeTeamId').val();
            const awayName = $('#AwayTeamId').val();

            let url = Site.getCurrentUrl();
            url = Site.setLicenseeOptionOriginalParam(url);
            url = QueryString.setParam(url, 'LeagueId', leagueId);
            url = QueryString.setParam(url, 'MatchId', matchId);
            url = QueryString.setParam(url, 'BetType', betType);
            url = QueryString.setParam(url, 'CurrentScore', currentScore);
            url = QueryString.setParam(url, 'IsShowFt', isShowFt);
            url = QueryString.setParam(url, 'IsShowFh', isShowFh);

            url = QueryString.setParam(url, 'HomeTeamId', homeName);
            url = QueryString.setParam(url, 'AwayTeamId', awayName);
            
            return encodeURI(url);
        }
    };

    return _me;
});