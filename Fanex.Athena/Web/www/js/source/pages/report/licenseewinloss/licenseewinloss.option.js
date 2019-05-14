/// <reference path='/@JSense.js' />
/*
* Note:in this report, parameter level have 3 value
*  '0' for master,'1' for agent and '2' for member
*/

define(
    ['jquery', 'common/querystring', 'common/site', 'lib/jqgrid/jquery.jqgrid.additional', 'lib/linq'],
    function ($, QueryString, Site, jqGridAdditional) {
        'use strict';
        const IGNORED_LICENSEEWL_PRODUCTS = ['BA'];
        const IGNORED_TURNOVER_PRODUCTS = ['BT', 'CO'];
        const _me =
        {
            isDisableBetList: false,
            licenseeId: 0,
            currencyIndex: 4,
            turnoverIndex: 5,
            licenseeWlIndex: 12,
            customerWlTotalIndex: 11,
            customerWlIndex: 9,
            hasCustomerComm: true,
            pageSize: 50,
            nonePagingSize: 2000,
            rowNum: 50,
            rowList: [50, 100, 200, 300, 400, 500, 1000, 2000],
            totalColspan: [2, 2, 3],
            //level 0,1,2
            urlData: 'api/LicenseeWinLossReport/Index',
            urlExcelData: 'api/LicenseeWinLossReport/Index',
            urlPromotionPrizeExcelData: 'api/PromotionPrizeReport/ExportExcel',
            gridOption:
            {
                datatype: 'local',
                colNames: [],
                colModel: [],
                data: [],
                height: '100%',
                autowidth: false,
                forceFit: false,
                shrinkToFit: true,
                loadtext: '',
                loadui: 'disable',
                loadonce: true,
                footerrow: true,
                userDataOnFooter: true,
                userData: [],
                grouping: true,
                viewrecords: true,
                gridview: true,
                rownumbers: true
            },
            restoreExpanse: function () {
                for (let property in _expanseTypes) {
                    if (_expanseTypes.hasOwnProperty(property)) {
                        _me.toggle(_expanseTypes[property], property);
                    }
                }
            }
        };

        // store state of toggle() function
        const _expanseTypes = {};

        const setDrillDownLink = function (level, currencyId, custId, datetime, currencyName, cellvalue) {
            return '<a class="drilldown" href="javascript:;" onclick="return licenseewinlossDrilldown(' + level + ',' +
             currencyId + ',' + custId + ',\'' + datetime + '\',\'' + currencyName + '\');">' + cellvalue + '</a>';
        };

        const currencyFormatter = function (cellvalue, options, rowObject) {
            const level = Number(_me.licenseeId) === 1 ? 1 : 2;
            return setDrillDownLink(level, rowObject.CurrencyId, 0, rowObject.Date, rowObject.CurrencyName, cellvalue);
        };

        const systemIdFormatter = function (cellvalue, options, rowObject) {
            return setDrillDownLink(2, rowObject.CurrencyId, rowObject.CustomerId, rowObject.Date, rowObject.CurrencyName, cellvalue);
        };

        const betlistLink = function (cellvalue, options, rowObject) {
            const param =
            {
                DrillDownFromDate: rowObject.Date,
                DrillDownToDate: rowObject.Date,
                DrillDownCurrencyId: rowObject.CurrencyId,
                DrillDownCurrencyName: rowObject.CurrencyName,
                CustomerId: rowObject.CustomerId,
                ExternalId: rowObject.ExternalId,
                SystemId: rowObject.SystemId
            };

            return '<a class="bet-list-link" href="javascript:;" data-drill-down=\'' + JSON.stringify(param) + '\'>' + cellvalue + '</a>';
        };

        //#region Columns

        const indexColumn =
        {
            name: 'Index',
            index: 'Index',
            resizable: false,
            width: 45,
            align: 'center',
            valign: 'middle',
            sortable: false
        };

        const dateColumn =
        {
            name: 'Date',
            index: 'Date',
            resizable: false,
            width: 100,
            align: 'center',
            valign: 'middle',
            sortable: true,
            formatter: 'date',
            formatoptions:
            {
                newformat: 'm/d/Y'
            }
        };

        const externalIdColumn =
        {
            name: 'ExternalId',
            index: 'ExternalId',
            resizable: false,
            width: 120,
            align: 'left',
            sortable: true
        };

        const systemIdColumn =
        {
            name: 'SystemId',
            index: 'SystemId',
            resizable: false,
            width: 150,
            align: 'left',
            sortable: true
        };

        const currencyColumn =
        {
            name: 'CurrencyName',
            index: 'CurrencyName',
            width: 80,
            align: 'center',
            sortable: true,
            resizable: false,
            formatter: currencyFormatter
        };

        const turnoverColumn =
        {
            name: 'TotalTurnOverSingle',
            index: 'TotalTurnOverSingle',
            width: 120,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: 'currency',
            hidden: false,
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const actualStakeColumn =
        {
            name: 'ActualStake',
            index: 'ActualStake',
            width: 100,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: 'currency',
            hidden: false,
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const buybackColumn =
        {
            name: 'TotalBuyBackAmountSingle',
            index: 'TotalBuyBackAmountSingle',
            width: 100,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: 'currency',
            hidden: false,
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const totalTransColumn =
        {
            name: 'TotalTransaction',
            index: 'TotalTransaction',
            width: 90,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: 'integer',
            frozen: true,
            formatoptions:
            {
                thousandsSeparator: ','
            }
        };

        const customerWlColumn =
        {
            name: 'CustomerWinLoss',
            index: 'CustomerWinLoss',
            width: 120,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: jqGridAdditional.formatDecimal
        };

        const playerCommColumn =
        {
            name: 'CustomerComm',
            index: 'CustomerComm',
            width: 70,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: jqGridAdditional.formatDecimal
        };

        const customerWlTotalColumn =
        {
            name: 'CustomerTotal',
            index: 'CustomerTotal',
            width: 120,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: jqGridAdditional.formatDecimal
        };

        const licenseeWlColumn =
        {
            name: 'TotalLicenseeWLSingle',
            index: 'TotalLicenseeWLSingle',
            width: 120,
            align: 'right',
            sortable: true,
            resizable: false,
            hidden: false,
            title: true,
            formatter: jqGridAdditional.formatLicenseeWl
        };

        const betTradeCommissionColumn =
        {
            name: 'BetTradeCommission',
            index: 'BetTradeCommission',
            width: 120,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const cashOutCommissionColumn =
        {
            name: 'CashOutCommission',
            index: 'CashOutCommission',
            width: 120,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const baCommissionColumn =
        {
            name: 'BACommission',
            index: 'BACommission',
            width: 95,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const amtDueToBetTradeColumn =
        {
            name: 'AmtDueToBetTrade',
            index: 'AmtDueToBetTrade',
            width: 85,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const amtDueToBaColumn =
        {
            name: 'AmtDueToBA',
            index: 'AmtDueToBA',
            width: 85,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const currencyIdColumn =
        {
            name: 'CurrencyId',
            index: 'CurrencyId',
            width: 2,
            align: 'center',
            sortable: true,
            resizable: false,
            hidden: true
        };

        const customerIdColumn =
        {
            name: 'CustomerId',
            index: 'CustomerId',
            width: 2,
            align: 'center',
            sortable: true,
            resizable: false,
            hidden: true
        };

        const productColumn =
        {
            name: 'productName',
            index: 'productName',
            width: 120,
            sortable: true,
            resizable: false,
            align: 'right',
            hidden: true,
            title: true,
            formatter: jqGridAdditional.formatLicenseeWl
        };

        //#endregion

        const colNameList = [
            '#',
            'Date',
            'ExternalId',
            'SystemId',
            'Currency',
            'Turnover',
            'ActualStake',
            'BuyBackAmount',
             'TotalTransaction',
             '@[Win]/@[Loss]', 'Comm',
             'Total', 'LicenseeW_L',
             '@[ProductBT]<br/>@[Commission]',
             '@[ProductCO]<br/>@[Commission]',
             'BA<br/>@[Commission]',
             '@[AmtDueToBetTrade]',
             '@[AmtDueToBA]',
             'CurrencyId',
             'CustomerId'];

        const colModelList = [indexColumn, dateColumn, externalIdColumn, systemIdColumn, currencyColumn,
            turnoverColumn, actualStakeColumn, buybackColumn, totalTransColumn, customerWlColumn, playerCommColumn,
            customerWlTotalColumn, licenseeWlColumn, betTradeCommissionColumn, cashOutCommissionColumn, baCommissionColumn,
            amtDueToBetTradeColumn, amtDueToBaColumn, currencyIdColumn, customerIdColumn];

        function isProductChecked(productOptions, productCode) {
            const length = productOptions.length;

            for (let i = 0; i < length; i++) {
                if (productOptions[i].Code === productCode) {
                    return productOptions[i].Status;
                }
            }

            return null;
        }

        function isIgnoredTurnoverProduct(productCode) {
            return $.inArray(productCode, IGNORED_TURNOVER_PRODUCTS) >= 0;
        }

        function isIgnoredLicenseeWLProduct(productCode) {
            return $.inArray(productCode, IGNORED_LICENSEEWL_PRODUCTS) >= 0;
        }

        function turnoverProductsFilter(item) {
            return item.Status === true && isIgnoredTurnoverProduct(item.Code) === false;
        }

        function licenseeWLProductsFilter(item) {
            return item.Status === true && isIgnoredLicenseeWLProduct(item.Code) === false;
        }

        function addBuyBackAmountColumns(columns, columnIndex) {
            const buyBackAmountColumn = Site.clone(productColumn);
            buyBackAmountColumn.name = 'TotalBuyBackAmount';
            buyBackAmountColumn.index = 'TotalBuyBackAmount';

            const buyBackAmountSBColumn = Site.clone(productColumn);
            buyBackAmountSBColumn.name = 'BuyBackAmountSB';
            buyBackAmountSBColumn.index = 'BuyBackAmountSB';

            const buyBackAmountBAColumn = Site.clone(productColumn);
            buyBackAmountBAColumn.name = 'BuyBackAmountBA';
            buyBackAmountBAColumn.index = 'BuyBackAmountBA';

            columns.insertAfter(buyBackAmountColumn, columnIndex);
            columns.insertAfter(buyBackAmountBAColumn, columnIndex);
            columns.insertAfter(buyBackAmountSBColumn, columnIndex);
        }

        _me.setGroupHeaderColumns = function (grid, productOptions) {
            const numOfTurnover = Enumerable.From(productOptions).Count(turnoverProductsFilter) + 1;
            const lastOfTurnover = numOfTurnover > 1 ? Enumerable.From(productOptions).Last(turnoverProductsFilter) : null;

            const numOfLicenseeWL = Enumerable.From(productOptions).Count(licenseeWLProductsFilter) + 1;
            const lastOfLicenseeWL = numOfLicenseeWL > 1 ? Enumerable.From(productOptions).Last(licenseeWLProductsFilter) : null;

            const groupCustomerWinloss = _me.hasCustomerComm ? {
                startColumnName: 'CustomerWinLoss',
                numberOfColumns: 3,
                titleText: Site.getSingleResource('CustomerW_L')
            } : {};

            const groupTurnoverWL = lastOfTurnover !== null ? {
                startColumnName: 'TurnOver' + lastOfTurnover.Code,
                numberOfColumns: numOfTurnover,
                titleText: Site.getSingleResource('Turnover')
            } : {};

            const groupLicenseeWL = lastOfLicenseeWL !== null ? {
                startColumnName: 'LicenseeWL' + lastOfLicenseeWL.Code,
                numberOfColumns: numOfLicenseeWL,
                titleText: Site.getSingleResource('LicenseeW_L')
            } : {};

            const groupBuyBackAmount = lastOfLicenseeWL !== null ? {
                startColumnName: 'BuyBackAmountSB',
                numberOfColumns: 3,
                titleText: Site.getSingleResource('BuyBackAmount')
            } : {};

            grid.jqGrid('setGroupHeaders',
            {
                useColSpanStyle: true,
                groupHeaders: [groupTurnoverWL, groupLicenseeWL, groupCustomerWinloss, groupBuyBackAmount]
            });
        };

        _me.getColName = function (productOptions) {
            // Column Customer Wl
            const temp = Site.clone(colNameList);
            let turnOverIndex = _me.turnoverIndex;
            let licenseeIndex = _me.licenseeWlIndex;
            let customerWLTotalIndex = _me.customerWlTotalIndex;
            temp[_me.customerWlIndex] = _me.hasCustomerComm ? '@[Win]/@[Loss]' : 'CustomerW_L';
            $.each(productOptions, function (index, item) {
                //insert turn over column
                if (item.Status === true) {
                    if (isIgnoredTurnoverProduct(item.Code) === false) {
                        temp.insertAfter(item.Name, _me.currencyIndex);
                        turnOverIndex++;
                        licenseeIndex++;
                        customerWLTotalIndex++;
                    }
                    if (isIgnoredLicenseeWLProduct(item.Code) === false) {
                        temp.insertAfter(item.Name, customerWLTotalIndex);
                        licenseeIndex++;
                    }
                }
            });
            //add total column
            temp.insertBefore('Total', turnOverIndex);
            licenseeIndex++;
            temp.insertBefore('Total', licenseeIndex);

            const buyBackIndex = turnOverIndex + 2;
            if (isProductChecked(productOptions, 'BA') !== null) {
                temp.insertAfter('Total', buyBackIndex);
                temp.insertAfter('BA', buyBackIndex);
                temp.insertAfter('Sportsbook', buyBackIndex);
            }

            return Site.getResources(temp);
        };

        _me.getColModel = function (level, reportBy, productOptions) {
            
            // Column hidden by customer comm
            customerWlTotalColumn.hidden = !_me.hasCustomerComm;
            playerCommColumn.hidden = !_me.hasCustomerComm;
            const levelNumber = Number(level);
            //set width of licenseeWL column
            if (!_me.hasCustomerComm) { licenseeWlColumn.width = 90; }
            // Column hidden by level
            currencyColumn.formatter = levelNumber === 0 ? currencyFormatter : null;
            systemIdColumn.formatter = levelNumber === 1 ? systemIdFormatter : null;

            dateColumn.hidden = levelNumber > 0;
            externalIdColumn.hidden = levelNumber < 2;
            systemIdColumn.hidden = levelNumber === 0;

            // Column hidden by product
            const allowedSb = isProductChecked(productOptions, 'SB');
            const allowedBa = isProductChecked(productOptions, 'BA');
            const allowedBetTrade = isProductChecked(productOptions, 'BT');
            const allowedCashOut = isProductChecked(productOptions, 'CO');
            buybackColumn.hidden = !allowedBetTrade;
            actualStakeColumn.hidden = !allowedBetTrade;
            baCommissionColumn.hidden = !allowedBa;
            amtDueToBaColumn.hidden = !allowedBa;
            betTradeCommissionColumn.hidden = !allowedBetTrade;
            amtDueToBetTradeColumn.hidden = allowedSb === false || allowedBa === false || !allowedBetTrade;
            cashOutCommissionColumn.hidden = !allowedCashOut;

            if (levelNumber === 2) {
                externalIdColumn.formatter = betlistLink;
                systemIdColumn.formatter = betlistLink;
            }
            dateColumn.formatoptions = { newformat: Number(reportBy) === 2 ? 'm/Y' : 'm/d/Y' };

            const temp = Site.clone(colModelList);

            let turnOverIndex = _me.turnoverIndex;

            let licenseeIndex = _me.licenseeWlIndex;

            let customerWLTotalIndex = _me.customerWlTotalIndex;
            $.each(productOptions, function (index, item) {
                //insert turn over column
                if (item.Status === true) {
                    // Exclude bettrade
                    if (isIgnoredTurnoverProduct(item.Code) === false) {
                        const turnOver = Site.clone(productColumn);
                        turnOver.name = 'TurnOver' + item.Code;
                        turnOver.index = 'TurnOver' + item.Code;
                        turnOver.sortable = true;

                        temp.insertAfter(turnOver, _me.currencyIndex);
                        turnOverIndex++;
                        licenseeIndex++;
                        customerWLTotalIndex++;
                    }

                    if (isIgnoredLicenseeWLProduct(item.Code) === false) {
                        const licenseeWL = Site.clone(productColumn);
                        licenseeWL.name = 'LicenseeWL' + item.Code;
                        licenseeWL.index = 'LicenseeWL' + item.Code;
                        licenseeWL.sortable = true;

                        temp.insertAfter(licenseeWL, customerWLTotalIndex);
                        licenseeIndex++;
                    }
                }
            });

            //add total

            const turnOverTotal = Site.clone(productColumn);
            turnOverTotal.name = 'TotalTurnOver';
            turnOverTotal.index = 'TotalTurnOver';
            temp.insertBefore(turnOverTotal, turnOverIndex);
            licenseeIndex++;
            const licenseeWLTotal = Site.clone(productColumn);
            licenseeWLTotal.name = 'TotalLicenseeWL';
            licenseeWLTotal.index = 'TotalLicenseeWL';
            temp.insertBefore(licenseeWLTotal, licenseeIndex);

            if (allowedBa !== null) {
                addBuyBackAmountColumns(temp, turnOverIndex + 2);
            }

            return temp;
        };

        _me.getGridOption = function (level, reportBy, productOptions) {
            _me.gridOption.colNames = _me.getColName(productOptions);
            _me.gridOption.colModel = _me.getColModel(level, reportBy, productOptions);
            return Site.clone(_me.gridOption);
        };

        _me.getTotalColModel = function (level, productOptions) {
            const colModel = _me.getColModel(level, -1, productOptions);
            // Not show drill down link on total link
            const curCol = Enumerable.From(colModel).First(function (item) {
                return item.name === 'CurrencyName';
            });

            curCol.formatter = null;
            return colModel;
        };

        _me.addProductButton = function (grid, gridId, gridName, productOptions) {
            /// <summary>
            /// add collapse/expand button to header product columns
            /// </summary>
            /// <param name='grid'>grid instance</param>

            const numOfActiveLicPro = Enumerable.From(productOptions).Count(licenseeWLProductsFilter);
            const numOfActiveTurnPro = Enumerable.From(productOptions).Count(turnoverProductsFilter);
            const isAllowedBetTrade = isProductChecked(productOptions, 'BT');
            const isAllowBA = isProductChecked(productOptions, 'BA');
            const clear = function (button) {
                $(button).off('click').remove();
            };
            //reset licenseWL column
            const curWidth = $('#ReportGrid_TotalLicenseeWLSingle div').width();

            if (curWidth < 100) {
                $('#ReportGrid_TotalLicenseeWLSingle div').css('width', '100px');
            }

            //#region Toggle
            // column params: TurnOver, LicenseeWL, BuyBackAmount
            const toggle = function (isShow, column) {
                if ((column === 'LicenseeWL' && numOfActiveLicPro <= 1) ||
                    (column === 'TurnOver' && numOfActiveTurnPro <= 1) ||
                    (column === 'BuyBackAmount' && (!isAllowedBetTrade || isAllowBA === null))) {
                    return;
                }
                _expanseTypes[column] = isShow;

                const param = isShow ? 'showCol' : 'hideCol';
                let fColumns = [];
                let productColumnNames = [];

                if (column === 'BuyBackAmount') {
                    const sbColumnName = column + 'SB';
                    const baColumnName = column + 'BA';
                    fColumns = [gridName + '_' + sbColumnName, gridName + '_' + baColumnName];
                    productColumnNames.push(sbColumnName, baColumnName);
                } else {
                    $.each(productOptions, function (index, value) {
                        if (value.Status === true) {
                            const columnName = column + value.Code;
                            productColumnNames.push(columnName);
                            fColumns.push(gridName + '_' + columnName);
                        }
                    });
                }

                const totalColumn = 'Total' + column;
                productColumnNames.push(totalColumn);

                grid.jqGrid(param, productColumnNames);

                const fTotalColumn = gridName + '_' + totalColumn;
                fColumns.push(fTotalColumn);

                /*show /hide single column*/
                const singleColumn = totalColumn + 'Single';
                const singleParam = isShow ? 'hideCol' : 'showCol';
                grid.jqGrid(singleParam, singleColumn);

                /*show/hide footer column*/
                jqGridAdditional.setFooterColumns(param, fColumns);

                const singleFColumn = gridName + '_' + singleColumn;
                jqGridAdditional.setFooterColumns(singleParam, [singleFColumn]);

                if (column === 'TurnOver') {
                    addTurnOverExpand();
                }
                else if (column === 'LicenseeWL') {
                    addLicenseeExpand();
                }
                else {
                    addBuyBackExpand();
                }

                /*jqgrid always clears grouping header after events complete*/
                addTurnOverCollapse();
                addLicenseeWlCollapse();
                addBuyBackCollapse();

                //update footer row
                $('#footer').html($('.ui-jqgrid-ftable').html());
                $('.report-content').css('cursor', 'default');

                jqGridAdditional.updateGridHeight();
                jqGridAdditional.updateGridWidth(grid);
                return false;
            };

            _me.toggle = toggle;
            //#end

            function addToggleButton($container, $element, isToggle, column) {
                $element.appendTo($container).append('<i class="btn-icon icon-arrow"></i>')
                .click(function () { return toggle(isToggle, column); });
            }

            const addTurnOverExpand = function () {
                if (numOfActiveTurnPro > 1) {
                    clear('#btnTurnOverExpand');
                    const $container = $('#' + gridId + '_' + 'TotalTurnOverSingle');
                    const $button = $('<button title="Expand to view details" id="btnTurnOverExpand" class="header-button btn"></button>');
                    addToggleButton($container, $button, true, 'TurnOver');
                }
            };

            const addTurnOverCollapse = function () {
                if (numOfActiveTurnPro > 1) {
                    clear('#btnTurnOverCollapse');

                    const $container = $(grid).closest('.ui-jqgrid-view')
                            .find('.ui-jqgrid-htable .ui-jqgrid-labels > .ui-th-column-header:first');

                    const $button = $('<button class="header-button btnCollapse btn" id="btnTurnOverCollapse"></button>');
                    addToggleButton($container, $button, false, 'TurnOver');
                }
            };

            const addLicenseeExpand = function () {
                if (numOfActiveLicPro > 1) {
                    clear('#btnLicenseeWLExpand');
                    const $container = $('#' + gridId + '_' + 'TotalLicenseeWLSingle');
                    const $button = $('<button title="Expand to view details" id="btnLicenseeWLExpand" class="header-button btn"></button>');
                    addToggleButton($container, $button, true, 'LicenseeWL');
                }
            };

            const addLicenseeWlCollapse = function () {
                if (numOfActiveLicPro > 1) {
                    clear('#btnLicenseeWLCollapse');

                    const $container = $(grid).closest('.ui-jqgrid-view')
                            .find('.ui-jqgrid-htable .ui-jqgrid-labels > .ui-th-column-header:last');
                    const $button = $('<button class="header-button btnCollapse btn" id="btnLicenseeWLCollapse">');
                    addToggleButton($container, $button, false, 'LicenseeWL');
                }
            };

            const addBuyBackExpand = function () {
                if (isAllowBA !== null) {
                    clear('#btnBuyBackExpand');
                    const $container = $('#' + gridId + '_' + 'TotalBuyBackAmountSingle');
                    const $button = $('<button title="Expand to view details" id="btnBuyBackExpand" class="header-button btn"></button>');
                    addToggleButton($container, $button, true, 'BuyBackAmount');
                }
            };

            const addBuyBackCollapse = function () {
                if (isAllowBA !== null) {
                    clear('#btnBuyBackCollapse');
                    let $container = $(grid).closest('.ui-jqgrid-view')
                            .find('.ui-jqgrid-htable .ui-jqgrid-labels > .ui-th-column-header');
                    $container = $container[$container.length - (_me.hasCustomerComm ? 3 : 2)];
                    const $button = $('<button class="header-button btnCollapse btn" id="btnBuyBackCollapse">');
                    addToggleButton($container, $button, false, 'BuyBackAmount');
                }
            };

            // Collapsing when loading completed
            addTurnOverCollapse();
            addTurnOverExpand();

            addLicenseeExpand();
            addLicenseeWlCollapse();

            addBuyBackCollapse();
            addBuyBackExpand();
        };

        return _me;
    });