/// <reference path='/@JSense.js' />
'use strict';
define(
    ['jquery', 'common/site', 'common/querystring', './betlist'],
    function ($, Site, QueryString, BetList) {

        const _me = {
            initialize: function () {
                BetList.initialize();
                _me.initEvent();
                _me.submit();
                Site.addUserGuide({
                    resourceName: $('#userGuideName').val(),
                    title: Site.getSingleResource('TotalBets') + ' - ' + $('#title').val()
                });
            },

            initEvent: function () {
                $('#SubmitButton').click(_me.submit);

                $('#ExportToExcel').click(function () {
                    let url = Site.getCurrentUrl();
                    url = Site.setLicenseeOptionParam(url);
                    url = QueryString.setParam(url, 'IsExportExcel', true);
                    const sortParams = BetList.getSortParams();
                    if (sortParams) {
                        url = QueryString.setParam(url, 'SortBy', sortParams.SortBy);
                        url = QueryString.setParam(url, 'SortOrder', sortParams.SortOrder);
                    }
                    Site.redirect(url);
                });

                $(window).on('resize', function () {
                    BetList.resizeGrid();
                });

                $(window).on('unload', function () {
                    $(window).off('resize');
                });
            },

            submit: function () {
                const actionName = Site.getLocation().pathname.split('/').pop();
                const params = Site.setLicenseeOptionParam();
                const url = Site.resolveClientUrl('api/RunningBettypesBetList/' + actionName);

                BetList.loadData(params, url);
            }
        };

        return _me;
    });