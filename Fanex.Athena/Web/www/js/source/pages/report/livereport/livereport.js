define(
    ['jquery', 'common/querystring', 'common/site', 'components/pluginhelper/daterangepicker', 'components/pluginhelper/monthpicker', './helper'],
    function ($, QueryString, Site, DatePicker, MonthPicker, Helper) {
        'use strict';

        function initialize() {
            Site.initialize();
            initEvent();
            DatePicker.initDateRangePicker();
            MonthPicker.initMonthPicker();
            Site.addUserGuide({
                resourceName: 'LiveReport',
                title: Site.getSingleResource('LiveReport')
            });
        }

        function initEvent() {
            $('#switchreport').click(function () {
                const mod = $(this).attr('data-history-mode');
                if (mod === 'False') {
                    Site.redirect(Site.resolveClientUrl('LiveReport?isViewedHistory=True'));
                }
                else {
                    Site.redirect(Site.resolveClientUrl('LiveReport?isViewedHistory=False'));
                }
            });

            $('body').on('click', '.product-detail-link', function () {
                viewProductDetail(this);
            });

            $('body').on('click', '.sport-detailt-link', function () {
                viewSportDetail(this);
            });

            $('#exporttoexcel').click(function () {
                $('#IsExportExcel').val(true);
                $('#livereport').submit();
                $('#IsExportExcel').val(false);
            });

            $('#btnSubmit').click(function () {
                Site.blockUI();
                $('#livereport').submit();
            });
        }

        function viewProductDetail(target) {
            const productCode = $(target).attr('data-product-code');
            let data = {
                productCode: productCode,
                FromDate: $('#FromDate').attr('data-original-from'),
                ToDate: $('#ToDate').attr('data-original-to'),
                BaseCurrency: $('#BaseCurrency').attr('data-original'),
                LiveIndicator: $('#LiveIndicator').attr('data-original')
            };
            data = Site.setLicenseeOptionOriginalParam(data);
            const isSelected = $(target).parent().hasClass('selected');
            if (isSelected) { return; }

            $('a.product-detail-link').parent().removeClass('selected');
            $(target).parent().addClass('selected');

            $.ajax({
                type: 'POST',
                data: data,
                dataType: 'json',
                url: Site.resolveClientUrl('LiveReport/Detail'),
                beforeSend: Site.blockUI,
                complete: function (jqXHR) {
                    if (jqXHR.readyState === 4) {
                        $('#ProductCode').val(data.productCode);
                        $('#detail-content').html(jqXHR.responseText);
                    }
                    Site.unBlockUI();
                }
            });
        }

        function viewBetList(url, totalValue, productOptions) {
            let newUrl = Site.setLicenseeOptionOriginalParam(url);
            newUrl = QueryString.setParam(newUrl, 'fromdate', $('#FromDate').attr('data-original-from'));
            newUrl = QueryString.setParam(newUrl, 'todate', $('#ToDate').attr('data-original-to'));
            newUrl = QueryString.setParam(newUrl, 'LiveIndicator', $('#LiveIndicator').attr('data-original'));
            newUrl = Helper.setSumParams(newUrl, totalValue);
            newUrl = Site.setProductCodeListParam(newUrl, productOptions);

            Site.blockUI();
            Site.redirect(newUrl);
        }

        function viewSportDetail(target) {
            const data = $(target).attr('data-drill-down');
            const jsonData = $.parseJSON(data);
            const productCode = $('#ProductCode').val();
            // after users back from match list, 
            // the report does not show detailed data, 
            // so remove product code to not show detailed data in EXPORT EXCEL
            $('#ProductCode').val('');
            const productOptions = Helper.getMatchListProductOption(jsonData.SportId, productCode);
            const urlMap = {
                Key101: 'LiveReportBetList/MixParlay?bettype=9',
                Key102: 'LiveReportBetList/MixParlay?bettype=29',
                Key103: 'LiveReportBetList/Outright',
                Key161: 'LiveReportBetList/NumberGame?Sporttype=161',
                Key164: 'LiveReportBetList/NumberGame?Sporttype=164',
                Key181: 'LiveReportBetList/VirtualSports?SportType=181',
                Key182: 'LiveReportBetList/VirtualSports?SportType=182',
                Key183: 'LiveReportBetList/VirtualSports?SportType=183',
                Key184: 'LiveReportBetList/VirtualSports?SportType=184',
                Key185: 'LiveReportBetList/VirtualSports?SportType=185',
                Key104: 'LiveReportBetList/MixParlay?bettype=2799'
            };

            let url = urlMap['Key' + jsonData.SportId];
            if (url) {
                viewBetList(Site.resolveClientUrl(url), jsonData.TotalValue, productOptions);
            }
            else {
                // Match List
                url = Site.resolveClientUrl('LiveReport/MatchList');
                url = Site.setLicenseeOptionOriginalParam(url);
                url = QueryString.setParam(url, 'SportId', jsonData.SportId);
                url = QueryString.setParam(url, 'ProductCode', productCode);
                url = QueryString.setParam(url, 'FromDate', $('#FromDate').attr('data-original-from'));
                url = QueryString.setParam(url, 'ToDate', $('#ToDate').attr('data-original-to'));
                url = QueryString.setParam(url, 'LiveIndicator', $('#LiveIndicator').attr('data-original'));
                url = Site.setProductCodeListParam(url, productOptions);

                Site.blockUI();
                Site.redirect(url);
            }
        }

        return {
            initialize: initialize
        };
    }
);