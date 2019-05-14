define([
    'jquery',
    'common/querystring',
    'common/site',
    '../../report',
    'lib/jqgrid/jquery.jqgrid.additional',
    'components/pluginhelper/daterangepicker',
    'helpers/daterange',
    'moment',
    'common/popup',
    'lib/jqgrid/jquery.jqGrid.en',
    'lib/jqgrid/jquery.jqGrid.min',
    'extensions/jquery.extension'],
    function ($, QueryString, Site, Report, jqGridAdditional, DatePicker, DateHelper, moment, Popup) {
        'use strict';
        const defaultOption = {
            UserGuideResourceName: '',
            UserGuideTitle: '',
            ValidMonthRange: 0,
            ReportTitle: '',
            GridOption: {}
        };

        const _selector = {
            SubmitButton: '#SubmitButton',
            ExportExcelInput: '#IsExportExcel',
            ExportToExcel: '#ExportToExcel',
            Form: '#ThirdPartyWinLossForm',
            Title: '.report-title',
            Header: '.panel-heading',
            GridId: 'ReportGrid',
            OrderItemInput: '#OrderItem',
            CanDrilldown: false,
            LevelLinkContainer: '#level-link-container',
            LevelLink: '.level-link',
            DrillDownLink: '.drilldown',
            BetListLink: '.bet-list-link'
        };

        let _ajaxRequest;
        const _cacheData = [];
        let _submitData;
        let _reportTitle;
        let _urlExcelData;
        let _thirdPartyWinLossOption;

        function initialize(memberOption) {
            Site.initialize();

            const option = $.extend({}, defaultOption, memberOption || {});

            if (option.UserGuideResourceName !== '') {
                Site.addUserGuide({
                    resourceName: option.UserGuideResourceName,
                    title: Site.getSingleResource(option.UserGuideTitle)
                });
            }

            _me.initSetting(option);

            DatePicker.initDateRangePicker();
            if (option.ValidMonthRange > 0) {
                DateHelper.setConstraintMonthRange(option.ValidMonthRange, _thirdPartyWinLossOption.urlExcelData);
            }

            _me.initEvent();
        }

        function initSetting(option) {
            _thirdPartyWinLossOption = option.GridOption;
            _reportTitle = Site.getSingleResource(option.ReportTitle);
            _urlExcelData = _thirdPartyWinLossOption.urlExcelData;
        }

        function initEvent() {
            $(_selector.SubmitButton).click(function () {
                _me.submit();
            });

            $(_selector.ExportToExcel).click(function () {
                $(_selector.ExportExcelInput).val(true);
                const mainForm = $(_selector.Form);
                const url = Site.resolveClientUrl(_urlExcelData);
                mainForm.attr('action', url);
                mainForm.submit();
                $(_selector.ExportExcelInput).val(false);
                return false;
            });

            $(_selector.LevelLinkContainer).on('click', _selector.LevelLink, function () {
                const level = $(this).data('level');
                if (level < 2) {
                    Report.renderBreadCrumb(level, _thirdPartyWinLossOption.licenseeId);
                    _me.bindData(level, _cacheData[level]);
                    _urlExcelData = _urlExcelData.replace('level=2', 'level=1');
                }
                if (level === 0) {
                    _me.setReportTitle(_submitData.CurrencyId, _submitData.FromDate, _submitData.ToDate);
                    setExcelUrl(0);
                }
            });

            $('.main-content').on('click', _selector.DrillDownLink, function () {
                const data = $(this).data('drill-down');
                _me.submit(data);
            });

            $('.main-content').on('click', _selector.BetListLink, function () {
                const dataDrillDown = $(this).data('drill-down');
                openBetlistPopUp(dataDrillDown);
            });

            $(window).on('resize', function () {
                resizeGrid();
            });

            $(window).on('unload', function () {
                $(window).off('resize');
            });
        }

        function submit(drillDownData) {
            let postdata;
            let currencyId = 0;
            let fromDate = '';
            let toDate = '';
            let custId = 0;
            let level = 0;

            if (drillDownData) {
                level = drillDownData.Level;
                
                postdata = _submitData;
                currencyId = drillDownData.CurrencyId || _submitData.CurrencyId;
                custId = drillDownData.CustId;

                const drilldownDateRange = Report.GetDrilldownDateRange(postdata.ReportBy, postdata.FromDate, postdata.ToDate, drillDownData.Datetime);
                fromDate = moment(drilldownDateRange.FromDate).format('MM/DD/YYYY');
                toDate = moment(drilldownDateRange.ToDate).format('MM/DD/YYYY');
            }
            else {
                postdata = $(_selector.Form).serializeObject();
                currencyId = postdata.CurrencyId;
                fromDate = postdata.FromDate;
                toDate = postdata.ToDate;
            }

            const url = setUpUrl(_thirdPartyWinLossOption.urlData, level, currencyId, custId, fromDate, toDate);
            const option = {
                type: 'POST',
                data: postdata,
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                cache: false,
                url: Site.resolveClientUrl(url),
                success: function (response) {
                    setExcelUrl(level, currencyId, custId, fromDate, toDate);
                    ajaxComplete(level, response, postdata);

                    const currencyName = level > 0 && postdata.BaseCurrency ? postdata.BaseCurrency.toUpperCase() : '';
                    _me.setReportTitle(currencyId, fromDate, toDate, currencyName);
                },
                beforeSend: function () {
                    Site.blockUI();
                },
                complete: function () {
                    Site.unBlockUI();
                }
            };
            if (_ajaxRequest != null) {
                _ajaxRequest.abort();
            }
            _ajaxRequest = $.ajax(option);

            return true;
        }

        function bindData(level, response) {
            Site.blockUI();
            jqGridAdditional.clearGrid(_selector.GridId);

            if (response == null || response.Data.length === 0) {
                jqGridAdditional.setNoInfo();
                Site.unBlockUI();
                return;
            }

            const numOfRow = response.Data.length;

            const reportGrid = $('#' + _selector.GridId);

            const gridOption = _thirdPartyWinLossOption.getGridOption(level, _submitData.ReportBy);
            gridOption.data = response.Data;
            gridOption.rowNum = numOfRow;
            gridOption.gridComplete = function () {
                jqGridAdditional.gridComplete();
                _me.bindTotal(level, response.Total, response.SummaryTotal);
                resizeGrid();
                Site.unBlockUI();
            };

            reportGrid.jqGrid(gridOption);
            _thirdPartyWinLossOption.setGroupHeader(reportGrid);
        }

        function bindTotal(level, totalData, summaryTotal) {
            const columnModel = _thirdPartyWinLossOption.getTotalColModel(level, _submitData.ReportBy);
            const colspan = _thirdPartyWinLossOption.totalColspan[level];
            const summaryColspan = colspan + 1;

            jqGridAdditional.assignTotal(totalData, columnModel);
            const summaryRowCount = Report.bindSummaryTotal(columnModel, summaryTotal);
            jqGridAdditional.setGroupFooters(colspan, summaryColspan, summaryRowCount);
        }

        function setReportTitle(currencyId, fromdate, todate, currencyName) {
            const titlePattern = _reportTitle + ', {0} → {1} - {2}';
            //get currencyName
            const currencyStr = currencyName ? Site.getSingleResource('Viewin').replace('{0}', currencyName)
                                                        : Report.getCurrencyNameForReportTitle(currencyId);

            const title = $.format(titlePattern, fromdate, todate, currencyStr);

            $(_selector.Title).html(title);
            $(_selector.Header).removeClass('hide');
        }

        function ajaxComplete(level, response, param) {
            if (response != null) {
                _cacheData[level] = response;
                if (level === 0) {
                    _submitData = param;
                }

                Report.renderBreadCrumb(level, _thirdPartyWinLossOption.licenseeId);
                _me.bindData(level, response);
            }
        }

        function setExcelUrl(level, currencyId, custId, fdate, tdate) {
            _urlExcelData = setUpUrl(_thirdPartyWinLossOption.urlExcelData, level, currencyId, custId, fdate, tdate);
        }

        function setUpUrl(url, level, currencyId, custId, fdate, tdate) {
            let newUrl = url;
            if (level > 0) {
                newUrl = QueryString.setParam(newUrl, 'level', level);
                newUrl = QueryString.setParam(newUrl, 'currencyId', currencyId);
                newUrl = QueryString.setParam(newUrl, 'custId', custId);
                newUrl = QueryString.setParam(newUrl, 'fdate', fdate);
                newUrl = QueryString.setParam(newUrl, 'tdate', tdate);
            }

            return newUrl;
        }

        function resizeGrid() {
            const reportGrid = $('#' + _selector.GridId);
            jqGridAdditional.updateGridHeight();
            jqGridAdditional.updateGridWidth(reportGrid);
        }

        function openBetlistPopUp(dataDrillDown) {
            const dateRange = Report.GetDrilldownDateRange(_submitData.ReportBy, _submitData.FromDate, _submitData.ToDate, dataDrillDown.DrillDownDate);

            let url = Site.resolveClientUrl('LicenseeWinLossBetList/Index');
            url = QueryString.setParam(url, 'fromdate', moment(dateRange.FromDate).format('MM/DD/YYYY'));
            url = QueryString.setParam(url, 'todate', moment(dateRange.ToDate).format('MM/DD/YYYY'));
            url = QueryString.setParam(url, 'excludetest', _submitData.IsExcludedTestData);
            url = QueryString.setParam(url, 'CurrencyId', dataDrillDown.DrillDownCurrencyId);
            url = QueryString.setParam(url, 'CurrencyName', dataDrillDown.DrillDownCurrencyName);
            url = QueryString.setParam(url, 'drawfilter', _submitData.DrawFilter);
            url = QueryString.setParam(url, 'custid', dataDrillDown.CustomerId);
            url = QueryString.setParam(url, 'systemId', dataDrillDown.SystemId);
            url = QueryString.setParam(url, 'externalId', dataDrillDown.ExternalId);
            url = QueryString.setParam(url, 'BaseCurrency', _submitData.BaseCurrency);
            url = QueryString.setParam(url, 'excelfilename', 'ColossusBetsWinLossBetList');
            url = Site.setProductCodeListParam(url, 'CB');

            const popH = Math.min($(window).height() - 100, 650), popW = 920;
            const popupOption = { id: 'betlist-popup', width: popW + 50, height: popH + 50, title: Site.getSingleResource('CustomerBetList') };
            Popup.openPopupWithIframe(url, popupOption);
            window.logOpenBetlistEvent && window.logOpenBetlistEvent();
        }

        const _me = {
            initialize: initialize,
            initSetting: initSetting,
            initEvent: initEvent,
            submit: submit,
            bindData: bindData,
            setReportTitle: setReportTitle,
            bindTotal: bindTotal
        };

        return _me;
    });