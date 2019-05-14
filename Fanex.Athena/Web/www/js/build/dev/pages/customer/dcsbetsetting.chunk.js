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
/******/ 		"www/js/build/dev/pages/customer/dcsbetsetting": 0
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
/******/ 	deferredModules.push([44,"www/js/build/dev/pages/lib/common"]);
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

/***/ "./www/js/source/lib/jquery.balloon.js":
/*!*********************************************!*\
  !*** ./www/js/source/lib/jquery.balloon.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/// <reference path="/@JSense.js" />
/**
* Hover balloon on elements without css and images.
*
* Copyright (c) 2011 Hayato Takenaka
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
* @author: Hayato Takenaka (http://urin.take-uma.net)
* @version: 0.3.0 - 2012/02/25
**/
; (function ($) {
    //-----------------------------------------------------------------------------
    // Private
    //-----------------------------------------------------------------------------
    // Helper for meta programming
    var Meta = {};
    Meta.pos = $.extend(["top", "bottom", "left", "right"], { camel: ["Top", "Bottom", "Left", "Right"] });
    Meta.size = $.extend(["height", "width"], { camel: ["Height", "Width"] });
    Meta.getRelativeNames = function (position) {
        var idx = {
            pos: {
                o: position,                                          // origin
                f: (position % 2 == 0) ? position + 1 : position - 1, // faced
                p1: (position % 2 == 0) ? position : position - 1,
                p2: (position % 2 == 0) ? position + 1 : position,
                c1: (position < 2) ? 2 : 0,
                c2: (position < 2) ? 3 : 1
            },
            size: {
                p: (position < 2) ? 0 : 1, // parallel
                c: (position < 2) ? 1 : 0  // cross
            }
        };
        var names = {};
        for (var m1 in idx) {
            if (!names[m1]) names[m1] = {};
            for (var m2 in idx[m1]) {
                names[m1][m2] = Meta[m1][idx[m1][m2]];
                if (!names.camel) names.camel = {};
                if (!names.camel[m1]) names.camel[m1] = {};
                names.camel[m1][m2] = Meta[m1].camel[idx[m1][m2]];
            }
        }
        names.isTopLeft = (names.pos.o == names.pos.p1);
        return names;
    };

    // Helper class to handle position and size as numerical pixels.
    function NumericalBoxElement() { this.initialize.apply(this, arguments); }
    (function () {
        // Method factories
        var Methods = {
            setBorder: function (pos, isVertical) {
                return function (value) {
                    this.$.css("border-" + pos.toLowerCase() + "-width", value + "px");
                    this["border" + pos] = value;
                    return (this.isActive) ? digitalize(this, isVertical) : this;
                }
            },
            setPosition: function (pos, isVertical) {
                return function (value) {
                    this.$.css(pos.toLowerCase(), value + "px");
                    this[pos.toLowerCase()] = value;
                    return (this.isActive) ? digitalize(this, isVertical) : this;
                }
            }
        };

        NumericalBoxElement.prototype = {
            initialize: function ($element) {
                this.$ = $element;
                $.extend(true, this, this.$.offset(), { center: {}, inner: { center: {}} });
                for (var i = 0; i < Meta.pos.length; i++) {
                    this["border" + Meta.pos.camel[i]] = parseInt(this.$.css("border-" + Meta.pos[i] + "-width")) || 0;
                }
                this.active();
            },
            active: function () { this.isActive = true; digitalize(this); return this; },
            inactive: function () { this.isActive = false; return this; }
        };
        for (var i = 0; i < Meta.pos.length; i++) {
            NumericalBoxElement.prototype["setBorder" + Meta.pos.camel[i]] = Methods.setBorder(Meta.pos.camel[i], (i < 2));
            if (i % 2 == 0)
                NumericalBoxElement.prototype["set" + Meta.pos.camel[i]] = Methods.setPosition(Meta.pos.camel[i], (i < 2));
        }

        function digitalize(box, isVertical) {
            if (isVertical == undefined) { digitalize(box, true); return digitalize(box, false); }
            var m = Meta.getRelativeNames((isVertical) ? 0 : 2);
            box[m.size.p] = box.$["outer" + m.camel.size.p]();
            box[m.pos.f] = box[m.pos.o] + box[m.size.p];
            box.center[m.pos.o] = box[m.pos.o] + box[m.size.p] / 2;
            box.inner[m.pos.o] = box[m.pos.o] + box["border" + m.camel.pos.o];
            box.inner[m.size.p] = box.$["inner" + m.camel.size.p]();
            box.inner[m.pos.f] = box.inner[m.pos.o] + box.inner[m.size.p];
            box.inner.center[m.pos.o] = box.inner[m.pos.f] + box.inner[m.size.p] / 2;
            return box;
        }
    })();

    // Adjust position of balloon body
    function makeupBalloon($target, $balloon, options) {
        $balloon.stop(true, true);
        var outerTip, innerTip,
			initTipStyle = { position: "absolute", height: "0", width: "0", border: "solid 0 transparent" },
			target = new NumericalBoxElement($target),
			balloon = new NumericalBoxElement($balloon);
        balloon.setTop(-options.offsetY
			+ ((options.position && options.position.indexOf("top") >= 0) ? target.top - balloon.height
			: ((options.position && options.position.indexOf("bottom") >= 0) ? target.bottom
			: target.center.top - balloon.height / 2)));
        balloon.setLeft(options.offsetX
			+ ((options.position && options.position.indexOf("left") >= 0) ? target.left - balloon.width
			: ((options.position && options.position.indexOf("right") >= 0) ? target.right
			: target.center.left - balloon.width / 2)));
        if (options.tipSize > 0) {
            // Add hidden balloon tips into balloon body.
            if ($balloon.data("outerTip")) { $balloon.data("outerTip").remove(); $balloon.removeData("outerTip"); }
            if ($balloon.data("innerTip")) { $balloon.data("innerTip").remove(); $balloon.removeData("innerTip"); }
            outerTip = new NumericalBoxElement($("<div>").css(initTipStyle).appendTo($balloon));
            innerTip = new NumericalBoxElement($("<div>").css(initTipStyle).appendTo($balloon));
            // Make tip triangle, adjust position of tips.
            var m;
            for (var i = 0; i < Meta.pos.length; i++) {
                m = Meta.getRelativeNames(i);
                if (balloon.center[m.pos.c1] >= target[m.pos.c1] &&
					balloon.center[m.pos.c1] <= target[m.pos.c2]) {
                    if (i % 2 == 0) {
                        if (balloon[m.pos.o] >= target[m.pos.o] && balloon[m.pos.f] >= target[m.pos.f]) break;
                    } else {
                        if (balloon[m.pos.o] <= target[m.pos.o] && balloon[m.pos.f] <= target[m.pos.f]) break;
                    }
                }
                m = null;
            }
            if (m) {
                balloon["set" + m.camel.pos.p1]
					(balloon[m.pos.p1] + ((m.isTopLeft) ? 1 : -1) * (options.tipSize - balloon["border" + m.camel.pos.o]));
                makeTip(balloon, outerTip, m, options.tipSize, $balloon.css("border-" + m.pos.o + "-color"));
                makeTip(balloon, innerTip, m, options.tipSize - 2 * balloon["border" + m.camel.pos.o], $balloon.css("background-color"));
                $balloon.data("outerTip", outerTip.$).data("innerTip", innerTip.$);
            } else {
                $.each([outerTip.$, innerTip.$], function () { this.remove(); });
            }
        }
        // Make up balloon tip.
        function makeTip(balloon, tip, m, tipSize, color) {
            var len = Math.round(tipSize / 1.7320508);
            tip.inactive()
				["setBorder" + m.camel.pos.f](tipSize)
				["setBorder" + m.camel.pos.c1](len)
				["setBorder" + m.camel.pos.c2](len)
				["set" + m.camel.pos.p1]((m.isTopLeft) ? -tipSize : balloon.inner[m.size.p])
				["set" + m.camel.pos.c1](balloon.inner[m.size.c] / 2 - len)
				.active()
				.$.css("border-" + m.pos.f + "-color", color);
        }
    }

    // True if the event comes from the target or balloon.
    function isValidTargetEvent($target, e) {
        var b = $target.data("balloon") && $target.data("balloon").get(0);
        return !(b && (b == e.relatedTarget || $.contains(b, e.relatedTarget)));
    }

    //-----------------------------------------------------------------------------
    // Public
    //-----------------------------------------------------------------------------
    $.fn.balloon = function (options) {
        options = $.extend(true, {}, $.balloon.defaults, options);
        return this.one("mouseenter", function (e) {
            var $target = $(this), t = this;
            var $balloon = $target.unbind("mouseenter", arguments.callee)
				.showBalloon(options).mouseenter(function (e) {
				    isValidTargetEvent($target, e) && $target.showBalloon();
				}).data("balloon");
            if ($balloon) {
                $balloon.mouseleave(function (e) {
                    if (t == e.relatedTarget || $.contains(t, e.relatedTarget)) return;
                    $target.hideBalloon();
                }).mouseenter(function (e) { $target.showBalloon(); });
            }
        }).mouseleave(function (e) {
            var $target = $(this);
            isValidTargetEvent($target, e) && $target.hideBalloon();
        });
    };

    $.fn.showBalloon = function (options) {
        var $target, $balloon, offTimer;
        if (!$.balloon.defaults.css) $.balloon.defaults.css = {};
        if (options || !this.data("options"))
            this.data("options", $.extend(true, {}, $.balloon.defaults, options));
        options = this.data("options");
        return this.each(function () {
            $target = $(this);
            (offTimer = $target.data("offTimer")) && clearTimeout(offTimer);
            var contents = $.isFunction(options.contents)
				? options.contents()
				: (options.contents || $target.attr("title"));
            var isNew = !($balloon = $target.data("balloon"));
            if (isNew) $balloon = $("<div>").append(contents);
            if (!options.url && (!$balloon || $balloon.html() == "")) return;
            if (!isNew && contents && contents != $balloon.html()) $balloon.empty().append(contents);
            $target.removeAttr("title");
            if (options.url) {
                $balloon.load($.isFunction(options.url) ? options.url(this) : options.url, function (res, sts, xhr) {
                    if (options.ajaxComplete) options.ajaxComplete(res, sts, xhr);
                    makeupBalloon($target, $balloon, options);
                });
            }
            if (isNew) {
                $balloon
					.addClass(options.classname)
					.css(options.css)
					.css({ visibility: "hidden", position: "absolute" })
					.appendTo("body");
                $target.data("balloon", $balloon);
                makeupBalloon($target, $balloon, options);
                $balloon.hide().css("visibility", "visible");
            } else {
                makeupBalloon($target, $balloon, options);
            }
            $target.data("onTimer", setTimeout(function () {
                if (options.showAnimation) {
                    options.showAnimation.apply($balloon.stop(true, true), [options.showDuration]);
                } else {
                    $balloon.show(options.showDuration, function () {
                        if (this.style.removeAttribute) { this.style.removeAttribute("filter"); }
                    });
                }
            }, options.delay));
        });
    };

    $.fn.hideBalloon = function () {
        var options = this.data("options"), onTimer, offTimer;
        return this.each(function () {
            var $target = $(this);
            (onTimer = $target.data("onTimer")) && clearTimeout(onTimer);
            (offTimer = $target.data("offTimer")) && clearTimeout(offTimer);
            $target.data("offTimer", setTimeout(function () {
                var $balloon = $target.data("balloon");
                if (options.hideAnimation) {
                    $balloon && options.hideAnimation.apply($balloon.stop(true, true), [options.hideDuration]);
                } else {
                    $balloon && $balloon.stop(true, true).hide(options.hideDuration);
                }
            },
			options.minLifetime));
        });
    };

    $.balloon = {
        defaults: {
            contents: null, url: null, ajaxComplete: null, classname: null,
            position: "top", offsetX: 0, offsetY: 0, tipSize: 12,
            delay: 0, minLifetime: 200,
            showDuration: 100, showAnimation: null,
            hideDuration: 80, hideAnimation: function (d) { this.fadeOut(d); },
            css: {
                minWidth: "20px",
                padding: "5px",
                borderRadius: "6px",
                border: "solid 1px #777",
                boxShadow: "4px 4px 4px #555",
                color: "#666",
                backgroundColor: "#efefef",
                opacity: ($.support.opacity) ? "0.85" : null,
                zIndex: "32767",
                textAlign: "left"
            }
        }
    };
})(jQuery);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js?fe57")))

