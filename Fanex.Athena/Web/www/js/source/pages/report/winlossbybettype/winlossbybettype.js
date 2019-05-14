'use strict';
define([
    'jquery',
    'common/site',
    'common/querystring',
    'components/pluginhelper/daterangepicker',
    'components/scrollablegrid',
    'helpers/sortableheader',
    'extensions/jquery.extension'],
    function ($, Site, QueryString, DatePicker, GridHelper, SortableHeader) {
        const _me = {
            initialize: function () {
                Site.initialize();
                GridHelper.resizeGrid();
                _me.initDateRangePicker();
                SortableHeader.createSortingIcon(_me.submitForm);
                Site.addUserGuide({
                    resourceName: 'WinLossByBetType',
                    title: Site.getSingleResource('WinLossByBetType')
                });
                _me.initEvent();
            },

            initDateRangePicker: function () {
                const ranges = ['Today', 'Yesterday', 'Currentweek'];
                DatePicker.initDateRangePicker(false, ranges);
            },

            initEvent: function () {
                $('#ExportToExcel').click(function () {
                    $('#IsExportExcel').val(true);
                    $('#WinLossByBetTypeForm').submit();
                });
                $('#SubmitButton').click(function () {
                    _me.submitForm();
                });

                $('.body-content').on('click', '.bet-list-link', function () {
                    _me.viewBetList($(this).data('bettype'));
                });

                $(window).on('resize', function () {
                    GridHelper.resizeGrid();
                });

                $(window).on('unload', function () {
                    $(window).off('resize');
                });
            },

            viewBetList: function (betType) {
                let url = Site.resolveClientUrl('WinLossByBetTypeBetList/Index');
                url = Site.setLicenseeOptionOriginalParam(url);
                url = QueryString.setParams(url, {
                    fromdate: $('#FromDate').val(),
                    todate: $('#ToDate').val(),
                    bettype: betType
                });
                Site.blockUI();
                Site.redirect(url);
            },

            submitForm: function () {
                Site.blockUI();
                $('#IsExportExcel').val(false);
                $('#WinLossByBetTypeForm').submit();
                return false;
            }
        };

        return _me;
    });