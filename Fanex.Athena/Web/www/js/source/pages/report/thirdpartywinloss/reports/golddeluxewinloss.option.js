define(['lib/jqgrid/jquery.jqgrid.additional', '../common/thirdpartywinloss.option'],
    function (jqGridAdditional, ThirdPartyWinLossOption) {
        'use strict';

        const LICENSEE_12BET = 1;
        const REPORT_BY_DAILY = 1;

        const indexColumn =
        {
            name: 'Index',
            index: 'Index',
            resizable: false,
            width: 30,
            align: 'center',
            valign: 'middle',
            frozen: true,
            cellattr: jqGridAdditional.rowSpanSetting,
            sortable: false
        };

        const dateColumn =
        {
            name: 'Date',
            index: 'Date',
            resizable: false,
            width: 55,
            align: 'center',
            valign: 'middle',
            sortable: false,
            frozen: true,
            cellattr: jqGridAdditional.rowSpanSetting,
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

        const currencyColumn =
        {
            name: 'CurrencyName',
            index: 'CurrencyName',
            width: 60,
            align: 'center',
            sortable: false,
            resizable: false
        };

        const turnoverColumn =
        {
            name: 'TurnOver',
            index: 'TurnOver',
            width: 75,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: 'currency',
            hidden: false,
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const totalTransColumn =
        {
            name: 'TotalTransaction',
            index: 'TotalTransaction',
            width: 75,
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

        const customerWlColumn =
        {
            name: 'CustomerWinLoss',
            index: 'CustomerWinLoss',
            width: 90,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: jqGridAdditional.formatDecimal
        };

        const licenseeWlColumn =
        {
            name: 'LicenseeWL',
            index: 'LicenseeWL',
            width: 100,
            align: 'right',
            sortable: false,
            resizable: false,
            hidden: false,
            title: true,
            formatter: jqGridAdditional.formatLicenseeWl
        };

        const tipsAmountColumn =
        {
            name: 'TipAmount',
            index: 'TipAmount',
            width: 100,
            align: 'right',
            sortable: false,
            resizable: false,
            hidden: false,
            title: true,
            formatter: jqGridAdditional.formatDecimal
        };

        const tipsSharingColumn =
        {
            name: 'TipSharing',
            index: 'TipSharing',
            width: 100,
            align: 'right',
            sortable: false,
            resizable: false,
            hidden: false,
            title: true,
            formatter: jqGridAdditional.formatDecimal
        };

        const amountDueColumn =
        {
            name: 'AmountDue',
            index: 'AmountDue',
            width: 100,
            align: 'right',
            sortable: false,
            resizable: false,
            hidden: false,
            title: true,
            formatter: jqGridAdditional.formatDecimal
        };

        const currencyIdColumn =
        {
            name: 'CurrencyId',
            index: 'CurrencyId',
            width: 2,
            align: 'center',
            sortable: false,
            resizable: false,
            hidden: true
        };

        const customerIdColumn =
        {
            name: 'CustomerId',
            index: 'CustomerId',
            width: 2,
            align: 'center',
            sortable: false,
            resizable: false,
            hidden: true
        };

        const colNameList = ['#', 'Date', 'ExternalId', 'SystemId', 'Currency',
            'Turnover', 'TotalTransaction', 'CustomerW_L', 'LicenseeW_L',
            'TipAmount', 'TipSharing', 'AmountDue', 'CurrencyId', 'CustomerId'];

        const colModelList = [indexColumn, dateColumn, externalIdColumn, systemIdColumn, currencyColumn,
            turnoverColumn, totalTransColumn, customerWlColumn, licenseeWlColumn,
            tipsAmountColumn, tipsSharingColumn, amountDueColumn, currencyIdColumn, customerIdColumn];

        const _me = new ThirdPartyWinLossOption({
            TotalColspan: [2, 2, 3],
            UrlData: 'api/GoldDeluxeWinLossReport/Index',
            UrlExcelData: 'api/GoldDeluxeWinLossReport/Index',
            ColNameList: colNameList,
            ColModelList: colModelList
        });

        _me.getColModel = function (level, reportBy) {
            const levelNumber = Number(level);
            dateColumn.hidden = levelNumber > 0;
            dateColumn.formatoptions =
            {
                newformat: parseInt(reportBy, 10) === REPORT_BY_DAILY ? 'm/d/Y' : 'm/Y'
            };

            currencyColumn.formatter = levelNumber === 0 ? function (cellvalue, options, rowObject) {
                const drilldownLevel = _me.licenseeId === LICENSEE_12BET ? 1 : 2;
                return _me.currencyFormatter(cellvalue, options, rowObject, drilldownLevel);
            } : null;
            systemIdColumn.formatter = levelNumber === 1 ? _me.systemIdFormatter : null;

            externalIdColumn.hidden = levelNumber < 2;
            systemIdColumn.hidden = levelNumber === 0;
            return ThirdPartyWinLossOption.prototype.getColModel.call(this);
        };

        return _me;
    });