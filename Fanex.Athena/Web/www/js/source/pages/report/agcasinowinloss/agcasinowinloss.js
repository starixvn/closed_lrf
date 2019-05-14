'use strict';
define(['jquery', 'common/site', './agcasinowinloss.option', '../report', 'lib/jqgrid/jquery.jqgrid.additional',
        'components/pluginhelper/daterangepicker', 'moment', 'helpers/daterange',
        'extensions/jquery.extension', 'lib/jqgrid/jquery.jqGrid.en', 'lib/jqgrid/jquery.jqGrid.min'],
    function ($, Site, AgCasinoWinLossOption, Report, jqGridAdditional, DatePicker, moment, DateHelper) {
        const cacheData = {};
        let ajaxRequest = null;
        let _level = 0;
        const VALID_MONTH_RANGE = 3;
        let _submitData;
        let _drilldownData;

        const _me = {
            initialize: function () {
                Site.initialize();
                DatePicker.initDateRangePicker();
                _me.initEvent();
                Site.addUserGuide({
                    resourceName: 'AGCasinoWL',
                    title: Site.getSingleResource('AGCasinoWinLoss')
                });
                DateHelper.setConstraintMonthRange(VALID_MONTH_RANGE, AgCasinoWinLossOption.urlExcelData);
            },
            initEvent: function () {
                $('#SubmitButton').click(function () {
                    _level = 0;
                    _me.submit();
                });

                $('#ExportToExcel').click(function () {
                    $('#IsExportExcel').val(true);
                    const mainForm = $('#MainForm');
                    const url = Site.resolveClientUrl(AgCasinoWinLossOption.urlExcelData);
                    mainForm.attr('action', url);
                    mainForm.submit();
                    $('#IsExportExcel').val(false);
                    return false;
                });

                $('#level-link-container').on('click', '.level-link', function () {
                    const level = Number($(this).attr('data-level'));
                    _level = level;
                    return _me.goBack(level);
                });

                $('.main-content').on('click', '.drilldown', function () {
                    const data = JSON.parse($(this).attr('data-drilldown'));
                    _me.drillDown(data);
                });

                $(window).on('resize', function () {
                    _me.resizeGrid();
                });

                $(window).on('unload', function () {
                    $(window).off('resize');
                });
            },
            resizeGrid: function(){  
                const reportGrid = $('#ReportGrid');
                jqGridAdditional.updateGridHeight();
                jqGridAdditional.updateGridWidth(reportGrid);
            },
            //#region Layout
            setExcelUrl: function (level, currencyId, custId, fdate, tdate) {
                let temp = 'api/AgCasinoWinLossReport/Index';
                if (level > 0) {
                    temp += '?level=' + level + '&currencyId='
                    + currencyId + '&custId=' + custId + '&fdate=' + moment(fdate).format('MM/DD/YYYY')
                     + '&tdate=' + moment(tdate).format('MM/DD/YYYY');
                }

                AgCasinoWinLossOption.urlExcelData = temp;
            },

            setReportTitle: function (currencyId, fromdate, todate) {
                const titlePattern = Site.getSingleResource('AGCasinoWinLoss') + ', {0} → {1} - {2}';
                const currencyName = Report.getCurrencyNameForReportTitle(currencyId);
                const title = $.format(titlePattern, moment(fromdate).format('MM/DD/YYYY'), moment(todate).format('MM/DD/YYYY'), currencyName);
                $('.report-title').html(title);
                $('.panel-heading').removeClass('hide');
            },
            //#end

            //#Get Data
            ajaxComplete: function (level, response) {
                const levelNumber = Number(level);
                if (response != null) {
                    cacheData[levelNumber] = response;
                    if (levelNumber === 0) {
                        _drilldownData = {
                            IsExcludedTestData: _submitData.IsExcludedTestData,
                            CurrencyId: _submitData.CurrencyId,
                            FromDate: _submitData.FromDate,
                            ToDate: _submitData.ToDate,
                            CurrencyName: _submitData.CurrencyName,
                            ReportBy: _submitData.ReportBy,
                            BaseCurrency: _submitData.BaseCurrency
                        };

                        _me.setReportTitle($('#CurrencyId').val(), _submitData.FromDate, _submitData.ToDate);
                    }

                    Report.renderBreadCrumb(levelNumber);
                    _me.bindData(levelNumber, response);
                }
            },

            submit: function () {
                const mainForm = $('#MainForm');
                const postdata = mainForm.serializeObject();
                _submitData = postdata;
                const option = {
                    type: 'POST',
                    data: postdata,
                    dataType: 'json',
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    cache: false,
                    url: Site.resolveClientUrl(AgCasinoWinLossOption.urlData),
                    success: function (response) {
                        _me.setExcelUrl(0, 0, 0, '', '');
                        _me.ajaxComplete(0, response);
                    },
                    beforeSend: function () {
                        Site.blockUI();
                    },
                    complete: function (/*jqXhr, textStatus*/) {
                        Site.unBlockUI();
                    }
                };
                if (ajaxRequest != null) {
                    ajaxRequest.abort();
                }
                ajaxRequest = $.ajax(option);

                return true;
            },

            lastDateOfMonth: function (year, month) {
                return new Date(year, month + 1, 0);
            },

            drillDown: function (data) {

                data.level = Number(data.level);

                if (_level !== data.level) {
                    _level = data.level;
                }

                const param =
                {
                    IsExcludedTestData: _drilldownData.IsExcludedTestData,
                    CurrencyId: _drilldownData.CurrencyId,
                    FromDate: _drilldownData.FromDate,
                    ToDate: _drilldownData.ToDate,
                    ReportBy: _drilldownData.ReportBy,
                    BaseCurrency: _drilldownData.BaseCurrency
                };

                let fdate = new Date(Date.parse(data.datetime));
                let tdate = new Date(Date.parse(data.datetime));
                if (Number(param.ReportBy) === 2) {
                    let fday = 1;
                    const month = fdate.getMonth();
                    const year = fdate.getFullYear();
                    const orignalFDate = new Date(param.FromDate);
                    if (month === orignalFDate.getMonth()) {
                        fday = orignalFDate.getDate();
                    }
                    fdate = new Date(year, month, fday, 0, 0, 0, 0);
                    const originalTDate = new Date(param.ToDate);

                    if (month === originalTDate.getMonth()) {
                        const tday = originalTDate.getDate();
                        tdate = new Date(year, month, tday, 0, 0, 0, 0);
                    }
                    else {
                        tdate = _me.lastDateOfMonth(year, month);
                    }
                }
                
                const option = {
                    type: 'POST',
                    data: JSON.stringify(param),
                    dataType: 'json',
                    contentType: 'application/json',
                    url: Site.resolveClientUrl(AgCasinoWinLossOption.urlData +
                        '?level=' + data.level + '&currencyId=' + data.currencyId + '&custId=' + data.custId + '&fdate=' +
                        moment(fdate).format('MM/DD/YYYY') + '&tdate=' + moment(tdate).format('MM/DD/YYYY')),
                    success: function (response) {
                        _me.ajaxComplete(data.level, response);
                        if (response != null && response.Data.length > 0) {
                            if (data.level > 0 && Number(param.CurrencyId) === 0) {
                                _me.setReportTitle(data.currencyId, fdate, tdate);
                            } else {
                                _me.setReportTitle(param.CurrencyId, fdate, tdate);
                            }
                        }

                        _me.setExcelUrl(data.level, data.currencyId, data.custId, fdate, tdate);
                    },
                    beforeSend: function () {
                        Site.blockUI();
                    },
                    complete: function (/*jqXhr, textStatus*/) {
                        Site.unBlockUI();
                    }
                };
                if (ajaxRequest != null) {
                    ajaxRequest.abort();
                }
                ajaxRequest = $.ajax(option);
            },

            goBack: function (level) {
                if (level === 0) {
                    Report.renderBreadCrumb(level);
                    _me.bindData(0, cacheData[level]);
                    //reset excel Link
                    _me.setExcelUrl(0, 0, 0, '', '');
                    //re-set title
                    const fromdate = new Date(_drilldownData.FromDate);
                    const todate = new Date(_drilldownData.ToDate);
                    const currencyId = _drilldownData.CurrencyId;
                    _me.setReportTitle(currencyId, fromdate, todate);
                }
                else if (level === 1) {
                    _me.bindData(1, cacheData[level]);
                    AgCasinoWinLossOption.urlExcelData = AgCasinoWinLossOption.urlExcelData.replace('level=2', 'level=1');
                    Report.renderBreadCrumb(level);
                }
            },

            //#BindReport
            bindTotal: function (level, totalData, summaryTotal) {
                const columnModel = AgCasinoWinLossOption.getTotalColModel(level);
                const colspan = AgCasinoWinLossOption.totalColspan[level];
                const summaryColspan = colspan + 1;

                jqGridAdditional.assignTotal(totalData, columnModel);
                const summaryRowCount = Report.bindSummaryTotal(columnModel, summaryTotal);
                jqGridAdditional.setGroupFooters(colspan, summaryColspan, summaryRowCount);
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

                const gridOption = AgCasinoWinLossOption.getGridOption(levelNumber);
                gridOption.data = response.Data;
                gridOption.rowTotal = numOfRow;

                gridOption.gridComplete = function () {
                    
                    jqGridAdditional.gridComplete();
                    $('#pg_ppdata').hide();

                    _me.bindTotal(levelNumber, response.Total, response.SummaryTotal);

                    _me.resizeGrid();

                    Site.unBlockUI();
                };

                // Show the grid
                reportGrid.jqGrid(gridOption);
            }
            //#end
        };

        return _me;
    });
