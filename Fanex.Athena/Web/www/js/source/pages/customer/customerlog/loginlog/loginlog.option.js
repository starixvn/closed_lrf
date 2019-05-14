'use strict';
define([], function () {
    const userNameColumn = {
        name: 'UserName',
        index: 'UserName',
        resizable: false,
        width: 150,
        align: 'left',
        valign: 'middle',
        sortable: true
    };
    const createdDateColumn = {
        name: 'CreatedDate',
        index: 'CreatedDate',
        resizable: false,
        width: 100,
        align: 'center',
        valign: 'middle',
        sortable: false,
        formatter: 'date',
        formatoptions:
        {
            srcformat: 'Y-m-d h:i:s A',
            newformat: 'n/j/Y h:i:s A'
        }
    };
    const lastTxnColumn = {
        name: 'LastTxn',
        index: 'LastTxn',
        resizable: false,
        width: 100,
        align: 'center',
        sortable: false,
        formatter: 'date',
        formatoptions:
        {
            srcformat: 'Y-m-d h:i:s A',
            newformat: 'n/j/Y h:i:s A'
        }
    };

    const colNameList = ['Username', 'CreatedDate', 'LastTxn'];
    const colModelList = [userNameColumn, createdDateColumn, lastTxnColumn];

    const _me = {
        gridOption: {
            rownumbers: true,
            datatype: 'local',
            height: 'auto',
            colNames: [],
            colModel: colModelList,
            rowNum: 50,
            rowList: [50, 100, 200, 300, 400, 500, 1000, 2000],
            viewrecords: true,
            loadui: 'disable',
            autowidth: false,
            forceFit: false,
            shrinkToFit: true,
            scroll: false,
            loadonce: true,
            gridview: true,
            sortorder: 'desc',
            pager: null,
            loadtext: ''
        },

        getColNames: function () {
            return colNameList;
        }
    };

    return _me;
});