/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"www/js/build/dev/pages/reports/livereport": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([2,"www/js/build/dev/pages/lib/common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./www/js/source/components/jquery.flatpopup.js":
/*!******************************************************!*\
  !*** ./www/js/source/components/jquery.flatpopup.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;﻿
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js?fe57")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($) {
    let $blockBody;
    
    const _methods = {
        init: function (inputOptions) {
            const defaultOptions = {
                width: 640,
                height: 480,
                padding: 0,
                id: 'popup-content',
                className: '',
                title: '&nbsp;',
                container: 'body',
                modal: true,
                onOpen: null,
                onOpened: null,
                onClose: null
            };

            $blockBody = $('.popup-block-body');
            const options = $.extend(defaultOptions, inputOptions || {});
            return this.each(function () {
                let $self = $(this);
                const $container = $(options.container);

                if (options.modal && $blockBody.length === 0) {
                    $blockBody = $('<div class="popup-block-body" style="display: none"></div>');
                    $container.append($blockBody);
                }
                
                const $popupElement = $('#' + options.id);
                if ($popupElement.length === 0 || $popupElement.hasClass('flat-popup') === false) {
                    $self.attr('id', options.id);
                    $self.addClass('flat-popup ' + options.className);
                    $self.children().wrapAll('<div class="wrapContent" style="padding:' + options.padding + 'px"></div>');
                    $self.hide()
                         .prepend('<div class="title-bar popup-title"><div class="txt-title">'
                             + options.title
                             + '</div><a class="popup-close" href="javascript:;"><i class="icon-close"></i></a></div>');

                    $self.find('a.popup-close').on('click', function () {
                        if (options.onClose) {
                            options.onClose.apply($self);
                        }

                        if ($self.find('iframe').length > 0) {
                            $self.find('.wrapContent').empty();
                        }
                        _methods.hide.apply($self);
                    });

                    $container.append($self);
                }
                else {
                    $self = $('#' + options.id);
                    $self.find('.txt-title').text(options.title);
                    const $wrapContent = $self.find('.wrapContent');
                    $wrapContent.append($self.children().not('.popup-title'));
                }

                $self.width(options.width);
                $self.height(options.height);

                if (options.onOpen) {
                    options.onOpen.apply($self);
                }

                _methods.show.call($self, options.modal);

                if (options.onOpened) {
                    setTimeout(options.onOpened.apply($self), 350);
                }
            });
        },

        show: function (modal) {
            const $self = this;
            //Set the center alignment padding + border see css style
            const left = ($(window).width() - $self.width()) / 2;
            let top = ($(window).height() - $self.height()) / 2;

            if (top > 300) {
                top -= 100;
            }

            $self.css({
                'top': (top < 0 ? 0 : top) + 'px',
                'left': (left < 0 ? 0 : left) + 'px'
            });

            if (modal === true || modal === undefined) {
                $blockBody.show();
            }

            $self.fadeIn(300);
        },

        hide: function () {
            $(this).fadeOut(300);
            $blockBody.hide();
            return false;
        }
    };

    $.fn.flatPopup = function (methodOrOptions) {
        if (_methods[methodOrOptions]) {
            return _methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to 'init'
            return _methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.flatPopup');
        }
    };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./www/js/source/components/pluginhelper/daterangepicker.js":
/*!******************************************************************!*\
  !*** ./www/js/source/components/pluginhelper/daterangepicker.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;﻿!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js?fe57"), __webpack_require__(/*! common/site */ "./www/js/source/common/site.js"), __webpack_require__(/*! moment */ "./node_modules/moment/moment.js"), __webpack_require__(/*! bootstrap-daterangepicker */ "./node_modules/bootstrap-daterangepicker/daterangepicker.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($, Site, moment) {
        'use strict';

        let _daysOfWeek, _monthNames;

        function initCommonTextResource() {
            if (!_daysOfWeek || !_monthNames) {
                _daysOfWeek = [
                    Site.getSingleResource('Su'), Site.getSingleResource('Mo'), Site.getSingleResource('Tu'), Site.getSingleResource('We'),
                    Site.getSingleResource('Th'), Site.getSingleResource('Fr'), Site.getSingleResource('Sa')
                ];

                _monthNames = [
                    Site.getSingleResource('Jan'), Site.getSingleResource('Feb'), Site.getSingleResource('Mar'), Site.getSingleResource('Apr'),
                    Site.getSingleResource('May'), Site.getSingleResource('Jun'), Site.getSingleResource('Jul'), Site.getSingleResource('Aug'),
                    Site.getSingleResource('Sep'), Site.getSingleResource('Oct'), Site.getSingleResource('Nov'), Site.getSingleResource('Dec')
                ];
            }
        }

        function initDateRangePicker(firstDayOfWeekIsMonday, rangeOption) {
            const $dateRange = $('#DateRange');

            const $from = $('#FromDate');
            const $to = $('#ToDate');
            const start = moment($from.attr('data-original-from'), 'MM/DD/YYYY');
            const end = moment($to.attr('data-original-to'), 'MM/DD/YYYY');

            function setRangeDate(start, end) {
                $from.val(start.format('MM/DD/YYYY'));
                $to.val(end.format('MM/DD/YYYY'));
                $dateRange.val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
            }

            const now = moment($dateRange.attr('data-today'), 'MM/DD/YYYY');
            const isoDayOfWeek = firstDayOfWeekIsMonday ? 1 : 7; // 1.Monday  7.Sunday
            const startDayOfWeek = now.clone().startOf('week').isoWeekday(isoDayOfWeek);
            const startDayOfLastWeek = now.clone().subtract(1, 'week').startOf('week').isoWeekday(isoDayOfWeek);

            const ranges = {};
            ranges[Site.getSingleResource('Today')] = [now, now];
            ranges[Site.getSingleResource('Yesterday')] = [now.clone().subtract(1, 'days'), now.clone().subtract(1, 'days')];
            ranges[Site.getSingleResource('Currentweek')] = [startDayOfWeek, now];
            ranges[Site.getSingleResource('Lastweek')] = [startDayOfLastWeek, startDayOfLastWeek.clone().add(6, 'days')];
            ranges[Site.getSingleResource('Currentmonth')] = [now.clone().startOf('month'), now];
            ranges[Site.getSingleResource('Lastmonth')] = [now.clone().subtract(1, 'month').startOf('month'), now.clone().subtract(1, 'month').endOf('month')];
            ranges[Site.getSingleResource('Sincelastmonth')] = [now.clone().subtract(1, 'month').startOf('month'), now];

            const customRanges = {};
            const hasRangeOption = rangeOption && rangeOption.length > 0;
            if (hasRangeOption) {
                for (let i = 0; i < rangeOption.length; i++) {
                    const rangeLabel = Site.getSingleResource(rangeOption[i]);
                    customRanges[rangeLabel] = ranges[rangeLabel];
                }
            }

            initCommonTextResource();
            const locale = {
                format: 'MM/DD/YYYY',
                applyLabel: Site.getSingleResource('OK'),
                cancelLabel: Site.getSingleResource('Cancel'),
                daysOfWeek: _daysOfWeek,
                monthNames: _monthNames,
                firstDay: firstDayOfWeekIsMonday ? 1 : 0
            };

            $dateRange.daterangepicker({
                startDate: start,
                endDate: end,
                minDate: moment($dateRange.attr('data-mindate'), 'MM/DD/YYYY'),
                maxDate: moment($dateRange.attr('data-maxdate'), 'MM/DD/YYYY'),
                ranges: hasRangeOption ? customRanges : ranges,
                locale: locale,
                showDropdowns: true,
                linkedCalendars: false,
                alwaysShowCalendars: true,
                showCustomRangeLabel: false
            }, setRangeDate);

            $dateRange.on('apply.daterangepicker', function (ev, picker) {
                setRangeDate(picker.startDate, picker.endDate);
            });

            $dateRange.on('show.daterangepicker', function (ev, picker) {
                const toDate = picker.endDate || new Date();
                const toMoment = moment(toDate);

                picker.rightCalendar.month = toMoment;
                picker.renderCalendar('right');
            });

            $('.date-range').on('click', '.icon-calendar', function () {
                $dateRange.data('daterangepicker').toggle();
            });

            setRangeDate(start, end);
        }

        function initSingleDatePicker(idElement, parentElement) {
            const $picker = $('#' + idElement);
            initCommonTextResource();
            const locale = {
                format: 'MM/DD/YYYY',
                daysOfWeek: _daysOfWeek,
                monthNames: _monthNames
            };

            $picker.daterangepicker({
                startDate: moment($picker.attr('data-original'), 'MM/DD/YYYY'),
                endDate: moment($picker.attr('data-original'), 'MM/DD/YYYY'),
                minDate: moment($picker.attr('data-mindate'), 'MM/DD/YYYY'),
                maxDate: moment($picker.attr('data-maxdate'), 'MM/DD/YYYY'),
                locale: locale,
                singleDatePicker: true,
                showDropdowns: true,
                parentEl: parentElement ? parentElement : '.single-date'
            });

            $('.single-date').on('click', '.icon-calendar', function () {
                $picker.data('daterangepicker').toggle();
            });
        }

        function setValueForDateRange(startDate, endDate) {
            if (startDate) {
                $('#DateRange').data('daterangepicker').setStartDate(startDate);
                $('#FromDate').val(startDate);
            }

            if (endDate) {
                $('#DateRange').data('daterangepicker').setEndDate(endDate);
                $('#ToDate').val(startDate);
            }
        }

        function setValueForSingleDate($element, dateValue) {
            $element.val(dateValue);
        }

        return {
            initDateRangePicker: initDateRangePicker,
            initSingleDatePicker: initSingleDatePicker,
            setValueForDateRange: setValueForDateRange,
            setValueForSingleDate: setValueForSingleDate
        };
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./www/js/source/components/pluginhelper/monthpicker.js":
/*!**************************************************************!*\
  !*** ./www/js/source/components/pluginhelper/monthpicker.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;﻿!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js?fe57"), __webpack_require__(/*! lib/jquery.monthpicker */ "./www/js/source/lib/jquery.monthpicker.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($) {
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
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./www/js/source/components/selectlist.js":
/*!************************************************!*\
  !*** ./www/js/source/components/selectlist.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;﻿!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js?fe57")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($) {
    'use strict';

    const CONTAINER_SELECTOR = '.select-list-container';
    const DISABLED_CLASS = 'disabled';
    const HIGHLIGHT_CLASS = 'highlighted';

    function getLabelHtml(option) {
        const targetDropdownId = option.selectionId + '-result-container';
        const className = option.isDisabled ? 'selection disabled' : 'selection';
        return '<div class="select-list-container">' +
                '<div class="' + className + '" id="' + option.selectionId + '" aria-targetDropdown="' + targetDropdownId + '">' +
                    '<div class="selection-label">' + option.labelText + '</div>' +
                    '<div class="selection-icon"><span class="selection-icon-arrow"></span></div>' +
                '</div>' +
            '</div>';
    }

    function getSearchBoxHtml(isShow) {
        return isShow ? '<div class="select-list-dropdown-search"><input class="select-list-search-results" autocomplete="off" /></div>' : '';
    }

    function getOptionItemHtml(dataItem) {
        return '<li class="option-item ' + dataItem.className + '" data-key="' + dataItem.key + '">' + dataItem.value + '</li>';
    }

    function getOptionListHtml(dataList) {
        const htmlArray = ['<div class="select-list-dropdown-results"><ul class="option-list">'];

        for (let i = 0; i < dataList.length; i++) {
            const dataItem = dataList[i];
            htmlArray.push(getOptionItemHtml(dataItem));
        }

        htmlArray.push('</ul></div>');

        return htmlArray.join('');
    }

    function scrollToHighLightItem($container, $item, index) {
        const itemTop = $item.offset().top;
        const itemHeight = $item.outerHeight();
        const containerTop = $container.offset().top;
        let scrollUp = null;
        if (itemTop <= containerTop) {
            scrollUp = true;
        }
        else if (itemTop >= containerTop + $container.height()) {
            scrollUp = false;
        }
        if (scrollUp === null) {
            return;
        }
        if (scrollUp) {
            $container.scrollTop(itemHeight * (index - 1) - $container.height());
        }
        else {
            $container.scrollTop(itemHeight * index);
        }
    }

    function keyUp($element) {
        const $selectList = $element.closest('.select-list-dropdown').find('.select-list-dropdown-results');
        const showOptionList = $selectList.find('.option-item:visible');
        const $highlightItem = $selectList.find('.option-item.' + HIGHLIGHT_CLASS + ':visible').first();
        const index = showOptionList.index($highlightItem);

        $highlightItem.removeClass(HIGHLIGHT_CLASS);
        if ($highlightItem.length > 0 && index !== 0) {
            const $preItem = showOptionList.eq(index - 1);
            $preItem.addClass(HIGHLIGHT_CLASS);
            scrollToHighLightItem($selectList, $preItem, index - 1);
        }
        else {
            showOptionList.last().addClass(HIGHLIGHT_CLASS);
            $selectList.scrollTop(showOptionList.length * $highlightItem.outerHeight());
        }
    }

    function keyDown($element) {
        const $selectList = $element.closest('.select-list-dropdown').find('.select-list-dropdown-results');
        const showOptionList = $selectList.find('.option-item:visible');
        const $highlightItem = $selectList.find('.option-item.' + HIGHLIGHT_CLASS + ':visible').first();
        const index = showOptionList.index($highlightItem);

        $highlightItem.removeClass(HIGHLIGHT_CLASS);
        if ($highlightItem.length > 0 && index !== (showOptionList.length - 1)) {
            const $nextItem = showOptionList.eq(index + 1);
            $nextItem.addClass(HIGHLIGHT_CLASS);
            scrollToHighLightItem($selectList, $nextItem, index + 1);
        }
        else {
            showOptionList.first().addClass(HIGHLIGHT_CLASS);
            $selectList.scrollTop(0);
        }
    }

    function keySearch($element, canEnter) {
        setTimeout(function () {
            const query = $element.val().toUpperCase();
            const $selectList = $element.closest('.select-list-dropdown').find('.select-list-dropdown-results');
            const optionList = $selectList.find('.option-item');
            let isFirstItem = canEnter;
            if (canEnter) {
                optionList.removeClass(HIGHLIGHT_CLASS);
            }
            optionList.each(function (index, item) {
                const $item = $(item);
                const currentText = $item.text().toUpperCase();
                if (currentText.indexOf(query) === -1) {
                    $item.hide();
                }
                else {
                    if (isFirstItem) {
                        $item.addClass(HIGHLIGHT_CLASS);
                        isFirstItem = false;
                        $selectList.scrollTop(0);
                    }
                    $item.show();
                }
            });
        }, 100);
    }

    function enter($element) {
        const $highlightItem = $element.closest('.select-list-dropdown').find('.option-item.' + HIGHLIGHT_CLASS + ':visible');
        $highlightItem.click();
    }

    function getDropdownList(resultContainerId, canSearch, canEnter) {
        /*jshint validthis: true*/
        const $originalSelectElement = $(this);
        const dataList = $originalSelectElement.find('option').map(function (index, item) {
            const key = item.value;
            const text = item.text;

            return { key: key, value: text, className: item.className };
        });
        const selectedValue = $originalSelectElement.val();

        const dropdownListHtml = '<div id="' + resultContainerId + '" class="select-list-result-container"><div class="select-list-dropdown">' +
                                getSearchBoxHtml(canSearch) + getOptionListHtml(dataList) +
                            '</div></div>';
        const $dropdown = $(dropdownListHtml);
        $dropdown.find('.option-item[data-key="' + selectedValue + '"]').addClass(HIGHLIGHT_CLASS);

        $dropdown.on('click', '.option-item', function () {
            $('.option-item').removeClass(HIGHLIGHT_CLASS);
            $(this).addClass(HIGHLIGHT_CLASS);
            const selectedKey = $(this).data('key');
            $originalSelectElement.val(selectedKey);

            $originalSelectElement.trigger('change');
        });

        const $searchBox = $dropdown.find('.select-list-search-results');

        $searchBox.on('click', function (e) {
            e.stopPropagation();
        });

        if (canEnter) {
            $searchBox.on('keyup', function (e) {
                const $this = $(this);
                if (e.keyCode === 40) {
                    keyDown($this);
                }
                else if (e.keyCode === 38) {
                    keyUp($this);
                }
                else if (e.keyCode === 13) {
                    enter($this);
                }
                else {
                    keySearch($this, true);
                }
            });
        }
        else {
            $searchBox.on('keyup', function () {
                const $this = $(this);
                keySearch($this, false);
            });
        }

        return $dropdown;
    }

    function generateId($element) {
        let id = '';

        if ($element.attr('id') !== null) {
            id = $element.attr('id');
        } else if ($element.attr('name') !== null) {
            id = $element.attr('name') + '-' + generateChars(2);
        } else {
            id = generateChars(4);
        }

        id = id.replace(/(:|\.|\[|\]|,)/g, '');
        id = 'select-list-' + id;

        return id;
    }

    function generateChars(length) {
        let chars = '';

        for (let i = 0; i < length; i++) {
            const randomChar = Math.floor(Math.random() * 36);
            chars += randomChar.toString(36);
        }

        return chars;
    }

    function closeAll() {
        $('.select-list-result-container').remove();
    }

    const defaultOption = {
        canSearch: false,
        canEnter: false,
        isDisabled: false,
        beforeOpen: function () { },
        afterOpen: function () { }
    };

    const _methods = {
        init: function (options) {
            const selectListOption = $.extend({}, defaultOption, options || {});

            return this.each(function () {
                const self = this;
                const $element = $(self);
                if (!selectListOption.canSearch) {
                    selectListOption.canSearch = $element.attr('data-can-search') === '1';
                }
                if (!selectListOption.canEnter) {
                    selectListOption.canEnter = $element.attr('data-can-enter') === '1';
                }

                _methods.buildLabel.call(self);

                const $container = $element.parent();
                $container.off('click', '.selection');
                $container.on('click', '.selection', function () {
                    const $selection = $(this);
                    if (!$selection.hasClass(DISABLED_CLASS)) {
                        _methods.toggle.call(self, selectListOption);
                    }
                });

                $element.on('change', function () {
                    _methods.update.call(self);
                });

                $('html').on('click', function (e) {
                    const $target = $(e.target);

                    if (!$target.closest(CONTAINER_SELECTOR).length) {
                        closeAll();
                    }
                });
            });
        },

        buildLabel: function (option) {
            const newOption = option || {};
            const $self = $(this);
            $self.siblings(CONTAINER_SELECTOR).remove();
            const optionSelected = $self.find('option:selected');
            const labelText = optionSelected.length ? optionSelected.text() : '';
            const selectionId = generateId($self);

            newOption.labelText = labelText;
            newOption.selectionId = selectionId;
            const $selectionLabel = $(getLabelHtml(newOption));

            $self.hide().parent().append($selectionLabel);
        },

        open: function (resultContainerId, canSearch, canEnter) {
            closeAll();

            const $self = $(this);
            const $dropdown = getDropdownList.call(this, resultContainerId, canSearch, canEnter);

            const $selection = $self.siblings(CONTAINER_SELECTOR).find('.selection');
            const offset = $selection.offset();
            $dropdown.css({ top: (offset.top + 26) + 'px', left: offset.left + 'px', width: $selection.width() + 'px' });

            $('body').append($dropdown);
            $dropdown.find('.select-list-search-results').focus();
        },

        close: function () {
            const $this = $(this);
            const $selection = $this.siblings(CONTAINER_SELECTOR).find('.selection');
            const resultContainerId = $selection.attr('aria-targetDropdown');
            $('#' + resultContainerId).remove();
        },

        toggle: function (option) {
            const $this = $(this);
            const $selection = $this.siblings(CONTAINER_SELECTOR).find('.selection');
            const resultContainerId = $selection.attr('aria-targetDropdown');

            if (resultContainerId && resultContainerId.length > 0) {
                const $currentDropdown = $('#' + resultContainerId);
                const isShowing = $currentDropdown.length > 0;

                if (isShowing) {
                    $currentDropdown.remove();
                }
                else {
                    if (typeof option.beforeOpen === 'function') {
                        option.beforeOpen.call(this);
                    }

                    _methods.open.call(this, resultContainerId, option.canSearch, option.canEnter);

                    if (typeof option.afterOpen === 'function') {
                        option.afterOpen.call(this);
                    }
                }
            }
        },

        update: function (option) {
            _methods.buildLabel.call(this, option);
        },

        disabled: function (isDisabled) {
            const $selection = $(this).siblings(CONTAINER_SELECTOR).find('.selection');
            $selection.toggleClass(DISABLED_CLASS, !!isDisabled);
        }
    };

    $.fn.selectList = function (methodOrOptions) {
        if (_methods[methodOrOptions]) {
            return _methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            return _methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on selectList');
        }
    };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./www/js/source/extensions/prototype.js":
/*!***********************************************!*\
  !*** ./www/js/source/extensions/prototype.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
﻿/// <reference path="/@JSense.js" />
///
/*
* @Alex-1/11/2013
* The below function will work adequatly for the six simple types I mentioned,
* as long as data in the objects and arrays form a tree structure.That is, there isn't
* more than one reference to the same data in the object.
*
*/

//#region String Prototype

/* jshint ignore:start */
String.prototype.format = function () {
    /// <summary>
    /// simply format method
    /// </summary>
    /// <returns type="string">formated string</returns>
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        formatted = formatted.replace("{" + i + "}", arguments[i]);
    }
    return formatted;
};
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};