/***/ }),

/***/ "./www/js/source/lib/numberformat.js":
/*!*******************************************!*\
  !*** ./www/js/source/lib/numberformat.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * jquery.numberformatter - Formatting/Parsing Numbers in jQuery
 *
 * Originally written by
 * Michael Abernethy (mike@abernethysoft.com),
 * Andrew Parry (aparry0@gmail.com)
 *
 * Updated by Sven Busse
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * @author Sven Busse
 **/

// Customize to use AMD module
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js?fe57")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($) {
    function NumberFormatter() {
        this.defaults = {
            format: "#,###.00",
            locale: "us",
            decimalSeparatorAlwaysShown: false,
            nanForceZero: true,
            round: true,
            isFullLocale: false,
            overrideGroupSep: null,
            overrideDecSep: null,
            overrideNegSign: null,
            isPercentage: false,            // treats the input as a percentage (i.e. input multiplied by 100)
            autoDetectPercentage: true      // will search if the format string ends with '%', if it does then the above option is implicitly set
        };

        var nfLocales = { initialized: false };

        var nfLocalesLikeUS = ['ae', 'ar', 'au', 'ca', 'cn', 'eg', 'gb', 'hk', 'il', 'in', 'jp', 'mx', 'sa', 'sk', 'th', 'tw', 'us', 'za'];
        var nfLocalesLikeDE = ['at', 'be', 'br', 'de', 'dk', 'ee', 'es', 'gr', 'it', 'lt', 'lv', 'nl', 'pt', 'tr', 'vn'];
        var nfLocalesLikeFR = ['bg', 'cz', 'fi', 'fr', 'no', 'pl', 'ro', 'ru', 'se'];
        var nfLocalesLikeCH = ['ch'];

        var nfLocaleFormatting = [[".", ","], [",", "."], [",", " "], [".", "'"]];
        var nfAllLocales = [nfLocalesLikeUS, nfLocalesLikeDE, nfLocalesLikeFR, nfLocalesLikeCH];

        function init() {
            // write the arrays into the hashtable
            for (var localeGroupIdx = 0; localeGroupIdx < nfAllLocales.length; localeGroupIdx++) {
                var localeGroup = nfAllLocales[localeGroupIdx];
                for (var i = 0; i < localeGroup.length; i++) {
                    nfLocales[localeGroup[i]] = localeGroupIdx;
                }
            }

            nfLocales.initialized = true;
        }

        function formatCodes(locale, isFullLocale) {
            if (!nfLocales.initialized)
                init();

            // default values
            var dec = ".";
            var group = ",";
            var neg = "-";

            if (isFullLocale == false) {
                // Extract and convert to lower-case any language code from a real 'locale' formatted string, if not use as-is
                // (To prevent locale format like : "fr_FR", "en_US", "de_DE", "fr_FR", "en-US", "de-DE")
                if (locale.indexOf('_') != -1)
                    locale = locale.split('_')[1].toLowerCase();
                else if (locale.indexOf('-') != -1)
                    locale = locale.split('-')[1].toLowerCase();
            }

            // hashtable lookup to match locale with codes
            var codesIndex = nfLocales[locale];
            if (codesIndex) {
                var codes = nfLocaleFormatting[codesIndex];
                if (codes) {
                    dec = codes[0];
                    group = codes[1];
                }
            }
            return { dec: dec, group: group, neg: neg };
        }

        function _roundNumber(number, decimalPlaces) {
            var power = Math.pow(10, decimalPlaces || 0);
            var value = String(Math.round(number * power) / power);

            // ensure the decimal places are there
            if (decimalPlaces > 0) {
                var dp = value.indexOf(".");
                if (dp == -1) {
                    value += '.';
                    dp = 0;
                } else {
                    dp = value.length - (dp + 1);
                }

                while (dp < decimalPlaces) {
                    value += '0';
                    dp++;
                }
            }
            return value;
        }

        /**
         * Formats a Number object into a string, using the given formatting options
         *
         * @param {Object} numberString
         * @param {Object} options
         */
        function _formatNumber(number, options, suffix, prefix, negativeInFront) {
            options = $.extend({}, this.defaults, options);
            var formatData = formatCodes(options.locale.toLowerCase(), options.isFullLocale);

            var dec = formatData.dec;
            var group = formatData.group;
            var neg = formatData.neg;

            // check overrides
            if (options.overrideGroupSep != null) {
                group = options.overrideGroupSep;
            }
            if (options.overrideDecSep != null) {
                dec = options.overrideDecSep;
            }
            if (options.overrideNegSign != null) {
                neg = options.overrideNegSign;
            }

            // Check NAN handling
            var forcedToZero = false;
            if (isNaN(number)) {
                if (options.nanForceZero == true) {
                    number = 0;
                    forcedToZero = true;
                } else {
                    return '';
                }
            }

            // special case for percentages
            if (options.isPercentage == true || (options.autoDetectPercentage && suffix.charAt(suffix.length - 1) == '%')) {
                number = number * 100;
            }

            var returnString = "";
            if (options.format.indexOf(".") > -1) {
                var decimalPortion = dec;
                var decimalFormat = options.format.substring(options.format.lastIndexOf(".") + 1);

                // round or truncate number as needed
                if (options.round == true)
                    number = Number(_roundNumber(number, decimalFormat.length));
                else {
                    var numStr = number.toString();
                    if (numStr.lastIndexOf('.') > 0) {
                        numStr = numStr.substring(0, numStr.lastIndexOf('.') + decimalFormat.length + 1);
                    }
                    number = Number(numStr);
                }

                var decimalValue = Number(number.toString().substring(number.toString().indexOf('.')));
                var decimalString = String(_roundNumber(decimalValue, decimalFormat.length));
                decimalString = decimalString.substring(decimalString.lastIndexOf('.') + 1);
                for (var i = 0; i < decimalFormat.length; i++) {
                    if (decimalFormat.charAt(i) == '#' && decimalString.charAt(i) != '0') {
                        decimalPortion += decimalString.charAt(i);
                    } else if (decimalFormat.charAt(i) == '#' && decimalString.charAt(i) == '0') {
                        var notParsed = decimalString.substring(i);
                        if (notParsed.match('[1-9]')) {
                            decimalPortion += decimalString.charAt(i);
                        } else
                            break;
                    } else if (decimalFormat.charAt(i) == "0")
                        decimalPortion += decimalString.charAt(i);
                }
                returnString += decimalPortion
            } else
                number = Math.round(number);

            var ones = Math.floor(number);
            if (number < 0)
                ones = Math.ceil(number);

            var onesFormat = "";
            if (options.format.indexOf(".") == -1)
                onesFormat = options.format;
            else
                onesFormat = options.format.substring(0, options.format.indexOf("."));

            var onePortion = "";
            if (!(ones == 0 && onesFormat.substr(onesFormat.length - 1) == '#') || forcedToZero) {
                // find how many digits are in the group
                var oneText = String(Math.abs(ones));
                var groupLength = 9999;
                if (onesFormat.lastIndexOf(",") != -1)
                    groupLength = onesFormat.length - onesFormat.lastIndexOf(",") - 1;
                var groupCount = 0;
                for (i = oneText.length - 1; i > -1; i--) {
                    onePortion = oneText.charAt(i) + onePortion;
                    groupCount++;
                    if (groupCount == groupLength && i != 0) {
                        onePortion = group + onePortion;
                        groupCount = 0;
                    }
                }

                // account for any pre-data padding
                if (onesFormat.length > onePortion.length) {
                    var padStart = onesFormat.indexOf('0');
                    if (padStart != -1) {
                        var padLen = onesFormat.length - padStart;

                        // pad to left with 0's or group char
                        var pos = onesFormat.length - onePortion.length - 1;
                        while (onePortion.length < padLen) {
                            var padChar = onesFormat.charAt(pos);
                            // replace with real group char if needed
                            if (padChar == ',')
                                padChar = group;
                            onePortion = padChar + onePortion;
                            pos--;
                        }
                    }
                }
            }

            if (!onePortion && onesFormat.indexOf('0', onesFormat.length - 1) !== -1)
                onePortion = '0';

            returnString = onePortion + returnString;

            // handle special case where negative is in front of the invalid characters
            if (number < 0 && negativeInFront && prefix.length > 0)
                prefix = neg + prefix;
            else if (number < 0)
                returnString = neg + returnString;

            if (!options.decimalSeparatorAlwaysShown) {
                if (returnString.lastIndexOf(dec) == returnString.length - 1) {
                    returnString = returnString.substring(0, returnString.length - 1);
                }
            }
            returnString = prefix + returnString + suffix;
            return returnString;
        }

        /*  Formatting Methods  */

        /**
         * First parses a string and reformats it with the given options.
         *
         * @param {Object} numberString
         * @param {Object} options
         */
        this.formatNumber = function (numberString, options) {
            options = $.extend({}, this.defaults, options);
            var formatData = formatCodes(options.locale.toLowerCase(), options.isFullLocale);

            var dec = formatData.dec;
            var group = formatData.group;
            var neg = formatData.neg;

            var validFormat = "0#-,.";

            // in the prefix & suffix part of the format string, characters can be escaped
            // by surrounding them in single quotes, so they are not intepreted as formatting placeholders
            var singleQuote = '\'';
            var nextCharIsQuoted = false;

            // strip all the invalid characters at the beginning and the end
            // of the format, and we'll stick them back on at the end
            // make a special case for the negative sign "-" though, so
            // we can have formats like -$23.32
            var prefix = "";
            var negativeInFront = false;
            for (var i = 0; i < options.format.length; i++) {
                if (options.format.charAt(i) == singleQuote) {
                    if (options.format.charAt(i + 1) == singleQuote) {
                        prefix = prefix + singleQuote;
                    }
                    nextCharIsQuoted = !nextCharIsQuoted && options.format.charAt(i + 2) == singleQuote;
                } else if (validFormat.indexOf(options.format.charAt(i)) == -1 || nextCharIsQuoted) {
                    prefix = prefix + options.format.charAt(i);
                } else {
                    if (i == 0 && options.format.charAt(i) == '-') {
                        negativeInFront = true;
                    } else {
                        // end of prefix has been reached, remove it from format string
                        options.format = options.format.substring(i, options.format.length);
                        break;
                    }
                }
            }
            var suffix = "";
            for (i = options.format.length - 1; i >= 0; i--) {
                if (options.format.charAt(i) == singleQuote) {
                    if (options.format.charAt(i - 1) == singleQuote) {
                        suffix = singleQuote + suffix;
                    }
                    nextCharIsQuoted = !nextCharIsQuoted && options.format.charAt(i - 2) == singleQuote;
                } else if (validFormat.indexOf(options.format.charAt(i)) == -1 || nextCharIsQuoted) {
                    suffix = options.format.charAt(i) + suffix;
                } else {
                    // beginning of suffix has been reached, remove it from format string
                    options.format = options.format.substring(0, i + 1);
                    break;
                }
            }

            // now we need to convert it into a number
            //while (numberString.indexOf(group) > -1)
            //  numberString = numberString.replace(group, '');
            //var number = new Number(numberString.replace(dec, ".").replace(neg, "-"));
            var number = Number(numberString);

            return _formatNumber(number, options, suffix, prefix, negativeInFront);
        };
    }

    return NumberFormatter;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ }),

