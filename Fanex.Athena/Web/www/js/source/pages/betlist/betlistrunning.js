'use strict';
define(
    ['jquery', 'common/site', 'common/querystring', './betlist'],
    function ($, Site, QueryString, BetList) {

        const _me = {
            initialize: function () {
                _me.initEvent();
                _me.submit();
                Site.addUserGuide({
                    resourceName: $('#userGuideName').val(),
                    title: Site.getSingleResource('TotalBets') + ' - ' + $('#title').val()
                });
            },

            initEvent: function () {
                $('#SubmitButton').click(function () {
                    _me.submit();
                });

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
                BetList.initialize();
                const actionName = Site.getLocation().pathname.split('/').pop();
                const url = Site.resolveClientUrl('api/RunningBetList/' + actionName);
                const params = Site.setLicenseeOptionParam();

                BetList.loadData(params, url);
            }
        };

        return _me;
    });