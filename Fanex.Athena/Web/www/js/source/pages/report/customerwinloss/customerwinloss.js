define([
    'jquery',
    'common/querystring',
    'common/site',
    '../report',
    './customerwinloss.option',
    'lib/jqgrid/jquery.jqgrid.additional',
    'components/pluginhelper/daterangepicker',
    'components/pluginhelper/monthpicker',
    'components/pluginhelper/multiselect',
    'common/popup',
    'components/paging',
    'helpers/excel',
    'components/pluginhelper/autocomplete',
    'helpers/downloader',
    'components/toast',
    'lib/jqgrid/jquery.jqGrid.en',
    'lib/jqgrid/jquery.jqGrid.min',
    'extensions/jquery.extension',
    'extensions/ajaxBinaryTransporting'],
    function ($, QueryString, Site, Report, CustomerWinLossOption, jqGridAdditional, DatePicker, MonthPicker, MultiSelect, Popup,
        PagingHelper, ExcelHelper, AutoComplete, Downloader, Toast) {
        'use strict';

        const EXCEL_FILENAME = 'CustomerWinLoss.xls';
        const EXCEL_PP_FILENAME = 'PP_PromotionPrize.xls';
        const SORTING_CODE = {
            'ExternalId': 2,
            'SystemId': 1,
            'Turnover': 3,
            'TotalTransaction': 13,
            'CustomerWL': 4,
            'BetEffective': 5,
            'PlayerComm': 10,
            'CustomerTotalWL': 14,
            'LicenseeWL': 6,
            'BAComm': 8,
            'RacingRevenue': 15,
            'AmtDueToBA': 11,
            'AmtDueToRacing': 12
        };

        let _ajaxRequest = null;
        let _submitData = null;
        let _productCodes = [];

        let _sortColumnName = '';
        let _sortOrder = '';
        let _orderItem = 0;
        let _isFirstLoad = false;

        let _pagingOption =
        {
            pageindex: 1,
            pagesize: 500,
            pagelist: [500, 1000, 2000],
            totalrow: 1,
            elementcontainer: '.paging',
            method: 'AJAX',
            ajaxfunction: 'CustomerWinLoss.ajaxPaging()',
            alwayshow: true
        };

        const _url = {
            SearchCustomer: 'SearchCustomerAPI/SearchCustomer'
        };

        const _selector = {
            SubmitButton: '#SubmitButton',
            ExportToExcel: '#ExportToExcel',
            Form: '#CustomerWinlossForm',
            Title: '.report-title',
            Header: '.panel-heading',
            GridId: 'ReportGrid',
            IsHistoryInput: '#IsHistory',
            IsAllowedBAInput: '#IsAllowedBA',
            IsAllowedCustomerCommissionInput: '#IsAllowedCustomerCommission',
            HistoryLink: '#history-report-link',
            CurrentLink: '#current-report-link',
            BetListLink: '.bet-list-link',
            Username: '#Username',
            PromotionPrizeLink: '#ExportPromotionPrizeLink'
        };

        function initialize() {
            Site.initialize();

            Site.addUserGuide({
                resourceName: 'CustomerWL',
                title: Site.getSingleResource('CustomerWinLoss')
            });
            MultiSelect.initProductList();
            DatePicker.initDateRangePicker();
            if ($(_selector.IsHistoryInput).val() === 'True') {
                MonthPicker.initMonthPicker();
            }

            _me.initEvent();
            _me.initSetting();
            _me.initAutoComplete();
        }

        function initEvent() {
            $(_selector.SubmitButton).click(function () {
                const validProduct = Report.ValidProducts();
                if (!validProduct) {
                    return;
                }

                resetParam();
                _me.submit();
            });

            $(_selector.ExportToExcel).click(function () {
                const validProduct = Report.ValidProducts();
                if (!validProduct) {
                    return;
                }

                const data = getPostData();
                data.PageIndex = 1;
                data.isExportExcel = true;

                exportExcel(CustomerWinLossOption.urlExcelData, data, EXCEL_FILENAME);
            });

            $(_selector.PromotionPrizeLink).click(function () {
                const filterData = getPostData();
                const data = {
                    __RequestVerificationToken: filterData.__RequestVerificationToken,
                    FromDate: filterData.FromDate,
                    ToDate: filterData.ToDate,
                    CurrencyId: filterData.CurrencyId,
                    CurrencyName: filterData.CurrencyName,
                    Username: filterData.Username,
                    IsExcludedTestData: filterData.IsExcludedTestData
                };

                exportExcel(CustomerWinLossOption.urlPromotionPrizeExcelData, data, EXCEL_PP_FILENAME);
            });

            $(_selector.HistoryLink).click(function () {
                _me.viewHistoryReport();
            });

            $(_selector.CurrentLink).click(function () {
                _me.viewCurrentReport();
            });

            window.CustomerWinLoss = {
                ajaxPaging: _me.ajaxPaging
            };

            $('.main-content').on('click', _selector.BetListLink, function () {
                const data = $(this).data('drill-down');
                _me.viewWinlossBetList(data.CustId, data.SystemId, data.ExternalId);
            });

            $(window).on('resize', function () {
                resizeGrid();
            });

            $(window).on('unload', function () {
                $(window).off('resize');
            });
        }

        function exportExcel(url, data, fileName) {
            const option = {
                type: 'POST',
                data: data,
                dataType: 'binary',
                responseType: 'blob',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                cache: false,
                url: Site.resolveClientUrl(url),
                success: function (response) {
                    Downloader.download(response, fileName);
                },
                beforeSend: function () {
                    Toast.show();
                }
            };
            $.ajax(option);

            return false;
        }

        function initSetting() {
            CustomerWinLossOption.isAllowBA = Site.asBool($(_selector.IsAllowedBAInput).val());
            CustomerWinLossOption.hasCustomerComm = Site.asBool($(_selector.IsAllowedCustomerCommissionInput).val());
            resetParam();
        }

        function initAutoComplete() {
            if ($(_selector.Username).length > 0) {
                const option = {
                    url: Site.resolveClientUrl(_url.SearchCustomer),
                    target: _selector.Username
                };

                AutoComplete.initialize(option);
            }
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
                url: Site.resolveClientUrl(CustomerWinLossOption.urlData),
                success: function (response) {
                    setReportTitle();
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
                showPromotionPrizeLink(false);
                return;
            }

            const gridOption = CustomerWinLossOption.getGridOption(response.TotalRows);
            gridOption.rowNum = response.Data.length;
            gridOption.data = response.Data;
            gridOption.onSortCol = function (index) {
                sort(index);
                return 'stop';
            };
            gridOption.gridComplete = function () {
                onGridComplete(this, gridOption, response);
                Site.unBlockUI();
            };

            const reportGrid = $('#' + _selector.GridId);
            reportGrid.jqGrid(gridOption);

            CustomerWinLossOption.setGroupHeaderColumns(reportGrid);
            const pprizeCount = response.PromotionPrize;
            showPromotionPrizeLink(Site.isNumber(pprizeCount) && parseInt(pprizeCount, 10) > 0);
        }

        function ajaxPaging() {
            _pagingOption = PagingHelper.getSetting();
            _me.submit();
        }

        function viewHistoryReport() {
            Site.blockUI();
            Site.redirect(Site.resolveClientUrl('CustomerWinlossReport/History'));
        }

        function viewCurrentReport() {
            Site.blockUI();
            Site.redirect(Site.resolveClientUrl('CustomerWinLossReport/Index'));
        }

        function viewWinlossBetList(custId, systemId, externalId) {
            let url = Site.resolveClientUrl('CustomerWinlossBetList/Index');
            url = QueryString.setParam(url, 'ProductCodeList', _productCodes);
            url = QueryString.setParam(url, 'currencyid', _submitData.CurrencyId);
            url = QueryString.setParam(url, 'CurrencyName', _submitData.CurrencyName);
            url = QueryString.setParam(url, 'BaseCurrency', _submitData.BaseCurrency);
            url = QueryString.setParam(url, 'custid', custId);
            url = QueryString.setParam(url, 'systemid', systemId);
            url = QueryString.setParam(url, 'externalid', externalId);
            url = QueryString.setParam(url, 'fromdate', _submitData.FromDate);
            url = QueryString.setParam(url, 'todate', _submitData.ToDate);
            url = QueryString.setParam(url, 'ishistoryreport', $('input#IsHistory').val());

            const popH = Math.min($(window).height() - 100, 650), popW = 920;
            const popupOption = { id: 'betlist-popup', width: popW + 50, height: popH + 50, title: Site.getSingleResource('CustomerBetList') };
            Popup.openPopupWithIframe(url, popupOption);
            window.logOpenBetlistEvent && window.logOpenBetlistEvent();
        }

        function setReportTitle() {
            const titlePattern = '{0}, {1} → {2}, {3}{4}{5}';
            const licenseeWLNote = getLicenseeWLNote();
            const tempUserName = _submitData.Username.length > 0
                ? ', ' + Site.getSingleResource('Username') + ': ' + _submitData.Username
                : '';

            const title = $.format(titlePattern,
                Site.getSingleResource('CustomerWinLoss'),
                _submitData.FromDate,
                _submitData.ToDate,
                Site.getSingleResource('Viewin').replace('{0}',
                _submitData.BaseCurrency === '' ? _submitData.CurrencyName : _submitData.BaseCurrency.toUpperCase()),
                licenseeWLNote === '' ? '' : ', ' + licenseeWLNote,
                tempUserName);

            $(_selector.Title).html(title);
            $(_selector.Header).removeClass('hide');
        }

        function showPromotionPrizeLink(isShow) {
            if (isShow) {
                $(_selector.PromotionPrizeLink).show();
            }
            else {
                $(_selector.PromotionPrizeLink).hide();
            }
        }

        function createPaging(totalRows) {
            _pagingOption.totalrow = totalRows;
            if (_pagingOption.totalrow > 0 && _pagingOption.totalrow > _pagingOption.pagelist[0]) {
                $(_pagingOption.elementcontainer).show();
                PagingHelper.render(_pagingOption);
            }
            else {
                $(_pagingOption.elementcontainer).hide();
            }
        }

        function sort(index) {
            if (_pagingOption.totalrow > 1) {
                setTimeout(function () {
                    if (_sortColumnName === index) {
                        _sortOrder = _sortOrder === 'asc' ? 'desc' : 'asc';
                    } else {
                        _sortOrder = 'asc';
                        _sortColumnName = index;
                        _orderItem = SORTING_CODE[_sortColumnName];
                    }
                    _me.submit();
                }, 100);
            }
        }

        function onGridComplete(grid, gridOption, response) {
            if (_isFirstLoad) {
                jqGridAdditional.gridComplete();

                const reportGrid = $('#' + _selector.GridId);
                if (_pagingOption.totalrow > 1) {
                    jqGridAdditional.addSortableHeaders(reportGrid, _sortColumnName, _sortOrder);
                }
                else {
                    jqGridAdditional.removeCursorOnNonSortableHeader(reportGrid);
                }

                jqGridAdditional.assignTotal(response.Total, gridOption.colModel);
                jqGridAdditional.setGroupFooters(Site.isFakeLicensee() ?
                    CustomerWinLossOption.totalColspanFakeLicensee :
                    CustomerWinLossOption.totalColspan);
                resizeGrid();
                _isFirstLoad = false;
            }
        }

        function getLicenseeWLNote() {
            if (_productCodes.length > 0) {
                return Site.getSingleResource('LicenseeW_L') + '(' + _productCodes.join(', ') + ')';
            }
            return '';
        }

        function getProductList() {
            const productCodeList = [];
            $('.childCheckbox', '#ProductList').each(function (index, element) {
                const productCode = $(element).attr('data-product-code');
                if (productCode && $(element).attr('data-original') === 'true') {
                    productCodeList.push(productCode.toUpperCase());
                }
            });

            return productCodeList;
        }

        function buildPostData() {
            if (!_submitData) {
                Report.setOriginalProduct();
                _submitData = getPostData();
                _productCodes = getProductList();
            }
            else {
                _submitData.PageIndex = _pagingOption.pageindex;
                _submitData.PageSize = _pagingOption.pagesize;
                _submitData.OrderItem = _orderItem;
                _submitData.IsAscSort = _sortOrder === 'asc';
            }
        }

        function resetParam() {
            _sortColumnName = 'ExternalId';
            _sortOrder = 'asc';
            _orderItem = SORTING_CODE[_sortColumnName];
            _pagingOption.pageindex = 1;
            _submitData = null;
        }

        function getPostData() {
            const param = $(_selector.Form).serializeObject();
            param.PageIndex = _pagingOption.pageindex;
            param.PageSize = _pagingOption.pagesize;
            param.OrderItem = _orderItem;
            param.IsAscSort = _sortOrder === 'asc';
            
            if (param.Username === undefined) {
                param.Username = '';
            }
            return param;
        }

        function resizeGrid() {
            const reportGrid = $('#' + _selector.GridId);
            jqGridAdditional.updateGridHeight();
            jqGridAdditional.updateGridWidth(reportGrid);
        }

        const _me = {
            initialize: initialize,
            initEvent: initEvent,
            initSetting: initSetting,
            initAutoComplete: initAutoComplete,
            submit: submit,
            viewHistoryReport: viewHistoryReport,
            viewCurrentReport: viewCurrentReport,
            viewWinlossBetList: viewWinlossBetList,
            ajaxPaging: ajaxPaging,
            bindData: bindData,
            getSubmitData: getPostData
        };

        return _me;
    });