String.prototype.ltrim = function () {
    return this.replace(/^\s*/g, '');
};

String.prototype.rtrim = function () {
    return this.replace(/\s*$/g, '');
};
String.prototype.replaceAll = function (token, newToken, ignoreCase) {
    var _token;
    var str = this + "";
    var i = -1;

    if (typeof token === "string") {
        if (ignoreCase) {
            _token = token.toLowerCase();

            while ((
                i = str.toLowerCase().indexOf(
                    token, i >= 0 ? i + newToken.length : 0
                )) !== -1
            ) {
                str = str.substring(0, i) +
                    newToken +
                    str.substring(i + token.length);
            }
        } else {
            return this.split(token).join(newToken);
        }
    }
    return str;
};

//#endregion

//#region Array prototype

Array.prototype.remove = function (value, fieldName) {
    /// <summary>
    ///
    /// Remove specific element in array
    /// </summary>
    /// <param name="value"> element or value of field in object</param>
    /// <param name="fieldName">Name of a field in object</param>
    for (var i = 0; i < this.length; ++i) {
        if (typeof this[i] == 'object' && fieldName !== undefined) {
            if (this[i][fieldName] !== undefined && this[i][fieldName] == value) {
                this.splice(i, 1);
                return;
            }
        } else {
            if (this[i] == value) {
                this.splice(i, 1);
                return;
            }
        }
    }
};
Array.prototype.insertAfter = function (value, after) {
    /// <summary>
    ///
    /// </summary>
    /// <param name="value">element</param>
    /// <param name="after">position</param>
    this.splice(after + 1, 0, value);
};
Array.prototype.insertBefore = function (value, before) {
    /// <summary>
    ///
    /// </summary>
    /// <param name="value">element</param>
    /// <param name="before">position</param>
    this.splice(before, 0, value);
};

