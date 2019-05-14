define(['jquery', 'common/site', 'lib/jqgrid/jquery.jqgrid.additional'], function ($, Site, jqGridAdditional) {
    'use strict';

    const setDrillDownLink = function (custId, cellvalue, externalid, systemId) {
        return '<a class="drilldown" href="javascript:;" data-custid="' + custId +
         '" data-externalid="' + externalid + '" data-systemid="' + systemId + '">' + cellvalue + '</a>';
    };

    //#region Columns
    const indexColumn =
        {
            name: 'Index',
            index: 'Index',
            width: 30,
            align: 'center',
            valign: 'middle',
            sortable: false,
            resizable: false
        };
    const externalIdColumn =
    {
        name: 'ExternalId',
        index: 'ExternalId',
        width: 95,
        align: 'left',
        sortable: false,
        resizable: false,
        formatter: function (cellvalue, options, rowObject) {
            return setDrillDownLink(rowObject.CustomerId, cellvalue, rowObject.ExternalId, rowObject.SystemId);
        }
    };
    const systemIdColumn =
    {
        name: 'SystemId',
        index: 'SystemId',
        width: 120,
        align: 'left',
        sortable: false,
        resizable: false,
        formatter: function (cellvalue, options, rowObject) {
            return setDrillDownLink(rowObject.CustomerId, cellvalue, rowObject.ExternalId, rowObject.SystemId);
        }
    };
    const matchColumn =
     {
         name: 'Match',
         index: 'Match',
         width: 90,
         sortable: false,
         resizable: false,
         hidden: false,
         formatter: function (cellvalue, options, rowObject) {
             return rowObject.HomeName + '<br/>' + rowObject.AwayName;
         }
     };
    const turnoverColumn =
        {
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
    const betcountColumn =
        {
            name: 'BetCount',
            index: 'BetCount',
            width: 50,
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
            width: 80,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: jqGridAdditional.formatDecimal
        };

    const licenseeWlColumn =
        {
            name: 'LicenseeWL',
            //classes: 'highlight',
            index: 'LicenseeWL',
            width: 80,
            align: 'right',
            sortable: false,
            resizable: false,
            hidden: false,
            title: true,
            formatter: jqGridAdditional.formatLicenseeWl
        };

    const baCommColumn =
        {
            name: 'BACommission',
            // classes: 'highlight',
            index: 'BACommission',
            width: 80,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };
    const amtDueToColumn =
        {
            name: 'AmountDue',
            index: 'AmountDue',
            width: 80,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

    //#endregion
    const colNames = [
         ['#', 'Match', 'BetCount', 'Turnover', 'CustomerW_L', 'LicenseeW_L', 'BACommission', 'AmtDueTo'],
         ['#', 'ExternalID', 'SystemID', 'BetCount', 'Turnover', 'CustomerW_L', 'LicenseeW_L', 'BACommission']
    ];

    const colModels = [
        [indexColumn, matchColumn, betcountColumn, turnoverColumn, customerWlColumn, licenseeWlColumn, baCommColumn, amtDueToColumn],
        [indexColumn, externalIdColumn, systemIdColumn, betcountColumn, turnoverColumn, customerWlColumn, licenseeWlColumn, baCommColumn]
    ];

    const me = {
        HasAmountDueToColumn: true,
        currencyIndex: 4,
        systemIdIndex: 3,
        externalIdIndex: 2,
        customerWlTotalIndex: 10,
        pageSize: 50,
        nonePagingSize: 2000,
        rowNum: 50,
        totalColspan: [1, 2, 3],
        //level 0,1,2
        urlData: 'api/WinLossByLeagueReport/Index',
        urlExcelData: 'api/WinLossByLeagueReport/Index',
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
            userDataOnFooter: true,
            userData: [],
            viewrecords: true,
            gridview: true,
            rowList: [50, 100, 200, 300, 400, 500, 1000, 2000]
        }
    };

    //# getGidOptionregion

    me.getColName = function (level) {
        return Site.getResources(colNames[level]);
    };

    me.getColModel = function (level) {
        amtDueToColumn.hidden = !me.HasAmountDueToColumn;
        return colModels[level];
    };

    me.getGridOption = function (level) {
        me.gridOption.colNames = me.getColName(level);
        me.gridOption.colModel = me.getColModel(level);
        return me.gridOption;
    };
    //#end

    me.addLeagueGroupRow = function (leagueid, leagueName) {
        const $grid = $('#ReportGrid');
        const $row = $grid.find('tr.jqgrow:first');
        $row.before('<tr><td colspan=8>&nbsp;&nbsp;&nbsp; <a id="leagueHeader" data-leagueid="' + leagueid
            + '" href="javascript:;">' + leagueName + '</a></td></tr>');
    };

    return me;
});