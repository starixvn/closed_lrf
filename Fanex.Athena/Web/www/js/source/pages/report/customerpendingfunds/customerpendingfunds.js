define([
    'jquery',
    'common/querystring',
    'common/site',
    'lib/jqgrid/jquery.jqgrid.additional',
    './customerpendingfunds.option',
    'components/pluginhelper/multiselect',
    'components/paging',
    'common/popup',
    '../report',
    'lib/jqgrid/jquery.jqGrid.en',
    'lib/jqgrid/jquery.jqGrid.min',
    'extensions/jquery.extension'],
    function ($, QueryString, Site, jqGridAdditional, CustomerPedingFundsOption, MultiSelect, PagingHelper, Popup, Report) {
        'use strict';

        const SORTING_CODE = {
            'SystemId': 1,
            'PendingFunds': 2,
            'BetCounts': 3,
            'ExternalId': 4
        };

        let _ajaxRequest = null;
        let _sortDirection = '';
        let _sortColumn = '';
        let _orderItem = 0;
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
            ajaxfunction: 'CustPendingFunds.ajaxPaging()',
            alwayshow: true
        };
        const _selector = {
            SubmitButton: '#SubmitButton',
            ExportToExcel: '#ExportToExcel',
            Form: '#CustomerPendingFundsForm',
            GridId: 'ReportGrid',
            SortColumnInput: '#SortColumn',
            SortDirectionInput: '#SortDirection',
            BetListLink: '.bet-list-link'
        };

        function initialize() {
            Site.initialize();
            Site.addUserGuide({
                resourceName: 'CustomerPendingFunds',
                title: Site.getSingleResource('CustomerPedingFunds')
            });
            MultiSelect.initProductList();

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

                $('#OrderItem').val(_orderItem);
                $('#IsAscSort').val(_sortDirection === 'asc');
                const mainForm = $(_selector.Form);
                const url = Site.resolveClientUrl(CustomerPedingFundsOption.urlExcelData);
                mainForm.attr('action', url);
                mainForm.submit();
                return false;
            });

            $('.main-content').on('click', _selector.BetListLink, function () {
                const data = $(this).data('drill-down');
                _me.viewPendingFundsBetList(data.CustId, data.SystemId, data.ExternalId);
            });

            $(window).on('resize', function () {
                resizeGrid();
            });

            $(window).on('unload', function () {
                $(window).off('resize');
            });

            window.CustPendingFunds = {
                ajaxPaging: _me.ajaxPaging
            };
        }

        function initSetting() {
            _sortColumn = 'ExternalId';
            _sortDirection = 'asc';
            _orderItem = SORTING_CODE[_sortColumn];
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
                url: Site.resolveClientUrl(CustomerPedingFundsOption.urlData),
                success: function (response) {
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

            const gridOption = CustomerPedingFundsOption.getGridOption(response.TotalRows);
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
        }

        function ajaxPaging() {
            _pagingOption = PagingHelper.getSetting();
            _me.submit();
        }

        function viewPendingFundsBetList(custid, systemId, externalId) {
            let url = Site.resolveClientUrl('PendingFundsBetList/Index');
            url = Site.setLicenseeOptionOriginalParam(url);
            url = Site.setProductOptionOriginalParamList(url);
            url = QueryString.setParam(url, 'custid', custid);
            url = QueryString.setParam(url, 'systemid', systemId);
            url = QueryString.setParam(url, 'externalid', externalId);

            const title = Site.getSingleResource('BetListRunning');
            const popH = Math.min($(window).height() - 100, 650), popW = 920;
            const popupOption = { id: 'betlist-popup', width: popW + 50, height: popH + 50, title: title };
            Popup.openPopupWithIframe(url, popupOption);
            window.logOpenBetlistEvent && window.logOpenBetlistEvent();
        }

        function buildPostData() {
            if (!_submitData) {
                Report.setOriginalProduct();
                Site.updateOriginalLicenseeOption();
                _submitData = $(_selector.Form).serializeObject();
            }
            _submitData.PageIndex = _pagingOption.pageindex;
            _submitData.PageSize = _pagingOption.pagesize;
            _submitData.OrderItem = _orderItem;
            _submitData.IsAscSort = _sortDirection === 'asc';
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
                _sortDirection = index === _sortColumn ? (_sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
                _sortColumn = index;
                _orderItem = SORTING_CODE[_sortColumn];
                window.setTimeout(function () {
                    $(_selector.SortColumnInput).val(_sortColumn);
                    $(_selector.SortDirectionInput).val(_sortDirection);
                    _me.submit();
                }, 100);
            }
        }

        function onGridComplete(grid, gridOption, response) {
            if (_isFirstLoad) {
                jqGridAdditional.gridComplete();

                const reportGrid = $('#' + _selector.GridId);
                if (_pagingOption.totalrow > 1) {
                    jqGridAdditional.addSortableHeaders(reportGrid, _sortColumn, _sortDirection);
                }
                else {
                    jqGridAdditional.removeCursorOnNonSortableHeader(reportGrid);
                }

                jqGridAdditional.assignTotal(response.Total, gridOption.colModel);
                jqGridAdditional.setGroupFooters(Site.isFakeLicensee() ?
                    CustomerPedingFundsOption.totalColspanFakeLicensee :
                    CustomerPedingFundsOption.totalColspan);
                resizeGrid();
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
            initSetting: initSetting,
            viewPendingFundsBetList: viewPendingFundsBetList
        };

        return _me;
    });