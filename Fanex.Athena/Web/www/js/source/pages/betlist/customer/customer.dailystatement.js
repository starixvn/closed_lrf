'use strict';
define(['jquery', 'common/site', 'common/querystring', './customer.dailystatement.option', '../betlist',
    'lib/jqgrid/jquery.jqgrid.additional', 'lib/jqgrid/jquery.jqGrid.en', 'lib/jqgrid/jquery.jqGrid.min'],
    function ($, Site, QueryString, DailyStatementOption, BetList, jqGridAdditional) {
        const _me = {
            loadData: function (params, url) {
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(params),
                    contentType: 'application/json',
                    dataType: 'json',
                    cache: false,
                    url: url,
                    success: function (response) {
                        _me.bindData(response);
                    },
                    beforeSend: function () {
                        Site.blockUI();
                    },
                    complete: function () {
                        Site.unBlockUI();
                    }
                });
            },

            getGridOption: function () {
                const gridOption = DailyStatementOption.gridOption;
                gridOption.colNames = DailyStatementOption.getColNames();

                return gridOption;
            },

            bindData: function (response) {
                jqGridAdditional.clearGrid('BetListGrid');
                const data = response.Main;
                if (data.length === 0) {
                    jqGridAdditional.setNoInfo();
                    return;
                }

                const gridOption = _me.getGridOption();
                gridOption.data = data;
                gridOption.gridComplete = function () {
                    jqGridAdditional.gridComplete();
                    jqGridAdditional.updateGridWidth($(this));
                    jqGridAdditional.updateGridHeight();
                };

                $('#BetListGrid').jqGrid(gridOption);
            }
        };

        return _me;
    });