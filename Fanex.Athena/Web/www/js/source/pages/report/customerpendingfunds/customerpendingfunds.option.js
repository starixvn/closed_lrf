define(['jquery', 'common/site', 'lib/jqgrid/jquery.jqgrid.additional'],
    function ($, Site, jqGridAdditional) {
        'use strict';
        const betlistLink = function (cellvalue, options, rowObject) {
            const param =
            {
                CustId: rowObject.CustId,
                ExternalId: rowObject.ExternalId,
                SystemId: rowObject.SystemId
            };

            return '<a class="bet-list-link" href="javascript:;" data-drill-down=\'' + JSON.stringify(param) + '\'>' + cellvalue + '</a>';
        };

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

        const externalIdColumn =
        {
            name: 'ExternalId',
            index: 'ExternalId',
            resizable: false,
            width: 200,
            align: 'left',
            valign: 'middle',
            sortable: true,
            formatter: betlistLink,
            cellattr: function () {
                return ' style="text-overflow: ellipsis"';
            }
        };

        const systemIdColumn =
        {
            name: 'SystemId',
            index: 'SystemId',
            resizable: false,
            width: 200,
            align: 'left',
            valign: 'middle',
            sortable: true
        };

        const betCountsColumn =
        {
            name: 'BetCounts',
            index: 'BetCounts',
            width: 120,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: 'integer',
            formatoptions:
            {
                thousandsSeparator: ','
            }
        };

        const pendingFundsColumn =
        {
            name: 'PendingFunds',
            index: 'PendingFunds',
            width: 115,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const colNameList = [
            '#',
            'ExternalId',
            'SystemId',
            'BetCounts',
            'PendingFunds'
        ];

        const colModelList = [
            indexColumn,
            externalIdColumn,
            systemIdColumn,
            betCountsColumn,
            pendingFundsColumn
        ];

        const _me =
        {
            urlData: 'api/CustomerPendingFundsReport/Index',
            urlExcelData: 'api/CustomerPendingFundsReport/ExportExcel',
            totalColspan: 3,
            totalColspanFakeLicensee: 2,
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
                userDataOnFooter: false,
                gridview: true,
                sortable: false
            },

            getGridOption: function (totalRows) {
                _me.gridOption.colNames = _me.getColName();
                _me.gridOption.colModel = _me.getColModel(totalRows);
                return Site.clone(_me.gridOption);
            },

            getColName: function () {
                return Site.getResources(colNameList);
            },

            getColModel: function (totalRows) {
                systemIdColumn.hidden = Site.isFakeLicensee();

                const colModels = Site.clone(colModelList);
                
                if (totalRows <= 1) {
                    $.each(colModels, function (index, item) {
                        item.sortable = false;
                    });
                }

                return colModels;
            },
        };

        return _me;
    });