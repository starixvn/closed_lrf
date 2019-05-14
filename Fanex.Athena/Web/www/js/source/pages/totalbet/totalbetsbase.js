define(['jquery', 'common/site', 'common/querystring', 'components/refreshcountdown', 'extensions/jquery.extension'],
    function ($, Site, QueryString, RefreshCountDown) {
        'use strict';

        const _me = {
            resizeGrid: function () {
                const $grid = $('.body-content');
                if ($grid.length === 0) {
                    return;
                }

                const gridTop = $grid.offset().top;
                const footerSite = 18;

                let gridHeight = window.innerHeight - gridTop - $('.footer-content').height() - footerSite - 10;
                gridHeight = Math.max(150, gridHeight);
                $grid.css('max-height', gridHeight);

                if (!$grid.hasVerticalScrollBar()) {
                    $grid.addClass('hasScroll');
                }
                else {
                    $grid.find('table').width($grid.width() - 17);
                }
            },
            initEvent: function () {
                RefreshCountDown.initialize();

                $('#reportContent').on('click', '.forcast-number', function () {
                    const matchId = $(this).attr('data-match-id');
                    const betType = $(this).attr('data-bet-type');
                    _me.viewRunningBetListMatch(matchId, betType);
                });

                $(document).ajaxComplete(function () {
                    _me.resizeGrid();
                });

                $(window).on('resize', function () {
                    _me.resizeGrid();
                });

                $(window).on('unload', function () {
                    $(window).off('resize');
                });
            },
            viewRunningBetListMatch: function (matchId, betType) {
                let url = Site.resolveClientUrl('RunningMatchBetList/Index');
                url = Site.setLicenseeOptionOriginalParam(url);
                url = QueryString.setParam(url, 'matchid', matchId);
                url = QueryString.setParam(url, 'bettype', betType);
                url = QueryString.setParam(url, 'isShowSumStake', true);

                Site.redirect(url);
            },
            viewRunningBetListMultiBettype: function (matchId, betType) {
                let url = Site.resolveClientUrl('RunningBettypesOfMatchBetList/Index');
                url = Site.setLicenseeOptionOriginalParam(url);
                url = QueryString.setParam(url, 'matchid', matchId);
                url = QueryString.setParam(url, 'multiplebettype', betType);
                url = QueryString.setParam(url, 'isShowSumStake', true);

                Site.redirect(url);
            },

            initialize: function () {
                _me.initEvent();
                _me.resizeGrid();
                Site.unBlockUI();
            }
        };

        return _me;
    });