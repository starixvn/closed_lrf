define(['jquery', 'lib/jquery.monthpicker'],
    function ($) {
        'use strict';
        const PICKER_SELECTOR = '#month-picker';
        const FORMAT = 'MM/dd/yyyy';

        const _historyDate = new Date($('#HistoryDate').val());

        function initMonthPicker(option) {
            const $picker = $(PICKER_SELECTOR);
            const $fromDate = $('#FromDate');
            const $todate = $('#ToDate');

            const fromdate = new Date($fromDate.val());
            const todate = new Date($todate.val());

            const defaultOption = {
                minDate: _historyDate,
                showDateRange: true,
                fromDayId: 'fDay',
                toDayId: 'tDay',
                format: FORMAT,
                month: fromdate,
                fromDay: fromdate.getDate(),
                toDay: todate.getDate(),
                afterChangeMonth: function () {
                    $fromDate.val($picker.monPickr('getFromDate', FORMAT));
                    $todate.val($picker.monPickr('getToDate', FORMAT));
                },
                afterChangeDay: function () {
                    $fromDate.val($picker.monPickr('getFromDate', FORMAT));
                    $todate.val($picker.monPickr('getToDate', FORMAT));

                    if (option && typeof option.customAfterChangeDay === 'function') {
                        option.customAfterChangeDay();
                    }
                }
            };

            if (option) {
                $.extend(defaultOption, option);
            }

            $picker.monPickr(defaultOption);
        }

        function getFromDateString() {
            return $(PICKER_SELECTOR).monPickr('getFromDate', FORMAT);
        }

        function getToDateString() {
            return $(PICKER_SELECTOR).monPickr('getToDate', FORMAT);
        }

        return {
            initMonthPicker: initMonthPicker,
            getFromDateString: getFromDateString,
            getToDateString: getToDateString
        };
    });