//#endregion

/* jshint ignore:end */

/***/ }),

/***/ "./www/js/source/lib/jquery.monthpicker.js":
/*!*************************************************!*\
  !*** ./www/js/source/lib/jquery.monthpicker.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/// <reference path="/@JSense.js" />
/*
* monPickr - jQuery Plugin
* Just a simple month picker
*
* Examples and documentation at: http://update.later
*
* Version: 0.0.2 (9 Feb 2012)
* Requires: jQuery v1.7+
*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! common/site */ "./www/js/source/common/site.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (Site) {
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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js?fe57")))

/***/ }),

/***/ "./www/js/source/pages/report/livereport/helper.js":
/*!*********************************************************!*\
  !*** ./www/js/source/pages/report/livereport/helper.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;﻿!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! common/querystring */ "./www/js/source/common/querystring.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (QueryString) {
    'use strict';
    function setSumParams(url, totalValue) {
        let newUrl = url;
        newUrl = QueryString.setParam(newUrl, 'totalrows', totalValue.BetCount);
        newUrl = QueryString.setParam(newUrl, 'sumwinlost', totalValue.CustomerWinLoss);
        newUrl = QueryString.setParam(newUrl, 'sumplayercomm', totalValue.CustomerComm);
        newUrl = QueryString.setParam(newUrl, 'sumlicenseewl', totalValue.LicenseeWinLoss);
        newUrl = QueryString.setParam(newUrl, 'sumcomm', totalValue.LicenseeComm);
        newUrl = QueryString.setParam(newUrl, 'sumturnover', totalValue.TurnOver);
        newUrl = QueryString.setParam(newUrl, 'sumamtdueto3rd', totalValue.AmountDue);

        return newUrl;
    }

    function getMatchListProductOption(sportId, productCode) {
        const newSportId = Number(sportId);
        let productOptions = [];
        if (newSportId > 0) {
            if (newSportId === 180 || newSportId === 186) {
                productOptions.push('VS');
            }
            else if (newSportId === 162) {
                productOptions.push('LC');
            }
            else if (newSportId === 104 || (newSportId >= 190 && newSportId <= 194)) {
                productOptions.push('VS2');
            }
            else {
                if (productCode === 'SB' || productCode === 'ALL') {
                    productOptions.push('SB');
                }
                if (productCode === 'BA' || productCode === 'ALL') {
                    productOptions.push('BA');
                }
            }
        }
        else {
            if (productCode === 'ALL') {
                productOptions = ['SB', 'BA', 'NG', 'LC', 'VS', 'CS', 'VS2'];
            }
            else {
                productOptions.push(productCode);
            }
        }

        return productOptions;
    }

    return {
        setSumParams: setSumParams,
        getMatchListProductOption: getMatchListProductOption,
    };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./www/js/source/pages/report/livereport/livereport.js":
