define(['jquery', 'common/site', 'lib/jqgrid/jquery.jqgrid.additional'],
    function ($, Site, jqGridAdditional) {
        'use strict';

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
            width: 120,
            align: 'left',
            valign: 'middle',
            sortable: false,
            cellattr: function () {
                return ' style="text-overflow: ellipsis"';
            }
        };

        const systemIdColumn =
        {
            name: 'SystemId',
            index: 'SystemId',
            resizable: false,
            width: 120,
            align: 'left',
            valign: 'middle',
            sortable: false
        };

        const openingBalanceColumn =
        {
            name: 'OpeningBalance',
            index: 'OpeningBalance',
            width: 110,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const depositColumn =
        {
            name: 'Deposit',
            index: 'Deposit',
            width: 90,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const withdrawalColumn =
        {
            name: 'Withdrawal',
            index: 'Withdrawal',
            width: 100,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const bonusColumn =
        {
            name: 'Bonus',
            index: 'Bonus',
            width: 60,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const adjustmentColumn =
        {
            name: 'Adjustment',
            index: 'Adjustment',
            width: 80,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const turnoverColumn =
        {
            name: 'Turnover',
            index: 'Turnover',
            width: 100,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const drawGameColumn =
        {
            name: 'DrawGame',
            index: 'DrawGame',
            width: 100,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const netTurnoverColumn =
        {
            name: 'NetTurnover',
            index: 'NetTurnover',
            width: 100,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const pendingFundsColumn =
        {
            name: 'PendingFunds',
            index: 'PendingFunds',
            width: 100,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const customerWinLossMergeColumn =
        {
            name: 'WinLoss',
            index: 'CustomerW_L',
            width: 200,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const customerWinLossColumn =
        {
            name: 'WinLoss',
            index: 'CustomerWinLoss',
            width: 100,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const customerCommColumn =
        {
            name: 'PlayerComm',
            index: 'CustomerComm',
            width: 80,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const customerTotalColumn =
        {
            name: 'TotalWL',
            index: 'CustomerTotal',
            width: 100,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const closingBalanceColumn =
        {
            name: 'ClosingBalance',
            index: 'ClosingBalance',
            width: 100,
            align: 'right',
            sortable: true,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const affiliateTransferColumn =
        {
            name: 'AffiliateTransfer',
            index: 'AffiliateTransfer',
            width: 100,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const productBATurnoverColumn =
        {
            name: 'TurnoverBA',
            index: 'ProductBATurnover',
            width: 100,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const productBACommColumn =
        {
            name: 'CommBA',
            index: 'ProductBAComm',
            width: 80,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const productBAAmountDueToColumn =
        {
            name: 'AmountDueToBA',
            index: 'ProductBAAmountDueTo',
            width: 100,
            align: 'right',
            sortable: false,
            resizable: false,
            formatter: 'currency',
            formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
        };

        const colNameList = [
        '#',
        'ExternalId',
        'SystemId',
        'OpeningBalance',
        'Deposit',
        'Withdrawal',
        'Bonus',
        'Adjustment',
        'Turnover',
        'DrawGame',
        'NetTurnover',
        'PendingFunds',
        'ClosingBalance',
        'AffiliateTransfer',
        ];

        const colModelList = [
            indexColumn,
            externalIdColumn,
            systemIdColumn,
            openingBalanceColumn,
            depositColumn,
            withdrawalColumn,
            bonusColumn,
            adjustmentColumn,
            turnoverColumn,
            drawGameColumn,
            netTurnoverColumn,
            pendingFundsColumn,
            closingBalanceColumn,
            affiliateTransferColumn
        ];

        const CUSTOMER_WL_COLUMNS_CONFIG = {
            ColModels: [customerWinLossColumn, customerCommColumn, customerTotalColumn],
            ColNames: ['WinLoss', 'Comm', 'Total'],
            ColMergeModel: [customerWinLossMergeColumn],
            ColMergeName: ['CustomerW_L']
        };

        const BA_COLUMNS_CONFIG = {
            ColModels: [productBATurnoverColumn, productBACommColumn, productBAAmountDueToColumn],
            ColNames: ['Turnover', 'Comm', 'AmountDueTo']
        };

        function insertColumns(columns, insertedColumns, insertedIndex) {
            let newInsertedIndex = insertedIndex;
            $.each(insertedColumns, function (index, item) {
                columns.insertAfter(item, newInsertedIndex);
                newInsertedIndex++;
            });
        }

        const _me =
        {
            urlData: 'api/CustomerBalanceReport/Index',
            urlExcelData: 'api/CustomerBalanceReport/ExportExcel',
            hasCustomerComm: true,
            isAllowBA: true,
            customerCommIndex: 11,
            productBAIndex: 13,
            totalColspan: 3,
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
                rownumbers: false,
                sortable: false
            },

            getGridOption: function (totalRows) {
                _me.gridOption.colNames = _me.getColName();
                _me.gridOption.colModel = _me.getColModel(totalRows);
                return Site.clone(_me.gridOption);
            },

            setGroupHeaderColumns: function ($grid) {
                const groupCustomerWinloss = _me.hasCustomerComm ?
                {
                    startColumnName: 'WinLoss',
                    numberOfColumns: 3,
                    titleText: Site.getSingleResource('CustomerW_L')
                } : {};

                const groupProductBA = _me.isAllowBA ?
                {
                    startColumnName: 'TurnoverBA',
                    numberOfColumns: 3,
                    titleText: Site.getSingleResource('ProductBA')
                } : {};

                $grid.jqGrid('setGroupHeaders',
                {
                    useColSpanStyle: true,
                    groupHeaders: [groupCustomerWinloss, groupProductBA]
                });
            },

            getColName: function () {
                const colNames = Site.clone(colNameList);

                if (_me.hasCustomerComm) {
                    insertColumns(colNames, CUSTOMER_WL_COLUMNS_CONFIG.ColNames, _me.customerCommIndex);
                }
                else {
                    insertColumns(colNames, CUSTOMER_WL_COLUMNS_CONFIG.ColMergeName, _me.customerCommIndex);
                }

                _me.productBAIndex = colNames.length - 1;

                if (_me.isAllowBA) {
                    insertColumns(colNames, BA_COLUMNS_CONFIG.ColNames, _me.productBAIndex);
                }

                return Site.getResources(colNames);
            },

            getColModel: function (totalRows) {
                const colModels = Site.clone(colModelList);

                if (_me.hasCustomerComm) {
                    insertColumns(colModels, CUSTOMER_WL_COLUMNS_CONFIG.ColModels, _me.customerCommIndex);
                }
                else {
                    insertColumns(colModels, CUSTOMER_WL_COLUMNS_CONFIG.ColMergeModel, _me.customerCommIndex);
                }

                _me.productBAIndex = colModels.length - 1;

                if (_me.isAllowBA) {
                    insertColumns(colModels, BA_COLUMNS_CONFIG.ColModels, _me.productBAIndex);
                }

                if (totalRows <= 1) {
                    $.each(colModels, function (index, item) {
                        item.sortable = false;
                    });
                }

                return colModels;
            },

            getOrderColumnCode: function (indexColumn, sortType) {
                if (sortType === 'asc' && indexColumn !== customerWinLossColumn.index && indexColumn !== customerWinLossMergeColumn.index) {
                    return 0;
                }

                switch (indexColumn) {
                    case customerWinLossColumn.index:
                    case customerWinLossMergeColumn.index:
                        if (sortType === 'desc') {
                            return 4;
                        }
                        return 5;
                    case depositColumn.index:
                        return 1;
                    case withdrawalColumn.index:
                        return 2;
                    case turnoverColumn.index:
                        return 3;
                    case openingBalanceColumn.index:
                        return 6;
                    case closingBalanceColumn.index:
                        return 7;
                    default:
                        return 0;
                }
            }
        };
        return _me;
    });