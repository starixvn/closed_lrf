'use strict';
define(['jquery', 'common/site', 'lib/jqgrid/jquery.jqgrid.additional'], function ($, Site, jqGridAdditional) {
    const setDrillDownLink = function (level, currencyId, custId, datetime, cellvalue) {
        const data = {
            level: level,
            currencyId: currencyId,
            custId: custId,
            datetime: datetime
        };
        return '<a class="drilldown" href="javascript:;" data-drilldown=\'' + JSON.stringify(data) + '\'>' + cellvalue + '</a>';
    };

    const currencyFormatter = function (cellvalue, options, rowObject) {
        return setDrillDownLink(1, rowObject.CurrencyId, 0, rowObject.Date, cellvalue);
    };

    const systemIdFormatter = function (cellvalue, options, rowObject) {
        return setDrillDownLink(2, rowObject.CurrencyId, rowObject.CustomerId, rowObject.Date, cellvalue);
    };

    //#region Columns

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
        sortable: false,
        formatter: systemIdFormatter
    };

    const currencyColumn =
    {
        name: 'CurrencyName',
        index: 'CurrencyName',
        width: 60,
        align: 'center',
        sortable: false,
        resizable: false,
        formatter: currencyFormatter
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
      'Turnover', 'TotalTransaction', 'CustomerW_L', 'LicenseeW_L', 'CurrencyId', 'CustomerId'];

    const colModelList = [indexColumn, dateColumn, externalIdColumn, systemIdColumn, currencyColumn,
        turnoverColumn, totalTransColumn, customerWlColumn, licenseeWlColumn, currencyIdColumn, customerIdColumn];

    const _me =
    {
        totalColspan: [2, 2, 3],
        urlData: 'api/AgCasinoWinLossReport/Index',
        urlExcelData: 'api/AgCasinoWinLossReport/Index',
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
        }
    };

    _me.getColName = function () {
        return Site.getResources(colNameList);
    };

    _me.getColModel = function (level) {
        const levelNumber = Number(level);

        currencyColumn.formatter = levelNumber === 0 ? currencyFormatter : null;
        systemIdColumn.formatter = levelNumber === 1 ? systemIdFormatter : null;

        dateColumn.hidden = levelNumber > 0;
        dateColumn.formatoptions =
        {
            newformat: $('#reportbydaily').is(':checked') ? 'm/d/Y' : 'm/Y'
        };
        externalIdColumn.hidden = levelNumber < 2;
        systemIdColumn.hidden = levelNumber === 0;

        const temp = Site.clone(colModelList);
        return temp;
    };

    _me.getGridOption = function (level) {
        _me.gridOption.colNames = _me.getColName();
        _me.gridOption.colModel = _me.getColModel(level);
        return Site.clone(_me.gridOption);
    };

    _me.getTotalColModel = function (level) {
        const colModel = _me.getColModel(level);

        for (let i = 0; i < colModel.length; i++) {
            const item = colModel[i];
            if (item.name === 'CurrencyName') {
                item.formatter = null;
                break;
            }
        }

        return colModel;
    };

    return _me;
});