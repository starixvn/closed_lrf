'use strict';
define(['jquery', 'common/querystring', 'common/site', './cashoutwinloss.option', '../report', 'lib/jqgrid/jquery.jqgrid.additional',
        'components/pluginhelper/daterangepicker', 'moment', 'common/popup', 'helpers/daterange',
        'extensions/jquery.extension', 'lib/jqgrid/jquery.jqGrid.en', 'lib/jqgrid/jquery.jqGrid.min'],
    function ($, QueryString, Site, CashOutWinLossOption, Report, jqGridAdditional, DatePicker, moment, Popup, DateHelper) {
        const cacheData = {};
        let ajaxRequest = null;
        let _level = 0;
        const VALID_MONTH_RANGE = 3;
        let _submitData;

        const _me = {
            initialize: function () {
                Site.initialize();
                DatePicker.initDateRangePicker();
                Site.addUserGuide({
                    resourceName: 'CashOutWL',
                    title: Site.getSingleResource('CashOutWinLoss')
                });
                DateHelper.setConstraintMonthRange(VALID_MONTH_RANGE, CashOutWinLossOption.urlExcelData);
                _me.initEvent();
                _me.initSetting();
                _me.registerGlobalFunction();
            },

            initSetting: function () {
                CashOutWinLossOption.isLicenseeOfferBA = $('#IsLicenseeOfferBA').val() === '1';
            },

            registerGlobalFunction: function () {
                window.cashoutDrillDown = _me.drillDown;
            },

            initEvent: function () {
                $('#SubmitButton').click(function () {
                    $('#IsExportExcel').val(false);
                    _level = 0;
                    _me.submit();
                });

                $('#ExportToExcel').click(function () {
                    $('#IsExportExcel').val(true);
                    const $mainForm = $('#MainForm');
                    const url = Site.resolveClientUrl(CashOutWinLossOption.urlExcelData);
                    $mainForm.attr('action', url);
                    $mainForm.submit();
                    $('#IsExportExcel').val(false);
                    return false;
                });

                $('#level-link-container').on('click', '.level-link', function () {
                    const level = Number($(this).data('level'));
                    _level = level;
                    if (level < 2) {
                        _me.goBack(level);
                    }
                });

                $('body').on('click', '.bet-list-link', function () {
                    const dataDrillDown = $(this).attr('data-drill-down');
                    _me.openBetlistPopUp(dataDrillDown);
                });

                $(window).on('resize', function () {
                    _me.resizeGrid();
                });

                $(window).on('unload', function () {
                    $(window).off('resize');
                });
            },

            submit: function () {
                const $mainForm = $('#MainForm');
                const postdata = $mainForm.serializeObject();
                _submitData = postdata;
                const option = {
                    type: 'POST',
                    data: postdata,
                    dataType: 'json',
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    cache: false,
                    url: Site.resolveClientUrl(CashOutWinLossOption.urlData),
                    success: function (response) {
                        _me.setExcelUrl(0, 0, 0, '', '');
                        _me.ajaxComplete(0, response);
                    },
                    beforeSend: function () {
                        Site.blockUI();
                    },
                    complete: function () {
                        Site.unBlockUI();
                    }
                };
                if (ajaxRequest !== null) {
                    ajaxRequest.abort();
                }
                ajaxRequest = $.ajax(option);

                return true;
            },

            setExcelUrl: function (level, currencyId, custId, fdate, tdate) {
                let temp = 'api/CashOutWinLossReport/Index';
                if (level > 0) {
                    temp += '?level=' + level + '&currencyId=' + currencyId + '&custId=' + custId +
                        '&fdate=' + moment(fdate).format('MM/DD/YYYY') + '&tdate=' + moment(tdate).format('MM/DD/YYYY');
                }

                CashOutWinLossOption.urlExcelData = temp;
            },

            ajaxComplete: function (level, response) {
                const levelNumber = Number(level);
                if (response !== null) {
                    cacheData[levelNumber] = response;
                    if (levelNumber === 0) {
                        _me.setReportTitle($('#CurrencyId').val(), _submitData.FromDate, _submitData.ToDate);
                    }

                    Report.renderBreadCrumb(levelNumber);
                    _me.bindData(levelNumber, response);
                }
            },

            setReportTitle: function (currencyId, fromdate, todate, currencyName) {
                const titlePattern = Site.getSingleResource('CashOutWinLoss') + ', {0} → {1} - {2}';
                const currencyNameOnTitle = currencyName ? Site.getSingleResource('Viewin').replace('{0}', currencyName)
                                                        : Report.getCurrencyNameForReportTitle(currencyId);
                const title = $.format(titlePattern,
                    moment(fromdate, 'MM/DD/YYYY').format('MM/DD/YYYY'),
                    moment(todate, 'MM/DD/YYYY').format('MM/DD/YYYY'),
                    currencyNameOnTitle);
                $('.report-title').html(title);
                $('.panel-heading').removeClass('hide');
            },

            bindData: function (level, response) {
                jqGridAdditional.clearGrid('ReportGrid');
                const numOfRow = response.Data.length;
                if (numOfRow === 0) {
                    jqGridAdditional.setNoInfo();
                    return;
                }

                const levelNumber = Number(level);
                const reportGrid = $('#ReportGrid');

                const gridOption = CashOutWinLossOption.getGridOption(levelNumber);
                gridOption.data = response.Data;
                gridOption.rowTotal = numOfRow;

                gridOption.gridComplete = function () {
                    jqGridAdditional.gridComplete();
                    $('#pg_ppdata').hide();
                    _me.bindTotal(levelNumber, response.Total, response.SummaryTotal);
                    $('#footer').html($('.ui-jqgrid-ftable').html());

                    CashOutWinLossOption.setGroupHeaders(reportGrid);
                    _me.resizeGrid();
                    Site.unBlockUI();
                };

                reportGrid.jqGrid(gridOption);
            },

            bindTotal: function (level, totalData, summaryTotal) {
                const columnModel = CashOutWinLossOption.getTotalColModel(level);
                const colspan = CashOutWinLossOption.totalColspan[level];
                const summaryColspan = colspan + 1;

                jqGridAdditional.assignTotal(totalData, columnModel);
                const summaryRowCount = Report.bindSummaryTotal(columnModel, summaryTotal);
                jqGridAdditional.setGroupFooters(colspan, summaryColspan, summaryRowCount);
            },

            resizeGrid: function () {
                const reportGrid = $('#ReportGrid');
                jqGridAdditional.updateGridHeight();
                jqGridAdditional.updateGridWidth(reportGrid);
            },

            goBack: function (level) {
                Report.renderBreadCrumb(level);
                _me.bindData(level, cacheData[level]);

                if (level === 0) {
                    _me.setExcelUrl(0, 0, 0, '', '');
                    _me.setReportTitle(_submitData.CurrencyId, _submitData.FromDate, _submitData.ToDate);
                }
                else if (level === 1) {
                    CashOutWinLossOption.urlExcelData = CashOutWinLossOption.urlExcelData.replace('level=2', 'level=1');
                }
            },

            drillDown: function (level, currencyId, customerId, datetime) {
                const levelNumber = Number(level);

                let newCurrencyId = currencyId;
                if (newCurrencyId === 0) {
                    newCurrencyId = _submitData.CurrencyId;
                }

                if (_level !== levelNumber) {
                    _level = levelNumber;
                }

                const param =
                {
                    IsExcludedTestData: _submitData.IsExcludedTestData,
                    CurrencyId: _submitData.CurrencyId,
                    FromDate: _submitData.FromDate,
                    ToDate: _submitData.ToDate,
                    ReportBy: _submitData.ReportBy,
                    BaseCurrency: _submitData.BaseCurrency
                };

                const drilldownDate = new Date(datetime);
                const dateRange = Report.GetDrilldownDateRange(param.ReportBy, param.FromDate, param.ToDate, drilldownDate);

                const postData = JSON.stringify(param);
                const url = Site.resolveClientUrl(CashOutWinLossOption.urlData) +
                        '?level=' + levelNumber + '&currencyId=' + newCurrencyId + '&custId=' + customerId +
                        '&fdate=' + moment(dateRange.FromDate).format('MM/DD/YYYY') + '&tdate=' + moment(dateRange.ToDate).format('MM/DD/YYYY');

                const option = {
                    type: 'POST',
                    data: postData,
                    dataType: 'json',
                    contentType: 'application/json',
                    cache: false,
                    url: url,
                    success: function (response) {
                        _me.ajaxComplete(levelNumber, response);
                        if (response !== null && response.Data.length > 0) {                     
                            if (levelNumber > 0 && Number(param.CurrencyId) === 0) {
                                const viewInCurrency = param.BaseCurrency ? param.BaseCurrency.toUpperCase() : '';
                                _me.setReportTitle(newCurrencyId, dateRange.FromDate, dateRange.ToDate, viewInCurrency);
                            } else {
                                _me.setReportTitle(param.CurrencyId, dateRange.FromDate, dateRange.ToDate);
                            }

                            _me.setExcelUrl(levelNumber, newCurrencyId, customerId, dateRange.FromDate, dateRange.ToDate);
                        }
                    },
                    beforeSend: function () {
                        Site.blockUI();
                    },
                    complete: function () {
                        Site.unBlockUI();
                    }
                };
                if (ajaxRequest !== null) {
                    ajaxRequest.abort();
                }
                ajaxRequest = $.ajax(option);
            },
            openBetlistPopUp: function (dataDrillDown) {
                const newDataDrillDown = $.parseJSON(dataDrillDown);
                const dateRange = Report.GetDrilldownDateRange(_submitData.ReportBy, _submitData.FromDate, _submitData.ToDate, newDataDrillDown.DrillDownDate);
                let url = Site.resolveClientUrl('CustomerWinLossBetList/Index');
                url = QueryString.setParam(url, 'fromdate', moment(dateRange.FromDate).format('MM/DD/YYYY'));
                url = QueryString.setParam(url, 'todate', moment(dateRange.ToDate).format('MM/DD/YYYY'));
                url = QueryString.setParam(url, 'excludetest', _submitData.IsExcludedTestData);
                url = QueryString.setParam(url, 'CurrencyId', newDataDrillDown.DrillDownCurrencyId);
                url = QueryString.setParam(url, 'CurrencyName', newDataDrillDown.DrillDownCurrencyName);
                url = QueryString.setParam(url, 'drawfilter', _submitData.DrawFilter);
                url = QueryString.setParam(url, 'custid', newDataDrillDown.CustomerId);
                url = QueryString.setParam(url, 'systemId', newDataDrillDown.SystemId);
                url = QueryString.setParam(url, 'externalId', newDataDrillDown.ExternalId);
                url = QueryString.setParam(url, 'BaseCurrency', _submitData.BaseCurrency);
                url = QueryString.setParam(url, 'excelfilename', 'CashOutWinLossBetList');
                url = Site.setProductCodeListParam(url, 'CO');

                const popH = Math.min($(window).height() - 100, 650), popW = 920;
                const popupOption = { id: 'betlist-popup', width: popW + 50, height: popH + 50, title: Site.getSingleResource('CustomerBetList') };
                Popup.openPopupWithIframe(url, popupOption);
                window.logOpenBetlistEvent && window.logOpenBetlistEvent();
            },
            lastDateOfMonth: function (year, month) {
                return moment([year, month + 1]).endOf('month');
            }
        };

        return _me;
    });