define(['jquery', 'common/site', 'common/querystring', 'components/refreshcountdown', 'common/popup', 'extensions/jquery.extension'],
    function ($, Site, QueryString, RefreshCountDown, Popup) {
        'use strict';

        let _isPopup;

        const _me = {
            resizeGrid: function () {
                const $grid = $('.body-content');
                if ($grid.length === 0) {
                    return;
                }

                const gridTop = $grid.offset().top;
                const footerSite = 18;
                let gridHeight = window.innerHeight - gridTop - footerSite - 10;
                gridHeight = Math.max(150, gridHeight);
                $grid.css('max-height', gridHeight);

                if (!$grid.hasVerticalScrollBar()) {
                    $grid.addClass('hasScroll');
                }
                else {
                    $grid.find('table').width($grid.width() - 17);
                }
            },
            initialize: function () {
                Site.initialize();

                _isPopup = $('#IsPopUp').val() === 'true';
                if (_isPopup) {
                    $('body').css('background', '#fff');
                    _me.resizePopup();
                }

                _me.initEvent();
                _me.resizeGrid();
                Site.addUserGuide({
                    resourceName: 'Forecast1x2',
                    title: Site.getSingleResource('Forecast') + ' - ' + Site.getSingleResource('OneXTwo')
                });

                RefreshCountDown.initialize();
                RefreshCountDown.initEvent();

                Site.unBlockUI();
            },
            initEvent: function () {
                $('.league-list').on('change', function () {
                    _me.submit();
                });

                $('#reportContent').on('click', '.button-add', function () {
                    const matchId = $(this).attr('data-match-id');
                    const betType = parseInt($(this).attr('data-bettype'), 10);
                    _me.openForecast(matchId, betType);
                });

                $('#SubmitButton').on('click', function () {
                    _me.submit();
                });

                $(window).on('resize', function () {
                    _me.resizeGrid();
                });

                $(window).on('unload', function () {
                    $(window).off('resize');
                });
            },
            openForecast: function (matchId, betType) {
                let url = Site.resolveClientUrl('RunningMatchBetList/Index');

                if (_isPopup) {
                    url = _me.getBetListUrl(url, matchId, betType);
                    const popH = Math.min(parent.innerHeight - 100, 650), popW = 900;
                    Popup.updateCurrentPopup(url, { width: popW, height: popH, title: Site.getSingleResource('BetList') });
                } else {
                    url = Site.setLicenseeOptionOriginalParam(url);
                    url = QueryString.setParam(url, 'matchid', matchId);
                    url = QueryString.setParam(url, 'bettype', betType);
                    Site.redirect(url);
                }
            },
            getBetListUrl: function (url, matchId, betType) {
                const currencyId = $('#CurrencyId-Hidden').val();
                const baseCurrency = $('#BaseCurrency-Hidden').val();
                let newUrl = url;
                newUrl = QueryString.setParam(newUrl, 'CurrencyId', currencyId);
                newUrl = QueryString.setParam(newUrl, 'BaseCurrency', baseCurrency);
                newUrl = QueryString.setParam(newUrl, 'matchid', matchId);
                newUrl = QueryString.setParam(newUrl, 'bettype', betType);
                newUrl = QueryString.setParam(newUrl, 'currencyname', QueryString.getParam(Site.getCurrentUrl(), 'currencyname'));

                return newUrl;
            },
            submit: function () {
                Site.blockUI();
                $('#ForecastOneXTwoForm').submit();
            },
            resizePopup: function () {
                const popH = Math.min(parent.innerHeight - 100, 600), popW = 700;
                const title = Site.getSingleResource('Forecast') + ' - ' + Site.getSingleResource('OneXTwo');
                Popup.updateCurrentPopup(null, { width: popW, height: popH, title: title });
            }
        };

        return _me;
    });