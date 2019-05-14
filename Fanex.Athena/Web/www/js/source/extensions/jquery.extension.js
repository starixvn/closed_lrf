/// <reference path="/@JSense.js" />
"use strict";
(function ($) {
    $.fn.checkboxgroup = function () {
        var $parent = $(this).parent();
        var allChk = this.first();
        var elseChk = this.slice(1);

        allChk.prop('checked', elseChk.filter(":checked").length === elseChk.length);

        allChk.change(function () {
            var thisIsChecked = $(this).is(':checked');
            elseChk.prop('checked', thisIsChecked);
            $parent.toggleClass("invalid", !thisIsChecked);
        });

        elseChk.change(function () {
            if ($(this).is(':checked')) {
                allChk.prop('checked', elseChk.filter(":checked").length === elseChk.length);
            } else {
                allChk.prop('checked', false);
            }

            $parent.toggleClass("invalid", elseChk.filter(":checked").length === 0);
        });

        return this;
    };

    $.fn.showHide = function (isShow) {
        if (isShow) {
            this.show();
        } else {
            this.hide();
        }

        return this;
    };

    jQuery.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    jQuery.fn.tableRowSpan = function (colIndexs, effectToIndex) {
        /// <summary>
        /// Created by Alex@20130228
        /// set table rowspan
        /// </summary>
        /// <param name="colIndexs">column indexs</param>
        /// <param name="effectToIndex">set rowspan for this columns base on lasted column in [colIndexs]</param>
        if (effectToIndex !== undefined) {
            if ($.inArray(effectToIndex, colIndexs) > -1) {
                return;
            }
        }

        function process(table, colIdx) {
            var that;
            var ethat;
            var ethis;
            var rowspan = 1;
            var len = table.rows.length - 1;
            for(var index = 0; index <= len; index++)
            {
                var currentRow = table.rows[index];                
                var td = currentRow.cells[colIdx];
                if(td) {
                    ethis = currentRow.cells[effectToIndex];
                    var found = that != null && $(td).html() === $(that).html();
                    if (found && index < len) {
                        rowspan++;
                        $(td).hide();
                        if (effectToIndex !== undefined) {
                            $(ethis).hide();
                        }
                        //.remove// do your action for the old cell here
                    }
                    else if (found && index === len) {
                        //do your action for lasted row
                        $(td).hide();
                        rowspan++;
                        $(that).attr("rowSpan", rowspan);
                        that = td;
                        if (effectToIndex !== undefined) {
                            $(ethis).hide();
                            $(ethat).attr("rowSpan", rowspan);
                            ethat = ethis;
                        }
                        rowspan = 1;
                        // do your action for the colSpan cell here
                    }
                    else {
                        if (effectToIndex !== undefined) {
                            $(ethat).attr("rowSpan", rowspan);
                            ethat = ethis;
                        }
                        $(that).attr("rowSpan", rowspan);
                        // do your action for the colSpan cell here
                        that = td;
                        rowspan = 1;
                    }
                    that = (that == null) ? td : that;
                    if (effectToIndex !== undefined) {
                        ethat = (ethat == null) ? ethis : ethat;
                    }
                    // set the that if not already set
                }
            }
        }

        return this.each(function () {
            for (var i = 0; i < colIndexs.length; i++) {
                process(this, colIndexs[i]);
            }
        });
    };

    jQuery.fn.numbericTextBox = function (min, max) {
        var thousandFormater = function (x) {
            var value = x.toString();
            var pattern = /(-?\d+)(\d{3})/;
            while (pattern.test(value)) {
                value = value.replace(pattern, "$1,$2");
            }
            return value;
        };

        var maxLength = max.toString().length;

        this.each(function (i, e) {
            $(e).keydown(function (event) {
                // Allow: backspace, delete, tab, escape, and enter
                if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || event.keyCode === 13 ||
                // Allow: Ctrl+A
                    (event.keyCode === 65 && event.ctrlKey === true) ||
                // Allow: home, end, left, right
                    (event.keyCode >= 35 && event.keyCode <= 39)) {
                    // let it happen, don't do anything
                    return;
                }
                else {
                    // Ensure that it is a number and stop the keypress
                    if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                        event.preventDefault();
                    }
                }
            }).keyup(function (event) {
                var textBox = event.target;
                var value = textBox.value.replace(/,/g, '');

                if (value.length > maxLength) {
                    value = value.slice(0, maxLength);
                }

                if (value < min) {
                    value = min;
                }
                else if (value > max) {
                    value = max;
                }

                textBox.value = thousandFormater(value);
            });
        });

        return this;
    };

    $.fn.hasVerticalScrollBar = function () {
        return this.length > 0 ? this.get(0).scrollHeight > this.height() : false;
    };
    $.fn.hasHorizontalScrollBar = function () {
        return this.length > 0 ? this.get(0).scrollWidth > this.width() : false;
    };
})(jQuery);

jQuery.extend({
    format: function () {
        /// <summary>
        /// simply format method
        /// </summary>
        /// <returns type="string">formated string</returns>
        var formatted = arguments[0];
        var passValue = jQuery.grep(arguments, function (n, i) { return i > 0; });
        for (var arg in passValue) {
            if (passValue.hasOwnProperty(arg)) {
                formatted = formatted.replace("{" + arg + "}", passValue[arg]);
            }
        }
        return formatted;
    }
});