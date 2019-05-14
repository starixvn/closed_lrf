define(['jquery', 'common/site', 'lib/jqgrid/jquery.jqgrid.additional'],
    function ($, Site, jqGridAdditional) {
        'use strict';

        const indexColumn = {
            key: true,
            name: 'Index',
            index: 'Index',
            resizable: false,
            width: 30,
            align: 'center',
            valign: 'middle',
            sortable: false
        };

        const groupColumn =
        {
            name: 'Group',
            index: 'Group',
            resizable: false,
            width: 90,
            align: 'left',
            sortable: false,
            formatter: function (cellValue, options, rowObject) {
                let newCellValue = cellValue;
                if (Number(rowObject.GroupCommId) === 0) {
                    newCellValue = Site.getSingleResource('None');
                }

                return '<div id="groupName-' + rowObject.CustId + '" style="background-color:' + rowObject.GroupColor +
                         '" class="commission-color">' + newCellValue + '</div>';
            }
        };

        const externalIdColumn =
        {
            name: 'ExternalId',
            index: 'ExternalId',
            resizable: false,
            width: 110,
            align: 'left',
            sortable: false
        };

        const systemIdColumn =
        {
            name: 'SystemId',
            index: 'SystemId',
            resizable: false,
            width: 120,
            align: 'left',
            sortable: false
        };

        const availableFundColumn = {
            name: 'AvailableFunds',
            index: 'AvailableFunds',
            width: 100,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: 'number',
            formatteroptions: { decimalSeparator: '.', thousandsSeparator: ' ', decimalPlaces: 2, defaultValue: '0.00' },
            frozen: true
        };
        const pendingFundColumn = {
            name: 'PendingFunds',
            index: 'PendindFunds',
            resizable: false,
            width: 100,
            align: 'right',
            sortable: false,
            frozen: true,
            formatter: function (cellValue, options, rowObject) {
                const number = Number(cellValue);
                if (number === 0) {
                    return jqGridAdditional.formatDecimal(cellValue);
                }
                else {
                    return '<a href="javascript:;" class="pendingFunds" ' +
                    'data-custid="' + rowObject.CustId + '" data-systemid="' + rowObject.SystemId + '" data-externalid="' + rowObject.ExternalId + '">'
                        + jqGridAdditional.formatDecimal(cellValue) + '</a>';
                }
            }
        };
        const statusColumn =
        {
            name: 'Status',
            index: 'Status',
            resizable: false,
            width: 80,
            align: 'center',
            sortable: false,
            formatter: function (cellValue, options, rowObject) {
                const dataAttribute = ' data-custid="' + rowObject.CustId + '" data-externalid="' + rowObject.ExternalId + '"' +
                                    ' data-issuspended="' + rowObject.IsSuspended + '" data-isclosed="' + rowObject.IsClosed + '"';

                return '<a href="javascript:;" title="' + Site.getSingleResource('Status') +
                    '" class="custStatusOption" id="edit-cust-status-' + rowObject.CustId + '"' + dataAttribute + '>' + cellValue + '</a>';
            }
        };
        const baStatusColumn =
        {
            name: 'BAStatus',
            index: 'BAStatus',
            resizable: false,
            width: 80,
            align: 'left',
            sortable: false,
            formatter: function (cellValue, options, rowObject) {
                const paramString = JSON.stringify({ custId: rowObject.CustId, isAllowBA: !cellValue, externalId: rowObject.ExternalId });
                const title = Site.getSingleResource(cellValue ? 'TurnOffBaTooltip' : 'TurnOnBaTooltip');

                return '<div title="' + title + '"' +
                    ' class="center-align switch ba-' + (cellValue ? 'on' : 'off') + '">' +
                    '<label><input class="baStatus" type="checkbox"' + (cellValue ? ' checked' : '') + ' data-val=\'' + paramString +
                    '\' /><span class="lever"></span><label>' +
                    '</div>';
            }
        };
        const specialLevelColumn = {
            name: 'SpecialLevel',
            index: 'SpecialLevel',
            resizable: false,
            width: 90,
            align: 'center',
            sortable: false,
            frozen: true,
            formatter: function (cellValue, options, rowObject) {
                return '<a href="javascript:;" class="grid-dropdown specialLevel" data-custid="' + rowObject.CustId + '" data-level="' + cellValue + '">'
                    + '<span class="grid-dropdown-item grid-dropdown-label level-' + cellValue + '">'
                    + (Number(cellValue) === 0 ? Site.getSingleResource('None') : cellValue) + '</span>'
                    + '<i class="grid-dropdown-item grid-dropdown-icon icon-arrow text-bold" title="' + Site.getSingleResource('SpecialLevel') + '"></i>'
                    + '</a>';
            }
        };
        const oddsGroupColumn = {
            name: 'OddsGroup',
            index: 'OddsGroup',
            resizable: false,
            width: 90,
            align: 'center',
            sortable: false,
            frozen: true,
            formatter: function (cellValue, options, rowObject) {
                return '<a href="javascript:;" class="grid-dropdown oddsGroup' + (rowObject.BAStatus ? ' disabled' : '')
                + '" data-custid="' + rowObject.CustId + '" data-group="' + cellValue + '">'
                + '<span class="grid-dropdown-item grid-dropdown-label group-' + cellValue + '">'
                + (Number(cellValue) === 0 ? Site.getSingleResource('None') : cellValue) + '</span>'
                + '<i class="grid-dropdown-item grid-dropdown-icon icon-arrow text-bold" title="' + Site.getSingleResource('OddsGroup') + '"></i>'
                + '</a>';
            }
        };
        const customerOptionColumn = {
            name: 'CustomerOption',
            index: 'CustomerOption',
            width: 80,
            align: 'center',
            sortable: false,
            resizable: false,
            frozen: true,
            formatter: function (cellValue, options, rowObject) {
                return '<a href="javascript:;" data-systemid="' + rowObject.SystemId +
                    '" data-externalid="' + rowObject.ExternalId + '" data-custid="' + rowObject.CustId
                    + '" title="' + Site.getSingleResource('CustomerOption') + '" class="custoptionlink" id="cust-option-link-' + rowObject.CustId + '">'
                    + Site.getSingleResource('View')
                    + '<i class="grid-dropdown-icon icon-arrow"></i></a>';
            }
        };
        const commissionColumn =
        {
            name: 'Commission',
            index: 'Commission',
            width: 40,
            align: 'right',
            sortable: false,
            resizable: false,
            title: true,
            formatter: 'number',
            formatteroptions: { decimalSeparator: '.', decimalPlaces: 2, defaultValue: '0.00' }
        };
        //#endregion
        const colNameList = ['#', 'ExternalId', 'SystemId', 'AvailableFunds', 'PendingFunds',
         'Status', 'BAStatus', 'SpecialLevel', 'OddsGroup', 'CustomerOption'];

        const colModelList = [indexColumn, externalIdColumn, systemIdColumn, availableFundColumn,
                        pendingFundColumn, statusColumn, baStatusColumn, specialLevelColumn, oddsGroupColumn, customerOptionColumn];

        const me = {
            urlData: 'Customer/CustomerList',
            urlExcelData: 'Customer/ExportExcel',
            gridOption: {
                datatype: 'local',
                colNames: [],
                colModel: [],
                data: [],
                height: 'auto',
                viewrecords: false,
                autowidth: false,
                forceFit: false,
                shrinkToFit: true,
                minWidth: 800,
                loadtext: '',
                loadui: 'disable',
                loadonce: true,
                gridview: true,
                footerrow: false,
                userDataOnFooter: true,
                scroll: 1,
                rowNum: 40,
                cmTemplate: { title: true }, //enable tooltip
                userData: [],
                beforeSelectRow: function () {
                    return false;
                },
                onRightClickRow: function () {
                    return false;
                }
            }
        };

        const PRODUCTS = [
            { Code: 'SB', Display: 'SB' },
            { Code: 'NG', Display: 'NG' },
            { Code: 'LC', Display: 'LC' },
            { Code: 'CS', Display: 'CS' }];
        let numOfProductColumns = 0;
        let firstProductCode;

        const getColName = function (productList, isAllowedCustomerCommission) {
            numOfProductColumns = 1;
            const temp = Site.clone(colNameList);
            if (isAllowedCustomerCommission) {
                temp.insertAfter('Group', 0);

                firstProductCode = null;
                for (let i = 0; i < PRODUCTS.length; i++) {
                    const product = PRODUCTS[i];
                    if (productList.indexOf(product.Code) >= 0) {
                        if (!firstProductCode) {
                            firstProductCode = product.Code.toUpperCase();
                        }

                        numOfProductColumns++;
                        temp.push(Site.getSingleResource(product.Display));
                    }
                }
            }

            return Site.getResources(temp);
        };

        const getColModel = function (productList, isAllowedCustomerCommission) {
            const temp = Site.clone(colModelList);

            if (isAllowedCustomerCommission) {
                const getCellAttrFunction = function (colName) {
                    return function (rowId, val, rowObj) {
                        return ' id="' + colName + '-' + rowObj.CustId + '" ';
                    };
                };

                let col = Site.clone(groupColumn);
                temp.insertAfter(col, 0);

                $.each(PRODUCTS, function (index, value) {
                    if (productList.indexOf(value.Code) >= 0) {
                        col = Site.clone(commissionColumn);
                        col.name = value.Code + 'Comm';
                        col.index = col.name;
                        col.cellattr = getCellAttrFunction(col.name);
                        temp.push(col);
                    }
                });
            }

            return temp;
        };

        me.setGroupHeaderColumns = function (grid) {
            grid.jqGrid('setGroupHeaders',
            {
                useColSpanStyle: true,
                groupHeaders: [{
                    startColumnName: firstProductCode + 'Comm',
                    numberOfColumns: numOfProductColumns,
                    titleText: Site.getSingleResource('Commission') + ' (%)'
                }]
            });
        };

        me.getGridOption = function (productList, isAllowedCustomerCommission) {
            me.gridOption.colNames = getColName(productList, isAllowedCustomerCommission);
            me.gridOption.colModel = getColModel(productList, isAllowedCustomerCommission);
            return me.gridOption;
        };

        return me;
    });