/*!*************************************************************!*\
  !*** ./www/js/source/pages/report/livereport/livereport.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;﻿!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js?fe57"), __webpack_require__(/*! common/querystring */ "./www/js/source/common/querystring.js"), __webpack_require__(/*! common/site */ "./www/js/source/common/site.js"), __webpack_require__(/*! components/pluginhelper/daterangepicker */ "./www/js/source/components/pluginhelper/daterangepicker.js"), __webpack_require__(/*! components/pluginhelper/monthpicker */ "./www/js/source/components/pluginhelper/monthpicker.js"), __webpack_require__(/*! ./helper */ "./www/js/source/pages/report/livereport/helper.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($, QueryString, Site, DatePicker, MonthPicker, Helper) {
        'use strict';

        function initialize() {
            Site.initialize();
            initEvent();
            DatePicker.initDateRangePicker();
            MonthPicker.initMonthPicker();
            Site.addUserGuide({
                resourceName: 'LiveReport',
                title: Site.getSingleResource('LiveReport')
            });
        }

        function initEvent() {
            $('#switchreport').click(function () {
                const mod = $(this).attr('data-history-mode');
                if (mod === 'False') {
                    Site.redirect(Site.resolveClientUrl('LiveReport?isViewedHistory=True'));
                }
                else {
                    Site.redirect(Site.resolveClientUrl('LiveReport?isViewedHistory=False'));
                }
            });

            $('body').on('click', '.product-detail-link', function () {
                viewProductDetail(this);
            });

            $('body').on('click', '.sport-detailt-link', function () {
                viewSportDetail(this);
            });

            $('#exporttoexcel').click(function () {
                $('#IsExportExcel').val(true);
                $('#livereport').submit();
                $('#IsExportExcel').val(false);
            });

            $('#btnSubmit').click(function () {
                Site.blockUI();
                $('#livereport').submit();
            });
        }

        function viewProductDetail(target) {
            const productCode = $(target).attr('data-product-code');
            let data = {
                productCode: productCode,
                FromDate: $('#FromDate').attr('data-original-from'),
                ToDate: $('#ToDate').attr('data-original-to'),
                BaseCurrency: $('#BaseCurrency').attr('data-original'),
                LiveIndicator: $('#LiveIndicator').attr('data-original')
            };
            data = Site.setLicenseeOptionOriginalParam(data);
            const isSelected = $(target).parent().hasClass('selected');
            if (isSelected) { return; }

            $('a.product-detail-link').parent().removeClass('selected');
            $(target).parent().addClass('selected');

            $.ajax({
                type: 'POST',
                data: data,
                dataType: 'json',
                url: Site.resolveClientUrl('LiveReport/Detail'),
                beforeSend: Site.blockUI,
                complete: function (jqXHR) {
                    if (jqXHR.readyState === 4) {
                        $('#ProductCode').val(data.productCode);
                        $('#detail-content').html(jqXHR.responseText);
                    }
                    Site.unBlockUI();
                }
            });
        }

        function viewBetList(url, totalValue, productOptions) {
            let newUrl = Site.setLicenseeOptionOriginalParam(url);
            newUrl = QueryString.setParam(newUrl, 'fromdate', $('#FromDate').attr('data-original-from'));
            newUrl = QueryString.setParam(newUrl, 'todate', $('#ToDate').attr('data-original-to'));
            newUrl = QueryString.setParam(newUrl, 'LiveIndicator', $('#LiveIndicator').attr('data-original'));
            newUrl = Helper.setSumParams(newUrl, totalValue);
            newUrl = Site.setProductCodeListParam(newUrl, productOptions);

            Site.blockUI();
            Site.redirect(newUrl);
        }

        function viewSportDetail(target) {
            const data = $(target).attr('data-drill-down');
            const jsonData = $.parseJSON(data);
            const productCode = $('#ProductCode').val();
            // after users back from match list, 
            // the report does not show detailed data, 
            // so remove product code to not show detailed data in EXPORT EXCEL
            $('#ProductCode').val('');
            const productOptions = Helper.getMatchListProductOption(jsonData.SportId, productCode);
            const urlMap = {
                Key101: 'LiveReportBetList/MixParlay?bettype=9',
                Key102: 'LiveReportBetList/MixParlay?bettype=29',
                Key103: 'LiveReportBetList/Outright',
                Key161: 'LiveReportBetList/NumberGame?Sporttype=161',
                Key164: 'LiveReportBetList/NumberGame?Sporttype=164',
                Key181: 'LiveReportBetList/VirtualSports?SportType=181',
                Key182: 'LiveReportBetList/VirtualSports?SportType=182',
                Key183: 'LiveReportBetList/VirtualSports?SportType=183',
                Key184: 'LiveReportBetList/VirtualSports?SportType=184',
                Key185: 'LiveReportBetList/VirtualSports?SportType=185',
                Key104: 'LiveReportBetList/MixParlay?bettype=2799'
            };

            let url = urlMap['Key' + jsonData.SportId];
            if (url) {
                viewBetList(Site.resolveClientUrl(url), jsonData.TotalValue, productOptions);
            }
            else {
                // Match List
                url = Site.resolveClientUrl('LiveReport/MatchList');
                url = Site.setLicenseeOptionOriginalParam(url);
                url = QueryString.setParam(url, 'SportId', jsonData.SportId);
                url = QueryString.setParam(url, 'ProductCode', productCode);
                url = QueryString.setParam(url, 'FromDate', $('#FromDate').attr('data-original-from'));
                url = QueryString.setParam(url, 'ToDate', $('#ToDate').attr('data-original-to'));
                url = QueryString.setParam(url, 'LiveIndicator', $('#LiveIndicator').attr('data-original'));
                url = Site.setProductCodeListParam(url, productOptions);

                Site.blockUI();
                Site.redirect(url);
            }
        }

        return {
            initialize: initialize
        };
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./www/js/source/pages/report/livereport/main-livereport.js":
/*!******************************************************************!*\
  !*** ./www/js/source/pages/report/livereport/main-livereport.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;﻿!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./livereport */ "./www/js/source/pages/report/livereport/livereport.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (LiveReport) {
    'use strict';
    $(LiveReport.initialize);
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js?fe57")))

/***/ }),

/***/ 2:
/*!************************************************************************!*\
  !*** multi ./www/js/source/pages/report/livereport/main-livereport.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./www/js/source/pages/report/livereport/main-livereport.js */"./www/js/source/pages/report/livereport/main-livereport.js");


/***/ })

/******/ });
//# sourceMappingURL=livereport.chunk.js.map