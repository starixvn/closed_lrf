define(['jquery', 'common/site', 'common/querystring', 'lib/jqgrid/jquery.jqgrid.additional', './winlossbyproduct.option', 'moment', 'common/popup',
    'components/pluginhelper/daterangepicker', '../report', 'components/pluginhelper/multiselect', 'components/pluginhelper/autocomplete',
    'helpers/daterange', 'helpers/excel',
    'extensions/jquery.extension', 'lib/jqgrid/jquery.jqGrid.en', 'lib/jqgrid/jquery.jqGrid.min'],
    function ($, Site, QueryString, jqGridAdditional, WinLossByProductOption, moment, Popup, DatePicker, Report,
        MultiSelect, AutoComplete, DateHelper, ExcelHelper) {
        'use strict';
        const VALID_MONTH_RANGE = 3;
        const _cacheData = [];
        let ajaxRequest = null;
        let _memberId, _systemId; // store data when submit level 0
        let _submitData = {}; // cache submit data of level 0.
        
        function getPostData() {
            const data = $('#SearchForm').serializeObject();
            if (data.Username === '') {
                data.Username = null;
            }

            return data;
        }

        function getLicenseeWLNote(productOptionJson, caption) {
            const productOptions = $.parseJSON(productOptionJson || '[]');
            const resultProducts = [];
            $.each(productOptions, function (index, item) {
                if (Site.asBool(item.Status)) {
                    resultProducts.push(item.Code);
                }
            });
            if (resultProducts.length > 0) {
                return (caption || Site.getSingleResource('LicenseeW_L')) + ' (' + resultProducts.join(', ') + ')';
            }
            else {
                return caption || '';
            }
        }

        const _me = {
            initialize: function () {
                Site.initialize();
                DatePicker.initDateRangePicker();
                MultiSelect.initProductList();
                DateHelper.setConstraintMonthRange(VALID_MONTH_RANGE, WinLossByProductOption.urlExcelData);
                Site.addUserGuide({
                    resourceName: 'WinLossByProduct',
                    title: Site.getSingleResource('WinLossByProduct')
                });
                _me.initEvent();
                _me.initSetting();
                _me.registerGlobalFunction();

                _me.initAutoComplete();
            },

            initSetting: function () {
                WinLossByProductOption.hasCustomerComm = Site.asBool($('#IsAllowedCustomerCommission').val());
                WinLossByProductOption.IsAllowBA = Site.asBool($('#IsAllowedBACommission').val());
                WinLossByProductOption.licenseeId = parseInt($('#drillDownLicenseeId').val(), 10);
                WinLossByProductOption.HasAmountDueToColumn = Site.asBool($('#HasAmountDueToColumn').val());
            },

            initAutoComplete: function () {
                const option = {
                    url: Site.resolveClientUrl('SearchCustomerAPI/SearchCustomer'),
                    target: '#Username'
                };

                AutoComplete.initialize(option);
            },

            registerGlobalFunction: function () {
                window.drillDown = _me.drillDown;
            },

            initEvent: function () {
                $('body').on('click', '.bet-list-link', function () {
                    const dataDrillDown = $(this).attr('data-drill-down');
                    _me.openBetlistPopUp(dataDrillDown);
                });

                $('#SubmitButton').click(function () {
                    $('#IsExportExcel').val(false);
                    _me.submit();
                });

                $('#ExportToExcel').click(function () {
                    const data = getPostData();
                    const url = Site.resolveClientUrl(WinLossByProductOption.urlExcelData);
                    ExcelHelper.exportExcel(data, url);
                    return false;
                });

                $('#level-link-container').on('click', '.level-link', function () {
                    const level = Number($(this).attr('data-level'));
                    if (level < 2) {
                        _me.goBack(level);
                    }
                });

                $('.main-content').on('click', '.drilldown', function () {
                    const param = $(this).data('drill-down');
                    _me.drillDown(param.level, param.currencyId, param.custId, param.datetime, param.currencyName);
                });

                $(window).on('resize', function () {
                    _me.resizeGrid();
                    _me.reUpdateGridWidth();
                    AutoComplete.updateWidthOfSuggestionDropdown();
                });

                $(window).on('unload', function () {
                    $(window).off('resize');
                });
            },

            submit: function () {
                Report.setOriginalProduct();

                const validProduct = Report.ValidProducts();
                if (!validProduct) {
                    return false;
                }

                Site.updateOriginalLicenseeOption();
                const data = getPostData();
                
                const option = {
                    type: 'POST',
                    data: data,
                    dataType: 'json',
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    cache: false,
                    url: Site.resolveClientUrl(WinLossByProductOption.urlData),
                    success: function (response) {
                        _submitData = {
                            ProductOptions: response.ProductOptions,
                            DrawFilter: data.DrawFilter,
                            CurrencyId: data.CurrencyId,
                            ReportBy: Number(data.ReportBy),
                            FromDate: new Date(data.FromDate),
                            ToDate: new Date(data.ToDate),
                            CurrencyName: data.CurrencyName,
                            IsExcludedTestData: data.IsExcludedTestData
                        };

                        _systemId = response.SystemId;
                        _memberId = response.MemberId;
                        _me.setReportTitle(_submitData.CurrencyId, _submitData.FromDate, _submitData.ToDate);
                        _me.setExcelUrl(0, 0, 0, '', '', '');
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

            setExcelUrl: function (level, currencyId, custId, fdate, tdate, currencyName) {
                let temp = 'api/WinLossByProductReport/Index';
                if (level > 0) {
                    temp += '?level=' + level + '&currencyId=' + currencyId + '&custId=' + custId + '&fdate=' +
                    moment(fdate).format('MM/DD/YYYY') + '&tdate=' + moment(tdate).format('MM/DD/YYYY') +
                    '&memberid=' + _memberId + '&systemid=' + _systemId + '&currencyname=' + currencyName;
                }
                WinLossByProductOption.urlExcelData = temp;
            },

            setReportTitle: function (currencyId, fromdate, todate, currencyName) {
                const titlePattern = Site.getSingleResource('WinLossByProduct') + ', {0} → {1} - {2}{3}';
                const currencyNameOnTitle = currencyName ? Site.getSingleResource('Viewin').replace('{0}', currencyName)
                                                        : Report.getCurrencyNameForReportTitle(currencyId);
                let licenseeWLNote = getLicenseeWLNote(_submitData.ProductOptions, _systemId);
                licenseeWLNote = licenseeWLNote === '' ? '' : ', ' + licenseeWLNote;

                const title = $.format(titlePattern,
                    moment(fromdate, 'MM/DD/YYYY').format('MM/DD/YYYY'), moment(todate, 'MM/DD/YYYY').format('MM/DD/YYYY'),
                    currencyNameOnTitle, licenseeWLNote);

                $('.report-title').html(title);
                $('.panel-heading').removeClass('hide');
            },

            ajaxComplete: function (level, response) {
                if (response !== null) {
                    _cacheData[level] = response;
                    Report.renderBreadCrumb(level, WinLossByProductOption.licenseeId);
                    _me.bindData(level, _submitData.ReportBy, response);
                }
            },

            bindData: function (level, reportBy, response) {
                jqGridAdditional.clearGrid('ReportGrid');
                const numOfRow = response.Data.length;
                if (numOfRow === 0) {
                    jqGridAdditional.setNoInfo();
                    return;
                }

                const levelNumber = Number(level);
                const reportGrid = $('#ReportGrid');
                let onPaging = false;

                const gridOption = WinLossByProductOption.getGridOption(levelNumber, reportBy);
                gridOption.data = response.Data;
                gridOption.rowNum = levelNumber === 2 ? WinLossByProductOption.pageSize : WinLossByProductOption.nonePagingSize;
                gridOption.rowTotal = numOfRow;
                gridOption.onPaging = function (pgButton) {
                    if (levelNumber === 2 && numOfRow > WinLossByProductOption.pageSize) {
                        if ($('#' + pgButton).hasClass('ui-state-disabled') === false) {
                            Site.blockUI();
                        }
                        onPaging = true;
                    }
                    else {
                        return 'stop';
                    }
                };
                gridOption.gridComplete = function () {
                    jqGridAdditional.gridComplete();
                    _me.rowSpanByLevel(reportGrid, levelNumber);

                    // Update colspan for grouping row (because fixed table should has correct colspan value)
                    const coulumnVisibleCount = gridOption.colModel.filter(function (item) { return !item.hidden; }).length;
                    reportGrid.find('tr.jqgroup td').attr('colspan', coulumnVisibleCount - 1); // -1 for hiding of Date column

                    if (levelNumber === 2 && numOfRow > WinLossByProductOption.pageSize) {
                        $('#pg_ppdata').show();
                    }
                    else {
                        $('#pg_ppdata').hide();
                    }

                    const $footerTable = $('table.ui-jqgrid-ftable');
                    if (onPaging && levelNumber === 2) {
                        $footerTable.html($('#footer').html());
                    }
                    else {
                        _me.bindTotal(levelNumber, response.Total, response.SummaryTotal);
                        $('#footer').html($footerTable.html());
                    }

                    onPaging = false;

                    //set rowspan for footer row
                    $footerTable.tableRowSpan([WinLossByProductOption.currencyIndex]);

                    _me.resizeGrid();
                    _me.reUpdateGridWidth();
                    Site.unBlockUI();
                };

                reportGrid.jqGrid(gridOption);

                if (WinLossByProductOption.hasCustomerComm) {
                    jqGridAdditional.setGroupCustomerWLColumns(reportGrid);
                }
            },

            reUpdateGridWidth: function () {
                const $gridContainer = $('.theme_jqGrid');
                const $gridFooter = $gridContainer.find('.ui-jqgrid-sdiv');
                const $gridBody = $gridContainer.find('.ui-jqgrid-bdiv');

                const shouldReUpdateGridWidth = $gridBody.hasHorizontalScrollBar() && $gridFooter.hasVerticalScrollBar();
                if (shouldReUpdateGridWidth) {
                    const tableWidth = $gridBody.width() - 20;
                    $gridContainer.find('.ui-jqgrid-hdiv').css('width', tableWidth + 'px');
                    $gridBody.css('width', tableWidth + 'px');
                }
            },

            rowSpanByLevel: function ($grid, level) {
                switch (level) {
                    case 0:
                        $grid.tableRowSpan([0, 4]);
                        break;
                    case 1:
                        $grid.tableRowSpan([0, WinLossByProductOption.systemIdIndex], WinLossByProductOption.currencyIndex);
                        break;
                    case 2:
                        $grid.tableRowSpan([0, WinLossByProductOption.externalIdIndex, WinLossByProductOption.systemIdIndex],
                                                     WinLossByProductOption.currencyIndex);
                        break;
                }
            },

            bindTotal: function (level, totalData, summaryTotal) {
                const columnModel = WinLossByProductOption.getTotalColModel(level);
                const colspan = Site.isFakeLicensee() ?
                    WinLossByProductOption.totalColspanFakeLicensee[level] :
                    WinLossByProductOption.totalColspan[level];
                const summaryColspan = colspan + 1;
                jqGridAdditional.assignTotal(totalData, columnModel);
                const summaryRowCount = Report.bindSummaryTotal(columnModel, _me.reverse(summaryTotal));

                const allowScrolling = true;
                jqGridAdditional.setGroupFooters(colspan, summaryColspan, summaryRowCount, allowScrolling);
            },

            reverse: function (objectData) {
                const reversedData = Site.clone(objectData);
                for (let property in reversedData) {
                    if (reversedData.hasOwnProperty(property)) {
                        reversedData[property].reverse();
                    }
                }

                return reversedData;
            },

            goBack: function (level) {
                const reportBy = _submitData.ReportBy;
                Report.renderBreadCrumb(level, WinLossByProductOption.licenseeId);
                _me.bindData(level, reportBy, _cacheData[level]);

                if (level === 0) {
                    _me.setExcelUrl(0, 0, 0, '', '', '');
                    _me.setReportTitle(_submitData.CurrencyId, _submitData.FromDate, _submitData.ToDate);
                }
                else {
                    WinLossByProductOption.urlExcelData = WinLossByProductOption.urlExcelData.replace('level=2', 'level=1');
                }
            },

            openBetlistPopUp: function (inputDataDrillDown) {
                const dataDrillDown = $.parseJSON(inputDataDrillDown);
                dataDrillDown.DrawFilter = _submitData.DrawFilter;
                dataDrillDown.IsExcludedTestData = _submitData.IsExcludedTestData;
                dataDrillDown.CurrencyId = _submitData.CurrencyId;
                dataDrillDown.CurrencyName = _submitData.CurrencyName;
                if (typeof dataDrillDown.DrillDownFromDate === 'string') {
                    dataDrillDown.DrillDownFromDate = new Date(dataDrillDown.DrillDownFromDate);
                    dataDrillDown.DrillDownToDate = new Date(dataDrillDown.DrillDownToDate);
                }

                const dateRange = Report.GetDrilldownDateRange(_submitData.ReportBy, _submitData.FromDate, _submitData.ToDate, dataDrillDown.DrillDownFromDate);

                let url = Site.resolveClientUrl('LicenseeWinLossBetList/Index');
                url = Site.setProductOptionOriginalParamList(url);
                url = Site.setLicenseeOptionOriginalParam(url);
                url = QueryString.setParams(url, {
                    fromdate: moment(dateRange.FromDate).format('MM/DD/YYYY'),
                    todate: moment(dateRange.ToDate).format('MM/DD/YYYY'),
                    excludetest: dataDrillDown.IsExcludedTestData,
                    CurrencyId: dataDrillDown.DrillDownCurrencyId,
                    CurrencyName: dataDrillDown.DrillDownCurrencyName,
                    drawfilter: dataDrillDown.DrawFilter,
                    custid: dataDrillDown.CustomerId,
                    systemId: dataDrillDown.SystemId,
                    externalId: dataDrillDown.ExternalId
                });

                const popH = Math.min($(window).height() - 100, 500), popW = 920;
                const popupOption = { id: 'betlist-popup', width: popW + 30, height: popH + 50, title: Site.getSingleResource('CustomerBetList') };
                Popup.openPopupWithIframe(url, popupOption);
                window.logOpenBetlistEvent && window.logOpenBetlistEvent();
            },

            resizeGrid: function () {
                const reportGrid = $('#ReportGrid');
                jqGridAdditional.updateGridHeight();
                jqGridAdditional.updateGridWidth(reportGrid);
            },

            drillDown: function (level, currencyId, customerId, datetime, currencyName) {
                const param = {
                    MemberId: _memberId,
                    ProductOptions: $.parseJSON(_submitData.ProductOptions),
                    DrawFilter: _submitData.DrawFilter,
                    IsExcludedTestData: _submitData.IsExcludedTestData,
                    CurrencyId: _submitData.CurrencyId,
                    ReportBy: _submitData.ReportBy,
                    FromDate: _submitData.FromDate,
                    ToDate: _submitData.ToDate,
                    BaseCurrency: $('#BaseCurrency').attr('data-original')
                };
                const drilldownDate = new Date(datetime);
                const dateRange = Report.GetDrilldownDateRange(param.ReportBy, param.FromDate, param.ToDate, drilldownDate);

                const url = Site.resolveClientUrl(WinLossByProductOption.urlData) + '?level=' + level + '&currencyId=' + currencyId + '&custId=' + customerId +
                         '&fdate=' + moment(dateRange.FromDate).format('MM/DD/YYYY') + '&tdate=' + moment(dateRange.ToDate).format('MM/DD/YYYY');
                const option = {
                    type: 'POST',
                    data: JSON.stringify(param),
                    dataType: 'json',
                    contentType: 'application/json',
                    cache: false,
                    url: url,
                    success: function (response) {
                        _me.ajaxComplete(level, response);
                        if (response !== null && response.Data.length > 0) {
                            if (level > 0 && param.CurrencyId === '0') {
                                const viewInCurrency = param.BaseCurrency ? param.BaseCurrency.toUpperCase() : currencyName;
                                _me.setReportTitle(currencyId, dateRange.FromDate, dateRange.ToDate, viewInCurrency);
                            } else {
                                _me.setReportTitle(param.CurrencyId, dateRange.FromDate, dateRange.ToDate);
                            }

                            _me.setExcelUrl(level, currencyId, customerId, dateRange.FromDate, dateRange.ToDate, currencyName);
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
            }
        };

        return _me;
    });