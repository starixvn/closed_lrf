define(['jquery', 'common/site'],
    function ($, Site) {
        'use strict';

        const externalIdColumn =
        {
            name: 'ExternalId',
            index: 'ExternalId',
            resizable: false,
            width: 200,
            align: 'left',
            sortable: false
        };

        const systemIdColumn =
        {
            name: 'SystemId',
            index: 'SystemId',
            resizable: false,
            width: 200,
            align: 'left',
            sortable: false
        };

        const balanceColumn = {
            name: 'Balance',
            index: 'Balance',
            width: 150,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: 'number',
            formatteroptions: { decimalSeparator: '.', thousandsSeparator: ' ', decimalPlaces: 2, defaultValue: '0.00' },
            frozen: true
        };
        const archivedDateColumn =
        {
            name: 'ArchivedDate',
            index: 'ArchivedDate',
            width: 140,
            align: 'center',
            formatter: 'date',
            sortable: false,
            resizable: false
        };
        //#endregion
        const colNameList = ['ExternalId', 'SystemId', 'Balance', 'ArchivedDate'];

        const colModelList = [externalIdColumn, systemIdColumn, balanceColumn, archivedDateColumn];

        const me = {
            urlData: 'Customer/DormantCustomerList',
            gridOption: {
                datatype: 'local',
                colNames: [],
                colModel: [],
                data: [],
                height: 'auto',
                viewrecords: false,
                autowidth: false,
                forceFit: true,
                shrinkToFit: false,
                minWidth: 300,
                loadtext: '',
                loadui: 'disable',
                loadonce: true,
                gridview: true,
                footerrow: false,
                userDataOnFooter: true,
                cmTemplate: { title: true }, //enable tooltip
                userData: [],
                beforeSelectRow: function () {
                    return false;
                },
                onRightClickRow: function () {
                    return false;
                }
            }
        };

        
        const getColName = function () {
            const temp = Site.clone(colNameList);
            return Site.getResources(temp);
        };

        const getColModel = function () {
            const temp = Site.clone(colModelList);

            return temp;
        };

        me.getGridOption = function () {
            me.gridOption.colNames = getColName();
            me.gridOption.colModel = getColModel();
            return me.gridOption;
        };

        return me;
    });