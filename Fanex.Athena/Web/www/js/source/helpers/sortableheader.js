"use strict";
define(["jquery"], function ($) {
    var Selector = {
        SortColumn: "#SortColumn",
        SortDirection: "#SortDirection"
    };
    var COLUMN_NAME_DATA = "column-name";

    var _me = {
        createSortingIcon: function (sortHandler) {
            if ($("#RowCount").val() <= 1) {
                $("#header-content .sortable").removeClass("sort-heading");
            }
            else {
                $("#header-content .sortable").each(function (index, element) {
                    var $sortHeader = $(element).find(".sort-heading");
                    var sortColumn = $sortHeader.data(COLUMN_NAME_DATA);
                    if (sortColumn === $(Selector.SortColumn).val()) {
                        $sortHeader.addClass("sorted-heading");

                        var sortClass = $(Selector.SortDirection).val() === "DESC" ? "sort-icon-desc" : "sort-icon-asc";
                        var sortSpan = $("<span class='sort-icon'></span>");
                        sortSpan.addClass(sortClass);
                        sortSpan.appendTo($sortHeader);
                    }

                    $(element).click(function () {
                        _me.sortReport($sortHeader.data(COLUMN_NAME_DATA));
                        sortHandler($sortHeader.data(COLUMN_NAME_DATA));
                    });
                });
            }
        },

        sortReport: function (sortColumn) {
            var sortDirection = $(Selector.SortColumn).val() === sortColumn ? $(Selector.SortDirection).val() === "DESC" ? "ASC" : "DESC" : "ASC";

            $(Selector.SortColumn).val(sortColumn);
            $(Selector.SortDirection).val(sortDirection);

            var currencyName = $("#CurrencyId option:selected").text();
            currencyName = $.trim(currencyName);
            $("#CurrencyName").val(currencyName);
        }
    };

    return _me;
});