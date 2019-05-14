define([
    'jquery',
    'common/site',
    'lib/jqgrid/jquery.jqgrid.additional',
    './customerturnover.option',
    'components/pluginhelper/autocomplete',
    'components/pluginhelper/daterangepicker',
    'helpers/daterange',
    'components/paging',
    'lib/jquery.multiselect.nlevel',
    'lib/jqgrid/jquery.jqGrid.en',
    'lib/jqgrid/jquery.jqGrid.min',
    'extensions/jquery.extension',
    'lib/linq'],
    function ($, Site, jqGridAdditional, CustomerTurnoverOption, AutoComplete, DatePicker, DateHelper, PagingHelper) {
        'use strict';

        let _sports = [];
        let _bettypes = [];
        let _checkedSports = [];
        let _checkedBettypes = [];
        let _submitData;
        const _url = {
            GetSports: 'CustomerTurnoverReport/GetSportsAndProducts',
            GetBetTypes: 'ReportAPI/GetBettypesBySport',
            SearchCustomer: 'SearchCustomerAPI/SearchCustomer'
        };
        const _selector = {
            SubmitButton: '#SubmitButton',
            ExportExcelInput: '#IsExportExcel',
            ExportToExcel: '#ExportToExcel',
            Form: '#CustomerTurnoverReport',
            Title: '.report-title',
            Header: '.panel-heading',
            GridId: 'ReportGrid',
            Odds: '#Odds',
            TickerFilter: '#TickerFilter',
            Username: '#Username',
            ProductMultiSelect: '#grid-products-multiselect',
            BetTypeMultiSelect: '#grid-bettypes-multiselect',
            BetTypeList: '#BetTypeList',
            ProductList: '#ProductList',
            IsAllowedCustomerCommission: '#IsAllowedCustomerCommission',
            ExcelParam: '#excelparam',
            ExcelForm: '#CustomerTurnoverForm'
        };
        let _ajaxRequestGetBettype, _ajaxRequestData;
        let _pagingOption =
            {
                pageindex: 1,
                pagesize: 25,
                pagelist: [25, 50, 100, 500],
                totalrow: 1,
                elementcontainer: '.paging',
                method: 'AJAX',
                ajaxfunction: 'CustTurnover.ajaxPaging()',
                alwayshow: true
            };

        function initialize() {
            Site.initialize();
            Site.addUserGuide({
                resourceName: 'CustomerTurnover',
                title: Site.getSingleResource('CustomerTurnover')
            });
            DatePicker.initDateRangePicker();
            
            _me.initSetting();
            _me.initAutoComplete();
            _me.initTicketFilter();
            _me.initEvent();
            _me.initProductTree();
        }

        function initEvent() {
            $(_selector.Odds).keypress(function (event) {
                handleOddInput(event);
            });

            $(_selector.SubmitButton).click(function () {
                if (!_me.checkValidFilter()) {
                    return;
                }
                
                _pagingOption.pageindex = 1;
                _submitData = null;
                _me.submit();
            });

            $(_selector.ExportToExcel).click(function () {
                $(_selector.ExportExcelInput).val(true);
                _me.exportToExcel();
                $(_selector.ExportExcelInput).val(false);
                //return false;
            });

            $(window).on('resize', function () {
                resizeGrid();
            });

            $(window).on('unload', function () {
                $(window).off('resize');
            });

            window.CustTurnover = {
                ajaxPaging: _me.ajaxPaging
            };
        }

        function initSetting() {
            CustomerTurnoverOption.hasCustomerComm = Site.asBool($(_selector.IsAllowedCustomerCommission).val());
        }

        function initTicketFilter() {
            $(_selector.TickerFilter + ' input[type=checkbox]').checkboxgroup();
            $(_selector.TickerFilter).on('change', 'input[type=checkbox]', function () {
                _me.checkValidFilter();
            });
        }

        function initAutoComplete() {
            const option = {
                url: Site.resolveClientUrl(_url.SearchCustomer),
                target: _selector.Username
            };

            AutoComplete.initialize(option);
        }

        function initProductTree() {
            $.getJSON(Site.resolveClientUrl(_url.GetSports), function (data) {
                _sports = data;
                _checkedSports = data;
                renderProductTree();
                /*loadd all bettype*/
                loadBettypes();
            });
        }

        function isValidDateRange(fromDate, toDate) {
            const oneDay = 24 * 60 * 60 * 1000;

            const diffDays = Math.round(Math.abs((new Date(fromDate).getTime() - new Date(toDate).getTime()) / (oneDay)));
            if(diffDays > 31) {
                alert(Site.getSingleResource('DateRangeExceedMsg').replace('{0}', 1));
                return false;
            }

            return true;
        }

        function submit() {
            buildPostData();
            
            if(!isValidDateRange(_submitData.fromdate, _submitData.todate))
            {
                return false;
            }

            const option = {
                type: 'POST',
                data: JSON.stringify(_submitData),
                dataType: 'json',
                contentType: 'application/json',
                cache: false,
                url: Site.resolveClientUrl(CustomerTurnoverOption.urlData),
                success: function (response) {
                    setReportTitle(_submitData.currencyname, _submitData.username, _submitData.fromdate, _submitData.todate, _submitData.odds);
                    CustomerTurnoverOption.reportBy = _submitData.reportby;
                    _me.bindData(response);
                },
                beforeSend: function () {
                    Site.blockUI();
                },
                complete: function () {
                    Site.unBlockUI();
                }
            };
            if (_ajaxRequestData != null) {
                _ajaxRequestData.abort();
            }
            _ajaxRequestData = $.ajax(option);
        }

        function bindData(response) {
            Site.blockUI();
            jqGridAdditional.clearGrid(_selector.GridId);

            createPaging(response.TotalRow);

            if (response.TotalRow === 0) {
                jqGridAdditional.setNoInfo();
                Site.unBlockUI();
                return;
            }

            const gridOption = CustomerTurnoverOption.getGridOption();
            gridOption.data = response.Data;
            gridOption.rowNum = response.Data.length;

            gridOption.gridComplete = function () {
                onGridComplete(this, gridOption, response);
                Site.unBlockUI();
            };

            const reportGrid = $('#' + _selector.GridId);
            reportGrid.jqGrid(gridOption);
        }

        function exportToExcel() {
            if (!isValidDateRange() || !_me.checkValidFilter()) {
                return false;
            }
            const param = getPostData();
            param.PageIndex = 1;
            $(_selector.ExcelParam).val(JSON.stringify(param));
            $(_selector.ExcelForm).submit();
            return false;
        }

        function ajaxPaging() {
            _pagingOption = PagingHelper.getSetting();
            _me.submit();
        }

        function checkValidFilter() {
            const validBetType = _checkedBettypes.length > 0;

            const ticketFilter = $(_selector.TickerFilter);
            const validTicketFilter = ticketFilter.find('input:checked').length > 0;
            const isValid = validBetType && validTicketFilter;

            $(_selector.BetTypeList).toggleClass('invalid', !validBetType);

            $(_selector.SubmitButton).prop('disabled', !isValid);

            return isValid;
        }

        function setReportTitle(currencyName, userName, fromDate, toDate, odds) {
            const titlePattern = Site.getSingleResource('Customer') + ' '
                + Site.getSingleResource('Turnover') + ', {0} → {1} - '
                + Site.getSingleResource('Currency') + ': {2} - '
                + Site.getSingleResource('MinimumOdds') + ': {3}{4}';

            const tempUserName = userName.length > 0
                ? ' - ' + Site.getSingleResource('Username') + ': ' + userName
                : '';

            const title = $.format(titlePattern, fromDate, toDate, currencyName, odds, tempUserName);

            $(_selector.Title).html(title);
            $(_selector.Header).removeClass('hide');
        }

        function buildPostData() {
            if (_submitData === null) {
                _submitData = getPostData();
            }
            else {
                _submitData.PageIndex = _pagingOption.pageindex;
                _submitData.PageSize = _pagingOption.pagesize;
            }
        }

        function getPostData() {
            const data = $(_selector.Form).serializeObject();

            const param = {};
            param.fromdate = data.FromDate;
            param.todate = data.ToDate;
            param.reportby = data.ReportBy;
            param.showwin = Site.asBool(data.ShowWin);
            param.showloss = Site.asBool(data.ShowLoss);
            param.showdraw = Site.asBool(data.ShowDraw);
            param.odds = data.Odds;
            param.SportProducts = _checkedSports;
            param.bettypes = _checkedBettypes;
            param.username = data.Username;
            param.currencyid = data.CurrencyId;
            param.isexportexcel = data.IsExportExcel;
            param.currencyname = data.CurrencyName;
            param.PageIndex = _pagingOption.pageindex;
            param.PageSize = _pagingOption.pagesize;

            if (!Site.isNumber(param.odds)) {
                param.odds = 0;
            }

            return param;
        }

        function onGridComplete(grid, gridOption, response) {
            const reportGrid = $('#' + _selector.GridId);
            if (CustomerTurnoverOption.hasCustomerComm) {
                jqGridAdditional.setGroupCustomerWLColumns(reportGrid);
            }
            jqGridAdditional.gridComplete();
            jqGridAdditional.removeCursorOnNonSortableHeader(reportGrid);
            jqGridAdditional.assignTotal(response.Total, gridOption.colModel);
            jqGridAdditional.setGroupFooters(CustomerTurnoverOption.totalColspan);
            resizeGrid();
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

        function renderProductTree() {
            const groupData = groupProductList();

            $(_selector.ProductMultiSelect).multiSelect({
                minWidth: 200,
                maxHeight: 400,
                hasOptGroup: true,
                listData: groupData,
                isUsedCustomCheckAllText: true,
                customCheckAllText: Site.getSingleResource('All'),
                checkAllText: Site.getSingleResource('All'),
                noItemText: Site.getSingleResource('NoProductFound'),
                unCheckAllText: Site.getSingleResource('UncheckAll'),
                updateResult: '',
                noneSelectedText: Site.getSingleResource('SelectOptions'),
                selectedText: Site.getSingleResource('SelectedItemCount'),
                tooltipNoItem: Site.getSingleResource('ThereIsNoSelectedItem'),
                selectedList: 0,
                isCheckAll: true,
                isRetrieveDataAfterClose: false,
                multiple: true,
                shadow: true,
                showHeader: true,
                showFooter: false,
                showTooltip: true,
                onCheck: function () {
                    const checkedItems = $(_selector.ProductMultiSelect).multiSelect('getCheckedItems');
                    const numberOfCheckedItems = checkedItems.length;
                    /*update checked sports*/
                    _checkedSports = [];
                    for (let i = 0; i < numberOfCheckedItems; i++) {
                        addCheckedSport(checkedItems[i]);
                    }

                    $(_selector.ProductList).toggleClass('invalid', _checkedSports.length <= 0);
                    /*Load bet types*/
                    loadBettypes();
                }
            });
        }

        function groupProductList() {
            const groupData = [];
            const parents = Enumerable.From(_sports).Where(function (s) { return s.ParentId === -1; }).ToArray();
            $.each(parents, function (index, value) {
                const parent = {
                    Id: index.toString(),
                    Value: '-1-' + value.ID,
                    Text: value.Name,
                    Checked: value.Checked,
                    ParrentId: -1,
                    Enable: true,
                    Css: '',
                    CssClass: ''
                };
                let cindex = 0;
                parent.Items = Enumerable.From(_sports).Where(function (child) {
                    return child.ParentId === value.ID && child.ID > 0 && child.ParentId > -1;
                }).Select(function (child) {
                    return {
                        Id: parent.Id + '-' + cindex++,
                        Value: child.ParentId + '-' + child.ID,
                        Text: child.Name,
                        ParrentId: child.ParentId,
                        Checked: child.Checked,
                        Enable: true,
                        Css: '',
                        CssClass: '',
                        GroupName: parent.Text
                    };
                }).ToArray();

                groupData.push(parent);
            });

            return groupData;
        }

        function addCheckedSport(checkedValue) {
            const modelItem = Enumerable.From(_sports).FirstOrDefault(null, function (item) {
                return (item.ParentId + '-' + item.ID) === checkedValue;
            });

            if (modelItem != null) {
                modelItem.Checked = true;
                _checkedSports.push(modelItem);
                /*add parent item*/

                if (modelItem.ParentId > -1) {
                    let parent = Enumerable.From(_checkedSports).FirstOrDefault(null, function (item) {
                        return item.ID === modelItem.ParentId && item.ParentId === -1;
                    });

                    /* if not found parrent item in checked sports
                    * Continue find parent item in sports and add it to checked sports.
                    */
                    if (parent == null) {
                        parent = Enumerable.From(_sports).FirstOrDefault(null, function (item) {
                            return item.ID === modelItem.ParentId && item.ParentId === -1;
                        });
                        if (parent != null) {
                            _checkedSports.push(parent);
                        }
                    }
                }
            }
        }

        function loadBettypes() {
            if (_checkedSports.length === 0) {
                _bettypes = [];
                _checkedBettypes = [];
                renderBetTypeTree();
                _me.checkValidFilter();
                return;
            }
            const option = {
                type: 'POST',
                data: JSON.stringify(_checkedSports),
                dataType: 'json',
                contentType: 'application/json',
                cache: false,
                url: _url.GetBetTypes,
                success: function (response) {
                    _bettypes = response;
                    _checkedBettypes = response;
                    renderBetTypeTree();
                },
                beforeSend: function () {
                    Site.blockUI();
                },
                complete: function () {
                    Site.unBlockUI();
                }
            };
            if (_ajaxRequestGetBettype != null) {
                _ajaxRequestGetBettype.abort();
            }
            _ajaxRequestGetBettype = $.ajax(option);
        }

        function renderBetTypeTree() {
            const dataList = [];
            $.each(_bettypes, function (index, value) {
                const item = {
                    Id: 'BetType-' + value.ID,
                    Value: value.ID,
                    Text: value.Name,
                    Checked: value.Checked,
                    Enable: true,
                    Css: '',
                    CssClass: ''
                };
                dataList.push(item);
            });
            _me.checkValidFilter();

            $(_selector.BetTypeMultiSelect).multiSelect({
                minWidth: 200,
                maxHeight: 400,
                listData: dataList,
                hasOptGroup: false,
                onCheck: function () {
                    const checkedItems = $(_selector.BetTypeMultiSelect).multiSelect('getCheckedItems');
                    const numberOfCheckedItems = checkedItems.length;
                    /*update checked bet types*/
                    _checkedBettypes = [];
                    for (let i = 0; i < numberOfCheckedItems; i++) {
                        addCheckedBettype(checkedItems[i]);
                    }
                    _me.checkValidFilter();
                },
                isUsedCustomCheckAllText: true,
                customCheckAllText: Site.getSingleResource('All'),
                checkAllText: Site.getSingleResource('All'),
                noItemText: Site.getSingleResource('NoBettypeFound'),
                unCheckAllText: Site.getSingleResource('UncheckAll'),
                updateResult: '',
                noneSelectedText: Site.getSingleResource('SelectOptions'),
                selectedText: Site.getSingleResource('SelectedItemCount'),
                tooltipNoItem: Site.getSingleResource('ThereIsNoSelectedItem'),
                selectedList: 0,
                isCheckAll: true,
                isRetrieveDataAfterClose: false,
                multiple: true,
                shadow: true,
                showFooter: false,
                showHeader: true,
                showTooltip: true
            });
        }

        function addCheckedBettype(checkedValue) {
            const modelItem = Enumerable.From(_bettypes).FirstOrDefault(null, function (item) {
                return item.ID.toString() === checkedValue.toString();
            });
            if (modelItem !== null) {
                modelItem.Checked = true;
                _checkedBettypes.push(modelItem);
            }
        }

        function handleOddInput(event) {
            /*--------------------------------------------------------------
                Backspace, tab, enter, end, home, left, right
                Don't support the del key in Opera because del == . == 46.
                --------------------------------------------------------------*/
            const controlKeys = [8, 9, 13, 39, 46];

            /*--------------------------------------------------------------
            IE doesn't support indexOf
            --------------------------------------------------------------*/
            const isControlKey = controlKeys.join(',').match(new RegExp(event.which));

            /*--------------------------------------------------------------
            Some browsers just don't raise events for control keys. Easy.
            e.g. Safari backspace.
            --------------------------------------------------------------*/
            if (!event.which ||
                // Control keys in most browsers. e.g. Firefox tab is 0
             48 <= event.which && event.which <= 57 ||
                // Always 0 through 9
                //(48 == event.which && $(this).attr('value')) ||   // No 0 first digit
                isControlKey) {
                // Opera assigns values for control keys.
                return;
            }
            else {
                event.preventDefault();
            }
        }

        function resizeGrid() {
            const reportGrid = $('#' + _selector.GridId);
            jqGridAdditional.updateGridHeight();
            jqGridAdditional.updateGridWidth(reportGrid);
        }

        const _me = {
            initialize: initialize,
            initSetting: initSetting,
            initAutoComplete: initAutoComplete,
            initTicketFilter: initTicketFilter,
            initEvent: initEvent,
            initProductTree: initProductTree,
            submit: submit,
            bindData: bindData,
            ajaxPaging: ajaxPaging,
            exportToExcel: exportToExcel,
            checkValidFilter: checkValidFilter,
            getPostData: getPostData
        };

        return _me;
    });