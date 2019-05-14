'use strict';
define(['jquery', 'common/site', './customerlist.gridoption', 'lib/jqgrid/jquery.jqgrid.additional', 'components/paging', './customerlist.state',
    'lib/jqgrid/jquery.jqGrid.en', 'lib/jqgrid/jquery.jqGrid.min', 'extensions/jquery.extension'],
function ($, Site, CustomerListOption, jqGridAdditional, PagingHelper, CustomerListState) {
    const _POPUP_LIST = ['#ViewOptionList', '#update-cust-status-popup', '#LevelListContainer', '#OddsGroupListContainer'];
    let _isAllowedCustomerCommission, _isAllowedUserEditComm;
    let _productList;
    let _ajaxRequest = null;

    let _state;

    const _me = {
        initialize: function () {
            _isAllowedCustomerCommission = $('#IsAllowedCustomerCommission').val() === 'True';
            _isAllowedUserEditComm = $('#IsAllowedUserEditComm').val() === 'True';
            _productList = $('#ProductList').val().split(',');
            _state = CustomerListState.getState();
        },

        submit: function () {
            _state.selectedCustomers = {};
            _state.checkedAllRows = false;

            const data = _me.getPostData();
            const option = {
                type: 'POST',
                data: data,
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                cache: false,
                url: Site.resolveClientUrl(CustomerListOption.urlData),
                success: function (response) {
                    _state.cachedData = response;
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

            data.GridColumns = [];
            const $gridColumnMultiselect = $('#ui-multiselect-options-grid-columns-multiselect ul.ui-multiselect-checkboxes input');
            $gridColumnMultiselect.each(function (index, element) {
                data.GridColumns.push({
                    Name: element.name,
                    Checked: element.checked
                });
            });

            const gridColumnCount = data.GridColumns.filter(function (item) { return item.Checked; }).length;
            if (gridColumnCount === 0) {
                return;
            }

            if ($('#OddsGroups').length > 0) {
                data.OddsGroups = [];
                const $oddsGroupsMultiselect = $('#ui-multiselect-options-odds-group-multiselect .ui-multiselect-checkboxes input');
                $oddsGroupsMultiselect.each(function (index, element) {
                    data.OddsGroups.push({
                        Name: element.name,
                        Checked: element.checked
                    });
                });

                const oddsGroupCount = data.OddsGroups.filter(function (item) { return item.Checked; }).length;
                if (oddsGroupCount === 0) {
                    return;
                }
            }

            if ($('#subsidiary-multiselect').length > 0) {
                data.SubsidiaryList = $('#subsidiary-multiselect').multiSelect('getCheckedItems').join();
            }

            data.PageIndex = _state.pagingOption.pageindex;
            data.PageSize = _state.pagingOption.pagesize;
            data.CurrencyId = $('#CurrencyId').val();
            data.SpecialLevel = $('#special-level-list-search').val();
            data.Username = Site.asNull($('#Username').val());
            data.CurrencyName = $('#CurrencyName').val();
            data.BaFilter = $('#BAFilterOption').val();
            data.GroupCommId = $('#DdlGroupCommId').val();
            data.BaseCurrency = $('#BaseCurrency').val();
            data.CustStatus = $('#CustStatusOption').val();

            $('#excelParam').val(JSON.stringify(data));

            $('#CurrencyId').attr('data-original', data.CurrencyId);
            $('#BaseCurrency').attr('data-original', data.BaseCurrency);

            return data;
        },
        // virtual scrolling not work after hide and show
        bindDataFromCache: function() { 
            _me.bindData(_state.cachedData, true);
        },
        bindData: function (gridData, keepScrollPosition) {
            jqGridAdditional.clearGrid('ReportGrid');
            
            const hasData = gridData && gridData.TotalRows > 0;
            $('#ActiveCustomerPager, #tabActiveCustomer .excel-container').toggle(hasData);
            const $container = $('#tabActiveCustomer');
            if (!hasData) {
                jqGridAdditional.setNoInfo(null, $container);
                $('#num-of-customer, #num-of-customer-header').html('0');
                Site.unBlockUI();
                return;
            }

            const oldScrollTop = $('#report-content .ui-jqgrid-bdiv').scrollTop();
            $('#num-of-customer, #num-of-customer-header').html(gridData.TotalRows);

            const pagingOption = _state.pagingOption;
            pagingOption.totalrow = parseInt(gridData.TotalRows, 10);
            PagingHelper.render(pagingOption);

            const showingColumns = $('#ui-multiselect-options-grid-columns-multiselect input').serializeObject();
            const gridOption = _me.processGridOption(showingColumns);
            gridOption.data = gridData.Data;
            gridOption.gridComplete = function () {
                jqGridAdditional.gridComplete($container);
            };

            // Show the grid
            const $reportGrid = $('#ReportGrid');
            $reportGrid.jqGrid(gridOption);
            CustomerListOption.setGroupHeaderColumns($reportGrid);

            if (_isAllowedCustomerCommission && showingColumns['Group'] !== undefined && _isAllowedUserEditComm) {
                $('#jqgh_ReportGrid_Index').attr('class', '').html('<input type="checkbox" id="CheckAll" /><label for="CheckAll"></label>');
            } else {
                $('#jqgh_ReportGrid_Index').html('#');
            }

            $('#CheckAll').prop('checked', _state.checkedAllRows);
            _me.resizeGrid('#ReportGrid');

            if (keepScrollPosition === true) {
                $('#report-content .ui-jqgrid-bdiv').scrollTop(oldScrollTop);
            }

            if ($.active <= 1) {
                Site.unBlockUI();
            } else {
                setTimeout(Site.unBlockUI, 500);
            }

            _me.addGridScrollEventToHidePopups();
        },

        resizeGrid: function (gridSelector) {
            const $reportGrid = $(gridSelector);
            jqGridAdditional.updateGridHeight($reportGrid.closest('.theme_jqGrid'));
            jqGridAdditional.updateGridWidth($reportGrid);
        },

        addGridScrollEventToHidePopups: function () {
            // Hide popup if scroll
            $('.ui-jqgrid-bdiv').on('scroll', function () {
                $(_POPUP_LIST).each(function (index, element) {
                    const popup = $(element);
                    if (popup.is(':visible')) {
                        popup.hide();
                    }
                });
            });
        },

        processGridOption: function (showingColumns) {
            const gridOption = CustomerListOption.getGridOption(_productList, _isAllowedCustomerCommission);
            const indexColumn = gridOption.colModel[0];

            _me.updateIndexColumnFormatter(indexColumn, showingColumns);
            _me.toggleColumn(gridOption, showingColumns);

            return gridOption;
        },

        updateIndexColumnFormatter: function (indexColumn, showingColumns) {
            const indexFormatter = function (cellValue, options, rowObject) {
                const checkedText = $('#CheckAll').prop('checked') || _state.selectedCustomers[rowObject.CustId] !== undefined ? 'checked' : '';

                return '<input type="checkbox" ' + checkedText + ' title="' + rowObject.CustId +
                        '" id="' + rowObject.CustId + '" data-group-comm-id="' + rowObject.GroupCommId + '" class="select-cust-checkbox check-child" />' +
                    '<label for="' + rowObject.CustId + '"></label>';
            };

            if (_isAllowedCustomerCommission && showingColumns['Group'] !== undefined && _isAllowedUserEditComm) {
                indexColumn.formatter = indexFormatter;
            }
            else {
                indexColumn.formatter = undefined;
            }
        },

        toggleColumn: function (gridOption, showingColumns) {
            const colNames = gridOption.colNames;
            const colModel = gridOption.colModel;
            let collength = colModel.length;
            let colIndex = 0;
            while (colIndex < collength) {
                const col = colModel[colIndex];
                if (!col.name || col.name === 'Index') {
                    colIndex++;
                    continue;
                }

                const colName = col.name.match(/^\w\wComm$/) !== null ? 'Commission' : col.name;

                if (showingColumns[colName] === undefined) {
                    colModel.splice(colIndex, 1);
                    colNames.splice(colIndex, 1);
                    collength--;
                }
                else {
                    colIndex++;
                }
            }
        },

        showGridDropdownById: function (listId, $context) {
            const $popup = $('#' + listId);
            const position = $context.offset();
            const isOverFlow = position.top + $popup.outerHeight() > window.innerHeight - 15;

            const popupTop = isOverFlow ? position.top - $popup.outerHeight() - 1 :
                                        position.top + $context.outerHeight() + 1;

            $popup.css({
                top: popupTop,
                left: position.left,
                width: $context.outerWidth()
            });

            const custId = $context.data('custid');
            if ($popup.data('custid') === custId) {
                $popup.toggle();
            }
            else {
                const $customerOption = $('#cust-option-link-' + custId);
                $popup.data('custid', custId);
                $popup.data('externalid', $customerOption.data('externalid'));
                $popup.data('systemid', $customerOption.data('systemid'));
                $popup.show();
            }

            return false;
        },

        updateGridData: function (option) {
            _me.closePopup(option.popUpSelector);
            const oldValue = option.oldValue;
            const newValue = option.newValue;

            if (oldValue === newValue || !window.confirm(option.confirmMessage)) {
                return;
            }

            $.ajax({
                type: 'POST',
                data: option.param,
                url: option.url,
                dataType: 'json',
                success: function (data) {
                    if (data.Success) {
                        const rowIndex = (option.$context.closest('tr').attr('id') - 1) % _state.pagingOption.pagesize;
                        const dataItem = _state.cachedData.Data[rowIndex];
                        dataItem[option.dataField] = newValue;
                        _me.bindData(_state.cachedData, true);
                    }
                    else {
                        alert(data.ErrorMessage);
                    }
                }
            });
        },

        closePopup: function (popUpSelector) {
            $(popUpSelector).fadeOut();
        }
    };

    return _me;
});