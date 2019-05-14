define(['jquery', 'common/site', 'components/pluginhelper/monthpicker', 'components/pluginhelper/multiselect', 'extensions/jquery.extension'],
    function ($, Site, MonthPicker, MultiSelect) {
        'use strict';
        let ajaxLeagues = null;
        let ajaxMatches = null;

        let _productCount = 0;

        const Selector = {
            SubmitButton: '#SubmitButton',
            Match: '#Match',
            League: '#League',
            CurrencyId: '#CurrencyId'
        };

        const _me = {
            initialize: function () {
                _productCount = $('#ProductList .childCheckbox[type=checkbox]').length;

                MultiSelect.initProductList();
                MonthPicker.initMonthPicker({
                    customAfterChangeDay: _me.loadLeagues
                });
                _me.initEvent();
            },

            initEvent: function () {
                $('#League').change(function () {
                    _me.loadMatches(true);
                });

                $('#Sport, #CurrencyId').change(function () {
                    _me.loadLeagues();
                });

                $('#TickerFilter input[type=checkbox]').checkboxgroup();

                $('#TickerFilter, #ProductList').on('change', 'input[type=checkbox]', function () {
                    const validProduct = $('#ProductList .childCheckbox:checked').length > 0;
                    const validTicketFilter = $('#TickerFilter input:checked').length > 0;
                    let isValid = validProduct && validTicketFilter;

                    if ($(this).attr('id') === 'AllTicket') {
                        isValid = $(this).prop('checked') && validProduct;
                    }

                    $('#SubmitButton').prop('disabled', !isValid);
                });

                $('#Odds').keypress(function (event) {
                    _me.handleOddInput(event);
                });
            },

            handleOddInput: function (event) {
                /*--------------------------------------------------------------
                    Backspace, tab, enter, end, home, left, right
                    Don't support the del key in Opera because del == . == 46.
                    --------------------------------------------------------------*/
                const controlKeys = [8, 9, 13, 35, 36, 37, 39, 46];

                /*--------------------------------------------------------------
                IE doesn't support indexOf
                --------------------------------------------------------------*/
                const isControlKey = controlKeys.join(',').match(new RegExp(event.which));

                /*--------------------------------------------------------------
                Some browsers just don't raise events for control keys. Easy.
                e.g. Safari backspace.
                --------------------------------------------------------------*/
                if (!event.which ||
                    // Control keys in most browsers. e.g. Firefox tab is 0
                 48 <= event.which && event.which <= 57 ||
                    // Always 0 through 9
                    //(48 == event.which && $(this).attr('value')) ||   // No 0 first digit
                    isControlKey) {
                    // Opera assigns values for control keys.
                    return;
                }
                else {
                    event.preventDefault();
                }
            },

            loadLeagues: function () {
                if (ajaxLeagues !== null) {
                    ajaxLeagues.abort();
                }

                Site.blockUI();
                $(Selector.SubmitButton).prop('disabled', true);
                const $league = $(Selector.League);
                $league.html('');

                ajaxLeagues = $.ajax({
                    type: 'POST',
                    url: Site.resolveClientUrl('WinLossByLeagueReport/GetLeaguesBySport'),
                    data: {
                        currencyId: $('#CurrencyId').val(),
                        sportid: $('#Sport').val(),
                        fromDate: MonthPicker.getFromDateString(),
                        toDate: MonthPicker.getToDateString()
                    },
                    success: function (data) {
                        let str = '';
                        $.each(data, function () {
                            str += _me.renderHtmlOption(this.Key, this.Value);
                        });
                        $league.html(str);
                        $league.selectList('update');
                        _me.loadMatches(false);
                    }
                });
            },

            loadMatches: function (isBlockUI) {
                if (ajaxMatches !== null) {
                    ajaxMatches.abort();
                }

                if (isBlockUI) {
                    Site.blockUI();
                }

                $(Selector.SubmitButton).prop('disabled', true);
                const $match = $(Selector.Match);
                $match.html('');
                const leagueid = $(Selector.League).val();
                if (!leagueid) {
                    $match.selectList('update');
                    Site.unBlockUI();
                    return;
                }

                ajaxMatches = $.ajax({
                    type: 'POST',
                    datatype: 'json',
                    url: Site.resolveClientUrl('WinLossByLeagueReport/GetMatchesByLeague'),
                    data: {
                        leagueid: leagueid,
                        fromDate: MonthPicker.getFromDateString(),
                        toDate: MonthPicker.getToDateString()
                    },
                    success: function (data) {
                        let str = '';
                        $.each(data, function () {
                            str += _me.renderHtmlOption(this.Key, this.Value);
                        });
                        $match.html(str);
                        if (data.length > 0) {
                            $(Selector.SubmitButton).prop('disabled', false);
                        }

                        $match.selectList('update');
                        Site.unBlockUI();
                    }
                });
            },

            renderHtmlOption: function (key, value) {
                return '<option value="' + key + '">' + value + '</option>';
            },

            buildProductsParams: function (paramObject, postData) {
                for (let i = 0; i < _productCount; i++) {
                    paramObject['ProductOptions[' + i + '].Code'] = postData['ProductOptions[' + i + '].Code'];
                    paramObject['ProductOptions[' + i + '].Name'] = postData['ProductOptions[' + i + '].Name'];
                    paramObject['ProductOptions[' + i + '].Status'] = postData['ProductOptions[' + i + '].Status'];
                }
            },
            buildProductCodeList: function (postData) {
                const productCodeList = [];
                for (let i = 0; i < _productCount; i++) {
                    if (postData['ProductOptions[' + i + '].Status'] === 'true') {
                        productCodeList.push(postData['ProductOptions[' + i + '].Code']);
                    }
                }

                return productCodeList;
            },
            isValid: function () {
                const checkedProductCount = $('#ProductList .childCheckbox:checked').length;
                const ticketFilterCount = $('#TickerFilter input:checked').length;

                if (checkedProductCount === 0 || ticketFilterCount === 0) {
                    return false;
                }

                let odds = parseFloat($('#Odds').val());
                if (isNaN(odds) || odds === null || odds < 0) {
                    odds = 0;
                }

                $('#Odds').val(odds);

                return true;
            }
        };

        return _me;
    });