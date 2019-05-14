'use strict';
define(['jquery', 'common/site'], function ($, Site) {
    const indexColumn =
    {
        name: 'Index',
        index: 'Index',
        resizable: false,
        width: 40,
        align: 'center',
        valign: 'middle',
        sortable: false
    };

    const sportNameColumn =
    {
        name: 'SportName',
        index: 'SportName',
        width: 180,
        align: 'left',
        sortable: true,
        resizable: false
    };

    const numOfMatchColumn =
    {
        width: 90,
        sortable: true,
        resizable: false,
        align: 'right',
        title: true,
        formatter: 'integer',
        formatoptions:
        {
            thousandsSeparator: ','
        }
    };

    const colNameList = ['#', 'Sport'];

    const colModelList = [indexColumn, sportNameColumn];

    const _me = {
        urlData: 'api/WeeklyLiveMatchReport/index',
        urlExcelData: 'api/WeeklyLiveMatchReport/index',
        gridOption:
        {
            rowNum: 500,
            datatype: 'local',
            height: '100%',
            autowidth: false,
            forceFit: false,
            shrinkToFit: true,
            minWidth: 450,
            loadui: 'disable',
            loadonce: true,
            footerrow: true,
            userDataOnFooter: true,
            viewrecords: true,
            gridview: true,
            rownumbers: false,
            localReader: {
                repeatitems: true,
                cell: 'Cell',
                id: 'Index'
            }
        }
    };

    _me.getGridOption = function (numOfWeek, weekHeaders) {
        const columnModels = Site.clone(colModelList);
        const columnNames = Site.clone(colNameList);
        for (let i = 0; i < numOfWeek; i++) {
            columnNames.push(weekHeaders[i]);

            const column = Site.clone(numOfMatchColumn);
            column.name = 'Week' + i;
            column.index = column.name;

            columnModels.push(column);
        }

        _me.gridOption.colNames = Site.getResources(columnNames);
        _me.gridOption.colModel = columnModels;

        return Site.clone(_me.gridOption);
    };

    return _me;
});