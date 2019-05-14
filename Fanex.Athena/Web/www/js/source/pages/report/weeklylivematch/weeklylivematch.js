'use strict';
define(['jquery', 'common/site', './weeklylivematch.option', 'lib/jqgrid/jquery.jqgrid.additional',
        'components/pluginhelper/daterangepicker', 'helpers/daterange', 'helpers/excel', 'helpers/datahelper',
        'lib/jqgrid/jquery.jqGrid.en', 'lib/jqgrid/jquery.jqGrid.min', 'lib/linq', 'extensions/jquery.extension'],
        function ($, Site, WeeklyLiveMatchOption, jqGridAdditional, DatePicker, DateHelper, ExcelHelper, DataHelper) {
            const VALID_MONTH_RANGE = 2;
            const SPORT_COLUMN_INDEX = 1;
            const START_WEEK_COLUMN_INDEX = 2;

            let ajaxRequest = null;
            let _cacheData = null;
            let _sortColumn = null;
            let _sortDirection = null;

            const _me = {
                initialize: function () {
                    Site.initialize();
                    _me.initEvent();

                    Site.addUserGuide({
                        resourceName: 'WeeklyLiveMatches',
                        title: Site.getSingleResource('WeeklyLiveMatches'),
                        height: 450
                    });
                    WeeklyLiveMatchOption.gridOption.onSortCol = function (index) {
                        Site.blockUI();
                        window.setTimeout(function () {
                            if (_sortColumn === index) {
                                _sortDirection = _sortDirection === 'asc' ? 'desc' : 'asc';
                            } else {
                                _sortDirection = 'asc';
                                _sortColumn = index;
                            }
                            _cacheData.Data = _me.sortData(_cacheData.Data);

                            _me.bindData(_cacheData);

                            Site.unBlockUI();
                        }, 100);
                        return 'stop';
                    };

                    const firstDayOfWeekIsMonday = true;
                    DatePicker.initDateRangePicker(firstDayOfWeekIsMonday);
                },

                sortData: function (arrayData) {
                    let columnIndex = SPORT_COLUMN_INDEX;
                    let sortThenBy = null;

                    if (_sortColumn.indexOf('Week') === 0) {
                        columnIndex = Number(_sortColumn.replace('Week', '')) + START_WEEK_COLUMN_INDEX;
                        sortThenBy = function (x) { return x.Cell[SPORT_COLUMN_INDEX]; };
                    }

                    const data = DataHelper.sort(arrayData, function (x) { return x.Cell[columnIndex]; }, _sortDirection, sortThenBy, 'asc');

                    // Re-assign Index column.
                    for (let i = 0; i < data.length; i++) {
                        data[i].Cell[0] = i + 1;
                    }

                    return data;
                },

                initEvent: function () {
                    DateHelper.setConstraintMonthRange(VALID_MONTH_RANGE, WeeklyLiveMatchOption.urlExcelData);

                    $('#SubmitButton').click(function () {
                        $('#IsExportExcel').val(false);
                        _me.submit();
                    });

                    $('#ExportToExcel').click(function () {
                        const mainForm = $('#mainform');
                        const data = mainForm.serializeObject();
                        data.IsExportExcel = true;
                        data.SortColumn = _sortColumn;
                        data.SortDirection = _sortDirection;
                        ExcelHelper.exportExcel(data, Site.resolveClientUrl(WeeklyLiveMatchOption.urlExcelData));
                        return false;
                    });
                },

                submit: function () {
                    const mainForm = $('#mainform');
                    const data = mainForm.serializeObject();
                    data.SortColumn = _sortColumn;
                    data.SortDirection = _sortDirection;
                    const option = {
                        type: 'POST',
                        data: data,
                        dataType: 'json',
                        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                        cache: false,
                        url: Site.resolveClientUrl(WeeklyLiveMatchOption.urlData),
                        success: function (response) {
                            _cacheData = response;
                            _me.bindData(response);
                        },
                        beforeSend: Site.blockUI,
                        complete: Site.unBlockUI
                    };
                    if (ajaxRequest !== null) {
                        ajaxRequest.abort();
                    }

                    ajaxRequest = $.ajax(option);

                    return true;
                },

                bindData: function (response) {
                    jqGridAdditional.clearGrid('ReportGrid');
                    const numOfRow = response.Data.length;
                    if (numOfRow === 0) {
                        jqGridAdditional.setNoInfo();
                        return;
                    }

                    const reportGrid = $('#ReportGrid');
                    const userData = {};
                    const totalData = response.TotalData;
                    for (let i = 0; i < totalData.length; i++) {
                        userData['Week' + i] = totalData[i];
                    }

                    const gridOption = WeeklyLiveMatchOption.getGridOption(response.NumberOfWeeks, response.WeekHeaders);
                    gridOption.data = response.Data;
                    gridOption.userData = userData;
                    gridOption.rowTotal = numOfRow;

                    gridOption.gridComplete = function () {
                        jqGridAdditional.gridComplete();
                        _me.resizeGrid();

                        Site.unBlockUI();
                    };

                    reportGrid.jqGrid(gridOption);

                    _me.setTotalRow();

                    jqGridAdditional.addSortableHeader(reportGrid, _sortColumn, _sortDirection, true);
                },

                setTotalRow: function () {
                    const $totalRow = $('.ui-jqgrid-ftable').find('.footrow');
                    $totalRow.addClass('grandTotal');
                    const $firstCell = $totalRow.find('td:eq(0)');
                    const $secondCell = $firstCell.next();
                    $secondCell.hide();
                    $firstCell.attr('colspan', 2).html(Site.getSingleResource('Total'));
                },

                resizeGrid: function () {
                    const reportGrid = $('#ReportGrid');
                    jqGridAdditional.updateGridHeight();
                    jqGridAdditional.updateGridWidth(reportGrid);
                }
            };

            return _me;
        });