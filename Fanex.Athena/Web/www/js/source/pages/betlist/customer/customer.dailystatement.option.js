'use strict';
define(['jquery', 'common/site'], function ($, Site) {
    const setLink = function (rowObject) {
        const drilldownParam = {
            CustId: rowObject.CustId,
            Date: rowObject.Date,
            TransType: rowObject.TransType,
            ExternalId: rowObject.ExternalId,
            SystemId: rowObject.SystemId
        };

        return rowObject.TransTypeHasBetList ?
            '<a href="javascript:;" class="betlistDrilldown" data-param=\'' + JSON.stringify(drilldownParam) + '\'>' + rowObject.FullStatementDate + '</a>'
            : rowObject.FullStatementDate;
    };

    const indexColumn = {
        name: 'Index',
        index: 'Index',
        width: 30,
        align: 'center',
        sortable: false,
        resizable: false
    };
    const date = {
        name: 'Date',
        index: 'Date',
        width: 150,
        align: 'center',
        sortable: false,
        formatter: function (cellValue, option, rowObject) {
            return setLink(rowObject);
        }
    };
    const remark = {
        name: 'Remark',
        index: 'Remark',
        width: 205,
        align: 'right',
        sortable: false
    };
    const turnover = {
        name: 'Turnover',
        index: 'Turnover',
        width: 120,
        align: 'right',
        sortable: false
    };

    const creditDebit = {
        name: 'CreditDebit',
        index: 'CreditDebit',
        width: 120,
        align: 'right',
        sortable: false
    };

    const commission = {
        name: 'Commission',
        index: 'Commission',
        width: 120,
        align: 'right',
        sortable: false,
        resizable: false
    };
    const balance = {
        name: 'Balance',
        index: 'Balance',
        width: 120,
        align: 'right',
        sortable: false
    };

    const columnNames = ['#', 'Date', 'Remark', 'Turnover', 'CreditDebit', 'Commission', 'Balance'];
    const columnModel = [indexColumn, date, remark, turnover, creditDebit, commission, balance];

    const _me = {
        gridOption: {
            datatype: 'local',
            height: 'auto',
            rowNum: 5000,
            colModel: columnModel,
            colNames: [],
            autowidth: false,
            shrinkToFit: true,
            gridview: true,
            footerrow: false,
            cmTemplate: { sortable: false }
        },
        getColNames: function () {
            return Site.getResources(columnNames);
        }
    };

    return _me;
});