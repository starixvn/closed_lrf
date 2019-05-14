define(['jquery', 'common/site', 'lib/jqgrid/jquery.jqgrid.additional'], function ($, Site, jqGridAdditional) {
    'use strict';

    const setDrillDownLink = function (level, currencyId, custId, datetime, currencyName, cellvalue) {
        const dataDrilldown = {
            level: level,
            currencyId: currencyId,
            custId: custId,
            datetime: datetime,
            currencyName: currencyName
        };

        return '<a class="drilldown" href="javascript:;" data-drill-down=\'' + JSON.stringify(dataDrilldown) + '\'>' + cellvalue + '</a>';
    };
    const currencyFormatter = function (cellvalue, options, rowObject) {
        const level = _me.licenseeId === 1 ? 1 : 2;
        return setDrillDownLink(level, rowObject.CurrencyId, 0, rowObject.Date, rowObject.CurrencyName, cellvalue);
    };
    const systemIdFormatter = function (cellvalue, options, rowObject) {
        return setDrillDownLink(2, rowObject.CurrencyId, rowObject.CustomerId, rowObject.Date, rowObject.CurrencyName, cellvalue);
    };
    const betlistLink = function (cellvalue, options, rowObject) {
        const param = {
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

    const indexColumn = {
        name: 'Index',
        index: 'Index',
        width: 30,
        align: 'center',
        valign: 'middle',
        sorttype: 'int',
        sortable: false,
        resizable: false
    };
    const dateColumn = {
        name: 'Date',
        index: 'Date',
        width: 55,
        align: 'center',
        valign: 'middle',
        sortable: false,
        resizable: false,
        formatter: 'date',
        formatoptions:
        {
            newformat: 'm/d/Y'
        },
        hidden: true
    };
    const externalIdColumn = {
        name: 'ExternalId',
        index: 'ExternalId',
        width: 95,
        align: 'left',
        sortable: false,
        resizable: false
    };
    const systemIdColumn = {
        name: 'SystemId',
        index: 'SystemId',
        width: 120,
        align: 'left',
        sortable: false,
        resizable: false
    };
    const currencyColumn = {
        name: 'CurrencyName',
        index: 'CurrencyName',
        width: 60,
        align: 'center',
        sortable: false,
        resizable: false,
        formatter: currencyFormatter
    };
    const turnoverColumn = {
        name: 'TurnOver',
        index: 'TurnOver',
        width: 90,
        align: 'right',
        sortable: false,
        resizable: false,
        formatter: 'currency',
        hidden: false,
        formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
    };
    const totalTransColumn = {
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
    const customerWlColumn = {
        name: 'CustomerWinLoss',
        index: 'CustomerWinLoss',
        width: 100,
        align: 'right',
        sortable: false,
        resizable: false,
        formatter: jqGridAdditional.formatDecimal
    };
    const playerCommColumn = {
        name: 'CustomerComm',
        index: 'CustomerComm',
        width: 70,
        align: 'right',
        sortable: false,
        resizable: false,
        formatter: jqGridAdditional.formatDecimal
    };
    const customerWlTotalColumn = {
        name: 'CustomerTotal',
        index: 'CustomerTotal',
        width: 90,
        align: 'right',
        sortable: false,
        resizable: false,
        formatter: jqGridAdditional.formatDecimal
    };
    const licenseeWlColumn = {
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
    const LicenseeWlCommColumn = {
        name: 'LicenseeWLComm',
        index: 'LicenseeWLComm',
        width: 70,
        align: 'right',
        sortable: false,
        resizable: false,
        formatter: 'currency',
        formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
    };

    const amtDueToColumn = {
        name: 'AmountDue',
        index: 'AmountDue',
        width: 85,
        align: 'right',
        sortable: false,
        resizable: false,
        formatter: 'currency',
        formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
    };
    const productColumn = {
        name: 'ProductName',
        index: 'productName',
        width: 160,
        sortable: false,
        resizable: false,
        align: 'left',
        hidden: false,
        title: true
    };

    const colNameList = ['#', 'Date', 'ExternalId', 'SystemId', 'Currency', 'Product', 'Turnover',
                'TotalTransaction', '@[Win]/@[Loss]', 'Comm', 'Total', 'LicenseeW_L', 'Comm', 'AmountDue'];
    const colModelList = [indexColumn, dateColumn, externalIdColumn, systemIdColumn, currencyColumn, productColumn, turnoverColumn,
                totalTransColumn, customerWlColumn, playerCommColumn, customerWlTotalColumn,
                 licenseeWlColumn, LicenseeWlCommColumn, amtDueToColumn];

    const _me = {
        licenseeId: 0,
        currencyIndex: 4,
        systemIdIndex: 3,
        externalIdIndex: 2,
        customerWlIndex: 8,
        hasCustomerComm: true,
        HasAmountDueToColumn: true,
        IsAllowBA: true,
        pageSize: 50,
        nonePagingSize: 3000,
        rowNum: 50,
        totalColspan: [1, 2, 3],
        totalColspanFakeLicensee: [1, 2, 2],
        //level 0,1,2
        urlData: 'api/WinLossByProductReport/Index',
        urlExcelData: 'api/WinLossByProductReport/Index',
        gridOption:
        {
            datatype: 'local',
            colNames: [],
            colModel: [],
            data: [],
            height: 'auto',
            autowidth: false,
            forceFit: false,
            shrinkToFit: true,
            loadtext: '',
            loadui: 'disable',
            loadonce: true,
            footerrow: true,
            pager: '#ppdata',
            userDataOnFooter: true,
            userData: [],
            viewrecords: true,
            gridview: true,
            sortname: 'Index',
            rowList: [50, 100, 200, 300, 400, 500, 1000, 2000]
        }
    };

    _me.getColName = function () {
        // Column Customer Wl
        colNameList[_me.customerWlIndex] = _me.hasCustomerComm ? '@[Win]/@[Loss]' : 'CustomerW_L';
        return Site.getResources(colNameList);
    };

    _me.getColModel = function (level, reportBy) {
        const levelNumber = Number(level);
        amtDueToColumn.hidden = !_me.HasAmountDueToColumn;
        // Column hidden by customer comm
        customerWlTotalColumn.hidden = !_me.hasCustomerComm;
        playerCommColumn.hidden = !_me.hasCustomerComm;
        LicenseeWlCommColumn.hidden = !_me.IsAllowBA;
        // Column hidden by level
        currencyColumn.formatter = levelNumber === 0 ? currencyFormatter : null;
        systemIdColumn.formatter = levelNumber === 1 ? systemIdFormatter : null;

        dateColumn.hidden = levelNumber > 0;
        externalIdColumn.hidden = levelNumber < 2;
        systemIdColumn.hidden = levelNumber === 0 || Site.isFakeLicensee();

        if (levelNumber === 2) {
            externalIdColumn.formatter = betlistLink;
            systemIdColumn.formatter = betlistLink;
        }

        if (Number(reportBy) === 2) {
            dateColumn.formatoptions = {
                newformat: 'm/Y'
            };
        } else {
            dateColumn.formatoptions = {
                newformat: 'm/d/Y'
            };
        }
        return colModelList;
    };

    _me.getGridOption = function (level, reportBy) {
        _me.gridOption.colNames = _me.getColName();
        _me.gridOption.colModel = _me.getColModel(level, reportBy);

        if (level === 0) {
            _me.gridOption.grouping = true;
            _me.gridOption.groupingView = {
                groupField: ['Date'],
                groupColumnShow: [false],
                plusicon: 'ui-icon-circlesmall-plus icon-arrow',
                minusicon: 'ui-icon-circlesmall-minus icon-arrow'
            };
        } else {
            _me.gridOption.grouping = false;
            _me.gridOption.groupingView = null;
        }

        return _me.gridOption;
    };

    _me.getTotalColModel = function (level) {
        const colModel = _me.getColModel(level, -1);
        // Not show drill down link on total link
        const curCol = colModel.filter(function (item) {
            return item.name === 'CurrencyName';
        })[0];

        curCol.formatter = null;
        return colModel;
    };

    return _me;
});