/***/ "./www/js/source/pages/customer/betsetting/common/betsetting.helper.js":
/*!*****************************************************************************!*\
  !*** ./www/js/source/pages/customer/betsetting/common/betsetting.helper.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;﻿
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js?fe57"), __webpack_require__(/*! common/site */ "./www/js/source/common/site.js"), __webpack_require__(/*! common/popup */ "./www/js/source/common/popup.js"), __webpack_require__(/*! lib/jquery.balloon */ "./www/js/source/lib/jquery.balloon.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($, Site, Popup) {
    
    function isInteger(text) {
        return /^\+?\d+$/.test(text);
    }

    const _me = {
        showDialogMesage: function (title, message) {
            const options = {
                title: title,
                height: 'auto',
                id: 'result-update-betsetting',
                onOpen: function () {
                    $('#btnSubmitBetSetting, #btnReset').prop('disabled', true);
                },
                onClose: function () {
                    $('#result-update-betsetting').remove();
                    $('#btnSubmitBetSetting, #btnReset').removeAttr('disabled');
                    setTimeout(function () {
                        Site.blockUI();
                        Site.getLocation().reload();
                    }, 500);
                },
                width: 450
            };

            const buttons = [
                {
                    text: Site.getSingleResource('OK'),
                    isClosedOnClick: true,
                    classes: 'btn btn-submit'
                }];

            Popup.openPopupWithButton('<div><p>' + message + '</p></div>', options, buttons);
        },

        convertToFloat: function (str) {
            const temp = str.replace(/,/g, '');
            const temp2 = temp.replace('.', '');

            if (isInteger(temp2)) {
                return parseFloat(temp);
            }
            else {
                return NaN;
            }
        },

        showBalloonMsg: function (elementSelector, strMsg) {
            const contents = '<div onclick="hideBalloonMsg(\'' + elementSelector + '\')" style="width:140px;" class="msgerr">' + strMsg + '</div>';

            $(elementSelector).blur(function () { _me.hideBalloonMsg(elementSelector); })
                              .focus()
                              .showBalloon({
                                  contents: contents
                              });
        },
        hideBalloonMsg: function (elementSelector) {
            $(elementSelector).hideBalloon();
        }
    };

    return _me;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./www/js/source/pages/customer/betsetting/common/betsetting.status.js":
/*!*****************************************************************************!*\
  !*** ./www/js/source/pages/customer/betsetting/common/betsetting.status.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;﻿
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js?fe57"), __webpack_require__(/*! common/site */ "./www/js/source/common/site.js"), __webpack_require__(/*! ./betsetting.helper */ "./www/js/source/pages/customer/betsetting/common/betsetting.helper.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($, Site, BetSettingHelper) {
    const _me = {
        update: function (url, postData) {
            $.ajax({
                type: 'POST',
                url: url,
                cache: false,
                data: postData,
                dataType: 'json',
                success: function (result) {
                    const messageResource = result.IsSuccessful ? 'MessageSuccess' : 'Fail';
                    BetSettingHelper.showDialogMesage(Site.getSingleResource(messageResource), result.Message);
                },
                error: function (request, status, err) {
                    BetSettingHelper.showDialogMesage(Site.getSingleResource('Error'), err);
                }
            });
        },

        getCommonPostData: function ($context) {
            const productId = parseInt($('#ProductId').val(), 10);
            const nickName = $context.data('nick-name');
            // update value  (0: enable, 1: disable) is opposed with current value (1: enable, 0: disable)
            const status = $context.data('status');
            const custId = $context.data('cust-id');

            return {
                productId: productId,
                nickname: nickName,
                status: status,
                custid: custId
            };
        }
    };

    return _me;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./www/js/source/pages/customer/betsetting/common/betsetting.validation.js":
/*!*********************************************************************************!*\
  !*** ./www/js/source/pages/customer/betsetting/common/betsetting.validation.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;﻿
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js?fe57"), __webpack_require__(/*! common/site */ "./www/js/source/common/site.js"), __webpack_require__(/*! ./betsetting.helper */ "./www/js/source/pages/customer/betsetting/common/betsetting.helper.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($, Site, BetSettingHelper) {
    const SPORTID_NUMBERGAME = 161;

    const _me = {
        checkValidationNumberGame: function () {
            if (!_me.checkLimitMinMaxBet(SPORTID_NUMBERGAME)) {
                return false;
            }

            const maxPerBallSelector = '#max-per-ball-161';
            const maxPerBall = BetSettingHelper.convertToFloat($(maxPerBallSelector).val());
            const maxPerBallLimit = BetSettingHelper.convertToFloat($(maxPerBallSelector).attr('data-max-value'));

            if (isNaN(maxPerBall)) {
                BetSettingHelper.showBalloonMsg(maxPerBallSelector, Site.getSingleResource('IncorrectMaxPerBall'));
                return false;
            }

            if (maxPerBallLimit > 0 && maxPerBall > maxPerBallLimit) {
                BetSettingHelper.showBalloonMsg(maxPerBallSelector, Site.getSingleResource('MaxPerBallLessThanOrEqual') + ' ' + maxPerBallLimit);
                return false;
            }

            return true;
        },

        checkLimitMinMaxBet: function (sportId) {
            const minBetId = '#min-bet-' + sportId;
            const maxBetId = '#max-bet-' + sportId;
            const maxPerMatchId = '#max-per-match-' + sportId;

            const $minBetTextBox = $(minBetId);
            const $maxBetTextBox = $(maxBetId);
            const $maxPerMatchTextBox = $(maxPerMatchId);
            if ($minBetTextBox.length === 0 ||
                $maxBetTextBox.length === 0 ||
                $maxPerMatchTextBox.length === 0) {
                return true;
            }

            // Get value in attribute
            const limitMinBet = BetSettingHelper.convertToFloat($minBetTextBox.attr('data-min-value'));
            const limitMaxBet = BetSettingHelper.convertToFloat($maxBetTextBox.attr('data-max-value'));
            const limitMaxPerMatch = BetSettingHelper.convertToFloat($maxPerMatchTextBox.attr('data-max-value'));
            const limitMaxPerMatchMin = BetSettingHelper.convertToFloat($maxPerMatchTextBox.attr('data-min-value'));

            const minBet = BetSettingHelper.convertToFloat($minBetTextBox.val());
            const maxBet = BetSettingHelper.convertToFloat($maxBetTextBox.val());
            const maxPerMatcth = BetSettingHelper.convertToFloat($maxPerMatchTextBox.val());

            // Check if minbet, maxbet, maxpermatch is valid number
            if (isNaN(minBet)) {
                BetSettingHelper.showBalloonMsg(minBetId, Site.getSingleResource('IncorrectMinBet'));
                return false;
            }
            if (isNaN(maxBet)) {
                BetSettingHelper.showBalloonMsg(maxBetId, Site.getSingleResource('IncorrectMaxBet'));
                return false;
            }
            if (isNaN(maxPerMatcth)) {
                BetSettingHelper.showBalloonMsg(maxPerMatchId, Site.getSingleResource('IncorrectMaxPerMatch'));
                return false;
            }

            if (minBet === 0 && maxBet === 0 && maxPerMatcth === 0) { return true; }

            // Check contrains
            // min bet <=maxbet <= max per match
            if (limitMinBet > 0 && minBet < BetSettingHelper.convertToFloat(limitMinBet.toString())) {
                BetSettingHelper.showBalloonMsg(minBetId, Site.getSingleResource('MinBetGreaterThanOrEqual') + ' ' + limitMinBet);
                return false;
            }
            if (limitMaxBet > 0 && maxBet > BetSettingHelper.convertToFloat(limitMaxBet.toString())) {
                BetSettingHelper.showBalloonMsg(maxBetId, Site.getSingleResource('MaxBetLessThanOrEqual') + ' ' + limitMaxBet);
                return false;
            }
            if (limitMaxPerMatchMin > 0 && maxPerMatcth < BetSettingHelper.convertToFloat(limitMaxPerMatchMin.toString())) {
                BetSettingHelper.showBalloonMsg(maxPerMatchId, Site.getSingleResource('MaxBetMatchMoreThanOrEqual') + ' ' + limitMaxPerMatchMin);
                return false;
            }
            if (limitMaxPerMatch > 0 && maxPerMatcth > BetSettingHelper.convertToFloat(limitMaxPerMatch.toString())) {
                BetSettingHelper.showBalloonMsg(maxPerMatchId, Site.getSingleResource('MaxBetMatchLessThanOrEqual') + ' ' + limitMaxPerMatch);
                return false;
            }
            if (minBet > maxBet) {
                BetSettingHelper.showBalloonMsg(minBetId, Site.getSingleResource('MinBetCanNotGreaterThanMaxBet'));
                return false;
            }
            if (maxBet > maxPerMatcth) {
                BetSettingHelper.showBalloonMsg(maxBetId, Site.getSingleResource('MaxBetCanNotGreaterThanMaxPerMatch'));
                return false;
            }

            return true;
        },

        checkLimitMinMaxBets: function (sportIds) {
            for (let i = 0; i < sportIds.length; i++) {
                if (!_me.checkLimitMinMaxBet(sportIds[i])) {
                    return false;
                }
            }

            return true;
        }
    };

    return _me;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./www/js/source/pages/customer/betsetting/common/betsettingbase.js":
/*!**************************************************************************!*\
  !*** ./www/js/source/pages/customer/betsetting/common/betsettingbase.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;﻿
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js?fe57"), __webpack_require__(/*! common/site */ "./www/js/source/common/site.js"), __webpack_require__(/*! common/popup */ "./www/js/source/common/popup.js"), __webpack_require__(/*! ./constant */ "./www/js/source/pages/customer/betsetting/common/constant.js"), __webpack_require__(/*! lib/numberformat */ "./www/js/source/lib/numberformat.js"), __webpack_require__(/*! ./betsetting.helper */ "./www/js/source/pages/customer/betsetting/common/betsetting.helper.js"), __webpack_require__(/*! ./betsetting.validation */ "./www/js/source/pages/customer/betsetting/common/betsetting.validation.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($, Site, Popup, Constant, NumberFormatter, BetSettingHelper, BetSettingValidation) {
        const Product = Constant.Product;

        const _me = {
            initialize: function () {
                $('#product-dropdown').on('change', function () {
                    const url = $(this).find('option:selected').data('href');
                    Site.blockUI();
                    Site.redirect(url);
                });
            },

            getSportIds: function () {
                const $idList = $('#IDList');
                return $idList.length ? $idList.val().split(',') : [];
            },

            setEnable: function () {
                const editable = $('#editable').val();
                const isEnable = !editable || editable === 'True';

                if (!isEnable) {
                    const sportIds = _me.getSportIds();

                    for (let i = 0; i < sportIds.length; i++) {
                        const sportId = sportIds[i];
                        const selector = '#min-bet-' + sportId + ',' + '#max-bet-' + sportId + ',' + '#max-per-match-' + sportId;
                        $(selector).prop('disabled', true);
                    }
                }
            },

            formatInputText: function () {
                const formatter = new NumberFormatter();

                $('input[type=text]').blur(function () {
                    const inputValue = $(this).val().replace(/,/g, '');
                    const formattedValue = formatter.formatNumber(inputValue, { format: '#,###,##0.##' });
                    $(this).val(formattedValue);
                });
            },

            resetInput: function () {
                $('#chkCopyAll').removeAttr('checked');
                $('input[id^="min"], input[id^="max-bet"], input[id^="max-per"]').each(function () {
                    $(this).val($(this).attr('data-original')).prop('disabled', false);
                });
            },

            showComfirm: function ($target, resourceMessage, callback) {
                const productId = parseInt($('#ProductId').val(), 10);
                const isValid = productId === Product.LiveCasino ? true :
                             productId === Product.NumberGame ? BetSettingValidation.checkValidationNumberGame() :
                                                                BetSettingValidation.checkLimitMinMaxBets(_me.getSportIds());
                if (!isValid) {
                    return;
                }

                const custId = $target.attr('data-cust-id');
                const userName = $target.attr('data-user-name');
                const nickName = $target.attr('data-nick-name');

                _me.showConfirmAction(Site.getSingleResource(resourceMessage), custId, userName, nickName, callback);
            },

            showConfirmAction: function (message, custId, userName, nickName, callback) {
                const options = {
                    title: Site.getSingleResource('Confirmation'),
                    height: 'auto',
                    id: 'confirm-update-betsetting',
                    onOpen: function () {
                        $('#btnSubmitBetSetting, #btnReset').prop('disabled', true);
                    },
                    onClose: function () {
                        $('#btnSubmitBetSetting, #btnReset').removeAttr('disabled');
                        $('#confirm-update-betsetting').remove();
                    },
                    width: 450
                };

                const buttons = [
                    {
                        text: Site.getSingleResource('OK'),
                        isClosedOnClick: true,
                        click: function () {
                            callback(custId, userName, nickName);
                        },
                        classes: 'btn btn-submit'
                    }, {
                        text: Site.getSingleResource('Cancel'),
                        isClosedOnClick: true,
                        classes: 'btn btn-cancel'
                    }];

                Popup.openPopupWithButton('<div><p>' + message + '</p></div>', options, buttons);
            },

            getBetSettingParamsForSports: function () {
                const params = {};
                const sportIds = _me.getSportIds();
                for (let i = 0; i < sportIds.length; i++) {
                    $.extend(params, _me.getBetSettingParams(sportIds[i]));
                }

                return params;
            },

            getBetSettingParams: function (sportId) {
                const $minbet = $('#min-bet-' + sportId);
                const $maxbet = $('#max-bet-' + sportId);
                const $maxPerMatch = $('#max-per-match-' + sportId);

                if ($minbet.length === 0 ||
                    $maxbet.length === 0 ||
                    $maxPerMatch.length === 0) {
                    return '';
                }

                let isUpdate = true;
                const originalMinBet = $('#min-bet-' + sportId).attr('data-original');
                const originalMaxBet = $('#max-bet-' + sportId).attr('data-original');
                const originalMaxPerMatch = $('#max-per-match-' + sportId).attr('data-original');

                // Check if data is changed
                if ($minbet.val() === originalMinBet
                    && $maxbet.val() === originalMaxBet
                    && $maxPerMatch.val() === originalMaxPerMatch) {
                    isUpdate = false;
                }

                // Data is changed, update it
                const minBet = BetSettingHelper.convertToFloat($minbet.val());
                const maxBet = BetSettingHelper.convertToFloat($maxbet.val());
                const maxPerMatcth = BetSettingHelper.convertToFloat($maxPerMatch.val());
                const betType = $('#bet-type-' + sportId).val();

                const result = {};
                result['minbet' + sportId] = minBet;
                result['maxbet' + sportId] = maxBet;
                result['maxpermatch' + sportId] = maxPerMatcth;
                result['update' + sportId] = isUpdate;
                result['bettype' + sportId] = betType;

                return result;
            },

            updateBetSetting: function (url, params) {
                $.ajax({
                    type: 'POST',
                    cache: false,
                    url: url,
                    data: params,
                    dataType: 'json',
                    success: function (result) {
                        const messageResource = Number(result.Code) === 0 ? 'MessageSuccess' : 'Fail';
                        BetSettingHelper.showDialogMesage(Site.getSingleResource(messageResource), result.Message);
                    }
                });
            }
        };

        return _me;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./www/js/source/pages/customer/betsetting/common/constant.js":
/*!********************************************************************!*\
  !*** ./www/js/source/pages/customer/betsetting/common/constant.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;﻿
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
    const Product = {
        Sportsbook: 0,
        Racing: 1,
        NumberGame: 2,
        LiveCasino: 4,
        VirtualSports: 5,
        RngCasino: 6,
        Keno: 8,
        AgCasino: 10,
        GoldDeluxe: 11,
        Macau: 12,
        BetTrade: 13,
        Colossusbets: 15,
        AllBet: 21,
        VoidBridge: 22,
        FishingWorld: 24,
        Cashout: 25,
        VirtualSports2: 27,
        Lottery: 28
    };

    const _me = {
        Product: Product
    };

    return _me;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./www/js/source/pages/customer/betsetting/main-dcsbetsetting.js":
/*!***********************************************************************!*\
  !*** ./www/js/source/pages/customer/betsetting/main-dcsbetsetting.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;﻿
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./products/dcsbetsetting */ "./www/js/source/pages/customer/betsetting/products/dcsbetsetting.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (DcsBetSetting) {
    $(DcsBetSetting.initialize);
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js?fe57")))

/***/ }),

