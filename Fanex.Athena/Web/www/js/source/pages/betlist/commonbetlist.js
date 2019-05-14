define(['jquery', 'common/site', 'common/querystring', './betlist'], function ($, Site, QueryString, BetList) {
    'use strict';

    const MAXIMUM_EXCEL_ROWS = 2147483646;

    const _me = {
        initialize: function () {
            Site.initialize();
            BetList.initialize();
            $('.content-filter').remove();

            let apiUrl = $('#ApiUrl').val();

            apiUrl = Site.resolveClientUrl(apiUrl);
            const serverPaging = $('#IsServerPaging').val();
            if (serverPaging === '1') {
                const paramString = QueryString.getQueryString(Site.getCurrentUrl());
                BetList.loadDataPaging(apiUrl + '?' + paramString);
            }
            else {
                const params = $.parseJSON($('#BetListMetaModel').val());

                // Update datetime because js-engine parser jsonDatetime wrongly
                params.FromDate = params.FromDateString;
                params.ToDate = params.ToDateString;
                params.Date = params.DateString;
                BetList.loadData(params, apiUrl);
            }

            $('#ExportToExcel').click(_me.exportToExcel);

            $(window).on('resize', function () {
                BetList.resizeGrid();
            });

            $(window).on('unload', function () {
                $(window).off('resize');
            });
        },
        exportToExcel: function () {
            const $grid = $('#BetListGrid');
            if ($('#IsExportAll').val() === '1') {
                const totalRows = $grid.jqGrid('getGridParam', 'records');
                if (totalRows > MAXIMUM_EXCEL_ROWS) {
                    alert(Site.getSingleResource('ExcelExceedRowsMsg'));
                    return;
                }
            }

            let url = Site.getCurrentUrl();
            const page = $grid.getGridParam('page');
            const size = $grid.getGridParam('rowNum');

            const serverPaging = $('#IsServerPaging').val();
            if (serverPaging === '1') {
                url = QueryString.setParam(url, 'PageIndex', page);
                url = QueryString.setParam(url, 'PageSize', size);
                url = QueryString.setParam(url, 'IsServerPaging', true);
            }

            const sortParams = BetList.getSortParams();
            if (sortParams) {
                url = QueryString.setParam(url, 'SortBy', sortParams.SortBy);
                url = QueryString.setParam(url, 'SortOrder', sortParams.SortOrder);
            }

            url = QueryString.setParam(url, 'IsExportExcel', true);
            Site.redirect(url);
        }
    };

    return _me;
});
