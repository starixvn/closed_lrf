/*global _language_en_US*/
define(['jquery', 'common/querystring', 'common/popup', 'extensions/prototype', 'components/selectlist'],  
    function ($, QueryString, Popup) {// jshint ignore:line
        'use strict';
        const BASE_CURRENT_LIST = ['EUR', 'USD', 'GBP'];
        let REQUEST_VERIFICATION_TOKEN;
        let _historyDate = null;
        let _rootUrl = null;
        let _pageLanguage = null;
        let _isFakeLicensee = null;

        function setProductCodeListParam(url, productCodeList){
            return QueryString.setParam(url, 'ProductCodeList', productCodeList);
        }

        function reload() {
            window.location.reload();
        }

        function resolveClientUrl(relativeUrl) {
            return _rootUrl + relativeUrl;
        }

        function setLicenseeOption(urlOrParams, currencyId, currencyName, baseCurrency) {
            const validCurrencyName = $.trim(currencyName);
            let returnUrlOrParams = urlOrParams;

            if (typeof (returnUrlOrParams) === 'string') {
                returnUrlOrParams = QueryString.setParam(returnUrlOrParams, 'CurrencyId', currencyId);
                returnUrlOrParams = QueryString.setParam(returnUrlOrParams, 'CurrencyName', validCurrencyName);
                returnUrlOrParams = QueryString.setParam(returnUrlOrParams, 'BaseCurrency', baseCurrency);
            }
            else {
                returnUrlOrParams.CurrencyId = currencyId;
                returnUrlOrParams.CurrencyName = validCurrencyName;
                returnUrlOrParams.BaseCurrency = baseCurrency;
            }

            return returnUrlOrParams;
        }

        function initSelectElements() {
            $('select.select').not('#CurrencyId').selectList();

            $('select#CurrencyId').selectList({ canSearch: true });
        }

        function initialize() {
            REQUEST_VERIFICATION_TOKEN = $('input[name=__RequestVerificationToken]').val();
            initSelectElements();
            currencyConstraint();
            initEvent();
            _historyDate = new Date($('#HistoryDate').val());
            _rootUrl = $('#RootUrl').val();
            _pageLanguage = $('#PageLanguage').val();
        }
        function initEvent() {
            $('#CurrencyId').change(function () {
                currencyConstraint(true);
            });

            $.ajaxSetup({
                cache: false,
                headers: { '__RequestVerificationToken': REQUEST_VERIFICATION_TOKEN },
                statusCode: {
                    0: function () {
                        unBlockUI();
                    },
                    400: function () {
                        unBlockUI();
                        alert(getSingleResource('InvalidRequestMsg'));
                    },
                    401: function () {
                        window.location.href = resolveClientUrl('Utility/LocationRestriction');
                    },
                    403: function () {
                        unBlockUI();
                        alert(getSingleResource('HttpError_403'));
                    },
                    500: function () {
                        unBlockUI();
                        alert(getSingleResource('ErrorProcessingMsg'));
                    }
                }
            });
        }
        function getHistoryDate() {
            return _historyDate;
        }
        function isBaseCurrency(currencyName) {
            return $.inArray(currencyName.toUpperCase(), BASE_CURRENT_LIST) > -1;
        }
        function addUserGuide(options) {
            const defaultOptions = {
                buttonSelector: '#UserGuide',
                id: 'UserGuidePopup'
            };
            const newOptions = $.extend(defaultOptions, options);
            newOptions.title = newOptions.title || '';
            const url = resolveClientUrl('UserGuide/Index?resourcename=' + newOptions.resourceName) + "&_" + (new Date().getTime());
            let $popup;
            let isRequesting = false;
            $(newOptions.buttonSelector).click(function () {
                const $userGuidePopup = $('<div style="display: none" ></div>');

                if (!$popup) {
                    if (isRequesting === false) {
                        isRequesting = true;
                        $userGuidePopup.empty().attr('style', '').hide()
                            .load(url, function (response, status) {
                                if (status === 'success') {
                                    setTimeout(function () {
                                        Popup.openPopup($userGuidePopup, defaultOptions);
                                        $popup = $('#' + defaultOptions.id);
                                    }, 50);
                                } else {
                                    $userGuidePopup.hide();
                                    isRequesting = false;
                                }
                            });
                    }
                } else {
                    $popup.flatPopup('show');
                }
            });
        }

        function asNull(text) {
            if (text === null || text.trim() === '') {
                return null;
            }

            return text;
        }

        function unBlockUI() {
            $('div.block-body').hide();
            $('div.loading').hide();
        }
        function blockUI() {
            $('div.block-body').show();
            $('div.loading').show();
        }

        function setLicenseeOptionParam(urlOrParams) {
            const currencyId = $('#CurrencyId').val();
            const baseCurrency = $('#BaseCurrency').val();

            const $currencyItem = $('#CurrencyId option[value=' + currencyId + ']');
            const currencyName = $currencyItem.length ? $currencyItem.text() : $('#CurrencyName').val();

            return setLicenseeOption(urlOrParams || {}, currencyId, currencyName, baseCurrency);
        }

        function setLicenseeOptionOriginalParam(urlOrParams) {
            const currencyId = $('#CurrencyId').attr('data-original');
            const baseCurrency = $('#BaseCurrency').attr('data-original');

            const $currencyItem = $('#CurrencyId option[value=' + currencyId + ']');
            const currencyName = $currencyItem.length ? $currencyItem.text() : $('#CurrencyName').val();

            return setLicenseeOption(urlOrParams, currencyId, currencyName, baseCurrency);
        }

        function updateOriginalLicenseeOption() {
            const objectIdList = ['#CurrencyId', '#BaseCurrency', '#CurrencyName'];
            $(objectIdList).each(function (i, e) {
                $(e).attr('data-original', $(e).val());
            });
        }

        function setProductOptionParamList(urlOrParams) {
            let returnUrlOrParams = urlOrParams;
            if (typeof (returnUrlOrParams) === 'string') {
                var counter = 0;
                $('.childCheckbox', '#ProductList').each(function (index, element) {
                    var productCode = $(element).attr('data-product-code');
                    if (productCode !== undefined && productCode.length > 0) {
                        returnUrlOrParams = setProductOptionParam(returnUrlOrParams, counter, productCode, $(element).prop("checked"));
                        counter++;
                    }
                });

                return returnUrlOrParams;
            }
            else {
                returnUrlOrParams.ProductOptions = [];
                $('.childCheckbox', '#ProductList').each(function (index, element) {
                    var productCode = $(element).attr('data-product-code');
                    if (productCode !== undefined && productCode.length > 0) {
                        returnUrlOrParams.ProductOptions.push({ Code: productCode, Name: productCode, Status: $(element).prop('checked') });
                    }
                });

                return returnUrlOrParams;
            }
        }

        function setProductOptionOriginalParamList(urlOrParams) {
            const productCodeList = [];
            $('.childCheckbox', '#ProductList').each(function (index, element) {
                const productCode = $(element).attr('data-product-code');
                if (productCode && $(element).attr('data-original') === 'true') {
                    productCodeList.push(productCode.toUpperCase());
                }
            });

            if (typeof (urlOrParams) === 'string') {
                return QueryString.setParam(urlOrParams, 'ProductCodeList', productCodeList);
            }
            else {
                urlOrParams.ProductCodeList = productCodeList.toString();
                return urlOrParams;
            }
        }

        function setProductOptionParam(url, counter, productCode, status) {
            const validProductCode = productCode == null ? undefined : productCode.toUpperCase();
            let newUrl = url;
            newUrl = QueryString.setParam(newUrl, 'ProductOptions[' + counter + '].Code', validProductCode);
            newUrl = QueryString.setParam(newUrl, 'ProductOptions[' + counter + '].Name', validProductCode);
            newUrl = QueryString.setParam(newUrl, 'ProductOptions[' + counter + '].Status', status);

            return newUrl;
        }

        function setDateRangeParam(url) {
            let newUrl = url;
            newUrl = QueryString.setParam(newUrl, 'FromDate', $('#FromDate').val());
            newUrl = QueryString.setParam(newUrl, 'ToDate', $('#ToDate').val());

            return newUrl;
        }

        function setDateRangeOriginalParam(url) {
            let newUrl = url;
            newUrl = QueryString.setParam(newUrl, 'FromDate', $('#FromDate').attr('data-original'));
            newUrl = QueryString.setParam(newUrl, 'ToDate', $('#ToDate').attr('data-original'));

            return newUrl;
        }

        function currencyConstraint(userChange) {
            const currency = Number($('#CurrencyId').val()) || 0;
            let currencyName = $('#CurrencyId option:selected').text();
            currencyName = $.trim(currencyName);
            $('#CurrencyName').val(currencyName);

            // Handle outside based currency list in some reports (customer wl, balance)
            var $baseCurrency = $('#BaseCurrency');
            var noConvertOption = $('option[value=""]', $baseCurrency);
            if (currency === 0 || isBaseCurrency(currencyName)) {
                noConvertOption.remove();
                if (userChange && currency !== 0) {
                    $('option[value="' + currencyName.toLowerCase() + '"]', $baseCurrency).prop('selected', true);
                    $baseCurrency.val(currencyName.toLowerCase());
                }
            }
            else {
                if (noConvertOption.length === 0
                    && $baseCurrency.find('option').length > 0) { // make sure $baseCurrency is select object
                    $('<option value="" selected>' + currencyName + '</option>').appendTo($baseCurrency);
                } else {
                    $('option[value=""]', $baseCurrency).text(currencyName);
                }
                if (userChange) {
                    $baseCurrency.val('');
                    $('option[value=""]', $baseCurrency).text(currencyName);
                }
            }

            // Handle inside based currency list in some reports(licensee wl, wl by product)
            const hasBaseCurrencyInDropdown = $('#CurrencyId option').filter(function () {
                return $(this).val() < 0;
            }).length > 0;
            if (hasBaseCurrencyInDropdown) {
                const basedCurrencyMap = { '-1': 'eur', '-2': 'usd', '-3': 'gbp' };
                let basedCurrency = basedCurrencyMap[currency.toString()];
                basedCurrency = basedCurrency === undefined ? '' : basedCurrency;
                $baseCurrency.val(basedCurrency);
            }

            $('select#BaseCurrency').selectList();
        }

        function clone(obj) {
            /// <summary>
            ///
            /// The below function will work adequatly for the six simple types I mentioned,
            /// as long as data in the objects and arrays form a tree structure.That is, there isn't
            /// more than one reference to the same data in the object.
            /// Handle the 3 simple types, and null or undefined
            /// </summary>
            /// <param name="obj"></param>
            /// <returns type=""></returns>

            if (null == obj || 'object' !== typeof obj) {
                return obj;
            }
            // Handle Date
            if (obj instanceof Date) {
                const date = new Date();
                date.setTime(obj.getTime());
                return date;
            }

            // Handle Array
            if (obj instanceof Array) {
                const array = [];
                for (let i = 0, len = obj.length; i < len; i++) {
                    array[i] = clone(obj[i]);
                }
                return array;
            }

            // Handle Object
            if (obj instanceof Object) {
                const copy = {};
                for (let attr in obj) {
                    if (obj.hasOwnProperty(attr)) {
                        copy[attr] = clone(obj[attr]);
                    }
                }
                return copy;
            }

            throw new Error('Unable to copy obj! Its type isn\'t supported.');
        }

        function asBool(input) {
            if (typeof input === 'string') {
                return input.toLowerCase() === 'true';
            }

            return !!input;
        }
        function getSingleResource(enghlishName) {
            if (enghlishName == null) {
                return enghlishName;
            }

            const keyName = '_language_' + _pageLanguage.replace('-', '_');

            let resources = window[keyName];
            if (!resources) {
                resources = window._language_en_US; // jshint ignore:line
            }

            const mapResource = function (key) {
                let item = resources[key];
                if (item === undefined) {
                    item = window._language_en_US[key]; // jshint ignore:line
                    return item !== undefined ? item : key;
                } else {
                    return item;
                }
            };
            if (enghlishName.indexOf('@') > -1) {
                const keys = enghlishName.match(/\@{1}\[{1}[a-zA-Z\d\_]+\]{1}/g);
                if (keys != null) {
                    let temp = enghlishName;
                    for (var i = 0; i < keys.length; i++) {
                        var realKey = keys[i].replace('@[', '').replace(']', '');
                        temp = temp.replace(keys[i], mapResource(realKey));
                    }
                    return temp;
                }
                return mapResource(enghlishName);
            }
            else {
                return mapResource(enghlishName);
            }
        }

        function getResources(arrayText) {
            if (arrayText == null) {
                return null;
            }
            if (arrayText.constructor !== Array) {
                return null;
            }

            const newArray = [];
            for (let i = 0; i < arrayText.length; i++) {
                newArray.push(getSingleResource(arrayText[i]));
            }
            return newArray;
        }
        function isNumber(text) {
            return !isNaN(parseFloat(text)) && isFinite(text);
        }
        function isInteger(text) {
            return typeof isNumber(text) && parseFloat(text) === parseInt(text, 10) && !isNaN(text);
        }

        function redirect(url) {
            window.location.href = url;
        }

        function getCurrentUrl() {
            return window.location.href;
        }

        function getLocation() {
            return window.location;
        }

        function debounce(func, wait, immediate) {
            let timeout;
            return function () {
                const context = this,
                    args = arguments;
                const later = function () {
                    timeout = null;
                    if (!immediate) {
                        func.apply(context, args);
                    }
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait || 500);
                if (callNow) {
                    func.apply(context, args);
                }
            };
        }

        function addFilterCollapseExpand(containerSelector) {
            const $handler = $('<div class="filter-handle"><i class="icon-arrow"></i></div>');
            const $container = $(containerSelector || '.page-form:has(form)');

            $container.append($handler);

            $handler.click(function () {
                $container.toggleClass('filter-collapse');
                $(window).resize();
            });
        }

        function isFakeLicensee() {
            if (_isFakeLicensee == null) {
                _isFakeLicensee = $('#IsFakeLicensee').val() === '1';
            }

            return _isFakeLicensee;
        }

        function getXsrfToken() {
            return REQUEST_VERIFICATION_TOKEN;
        }

        return {
            initialize: initialize,
            setProductCodeListParam: setProductCodeListParam,
            reload: reload,
            resolveClientUrl: resolveClientUrl,
            getHistoryDate: getHistoryDate,
            isBaseCurrency: isBaseCurrency,
            addUserGuide: addUserGuide,
            asNull: asNull,
            unBlockUI: unBlockUI,
            blockUI: blockUI,
            setLicenseeOptionParam: setLicenseeOptionParam,
            setLicenseeOptionOriginalParam: setLicenseeOptionOriginalParam,
            updateOriginalLicenseeOption: updateOriginalLicenseeOption,
            setProductOptionParamList: setProductOptionParamList,
            setProductOptionOriginalParamList: setProductOptionOriginalParamList,
            setProductOptionParam: setProductOptionParam,
            setDateRangeParam: setDateRangeParam,
            setDateRangeOriginalParam: setDateRangeOriginalParam,
            currencyConstraint: currencyConstraint,
            clone: clone,
            asBool: asBool,
            getSingleResource: getSingleResource,
            getResources: getResources,
            isNumber: isNumber,
            isInteger: isInteger,
            redirect: redirect,
            getCurrentUrl: getCurrentUrl,
            getLocation: getLocation,
            initSelectElements: initSelectElements,
            debounce: debounce,
            addFilterCollapseExpand: addFilterCollapseExpand,
            isFakeLicensee: isFakeLicensee,
            getXsrfToken: getXsrfToken
        };
    });