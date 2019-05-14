define([
        'jquery',
        'common/site',
        '../report',
        './activecustomersummary.option',
        'components/pluginhelper/daterangepicker',
        'components/pluginhelper/multiselect',
        'helpers/daterange',
        'lib/jqgrid/jquery.jqgrid.additional',
        'lib/jqgrid/jquery.jqGrid.en',
        'lib/jqgrid/jquery.jqGrid.min',
        'extensions/jquery.extension'],
    function ($, Site, Report, ActiveCustomerOption, DatePicker, MultiSelect, DateHelper, jqGridAdditional) {
        'use strict';
        const VALID_MONTH_RANGE = 3;

        let _ajaxRequest = null;
        let _sortColumnName = '';
        let _sortOrder = 'desc';
        let _onSorting = false;
        let _onPaging = false;
        const selector = {
            SubmitButton: '#SubmitButton',
            ExportExcelInput: '#IsExportExcel',
            ExportToExcel: '#ExportToExcel',
            Form: '#mainform',
            Title: '.report-title',
            Header: '.panel-heading',
            GridId: 'ReportGrid'
        };

        function initialize() {
            Site.initialize();
            Site.addUserGuide({
                resourceName: 'ActiveCustomerSummary',
                title: Site.getSingleResource('ActiveCustomerSummary')
            });

            MultiSelect.initProductList();
            DatePicker.initDateRangePicker();
            DateHelper.setConstraintMonthRange(VALID_MONTH_RANGE, ActiveCustomerOption.urlExcelData);

            _me.initEvent();
        }

        function initEvent() {
            $(selector.SubmitButton).click(function () {
                const validProduct = Report.ValidProducts();
                if (!validProduct) {
                    return;
                }

                _me.submit();
            });

            $(selector.ExportToExcel).click(function () {
                const validProduct = Report.ValidProducts();
                if (!validProduct) {
                    return false;
                }

                $(selector.ExportExcelInput).val(true);
                const mainForm = $(selector.Form);
                const url = Site.resolveClientUrl(ActiveCustomerOption.urlExcelData);
                mainForm.attr('action', url);
                mainForm.submit();
                $(selector.ExportExcelInput).val(false);
                return false;
            });

            $(window).on('resize', function () {
                resizeGrid();
            });

            $(window).on('unload', function () {
                $(window).off('resize');
            });
        }

        function setReportTitle(currencyId, fromdate, todate) {
            const titlePattern = Site.getSingleResource('ActiveCustomerSummary') + ', {0} → {1} - {2}';
            const currencyStr = Report.getCurrencyNameForReportTitle(currencyId);

            const title = $.format(titlePattern, fromdate.toString('M/dd/yyyy'), todate.toString('M/dd/yyyy'), currencyStr);

            $(selector.Title).html(title);
            $(selector.Header).removeClass('hide');
        }

        function submit() {
            const data = getData();

            const option = {
                type: 'POST',
                data: data,
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                cache: false,
                url: Site.resolveClientUrl(ActiveCustomerOption.urlData),
                success: function (response) {
                    if (response !== null) {
                        _me.setReportTitle(data.CurrencyId, data.FromDate, data.ToDate);
                        _me.bindData(response);
                    }
                },
                beforeSend: function () {
                    Site.blockUI();
                },
                complete: function () {
                    Site.unBlockUI();
                }
            };
            if (_ajaxRequest !== null) {
                _ajaxRequest.abort();
            }

            _ajaxRequest = $.ajax(option);

            return true;
        }

        function bindData(response) {
            jqGridAdditional.clearGrid(selector.GridId);
            _onSorting = false;
            _onPaging = false;

            const numOfRow = response.Data.length;
            if (numOfRow === 0) {
                jqGridAdditional.setNoInfo();
                return;
            }

            const reportGrid = $('#' + selector.GridId);
            const gridOption = getGridOption(reportGrid, response, numOfRow);

            if (numOfRow > ActiveCustomerOption.pageSize) {
                $(gridOption.pager).show();
            }
            else{
                $(gridOption.pager).hide();
            }

            reportGrid.jqGrid(gridOption);           
        }

        function bindTotal(grantTotalCustomer, colspan) {
            const mainFooter = $('.ui-jqgrid-ftable tr:last-child');
            const textFooter = Site.getSingleResource('TotalActiveCustomer')
                            + ' = '
                            + jqGridAdditional.formatInteger(grantTotalCustomer);

            mainFooter.find('td:eq(0)')
                .html(textFooter)
                .attr('colspan', colspan)
                .css('text-align', 'left')
                .nextAll().remove();
        }

        function resizeGrid() {
            const reportGrid = $('#' + selector.GridId);
            jqGridAdditional.updateGridHeight();
            jqGridAdditional.updateGridWidth(reportGrid);
        }

        function getData() {
            const mainForm = $(selector.Form);
            const data = mainForm.serializeObject();
            if (_sortColumnName) {
                data.sortBy = _sortColumnName.replace('.', '');
                data.sortOrder = _sortOrder;
            }

            return data;
        }

        function getGridOption(reportGrid, response, numOfRow) {
            const productOptions = $.parseJSON(response.ProductOptions);
            const gridOption = ActiveCustomerOption.getGridOption(productOptions, numOfRow);
            gridOption.data = response.Data;
            gridOption.rowNum = ActiveCustomerOption.pageSize;

            gridOption.gridComplete = function () {
                if (!_onSorting && !_onPaging) {
                    jqGridAdditional.gridComplete();
                    jqGridAdditional.addSortableHeaders(reportGrid, _sortColumnName, _sortOrder);
                    _me.bindTotal(response.GrantTotalCustomer, gridOption.colModel.length);
                    ActiveCustomerOption.setGroupHeaderColumns(reportGrid, productOptions);
                    resizeGrid();
                }
                if (_onSorting) {
                    jqGridAdditional.updateSortableHeader(reportGrid, _sortColumnName, _sortOrder);
                    _onSorting = false;
                }
                Site.unBlockUI();
            };

            gridOption.onSortCol = function (index, columnIndex, sortOrder) {
                Site.blockUI();
                _sortOrder = sortOrder;
                _sortColumnName = index;
                _onSorting = true;
            };

            gridOption.onPaging = function () {
                if (numOfRow > ActiveCustomerOption.pageSize) {
                    Site.blockUI();
                    _onPaging = true;
                }
                else {
                    return 'stop';
                }
            };

            return gridOption;
        }

        const _me = {
            initialize: initialize,
            initEvent: initEvent,
            setReportTitle: setReportTitle,
            submit: submit,
            bindData: bindData,
            bindTotal: bindTotal,
            getSubmitData: getData
        };

        return _me;
    });