/***/ "./www/js/source/pages/customer/betsetting/products/dcsbetsetting.js":
/*!***************************************************************************!*\
  !*** ./www/js/source/pages/customer/betsetting/products/dcsbetsetting.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;﻿/* AllBet, VoidBridge, FishingWorld */

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js?fe57"), __webpack_require__(/*! common/site */ "./www/js/source/common/site.js"), __webpack_require__(/*! ../common/constant */ "./www/js/source/pages/customer/betsetting/common/constant.js"),__webpack_require__(/*! ../common/betsettingbase */ "./www/js/source/pages/customer/betsetting/common/betsettingbase.js"), __webpack_require__(/*! ../common/betsetting.status */ "./www/js/source/pages/customer/betsetting/common/betsetting.status.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($, Site, Constant, BetSettingBase, BetSettingStatus) {
        const Product = Constant.Product;
        const ProductCodeMap = {};
        ProductCodeMap[Product.VirtualSports] = 'VS';
        ProductCodeMap[Product.VirtualSports2] = 'VS2';
        ProductCodeMap[Product.Lottery] = 'LT';

        function getConfirmMessage(productId) {
            const productNameResource = 'Product' + ProductCodeMap[productId];
            const message = Site.getSingleResource('UpdateProductBetSettings');
            return message.replace('{0}', Site.getSingleResource(productNameResource));
        }

        const _me = {
            initialize: function () {
                Site.initialize();
                BetSettingBase.initialize();
                BetSettingBase.setEnable();
                _me.initEvent();
                _me.checkToDisableInput();
            },

            initEvent: function () {
                $('#btnUpdateStatus').click(function () {
                    _me.updateStatus($(this));
                });

                $('#btnReset').on('click', function () {
                    BetSettingBase.resetInput();
                });

                $('#btnSubmitBetSetting').on('click', function () {
                    const productId = parseInt($('#ProductId').val(), 10);
                    const messageResource = getConfirmMessage(productId);

                    BetSettingBase.showComfirm($(this), messageResource, _me.updateBetSetting);
                });

                // Formating number in text box.
                BetSettingBase.formatInputText();
            },
            checkToDisableInput: function () {
                const enabled = $('#IsEnabled').val() !== '0';

                if (!enabled) {
                    $('.table-content input[type=text]').prop('disabled', true).addClass('disabled');
                    $('#btnSubmitBetSetting, #btnReset').prop('disabled', true).addClass('disabled');
                }
            },
            updateStatus: function ($context) {
                const url = Site.resolveClientUrl('DcsBetSetting/UpdateStatus');
                const params = BetSettingStatus.getCommonPostData($context);
                BetSettingStatus.update(url, params);
            },

            updateBetSetting: function (custId, userName, nickName) {
                const productId = parseInt($('#ProductId').val(), 10);
                
                const params = BetSettingBase.getBetSettingParamsForSports();
                params.custid = custId;
                params.userName = userName;
                params.nickName = nickName;
                params.productId = productId;

                BetSettingBase.updateBetSetting(Site.resolveClientUrl('DcsBetSetting/UpdateBetSetting'), params);
            }
        };

        return _me;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 44:
/*!*****************************************************************************!*\
  !*** multi ./www/js/source/pages/customer/betsetting/main-dcsbetsetting.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./www/js/source/pages/customer/betsetting/main-dcsbetsetting.js */"./www/js/source/pages/customer/betsetting/main-dcsbetsetting.js");


/***/ })

/******/ });
//# sourceMappingURL=dcsbetsetting.chunk.js.map