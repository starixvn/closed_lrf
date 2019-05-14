define(['jquery', 'common/site', 'lib/jqgrid/jquery.jqgrid.additional', '../common/thirdpartywinloss.option'],
    function ($, Site, jqGridAdditional, ThirdPartyWinLossOption) {
        'use strict';

        const REPORT_BY_DAILY = 1;

        const indexColumn = {
            name: 'Index',
            index: 'Index',
            resizable: false,
            width: 30,
            align: 'center',
            valign: 'middle',
            frozen: true,
            sortable: false,
            cellattr: jqGridAdditional.rowSpanSetting
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

        const memWinningColumn =
        {
            name: 'MemberWinning',
            index: 'MemberWinning',
            width: 90,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: jqGridAdditional.formatDecimal
        };

        const cashOutColumn =
        {
            name: 'CashOut',
            index: 'CashOut',
            width: 90,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: jqGridAdditional.formatDecimal
        };

        const cashOutShareColumn =
        {
            name: 'CashOutShare',
            index: 'CashOutShare',
            width: 90,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: jqGridAdditional.formatDecimal
        };

        const commissionShareColumn =
        {
            name: 'CommissionShare',
            index: 'CommissionShare',
            width: 100,
            align: 'right',
            sortable: false,
            resizable: false,
            hidden: false,
            title: true,
            formatter: jqGridAdditional.formatLicenseeWl
        };

        const amountDueToCBColumn =
        {
            name: 'AmountDueToCB',
            index: 'AmountDueToCB',
            width: 90,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: jqGridAdditional.formatDecimal
        };

        const grandPrizeColumn =
        {
            name: 'GrandPrize',
            index: 'GrandPrize',
            width: 90,
            align: 'right',
            sortable: false,
            resizable: false,
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
          'Turnover', 'TotalTransaction', 'CustomerWinnings', 'CashOutAmt', 'CashOutShare', 'CommissionShare',
          'AmountDueToCB', 'AmtGreaterThan30kGBP', 'CurrencyId', 'CustomerId'];

        const colModelList = [indexColumn, dateColumn, externalIdColumn, systemIdColumn, currencyColumn,
            turnoverColumn, totalTransColumn, memWinningColumn, cashOutColumn, cashOutShareColumn, commissionShareColumn,
            amountDueToCBColumn, grandPrizeColumn, currencyIdColumn, customerIdColumn];

        const _me = new ThirdPartyWinLossOption({
            TotalColspan: [2, 3],
            UrlData: 'api/ColossusBetsWinlossReport/Index',
            UrlExcelData: 'api/ColossusBetsWinlossReport/Index',
            ColNameList: colNameList,
            ColModelList: colModelList
        });

        _me.getColModel = function (level, reportBy) {
            const levelNumber = Number(level);

            currencyColumn.formatter = levelNumber === 0 ? function (cellvalue, options, rowObject) {
                const levelNumber = 1;
                return _me.currencyFormatter(cellvalue, options, rowObject, levelNumber);
            } : null;

            dateColumn.hidden = levelNumber > 0;
            dateColumn.formatter = function (cellvalue, options, rowObject) {
                const newCellvalue = $.fn.fmatter.call(this, 'date', cellvalue, options, rowObject);
                return _me.setDrillDownLink(1, 0, 0, rowObject.Date, newCellvalue);
            };
            dateColumn.formatoptions =
            {
                newformat: parseInt(reportBy, 10) === REPORT_BY_DAILY ? 'm/d/Y' : 'm/Y'
            };

            externalIdColumn.hidden = levelNumber === 0;
            systemIdColumn.hidden = levelNumber === 0;

            if (levelNumber === 1) {
                externalIdColumn.formatter = _me.betlistLink;
                systemIdColumn.formatter = _me.betlistLink;
            }
            return ThirdPartyWinLossOption.prototype.getColModel.call(this);
        };

        _me.setGroupHeader = function ($grid) {
            const group = {
                startColumnName: 'MemberWinning',
                numberOfColumns: 2,
                titleText: Site.getSingleResource('AmtLessThan30kGBP')
            };

            $grid.jqGrid('setGroupHeaders',
            {
                useColSpanStyle: true,
                groupHeaders: [group]
            });
        };

        return _me;
    });