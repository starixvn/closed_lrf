'use strict';
define([], function () {
    const logIdColumn = {
        name: 'LogId',
        index: 'LogId',
        resizable: false,
        width: 62,
        align: 'center',
        sortable: false
    };
    const logDateColumn = {
        name: 'LogDate',
        index: 'LogDate',
        resizable: false,
        width: 80,
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
    const editedByColumn = {
        name: 'EditedBy',
        index: 'EditedBy',
        resizable: false,
        width: 80,
        align: 'center',
        valign: 'middle',
        sortable: true
    };
    const actionColumn = {
        name: 'ActionName',
        index: 'ActionName',
        resizable: false,
        width: 150,
        align: 'left',
        sortable: false
    };
    const detailColumn = {
        name: 'Details',
        index: 'Details',
        resizable: false,
        width: 500,
        align: 'center',
        title: false,
        sortable: false,
        classes: 'jqgrid-detail-col'
    };

    const colNameList = ['LogID', 'LogDate', 'Editedby', 'Action', 'Details'];
    const colModelList = [logIdColumn, logDateColumn, editedByColumn, actionColumn, detailColumn];

    const _me = {
        gridOption: {
            height: 'auto',
            datatype: 'local',
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
            pager: '#ppdata',
            loadtext: ''
        },

        getColNames: function () {
            return colNameList;
        }
    };

    return _me;
});