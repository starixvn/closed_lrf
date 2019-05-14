define(['jquery', 'common/site'], function ($, Site) {
    'use strict';

    const dateColumn =
    {
        name: 'TransactionDate',
        index: 'TransactionDate',
        resizable: false,
        width: 70,
        align: 'center',
        valign: 'middle',
        sortable: true,
        formatter: 'date',
        formatoptions:
        {
            newformat: 'm/Y'
        }
    };

    const numMemberColumn =
    {
        name: 'TotalCustomer',
        index: 'TotalCustomer',
        width: 80,
        align: 'right',
        sortable: true,
        resizable: false,
        formatter: 'integer',
        frozen: true,
        formatoptions:
        {
            thousandsSeparator: ','
        }
    };

    const productColumn =
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

    const colNameList = ['Month', 'Total'];

    const colModelList = [dateColumn, numMemberColumn];

    const _me = {
        dateColumnIndex: 0,
        totalCustomerIndex: 1,
        pageSize: 50,
        urlData: 'api/ActiveCustomerSummaryReport/Index',
        urlExcelData: 'api/ActiveCustomerSummaryReport/Index',
        gridOption:
        {
            datatype: 'local',
            colNames: [],
            colModel: [],
            data: [],
            height: '100%',
            autowidth: false,
            forceFit: false,
            shrinkToFit: true,
            loadtext: '',
            loadui: 'disable',
            loadonce: true,
            footerrow: true,
            gridview: true,
            rownumbers: false,
            rowList: [50, 100, 200, 300, 400, 500, 1000, 2000],
            rowNum: 50,
            pager: '#ppdata',
            recordtext: ''
        },

        getGridOption: function (productOptions, totalRows) {
            const columnModels = Site.clone(colModelList);
            const columnNames = Site.clone(colNameList);
            let startIndex = _me.dateColumnIndex;

            $.each(productOptions, function (index, value) {
                // columnNames
                columnNames.insertAfter(value.Name, startIndex);

                // columModels
                const column = Site.clone(productColumn);
                column.index = 'CustomerCount.' + value.Code;
                column.name = column.index;

                if (!value.Status) {
                    column.formatter = function () {
                        return '-';
                    };
                    column.sortable = false;
                }

                columnModels.insertAfter(column, startIndex);
                startIndex++;
            });

            if (totalRows <= 1) {
                $.each(columnModels, function (index, value) {
                    value.sortable = false;
                });
            }

            _me.gridOption.colNames = Site.getResources(columnNames);
            _me.gridOption.colModel = columnModels;

            return Site.clone(_me.gridOption);
        },

        setGroupHeaderColumns: function (grid, productOptions) {
            grid.jqGrid('setGroupHeaders',
            {
                useColSpanStyle: true,
                groupHeaders: [{
                    startColumnName: productOptions[0].Code,
                    numberOfColumns: productOptions.length,
                    titleText: Site.getSingleResource('Product')
                }]
            });
        }
    };

    return _me;
});