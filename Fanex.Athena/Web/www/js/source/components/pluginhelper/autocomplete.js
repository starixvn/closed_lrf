// require option properties: suggestionDropdown, url, target
define(['jquery', 'common/site', 'vendor-materialize', 'materialize-autocomplete'],
    function ($, Site) {
    'use strict';

    const mainOption = {
        suggestionDropdown: '#suggestionDropdown',
        url: null,
        target: null
    };

    const DELAY_MILLISECOND = 600;

    let _autoComplete;

    const _me = {
        initialize: function (option) {
            _me.initAutoComplete(option);
            _me.initEvent();
        },

        initEvent: function () {
            $('body').click(function () {
                _me.hideDropdown();
            });

            $(mainOption.target).keyup(function (e) {
                if (e.keyCode === 13) {
                    _me.hideDropdown();
                }
            });
        },

        initAutoComplete: function (option) {
            $.extend(mainOption, option);
            if (!mainOption.url || !mainOption.target) {
                throw Error('Missing data in option');
            }

            _autoComplete = $(mainOption.target).materialize_autocomplete({ // jshint ignore:line
                ignoreCase: false,
                dropdown: {
                    el: mainOption.suggestionDropdown
                },
                getData: Site.debounce(_me.search, DELAY_MILLISECOND),
            });       
        },

        search: function (value, callback) {
            const query = $.trim(value);
            if (query.length < 3)
            {
                return;
            }

            const url = mainOption.url + '?query=' + value;

            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: url,
                success: function (response) {
                    const suggestions = response.suggestions;

                    if (suggestions && suggestions.length > 0) {
                        const data = suggestions.map(function (item) {
                            return { id: item, text: item };
                        });

                        _me.updateWidthOfSuggestionDropdown();
                        callback(value, data);
                    }
                    else {
                        _me.hideDropdown();
                    }
                }
            });
        },

        updateWidthOfSuggestionDropdown: function () {
            const $autoCompleteTarget = $(mainOption.target);
            const $suggestionDropdown = $(mainOption.suggestionDropdown);
            if ($suggestionDropdown.innerWidth() !== $autoCompleteTarget.innerWidth()) {
                $suggestionDropdown.innerWidth($autoCompleteTarget.innerWidth());
            }
        },

        hideDropdown: function () {
            _autoComplete.$dropdown.html('').hide();
        }
    };

    return _me;
});