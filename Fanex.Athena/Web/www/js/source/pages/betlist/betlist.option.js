define(['jquery', 'common/site'], function ($, Site) {
    'use strict';
    const columnNames = ['#', 'ExternalId', 'SystemId', 'TransTime', 'Choice', 'Odds', 'Stake',
                    'WinLoss', 'EffectiveBettingValue', '@[LicenseeWL]/@[Comm]', 'Status'];
    const indexColumn =
    {
        name: 'Index',
        index: 'Index',
        width: 50,
        align: 'center',
        sortable: false,
        resizable: false
    };
    const externalId =
    {
        name: 'ExternalId',
        index: 'ExternalId',
        width: 100,
        align: 'left',
        sortable: false
    };
    const systemId =
    {
        name: 'SystemId',
        index: 'UserName',
        width: 120,
        align: 'left',
        sortable: false
    };
    const transTime =
    {
        name: 'TransTime',
        index: 'TransTime',
        width: 110,
        align: 'center',
        sortable: false,
        resizable: false,
        title: false,
        classes: 'transtime'
    };
    const choice =
    {
        name: 'Choice',
        index: 'Choice',
        width: 300,
        align: 'right',
        sortable: false,
        title: false
    };
    const odds =
    {
        name: 'Odds',
        index: 'Odds',
        width: 60,
        align: 'right',
        sortable: false,
        resizable: false,
        title: false
    };
    const stake =
    {
        name: 'Stake',
        index: 'Stake',
        width: 70,
        align: 'right',
        sortable: true,
        resizable: false
    };
    const winloss =
    {
        name: 'WinLoss',
        index: 'WinLoss',
        width: 75,
        align: 'right',
        sortable: true,
        resizable: false,
        title: false
    };
    const betEffective =
    {
        name: 'BetEffective',
        index: 'BetEffective',
        width: 115,
        align: 'right',
        sortable: true,
        resizable: false,
        title: false
    };
    const licenseeWl =
    {
        name: 'LicenseeWL',
        index: 'LicenseeWL',
        width: 85,
        align: 'right',
        sortable: true,
        resizable: false,
        title: false
    };
    const status =
    {
        name: 'Status',
        index: 'Status',
        width: 60,
        align: 'center',
        sortable: false,
        resizable: false,
        title: false
    };

    const columnModel = [indexColumn, externalId, systemId, transTime, choice, odds, stake, winloss, betEffective, licenseeWl, status];

    return {
        gridOption:
        {
            datatype: 'local',
            rowNum: 50,
            rowList: [50, 100, 200, 300, 400, 500, 1000, 2000],
            pager: '#pager2',
            loadtext: '',
            viewrecords: true,
            autowidth: true,
            shrinkToFit: true,
            scroll: false,
            loadonce: true,
            gridview: true,
            userDataOnFooter: true,
            jsonReader: { repeatitems: false },
            cmTemplate: { sortable: false },
            beforeSelectRow: function () {
                return false;
            },
            onRightClickRow: function () {
                return false;
            },
            onPaging: function (pgButton) {
                if ($('#' + pgButton).hasClass('ui-state-disabled') === false) {
                    Site.blockUI();
                }
            }
        },

        columnModel: columnModel,
        columnNames: columnNames,
        maxHeight: 720
    };
});