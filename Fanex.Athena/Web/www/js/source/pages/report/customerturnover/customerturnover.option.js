define(['common/site', 'lib/jqgrid/jquery.jqgrid.additional'],
    function (Site, jqGridAdditional) {
        'use strict';
        const indexColumn = {
            name: 'Index',
            index: 'Index',
            width: 30,
            align: 'center',
            valign: 'middle',
            sortable: false,
            resizable: false,
            frozen: true,
            cellattr: jqGridAdditional.rowSpanSetting
        };
        const dateColumn = {
            name: 'ReportBy',
            index: 'ReportBy',
            width: 60,
            align: 'center',
            valign: 'middle',
            sortable: false,
            resizable: false,
            frozen: true,
            cellattr: jqGridAdditional.rowSpanSetting,
            formatter: 'date',
            formatoptions:
            {
                newformat: 'm/d/Y'
            }
        };
        const userNameColumn = {
            name: 'UserName',
            index: 'UserName',
            width: 85,
            align: 'left',
            sortable: false,
            frozen: true,
            resizable: false,
            cellattr: jqGridAdditional.rowSpanSetting
        };
        const currencyColumn = {
            name: 'Currency',
            index: 'Currency',
            width: 50,
            align: 'center',
            sortable: false,
            resizable: false,
            frozen: true,
            cellattr: jqGridAdditional.rowSpanSetting
        };
        const sportColumn = {
            name: 'SportType',
            index: 'SportType',
            width: 110,
            align: 'left',
            sortable: false,
            resizable: false,
            frozen: true,
            cellattr: jqGridAdditional.rowSpanSetting2
        };
        const bettypeColumn = {
            name: 'Bettype',
            index: 'Bettype',
            width: 140,
            align: 'left',
            sortable: false,
            resizable: false,
            frozen: true
        };
        const effectiveBettingVlueColumn = {
            name: 'EffectiveBettingValue',
            index: 'EffectiveBettingValue',
            width: 90,
            align: 'right',
            sortable: false,
            resizable: false,
            frozen: true,
            formatter: jqGridAdditional.formatDecimal
        };
        const totalTransColumn = {
            name: 'TotalTransactions',
            index: 'TotalTransactions',
            width: 65,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: 'integer',
            frozen: true,
            formatoptions:
            {
                thousandsSeparator: ','
            }
        };
        const turnoverColumn = {
            name: 'Turnover',
            index: 'Turnover',
            resizable: false,
            width: 90,
            align: 'right',
            sortable: false,
            frozen: true,
            formatter: jqGridAdditional.formatDecimal
        };
        const totalturnoverColumn = {
            name: 'TotalTurnover',
            index: 'TotalTurnover',
            resizable: false,
            width: 90,
            align: 'right',
            sortable: false,
            frozen: true,
            cellattr: jqGridAdditional.rowSpanSetting,
            formatter: jqGridAdditional.formatDecimal
        };
        const customerWlColumn = {
            name: 'CustomerWinLoss',
            index: 'CustomerWinLoss',
            width: 90,
            align: 'right',
            sortable: false,
            resizable: false,
            frozen: true,
            formatter: jqGridAdditional.formatDecimal
        };
        const playerCommColumn = {
            name: 'CustomerComm',
            index: 'CustomerComm',
            width: 50,
            align: 'right',
            sortable: false,
            resizable: false,
            frozen: true,
            formatter: jqGridAdditional.formatDecimal
        };
        const customerWlTotalColumn = {
            name: 'CustomerTotal',
            index: 'CustomerTotal',
            width: 90,
            align: 'right',
            sortable: false,
            resizable: false,
            frozen: true,
            formatter: jqGridAdditional.formatDecimal
        };
        //#endregion
        const colNameList = ['#', 'Date', 'Username', 'Currency', 'Sport', 'BetType', 'EffectiveBettingValue',
        'TotalTransaction', 'Turnover', 'TotalTurnover', '@[Win]/@[Loss]', 'Comm', 'Total'];

        const colModelList = [indexColumn, dateColumn, userNameColumn, currencyColumn, sportColumn, bettypeColumn,
                        effectiveBettingVlueColumn, totalTransColumn, turnoverColumn, totalturnoverColumn,
                        customerWlColumn, playerCommColumn, customerWlTotalColumn];
        const customerWlTotalIndex = 12;

        const _me = {
            urlData: 'reportapi/CustomerTurnover',
            hasCustomerComm: false,
            totalColspan: 6,
            reportBy: 1, //1:daily ,2 :monthly,
            gridOption: {
                datatype: 'local',
                colNames: [],
                colModel: [],
                data: [],
                height: '100%',
                viewrecords: true,
                autowidth: false,
                forceFit: false,
                shrinkToFit: true,
                loadtext: '',
                loadui: 'disable',
                loadonce: true,
                gridview: true,
                footerrow: true,
                userDataOnFooter: false,
                userData: []
            }
        };

        _me.getColName = function () {
            // Column Customer Wl
            colNameList[customerWlTotalIndex] = _me.hasCustomerComm ? 'Total' : 'CustomerW_L';
            return Site.getResources(colNameList);
        };

        _me.getColModel = function () {
            // Column hidden by customer comm
            customerWlColumn.hidden = !_me.hasCustomerComm;
            playerCommColumn.hidden = !_me.hasCustomerComm;

            dateColumn.formatoptions = Number(_me.reportBy) === 2 ? {
                newformat: 'm/Y'
            } : {
                newformat: 'm/d/Y'
            };

            return colModelList;
        };

        _me.getGridOption = function () {
            const option = Site.clone(_me.gridOption);
            option.colNames = _me.getColName();
            option.colModel = _me.getColModel();

            return option;
        };

        return _me;
    });