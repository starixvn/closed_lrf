'use strict';
define(['jquery', 'common/site', 'lib/jqgrid/jquery.jqgrid.additional'], function ($, Site, jqGridAdditional) {
    const setDrillDownLink = function (level, currencyId, custId, datetime, cellvalue) {
        return '<a class="drilldown" href="javascript:;" onclick="return cashoutDrillDown(' + level + ',' +
         currencyId + ',' + custId + ',\'' + datetime + '\');">' + cellvalue + '</a>';
    };
    const dateFormatter = function (cellvalue, options, rowObject) {
        const newCellvalue = $.fn.fmatter.call(this, 'date', cellvalue, options, rowObject);
        return setDrillDownLink(1, 0, 0, rowObject.Date, newCellvalue);
    };
    const currencyFormatter = function (cellvalue, options, rowObject) {
        return setDrillDownLink(1, rowObject.CurrencyId, 0, rowObject.Date, cellvalue);
    };

    const betlistLink = function (cellvalue, options, rowObject) {
        const param =
        {
            DrillDownDate: rowObject.Date,
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
        frozen: true,
        cellattr: jqGridAdditional.rowSpanSetting,
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
        sortable: false,
        frozen: true,
        cellattr: jqGridAdditional.rowSpanSetting,
        formatter: dateFormatter,
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
        sortable: false,
        formatter: betlistLink
    };

    const systemIdColumn =
    {
        name: 'SystemId',
        index: 'SystemId',
        resizable: false,
        width: 150,
        align: 'left',
        sortable: false,
        formatter: betlistLink
    };

    const currencyColumn =
    {
        name: 'CurrencyName',
        index: 'CurrencyName',
        width: 80,
        align: 'center',
        sortable: false,
        resizable: false,
        formatter: currencyFormatter
    };

    const cashOutTimesColumn =
    {
        name: 'CashOutTimes',
        index: 'CashOutTimes',
        width: 120,
        align: 'right',
        sortable: false,
        resizable: false,
        formatter: 'integer',
        hidden: false
    };

    const cashOutTicketsColumn =
    {
        name: 'CashOutTickets',
        index: 'CashOutTickets',
        width: 100,
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

    const cashOutValueColumn =
    {
        name: 'CashOutValue',
        index: 'CashOutValue',
        width: 120,
        align: 'right',
        sortable: false,
        resizable: false,
        formatter: jqGridAdditional.formatDecimal
    };

    const buyBackAmoutSBColumn =
    {
        name: 'BuyBackAmountSB',
        index: 'BuyBackAmountSB',
        width: 90,
        align: 'right',
        sortable: false,
        resizable: false,
        formatter: 'currency',
        hidden: false,
        formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
    };

    const buyBackAmoutBAColumn =
    {
        name: 'BuyBackAmountBA',
        index: 'BuyBackAmountBA',
        width: 100,
        align: 'right',
        sortable: false,
        resizable: false,
        formatter: 'currency',
        hidden: false,
        formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
    };

    const buyBackAmoutTotalColumn =
    {
        name: 'TotalBuyBackAmount',
        index: 'TotalBuyBackAmount',
        width: 100,
        align: 'right',
        sortable: false,
        resizable: false,
        formatter: 'currency',
        hidden: false,
        formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
    };

    const ticketPayoutColumn =
    {
        name: 'TicketPayout',
        index: 'TicketPayout',
        width: 100,
        align: 'right',
        sortable: false,
        resizable: false,
        formatter: jqGridAdditional.formatDecimal
    };

    const cashOutCommissionColumn =
    {
        name: 'CashOutCommission',
        index: 'CashOutCommission',
        width: 90,
        align: 'right',
        sortable: false,
        resizable: false,
        formatter: jqGridAdditional.formatDecimal
    };

    const settleAmountTicketPayoutColumn =
    {
        name: 'SettleAmountTicketPayout',
        index: 'SettleAmountTicketPayout',
        width: 100,
        align: 'right',
        sortable: false,
        resizable: false,
        formatter: 'currency',
        hidden: false,
        formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
    };

    const settleAmountBuyBackCommColumn =
    {
        name: 'SettleAmountBuyBackComm',
        index: 'SettleAmountBuyBackComm',
        width: 100,
        align: 'right',
        sortable: false,
        resizable: false,
        formatter: 'currency',
        hidden: false,
        formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
    };

    const settleAmountTotalColumn =
    {
        name: 'SettleAmountTotal',
        index: 'SettleAmountTotal',
        width: 100,
        align: 'right',
        sortable: false,
        resizable: false,
        formatter: 'currency',
        hidden: false,
        formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
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

    //#endregion

    const colNameList = ['#', 'Date', 'ExternalId', 'SystemId', 'Currency',
      'CashOutTimes', 'CashOutTickets', 'CashOutValue','ProductSB', 'ProductBA', 'Total', 'TicketPayout', 'CashOutCommission',
      'TicketPayout', 'BBAmtComm', 'Total', 'CurrencyId', 'CustomerId'];

    const colModelList = [indexColumn, dateColumn, externalIdColumn, systemIdColumn, currencyColumn,
        cashOutTimesColumn, cashOutTicketsColumn, cashOutValueColumn, buyBackAmoutSBColumn, buyBackAmoutBAColumn, buyBackAmoutTotalColumn,
        ticketPayoutColumn, cashOutCommissionColumn, settleAmountTicketPayoutColumn, settleAmountBuyBackCommColumn,
        settleAmountTotalColumn, currencyIdColumn, customerIdColumn];

    const _me = {
        isLicenseeOfferBA: false,
        buyBackAmountTotalColumnIndex: 10,
        totalColspan: [2, 3],
        urlData: 'api/CashOutWinLossReport/Index',
        urlExcelData: 'api/CashOutWinLossReport/Index',
        gridOption:
        {
            datatype: 'local',
            colNames: [],
            colModel: [],
            data: [],
            userDataOnFooter: true,
            userData: [],
            height: '100%',
            autowidth: false,
            forceFit: false,
            shrinkToFit: true,
            loadtext: '',
            loadui: 'disable',
            loadonce: true,
            footerrow: true,
            rowNum: 2000,
            grouping: true,
            viewrecords: true,
            gridview: true,
            pager: '#ppdata',
            rownumbers: true
        },

        setGroupHeaders: function ($grid) {
            const groupBuyBackAmount = _me.isLicenseeOfferBA ?
            {
                startColumnName: 'BuyBackAmountSB',
                numberOfColumns: 3,
                titleText: Site.getSingleResource('BuyBackAmount')
            } : {};
            const groupSettleAmount = {
                startColumnName: 'SettleAmountTicketPayout',
                numberOfColumns: 3,
                titleText: Site.getSingleResource('SettleAmount')
            };
            $grid.jqGrid('setGroupHeaders', {
                useColSpanStyle: true,
                groupHeaders: [groupBuyBackAmount, groupSettleAmount]
            });
        },

        getColName: function () {
            const temp = Site.clone(colNameList);
            if (!_me.isLicenseeOfferBA) {
                temp[_me.buyBackAmountTotalColumnIndex] = 'BuyBackAmount';
            }

            return Site.getResources(temp);
        },

        getColModel: function (level) {
            const levelNumber = Number(level);

            currencyColumn.formatter = levelNumber === 0 ? currencyFormatter : null;

            dateColumn.hidden = levelNumber > 0;
            dateColumn.formatoptions =
            {
                newformat: $('#reportbydaily').is(':checked') ? 'm/d/Y' : 'm/Y'
            };
            externalIdColumn.hidden = levelNumber === 0;
            systemIdColumn.hidden = levelNumber === 0;
            if (!_me.isLicenseeOfferBA) {
                buyBackAmoutSBColumn.hidden = true;
                buyBackAmoutBAColumn.hidden = true;
            }

            const temp = Site.clone(colModelList);
            return temp;
        },

        getGridOption: function (level) {
            _me.gridOption.colNames = _me.getColName();
            _me.gridOption.colModel = _me.getColModel(level);
            return Site.clone(_me.gridOption);
        },

        getTotalColModel: function (level) {
            const colModel = _me.getColModel(level);
            // Not show drill down link on total link
            const currencyNameCol = colModel.filter(function (item) {
                return item.name === 'CurrencyName';
            })[0];

            currencyNameCol.formatter = null;

            return colModel;
        }
    };

    return _me;
});