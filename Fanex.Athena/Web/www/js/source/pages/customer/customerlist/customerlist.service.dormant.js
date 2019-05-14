'use strict';
define(['jquery', 'common/site', './customerlist.gridoption.dormant', 'lib/jqgrid/jquery.jqgrid.additional',
    'components/paging', './customerlist.state', 'lib/jqgrid/jquery.jqGrid.en', 'lib/jqgrid/jquery.jqGrid.min', 'extensions/jquery.extension'],
function ($, Site, CustomerListOptionDormant, jqGridAdditional, PagingHelper, CustomerListState) {
    let _ajaxRequest = null;

    let _state;
    
    const _me = {
        initialize: function () {
            _state = CustomerListState.getDormantState();
        },

        submit: function () {
            
            const data = _me.getPostData();
            const option = {
                type: 'POST',
                data: data,
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                cache: false,
                url: Site.resolveClientUrl(CustomerListOptionDormant.urlData),
                success: function (response) {
                    _me.bindData(response);
                },
                beforeSend: function () {
                    Site.blockUI();
                },
                error: function () {
                    Site.unBlockUI();
                }
            };

            if (_ajaxRequest !== null) {
                _ajaxRequest.abort();
            }
            _ajaxRequest = $.ajax(option);
        },

        getPostData: function () {
            const data = {};

            if ($('#subsidiary-multiselect').length > 0) {
                data.SubsidiaryList = $('#subsidiary-multiselect').multiSelect('getCheckedItems').join();
            }

            data.PageIndex = _state.pagingOption.pageindex;
            data.PageSize = _state.pagingOption.pagesize;
            data.CurrencyId = $('#CurrencyId').val();
            data.Username = Site.asNull($('#Username').val());
            data.CurrencyName = $('#CurrencyName').val();
            data.BaseCurrency = $('#BaseCurrency').val();

            $('#excelDormantParam').val(JSON.stringify(data));

            $('#CurrencyId').attr('data-original', data.CurrencyId);
            $('#BaseCurrency').attr('data-original', data.BaseCurrency);

            return data;
        },

        bindData: function (gridData) {
            const width = 708;
            const $container = $('#tabDormantCustomer');
            jqGridAdditional.clearGrid('DormantCustomerGrid');

            const hasData = gridData && gridData.TotalRows > 0;
            $('#DormantCustomerPager, #tabDormantCustomer .excel-container').toggle(hasData);

            if (!hasData) {
                jqGridAdditional.setNoInfo(null, $container);
                $container.find('.panel-heading').width(width);
                $container.find('#noInfoRow').width(width - 10);
                $('#num-of-dormant-customer, #num-of-dormant-customer-header').html('0');
                Site.unBlockUI();
                return;
            }

            $('#num-of-dormant-customer, #num-of-dormant-customer-header').html(gridData.TotalRows);

            const pagingOption = _state.pagingOption;
            pagingOption.totalrow = parseInt(gridData.TotalRows, 10);
            PagingHelper.render(pagingOption);

            const $reportGrid = $('#DormantCustomerGrid');
            
            const gridOption = CustomerListOptionDormant.getGridOption();
            gridOption.data = gridData.Data;
            gridOption.rowNum = gridData.Data.length;
            gridOption.gridComplete = function () {
                jqGridAdditional.gridComplete($container);
            };

            // Show the grid
            $reportGrid.jqGrid(gridOption);

            jqGridAdditional.updateGridHeight($container);
            
            $('#DormantCustomerGrid').jqGrid('setGridWidth', width);
            $container.find('.panel-heading').width(width);
            $('#DormantCustomerPager').width(width);
            
            if ($.active <= 1) {
                Site.unBlockUI();
            }
        },

        resizeGrid: function (gridSelector) {
            const $reportGrid = $(gridSelector);
            jqGridAdditional.updateGridHeight($reportGrid.closest('.theme_jqGrid'));
            jqGridAdditional.updateGridWidth($reportGrid);
        }
    };

    return _me;
});