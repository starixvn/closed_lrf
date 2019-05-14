/// <reference path="/@JSense.js" />
/*
* monPickr - jQuery Plugin
* Just a simple month picker
*
* Examples and documentation at: http://update.later
*
* Version: 0.0.2 (9 Feb 2012)
* Requires: jQuery v1.7+
*/
define(["common/site"], function (Site) {
    (function ($) {
        var logger = { error: $.noop };

        Date.prototype.toStringFormat = function (format) {
            var shortMonthsInYear = Site.getResources(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]),
                longMonthsInYear = Site.getResources(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]),
                year = this.getFullYear(),
                month = this.getMonth(),
                day = this.getDate(),
                result = format;

            function strMonth(value) {
                var monthArrayIndex = parseInt(value);
                return shortMonthsInYear[monthArrayIndex] || value;
            }

            function strLongMonth(value) {
                var monthArrayIndex = parseInt(value);
                return longMonthsInYear[monthArrayIndex] || value;
            }

            result = result.replace(/yyyy/g, year);
            result = result.replace(/yy/g, year.toString().substr(2));

            result = result.replace(/MMMM/g, strLongMonth(month));
            result = result.replace(/MMM/g, strMonth(month));
            result = result.replace(/MM/g, month < 9 ? '0' + (month + 1) : (month + 1));

            result = result.replace(/dd/g, day < 10 ? '0' + day : day);

            return result;
        };

        var isInteger = function (value, writeLogToConsole) {
            var isValid = Math.ceil(value) == Math.floor(value);

            if (writeLogToConsole && !isValid) logger.error('Oops! "' + value + '" is an invalid Integer');

            return isValid;
        }

        var isValidDate = function (value, writeLogToConsole) {
            var _value = new Date(value),
                isValid = isInteger(_value.getDate()) && isInteger(_value.getMonth()) && isInteger(_value.getFullYear());

            if (writeLogToConsole && !isValid) logger.error('Oops! "' + value + '" is an invalid Date');

            return isValid;
        }

        var today = null,
            thisYear = null,
            thisMonth = null,
            thisDay = null,
            firstDayThisYear = null,
            firstDayThisMonth = null,
            lastDayThisMonth = null,

        /*
        * Private methods
        */

            _getData = function (target) {
                var data = $(target).data('monPickr');
                if (!data) {
                    logger.error('Oops! No data of monPickr is available');
                    return null;
                }
                return data;
            },

            _validateMonth = function (minDate, maxDate, year, month) {
                var minYear = minDate.getFullYear(),
                    minMonth = minDate.getMonth(),
                    maxYear = maxDate.getFullYear(),
                    maxMonth = maxDate.getMonth(),

                    outOfLowBoundary = year < minYear || (year == minYear && month < minMonth),
                    outOfHighBoundary = year > maxYear || (year == maxYear && month > maxMonth);

                return !outOfLowBoundary && !outOfHighBoundary;
            },

            _validateDate = function (minDate, maxDate, year, month, date) {
                // Re-new the params cauz of time ignorance
                var minDayInMonth = new Date(year, month, _getMinDayInMonth(minDate, year, month)),
                    maxDayInMonth = new Date(year, month, _getMaxDayInMonth(maxDate, year, month)),
                    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

                return minDate <= date && date <= maxDayInMonth;
            },

            _checkReachBound = function (data, year, month) {
                // diable next/prev button if the selected month reach the bound
                var nextMonth = new Date(year, month + 1, 1),
                    prevMonth = new Date(year, month - 1, 1);

                if (!_validateMonth(data.minDate, data.maxDate, nextMonth.getFullYear(), nextMonth.getMonth())) data.btnNext.addClass('disable');
                else data.btnNext.removeClass('disable');

                if (!_validateMonth(data.minDate, data.maxDate, prevMonth.getFullYear(), prevMonth.getMonth())) data.btnPrev.addClass('disable');
                else data.btnPrev.removeClass('disable');
            },

            _setMonth = function (data, year, month) {
                data.year = year;
                data.month = month;
            },

            _setMonthLabel = function (data) {
                data.lblSelectedMonth.html(new Date(data.year, data.month, 1).toStringFormat(data.monthFormat));
            },

            _selectMonth = function (data, year, month) {
                // invokes handler (if any) just before the event change month
                if (typeof data.beforeChangeMonth == 'function') data.beforeChangeMonth();
                else { logger.error('Oops! beforeChangeMonth event\'s handler (which has type "' + typeof data.beforeChangeMonth + '") is not a function'); }

                // highlight selected month
                data.dropDown.find('.monthWrap a[month].selected').removeClass('selected');
                data.dropDown.find('.monthWrap[year=' + year + '] a[month=' + (month + 1) + ']:first').addClass('selected');

                _setMonth(data, year, month);
                _setMonthLabel(data);

                // if selected year differs from current year then hide current year and show selected one
                if (data.dropDown.find('.monthWrap.selected').attr('year') != year) {
                    _hideCurrentYear(data);
                    _showSelectedYear(data, year);
                    data.dropDown.find('.year a.selected:first').parent().addClass('selected');
                }

                if (data.showDateRange) {
                    var minDayInMonth = _getMinDayInMonth(data.minDate, data.year, data.month),
                    maxDayInMonth = _getMaxDayInMonth(data.maxDate, data.year, data.month);

                    // change fromDate and toDate
                    _selectDay(data, data.ddlFromDate, minDayInMonth, true);
                    _selectDay(data, data.ddlToDate, maxDayInMonth, false);
                }

                _checkReachBound(data, year, month);

                // invokes handler (if any) just after the event change month
                if (typeof data.afterChangeMonth == 'function') data.afterChangeMonth();
                else { logger.error('Oops! afterChangeMonth event\'s handler (which has type "' + typeof data.afterChangeMonth + '") is not a function'); }
            },

            _setDay = function (data, value, isFromDay) {
                var minDayInMonth = _getMinDayInMonth(data.minDate, data.year, data.month),
                    maxDayInMonth = _getMaxDayInMonth(data.maxDate, data.year, data.month);

                if (isFromDay) {
                    data.fromDay = parseInt(value, 10);
                    data.fromDate = new Date(data.year, data.month, value);

                    data.ddlToDate.dropDown.find('li').each(function (index) {
                        var day = index + 1;
                        var isShow = day >= data.fromDay && day >= minDayInMonth && day <= maxDayInMonth;
                        $(this).toggle(isShow);
                    });
                } else {
                    data.toDay = parseInt(value, 10);
                    data.toDate = new Date(data.year, data.month, value);

                    data.ddlFromDate.dropDown.find('li').each(function (index) {
                        var day = index + 1;
                        var isShow = day <= data.toDay && day >= minDayInMonth && day <= maxDayInMonth;
                        $(this).toggle(isShow);
                    });
                }
            },

            _setDayLabel = function (target, value) {
                target.find('.selectedDay').html(value);
            },

            _selectDay = function (data, target, value, isFromDay) {
                // invokes handler (if any) just before the event change day
                if (typeof data.beforeChangeDay == 'function') data.beforeChangeDay();
                else { logger.error('Oops! beforeChangeDay event\'s handler (which has type "' + typeof data.beforeChangeDay + '") is not a function'); }

                _setDayLabel(target, value);
                _setDay(data, value, isFromDay);

                // invokes handler (if any) just after the event change day
                if (typeof data.afterChangeDay == 'function') data.afterChangeDay();
                else { logger.error('Oops! afterChangeDay event\'s handler (which has type "' + typeof data.afterChangeDay + '") is not a function'); }
            },

            _getMinDayInMonth = function (minDate, year, month) {
                var _firstDayOfMonth = new Date(year, month, 1),
                    _minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());

                return _minDate > _firstDayOfMonth ? _minDate.getDate() : 1;
            },

            _getMaxDayInMonth = function (maxDate, year, month) {
                var _lastDayOfMonth = new Date(year, month + 1, 0),
                    _maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());

                return _lastDayOfMonth > _maxDate ? _maxDate.getDate() : _lastDayOfMonth.getDate();
            },

            _hideCurrentYear = function (data) {
                // collapse current year
                var currentMonthWrap = data.dropDown.find('.monthWrap.selected').eq(0);

                if (data.dropDown.is(':hidden')) {
                    currentMonthWrap.hide();
                } else {
                    currentMonthWrap.slideUp(data.showYearSpeed);
                }

                currentMonthWrap.removeClass('selected');
                data.dropDown.find('.year .selected').eq(0).removeClass('selected').parent().removeClass('selected');
            },

            _showSelectedYear = function (data, year) {
                var target = data.dropDown.find('.monthWrap[year=' + year + ']').eq(0);

                target.prev('.year').find('a[year]').eq(0).addClass('selected');
                target.addClass('selected').slideDown(data.showYearSpeed);
            },

            _showDropDown = function (data, target) {
                target.dropDown.slideDown(data.showDropDownSpeed);
            },

            _hideDropDown = function (data, target) {
                target.dropDown.slideUp(data.showDropDownSpeed);
            },

        _methods = {
            init: function (options) {
                options = options || {};

                if ($.isFunction(options.log)) logger.error = options.log;

                if (!this.length) { // if the initial DOM does not exist
                    logger.error('Oops! DOM element "' + this.selector + '" does not exist');
                    return;
                }

                if (options.today && !isValidDate(options.today, true)) return;

                today = options.today ? new Date(options.today) : new Date();
                thisYear = today.getFullYear();
                thisMonth = today.getMonth();
                thisDay = today.getDate();
                firstDayThisYear = new Date(thisYear, 0, 1);
                firstDayThisMonth = new Date(thisYear, thisMonth, 1);
                lastDayThisMonth = new Date(thisYear, thisMonth + 1, 0);

                // Create some defaults, extending them with any options that were provided
                var settings = $.extend({
                    minDate: firstDayThisYear,
                    maxDate: today,
                    month: today,

                    showDateRange: false,
                    fromDay: firstDayThisMonth.getDate(),
                    toDay: today.getDate(),
                    fromDayId: null, // required if showDateRange is true
                    toDayId: null, // required if showDateRange is true

                    expandYearOnhover: false,
                    expandDayOnhover: false,
                    showYearSpeed: 110,
                    showDropDownSpeed: 10,

                    disabled: false,
                    sortDesc: false,
                    monthFormat: 'MMM yyyy',
                    nextText: 'Next Month',
                    prevText: 'Previous Month',
                    monPickrText: 'Show/hide Month Picker',
                    zIndex: 1,

                    beforeChangeMonth: function () { },
                    afterChangeMonth: function () { },
                    beforeChangeDay: function () { },
                    afterChangeDay: function () { }
                }, options);

                //#region VALIDATES INPUT VALUES

                // Validates minDate & maxDate
                if (!isValidDate(settings.minDate, true) || !isValidDate(settings.maxDate, true)) return;

                // Convert minDate & maxDate to Date type for easier later using
                settings.minDate = new Date(settings.minDate);
                settings.maxDate = new Date(settings.maxDate);

                // Validtes selected month
                if (!isValidDate(settings.month, true)) return;

                // Convert selected month to Date type for easier later using
                settings.month = new Date(settings.month);

                var year = settings.month.getFullYear(),
                    month = settings.month.getMonth();

                // Make sure selected month are not out of range (minDate ~ maxDate)
                if (!_validateMonth(settings.minDate, settings.maxDate, year, month)) {
                    logger.error('Oops! Selected month (' + settings.month.toStringFormat('MM/yyyy') +
                        ') is out of range (' + settings.minDate.toStringFormat('MM/yyyy') + ' ~ ' + settings.maxDate.toStringFormat('MM/yyyy') + ')');
                    return;
                }

                // Makes sure selected fromDate & toDate are not out of Range (minDate ~ maxDate)
                var fromDate = new Date(year, month, settings.fromDay),
                    toDate = new Date(year, month, settings.toDay);

                if (!_validateDate(settings.minDate, settings.maxDate, year, month, fromDate)) {
                    logger.error('Oops! fromDate (' + fromDate.toStringFormat('MMM dd, yyyy') + ') is out of range');
                    return;
                }

                if (!_validateDate(settings.minDate, settings.maxDate, year, month, toDate)) {
                    logger.error('Oops! toDate (' + toDate.toStringFormat('MMM dd, yyyy') + ') is out of range');
                    return;
                }

                //#endregion VALIDATES INPUT VALUES

                return this.each(function () {
                    var $this = $(this),
                        data = $this.data('monPickr');

                    // Initialize the plugin if it hasn't
                    if (!data) {
                        $this.data('monPickr', {
                            target: $this,

                            minDate: settings.minDate,
                            maxDate: settings.maxDate,
                            originalYear: settings.year,
                            originalMonth: settings.month,
                            year: settings.month.getFullYear(),
                            month: settings.month.getMonth(),

                            showDateRange: settings.showDateRange,
                            originalFromDay: settings.fromDay,
                            originalToDay: settings.toDay,
                            fromDay: settings.fromDay,
                            toDay: settings.toDay,
                            fromDate: fromDate,
                            toDate: toDate,
                            fromDayId: settings.fromDayId,
                            toDayId: settings.toDayId,

                            expandYearOnhover: settings.expandYearOnhover,
                            expandDayOnhover: settings.expandDayOnhover,
                            showYearSpeed: settings.showYearSpeed,
                            showDropDownSpeed: settings.showDropDownSpeed,

                            disabled: settings.disabled,
                            sortDesc: settings.sortDesc,
                            monthFormat: settings.monthFormat,
                            nextText: settings.nextText,
                            prevText: settings.prevText,
                            monPickrText: settings.monPickrText,
                            zIndex: settings.zIndex,

                            beforeChangeMonth: settings.beforeChangeMonth,
                            afterChangeMonth: settings.afterChangeMonth,
                            beforeChangeDay: settings.beforeChangeDay,
                            afterChangeDay: settings.afterChangeDay
                        });

                        data = $this.data('monPickr')
                    }

                    //#region INIT DOM ELEMENTS

                    //#region Month Picker

                    $this.addClass('monPickr');
                    data.btnPrev = $('<a href="javascript:;" class="prev" title="' + data.prevText + '"><b>&lsaquo;</b></a>');
                    data.btnNext = $('<a href="javascript:;" class="next" title="' + data.nextText + '"><b>&rsaquo;</b></a>');
                    data.lblSelectedMonth = $('<span class="selectedMonth" title="' + data.monPickrText + '"></span>');
                    _setMonthLabel(data);
                    $this.append(data.btnPrev, data.lblSelectedMonth, data.btnNext);

                    $this.wrap('<div class="monPickrWrap" style="z-index: ' + data.zIndex + '" />');
                    data.wrap = $this.parents('.monPickrWrap');
                    data.wrap.wrap('<div class="monPickrWrapParent" style="position: relative" />')
                        .css({ 'position': 'absolute' }).parent().height(data.wrap.outerHeight());

                    data.dropDown = $('<div class="monPickrDropDown" />');

                    var currentYear = data.minDate.getFullYear(),
                        currentMonth = data.minDate.getMonth(),
                        minYear = data.minDate.getFullYear(),
                        minMonth = data.minDate.getMonth(),
                        maxYear = data.maxDate.getFullYear(),
                        maxMonth = data.maxDate.getMonth(),
                        dropDownInner, temp;

                    dropDownInner = '<ul class="monPickrDropDownInner">';

                    if (data.sortDesc) {
                        currentYear = data.maxDate.getFullYear();
                        currentMonth = data.maxDate.getMonth();

                        while (currentYear > minYear || (currentYear == minYear && currentMonth >= minMonth)) {
                            temp = currentYear == data.year ? 'selected' : '';
                            temp += data.expandYearOnhover ? ' hover' : '';

                            dropDownInner +=
                            '<li class="year ' + temp + '">' +
                                '<a year="' + currentYear + '" class="' + temp + '" href="javascript:;">' +
                                    currentYear +
                                '</a>' +
                            '</li>';

                            if (currentYear == data.year) {
                                dropDownInner += '<li class="monthWrap selected" year="' + currentYear + '" style="display: list-item"><ul>';
                            } else {
                                dropDownInner += '<li class="monthWrap" year="' + currentYear + '"><ul>';
                            }

                            while ((currentYear > minYear || (currentYear == minYear && currentMonth >= minMonth)) && currentMonth >= 0) {
                                temp = currentYear == data.year && currentMonth == data.month ? 'class="selected"' : '';

                                dropDownInner +=
                                '<li>' +
                                    '<a month="' + (currentMonth + 1) + '" ' + temp + ' href="javascript:;">' +
                                        new Date(currentYear, currentMonth).toStringFormat('MMMM') + '</a>' +
                                '<li>';

                                currentMonth--;
                            }

                            dropDownInner += '</ul></li>';

                            currentYear--;
                            currentMonth = 11;
                        }
                    } else {
                        while (currentYear < maxYear || (currentYear == maxYear && currentMonth <= maxMonth)) {
                            temp = currentYear == data.year ? 'selected' : '';
                            temp += data.expandYearOnhover ? ' hover' : '';

                            dropDownInner +=
                            '<li class="year ' + temp + '">' +
                                '<a year="' + currentYear + '" class="' + temp + '" href="javascript:;">' +
                                    currentYear +
                                '</a>' +
                            '</li>';

                            if (currentYear == data.year) {
                                dropDownInner += '<li class="monthWrap selected" year="' + currentYear + '" style="display: list-item"><ul>';
                            } else {
                                dropDownInner += '<li class="monthWrap" year="' + currentYear + '"><ul>';
                            }

                            while ((currentYear < maxYear || (currentYear == maxYear && currentMonth <= maxMonth)) && currentMonth < 12) {
                                temp = currentYear == data.year && currentMonth == data.month ? 'class="selected"' : '';

                                dropDownInner +=
                                '<li>' +
                                    '<a month="' + (currentMonth + 1) + '" ' + temp + ' href="javascript:;">' +
                                        new Date(currentYear, currentMonth).toStringFormat('MMMM') + '</a>' +
                                '<li>';

                                currentMonth++;
                            }

                            dropDownInner += '</ul></li>';

                            currentYear++;
                            currentMonth = 0;
                        }
                    }

                    dropDownInner += '</ul>';

                    data.dropDown.append(dropDownInner);
                    $this.after(data.dropDown);

                    _checkReachBound(data, year, month);

                    //#region Events

                    // Toggle the dropdown when users click on selected month label
                    data.wrap.on('click', function (e) {
                        _hideDropDown(data, data.ddlFromDate);
                        _hideDropDown(data, data.ddlToDate);

                        if ($(e.target).hasClass('selectedMonth')) {
                            if (data.dropDown.is(':hidden')) {
                                _showDropDown(data, data);
                            } else {
                                _hideDropDown(data, data);
                            }
                        }
                    });

                    // Collapse all dropdowns when users click outside the picker
                    $('html').on('click', function (e) {
                        var $target = $(e.target);
                        var pickerId = "#" + data.target.attr("id");

                        if (!$target.closest(pickerId).length) {
                            _hideDropDown(data, data);
                        }
                    });

                    // Toggle a dropdown when users click/hover on its "the year" link
                    var expectedEvent = data.expandYearOnhover ? 'mouseenter' : 'click';
                    data.dropDown.on(expectedEvent, '.year a', function () {
                        var $this = $(this), year = $this.attr('year'),
                            thisIsNotSelected = $this.hasClass('selected') == false;

                        switch (expectedEvent) {
                            case 'mouseenter':
                                {
                                    if (thisIsNotSelected) {
                                        _hideCurrentYear(data);
                                        _showSelectedYear(data, year); // expand this
                                    }
                                } break;
                            case 'click':
                                {
                                    _hideCurrentYear(data);

                                    if (thisIsNotSelected) {
                                        // We have to expand "the year" which was clicked.
                                        // Else means this is the current year itself --> we don't need to expand it
                                        _showSelectedYear(data, year);
                                    }

                                    data.dropDown.find('.year a.selected:first').parent().addClass('selected');
                                } break;
                        }
                    });

                    // Change current month when users select a month
                    data.dropDown.on('click', '.monthWrap a[month]', function () {
                        var $this = $(this);
                        _selectMonth(data, $this.parents('.monthWrap').attr('year'), $this.attr('month') - 1);
                        _hideDropDown(data, data);
                    });

                    // Move to next month when users click next button
                    data.btnNext.on('click', function () {
                        var nextMonth = data.month + 1,
                            year = data.year;

                        if (nextMonth > 11) {
                            nextMonth = 0;
                            year++;
                        }

                        if (_validateMonth(data.minDate, data.maxDate, year, nextMonth)) {
                            _selectMonth(data, year, nextMonth);
                        }
                    });

                    // Move to previous month when users click prev button
                    data.btnPrev.on('click', function () {
                        var prevMonth = data.month - 1,
                            year = data.year;

                        if (prevMonth < 0) {
                            prevMonth = 11;
                            year--;
                        }

                        if (_validateMonth(data.minDate, data.maxDate, year, prevMonth)) {
                            _selectMonth(data, year, prevMonth);
                        }
                    });

                    //#endregion Events

                    //#endregion Month Picker

                    //#region Day Picker

                    if (data.showDateRange) { // Renders date range component (fromDate & toDate)
                        var renderDayPicker = function (data, dayPickr, dayPickrId, selectedDay) {
                            dayPickr = $('#' + dayPickrId);

                            if (dayPickr.length > 0) {
                                dayPickr.addClass('dayPickr')
                                    .append('<span class="selectedDay">' + selectedDay + '</span>')
                                    .append('<a class="darr" href="javascript:;"><b>v</b></a>')
                                    .wrap('<div class="selectedDayWrap" style="z-index: ' + data.zIndex + '" />');

                                dayPickr.wrap = dayPickr.parents('.selectedDayWrap')
                                    .wrap('<div class="selectedDayWrapParent" style="position: relative" />')
                                    .css({ 'position': 'absolute' });
                                dayPickr.wrap.parent().height(dayPickr.wrap.outerHeight());
                                dayPickr.dropDown = $('<div class="dayPickrDropDown" />');

                                var currentDay = 1,
                                    minDay = _getMinDayInMonth(data.minDate, data.year, data.month),
                                    maxDay = _getMaxDayInMonth(data.maxDate, data.year, data.month),
                                    dayPickrDropDown;

                                dayPickrDropDown = '<ul>';

                                while (currentDay <= 31) {
                                    temp = currentDay < minDay || currentDay > maxDay ? 'style="display: none"' : '';
                                    dayPickrDropDown += '<li ' + temp + '><a href="javascript:;">' + currentDay + '</a></li>';
                                    currentDay++;
                                }

                                dayPickrDropDown += '</ul>';

                                dayPickr.dropDown.append(dayPickrDropDown);
                                dayPickr.after(dayPickr.dropDown);

                                return dayPickr;
                            } else {
                                logger.error('Oops! fromDayId (' + data.fromDayId + ') or toDayId (' + data.toDayId + ') does not exist');
                            }
                        }

                        data.ddlFromDate = renderDayPicker(data, data.ddlFromDate, data.fromDayId, data.fromDay);
                        data.ddlToDate = renderDayPicker(data, data.ddlToDate, data.toDayId, data.toDay);

                        //#region Events

                        var dayExpectedEvent = data.expandDayOnhover ? 'hover' : 'click',
                            toggleDayPickr = function (e) {
                                if (data.isClosingDropDown) {
                                    data.isClosingDropDown = false;
                                    return;
                                }

                                var target = e.data.target;

                                _hideDropDown(data, data);
                                if (target == data.ddlFromDate) {
                                    _hideDropDown(data, data.ddlToDate);
                                }
                                else {
                                    _hideDropDown(data, data.ddlFromDate);
                                }

                                if (target.dropDown.is(':hidden')) {
                                    _showDropDown(data, target);
                                } else {
                                    _hideDropDown(data, target);
                                }
                            };

                        // Toggle the day picker dropdown when users click/hover on selected day label
                        data.ddlFromDate.wrap.on(dayExpectedEvent, { target: data.ddlFromDate }, toggleDayPickr);
                        data.ddlToDate.wrap.on(dayExpectedEvent, { target: data.ddlToDate }, toggleDayPickr);

                        if (!data.expandDayOnhover) {
                            // Collapse all day picker dropdowns when users click outside the picker
                            $('html').on('click', function (e) {
                                var $target = $(e.target);
                                var targetId = $target.attr("id");
                                targetId = targetId === undefined ? $target.parent().attr("id") : targetId;

                                if (targetId !== data.fromDayId && targetId !== data.toDayId) {
                                    _hideDropDown(data, data.ddlFromDate);
                                    _hideDropDown(data, data.ddlToDate);
                                }
                                else if (targetId !== data.fromDayId) {
                                    _hideDropDown(data, data.ddlFromDate);
                                }
                                else {
                                    _hideDropDown(data, data.ddlToDate);
                                }
                            });
                        }

                        var changeCurrentDay = function (e) {
                            var $this = $(this),
                                selectedDay = $this.find('a').html();

                            // prevent conflict when closing day dropdown
                            if (data.expandDayOnhover) data.isClosingDropDown = true;

                            $this.parents('.dayPickrDropDown').hide();
                            _selectDay(data, e.data.target, selectedDay, e.data.isFromDay);

                            e.stopPropagation();
                        };

                        // Change current fromDay/toDay when users select a day
                        data.ddlFromDate.dropDown.on('click', 'li', { target: data.ddlFromDate, isFromDay: true }, changeCurrentDay);
                        data.ddlToDate.dropDown.on('click', 'li', { target: data.ddlToDate, isFromDay: false }, changeCurrentDay);

                        //#endregion Events
                    }

                    //#endregion Day Picker

                    //#endregion INIT DOM ELEMENTS
                });
            },

            // Returns the current month or null if the invoker's data does not exist
            // format may be '' which tell this to use default format
            getMonth: function (format) {
                var data = _getData(this);
                if (!data) return null;

                if (format != undefined) {
                    format = format.length > 0 ? format : data.monthFormat;
                    return new Date(data.year, data.month).toStringFormat(format);
                } else {
                    return data.month + 1;
                }
            },

            // Sets the current month for the month picker.
            // value may be a Date object or a string but it must be a full date (include year, month & day)
            setMonth: function (value) {
                var data = _getData(this);
                if (!data) return;

                var year, month, _value = value;

                if ((typeof value).toLowerCase() != 'object') {
                    _value = new Date(_value);
                }

                year = _value.getFullYear();
                month = _value.getMonth();

                if (isInteger(year) && isInteger(month)) {
                    if (_validateMonth(data.minDate, data.maxDate, year, month)) {
                        _selectMonth(data, year, month);
                    } else {
                        logger.error('Oops! Can\'t set month because input (' + value.toString() +
                            ') is out of range (' + data.minDate.toStringFormat('MMM yyyy') + ' ~ ' + data.maxDate.toStringFormat('MMM yyyy') + ')');
                    }
                } else {
                    logger.error('Oops! Can\'t set month because of invalid input (' + value.toString() + ')');
                }
            },

            // Returns the current fromDate or null if the invoker's data does not exist
            // format may be '' which tell this to use default format
            getFromDate: function (format) {
                var data = _getData(this);
                if (!data) return null;

                if (format != undefined) {
                    format = format.length > 0 ? format : data.monthFormat;
                    return data.fromDate.toStringFormat(format);
                }

                return data.fromDate;
            },

            // Returns the current toDate or null if the invoker's data does not exist
            // format may be '' which tell this to use default format
            getToDate: function (format) {
                var data = _getData(this);
                if (!data) return null;

                if (format != undefined) {
                    format = format.length > 0 ? format : data.monthFormat;
                    return data.toDate.toStringFormat(format);
                }

                return data.toDate;
            },

            // Sets the current fromDay
            setFromDay: function (value) {
                var data = _getData(this);
                if (!data) return;

                var selectedDate = new Date(data.year, data.month, value);

                if (isInteger(value) && _validateDate(data.minDate, data.maxDate, data.year, data.month, selectedDate)) {
                    _selectDay(data, data.ddlFromDate, value, true);
                } else {
                    logger.error('Oops! input value (' + value + ') is invalid');
                }
            },

            // Sets the current toDay
            setToDay: function (value) {
                var data = _getData(this);
                if (!data) return;

                var selectedDate = new Date(data.year, data.month, value);

                if (isInteger(value) && _validateDate(data.minDate, data.maxDate, data.year, data.month, selectedDate)) {
                    _selectDay(data, data.ddlToDate, value, false);
                } else {
                    logger.error('Oops! input value (' + value + ') is invalid');
                }
            },

            // Resets picker to its data-original initial state
            reset: function () {
                var data = _getData(this);
                if (!data) return;

                _selectMonth(data, data.originalYear, data.originalMonth);
            }
        };

        /*
        * Public methods
        */

        $.fn.monPickr = function (method) {
            if (_methods[method]) { // call a method but init
                return _methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (typeof method === 'object' || !method) { // call init method
                return _methods.init.apply(this, arguments);
            } else { //
                logger.error('Oops! Method "' + method + '" does not exist on jQuery.monPickr');
            }
        };
    })(jQuery);
});