define([
    'jquery',
    'common/site',
    'lib/jqgrid/jquery.jqgrid.additional',
    './customerbalance.option',
    'components/pluginhelper/daterangepicker',
    'components/pluginhelper/multiselect',
    'helpers/daterange',
    'components/paging',
    '../report',
    'lib/jqgrid/jquery.jqGrid.en',
    'lib/jqgrid/jquery.jqGrid.min',
    'extensions/jquery.extension'],
    function ($, Site, jqGridAdditional, CustomerBalanceOption, DatePicker, MultiSelect, DateHelper, PagingHelper, Report) {
        'use strict';

        const VALID_MONTH_RANGE = 2;

        let _ajaxRequest = null;
        let _sortColumnIndex = 'Deposit';
        let _sortType = 'desc';
        let _orderColumnCode = 1;
        let _isFirstLoad = true;
        let _submitData = null;
        let _pagingOption =
        {
            pageindex: 1,
            pagesize: 500,
            pagelist: [500, 1000, 2000],
            totalrow: 1,
            elementcontainer: '.paging',
            method: 'AJAX',
            ajaxfunction: 'CustomerBalance.ajaxPaging()',
            alwayshow: true
        };
        const _selector = {
            SubmitButton: '#SubmitButton',
            ExportToExcel: '#ExportToExcel',
            Form: '#CustomerBalanceForm',
            Title: '.report-title',
            Header: '.panel-heading',
            GridId: 'ReportGrid',
            OrderItemInput: '#OrderItem'
        };

        function initialize() {
            Site.initialize();
            Site.addUserGuide({
                resourceName: 'CustomerBalance',
                title: Site.getSingleResource('CustomerBalance')
            });
            MultiSelect.initProductList();
            DatePicker.initDateRangePicker();
            DateHelper.setConstraintMonthRange(VALID_MONTH_RANGE, CustomerBalanceOption.urlExcelData);

            _me.initEvent();
            _me.initSetting();
        }

        function initEvent() {
            $(_selector.SubmitButton).click(function () {
                const validProduct = Report.ValidProducts();
                if (!validProduct) {
                    return;
                }

                _pagingOption.pageindex = 1;
                _submitData = null;
                _me.submit();
            });

            $(_selector.ExportToExcel).click(function () {
                const validProduct = Report.ValidProducts();
                if (!validProduct) {
                    return false;
                }

                const mainForm = $(_selector.Form);
                const url = Site.resolveClientUrl(CustomerBalanceOption.urlExcelData);
                $(_selector.OrderItemInput, _selector.Form).val(_orderColumnCode);
                mainForm.attr('action', url);
                mainForm.submit();
                return false;
            });

            $(window).on('resize', function () {
                resizeGrid();
            });

            $(window).on('unload', function () {
                $(window).off('resize');
            });

            window.CustomerBalance = {
                ajaxPaging: _me.ajaxPaging
            };
        }

        function initSetting() {
            CustomerBalanceOption.hasCustomerComm = Site.asBool($('#IsAllowedCustomerCommission').val());
            CustomerBalanceOption.isAllowBA = Site.asBool($('#IsAllowedBACommission').val());
        }

        function submit() {
            buildPostData();

            const option =
            {
                type: 'POST',
                data: _submitData,
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                cache: false,
                url: Site.resolveClientUrl(CustomerBalanceOption.urlData),
                success: function (response) {
                    setReportTitle(_submitData.FromDate, _submitData.ToDate, _submitData.CurrencyName);
                    _me.bindData(response);
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

        function bindData(response) {
            Site.blockUI();
            jqGridAdditional.clearGrid(_selector.GridId);
            _isFirstLoad = true;

            createPaging(response.TotalRows);

            if (response.TotalRows === 0) {
                jqGridAdditional.setNoInfo();
                Site.unBlockUI();
                return;
            }

            const gridOption = CustomerBalanceOption.getGridOption(response.TotalRows);
            gridOption.rowNum = response.Data.length;
            gridOption.data = response.Data;
            gridOption.onSortCol = function (index) {
                sort(index);
                return 'stop';
            };
            gridOption.gridComplete = function () {
                onGridComplete(gridOption, response);
                Site.unBlockUI();
            };

            const reportGrid = $('#' + _selector.GridId);
            reportGrid.jqGrid(gridOption);

            CustomerBalanceOption.setGroupHeaderColumns(reportGrid);
            resizeGrid();
        }

        function ajaxPaging() {
            _pagingOption = PagingHelper.getSetting();
            _me.submit();
        }

        function buildPostData() {
            if (!_submitData) {
                _submitData = $(_selector.Form).serializeObject();
            }
            _submitData.PageIndex = _pagingOption.pageindex;
            _submitData.PageSize = _pagingOption.pagesize;
            _submitData.OrderItem = _orderColumnCode;
        }

        function setReportTitle(fromDate, toDate, currencyName) {
            const titlePattern = '{0}, {1} → {2}, {3}';
            const title = $.format(titlePattern,
                Site.getSingleResource('CustomerBalance'),
                fromDate,
                toDate,
                Site.getSingleResource('Viewin').replace('{0}', currencyName));

            $(_selector.Title).html(title);
            $(_selector.Header).removeClass('hide');
        }

        function createPaging(totalRows) {
            _pagingOption.totalrow = totalRows;
            if (_pagingOption.totalrow > _pagingOption.pagelist[0]) {
                $(_pagingOption.elementcontainer).show();
                PagingHelper.render(_pagingOption);
            }
            else {
                $(_pagingOption.elementcontainer).hide();
            }
        }

        function sort(index) {
            if (_pagingOption.totalrow > 1) {
                const sortType = index === _sortColumnIndex ? (_sortType === 'desc' ? 'asc' : 'desc') : 'desc';
                const orderColumnCode = CustomerBalanceOption.getOrderColumnCode(index, sortType);
                if (orderColumnCode === 0) {
                    return 'stop';
                }

                window.setTimeout(function () {
                    _sortColumnIndex = index;
                    _sortType = sortType;
                    _orderColumnCode = orderColumnCode;
                    _me.submit();
                }, 100);
            }
        }

        function onGridComplete(gridOption, response) {
            if (_isFirstLoad) {
                jqGridAdditional.gridComplete();

                const reportGrid = $('#' + _selector.GridId);
                if (_pagingOption.totalrow > 1) {
                    jqGridAdditional.addSortableHeaders(reportGrid, _sortColumnIndex, _sortType);
                }
                else {
                    jqGridAdditional.removeCursorOnNonSortableHeader(reportGrid);
                }

                jqGridAdditional.assignTotal(response.Total, gridOption.colModel);
                jqGridAdditional.setGroupFooters(CustomerBalanceOption.totalColspan);
                _isFirstLoad = false;
            }
        }

        function resizeGrid() {
            const reportGrid = $('#' + _selector.GridId);
            jqGridAdditional.updateGridHeight();
            jqGridAdditional.updateGridWidth(reportGrid);
        }

        const _me = {
            initialize: initialize,
            initEvent: initEvent,
            submit: submit,
            bindData: bindData,
            ajaxPaging: ajaxPaging,
            initSetting: initSetting
        };

        return _me;
    });