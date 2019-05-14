/// <reference path="/@JSense.js" />
///
define(['jquery', 'common/site', 'lib/bignumber'], function ($, Site, BigNumber) {
    "use strict";
    var jqGridAdditional = (function () {
        return {
            DECIMAL_FORMAT_OPTIONS: {
                decimalSeparator: ".",
                thousandsSeparator: ",",
                decimalPlaces: 2
            },
            updateGridHeight: function ($container) {
                $container = $container || $("body");
                if ($container.find(".no-info-row").length) {
                    return;
                }
                var $bdiv = $container.find(".ui-jqgrid-bdiv");
                if ($bdiv.length === 0) {
                    return;
                }

                var gridTop = $bdiv.offset().top;
                var pagingHeight = $container.find(".paging:visible").length ? $container.find(".paging:visible").height() : 0;
                pagingHeight = pagingHeight || ($container.find("#paging:visible").length ? $container.find("#paging:visible").height() : 0);
                var footerHeight = $container.find(".ui-jqgrid-sdiv:visible").length ? $container.find(".ui-jqgrid-sdiv:visible").height() : 0;
                var jqgridPagerHeight = $container.find(".ui-jqgrid-pager:visible").length ? $container.find(".ui-jqgrid-pager:visible").outerHeight(true) : 0;
                var footerSite = 18;

                var gridHeight = window.innerHeight - gridTop - footerHeight - jqgridPagerHeight - pagingHeight - footerSite - 15;
                gridHeight = Math.max(120, gridHeight);

                $bdiv.css("max-height", gridHeight);
            },
            updateGridWidth: function ($grid, shrinkToFit) {
                var $container = $grid.closest(".theme_jqGrid");
                if ($container.find(".ui-jqgrid-hbox").length === 0) {
                    return;
                }

                $grid.setGridParam({
                    shrinkToFit: shrinkToFit === true
                });

                var parentWidth = $container.width();
                
                $grid.jqGrid('setGridWidth', parentWidth);

                var tableWidth = parentWidth - 20;
                
                $grid.css("width", tableWidth + "px");
                $container.find(".ui-jqgrid-hdiv table.ui-jqgrid-htable").css("width", tableWidth + "px");
                $container.find(".ui-jqgrid-sdiv table.ui-jqgrid-ftable").css("width", tableWidth + "px");

                jqGridAdditional.updateFooterWidth($container);
            },

            updateFooterWidth: function ($container) {
                $container.find(".footer-firstrow").remove();
                var settingWidthRow = $container.find(".ui-jqgrid-bdiv table.ui-jqgrid-btable tr.jqgfirstrow").clone();
                settingWidthRow.addClass("footer-firstrow").removeClass("jqgfirstrow")
                                .prependTo($container.find("table.ui-jqgrid-ftable tbody"));
            },

            formatInteger: function (value) {
                if (value !== undefined && value !== null) {
                    if (value === "NaN") {
                        return "NaN";
                    }

                    var sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})');
                    var resultValue = value + '';

                    while (sRegExp.test(resultValue)) {
                        resultValue = resultValue.replace(sRegExp, '$1,$2');
                    }

                    return resultValue;
                }
                return value;
            },

            formatDecimal: function (value) {
                if (value !== undefined && value !== null) {
                    if (isNaN(value)) {
                        return "NaN";
                    }

                    return (new BigNumber(value.toString())).round(2, BigNumber.ROUND_HALF_UP).toFormat(2);
                }

                return value;
            },

            formatLicenseeWl: function (value) {
                var decimalValue = jqGridAdditional.formatDecimal(value);
                return value < 0 ? "<span class='negative-number'>" + decimalValue + "</span>" : decimalValue;
            },

            excludeCol: function (colName, colModel, excludedCol) {
                var result =
                {
                    colName: [],
                    colModel: []
                };
                for (var i = 0; i < colModel.length; i++) {
                    if ($.inArray(colModel[i].name, excludedCol) < 0) {
                        result.colName.push(colName[i]);
                        result.colModel.push(colModel[i]);
                    }
                }
                return result;
            },

            hideColumn: function (models, colName) {
                for (var i = 0; i < models.length; i++) {
                    if (models[i].name.toLowerCase() === colName.toLowerCase()) {
                        models[i].hidden = true;
                        break;
                    }
                }
            },

            setGroupCustomerWLColumns: function (grid) {
                grid.jqGrid('setGroupHeaders',
                {
                    useColSpanStyle: true,
                    groupHeaders: [{
                        startColumnName: 'CustomerWinLoss',
                        numberOfColumns: 3,
                        titleText: Site.getSingleResource('CustomerW_L')
                    }]
                });
            },

            resetHeaderHeight: function () {
                $(".ui-jqgrid-htable>thead>tr.ui-jqgrid-labels > th.ui-th-column div").addClass("header-two-line");
            },

            getNewLicenseeWLNote: function (productList, caption) {
                var temp = caption || Site.getSingleResource("LicenseeW_L");
                var productTemp = "";
                var productAds = ["SB", "LC", "NG", "VS", "CS", "KN", "BT", "VB"];
                for (var i = 0; i < productList.length; i++) {
                    if ($.inArray(productList[i], productAds) > -1) {
                        productTemp += productTemp.length === 0 ? productList[i] : ", " + productList[i];
                    }
                }
                if (productTemp.length > 0) {
                    temp += "(" + productTemp + ")";
                }
                else {
                    return caption || "";
                }

                return temp;
            },
            // update getNewLicenseeWLNote() as well
            getLicenseeWLNote: function (productOptionJson, caption) {
                var productOptions = $.parseJSON(productOptionJson);
                var temp = caption || Site.getSingleResource("LicenseeW_L");
                var productTemp = "";
                var productAds = ["SB", "LC", "NG", "VS", "CS", "KN", "BT", "VB"];
                for (var i = 0; i < productOptions.length; i++) {
                    if ($.inArray(productOptions[i].Code, productAds) > -1 && Site.asBool(productOptions[i].Status)) {
                        productTemp += productTemp.length === 0 ? productOptions[i].Code : ", " + productOptions[i].Code;
                    }
                }
                if (productTemp.length > 0) {
                    temp += "(" + productTemp + ")";
                }
                else {
                    return caption || "";
                }

                return temp;
            },

            gridComplete: function ($container) {
                $container = $container || $('body');
                $container.find(".ui-jqgrid-titlebar").hide();
                $container.find(".ui-jqgrid-hdiv").css("clear", "both");

                $container.find('#noInfoRow').remove();
            },

            clearGrid: function (reportId) {
                var $grid = $('#' + reportId);
                $grid.jqGrid('GridUnload');
                $grid.closest(".theme_jqGrid > div").css('width', '');
            },

            rowSpanSetting: function (rowId, val, rawObject) {
                var rowSpan = rawObject.RowSpan, result;
                if (rowSpan > 1) {
                    result = ' rowspan=' + '"' + rowSpan + '"';
                }
                else if (rowSpan < 0) {
                    result = ' style="display:none;" ';
                }
                else {
                    result = '';
                }

                return result;
            },

            rowSpanSetting2: function (rowId, val, rawObject) {
                var rowSpan = rawObject.RowSpan2, result;
                if (rowSpan > 1) {
                    result = ' rowspan=' + '"' + rowSpan + '"';
                }
                else if (rowSpan < 0) {
                    result = ' style="display:none;" ';
                }
                else {
                    result = '';
                }

                return result;
            },

            assignTotal: function (totalData, columnModel) {
                var mainFooter = $(".ui-jqgrid-ftable tr:last-child");

                if (mainFooter.length >= 0) {
                    //add grand total
                    $(totalData).each(function (totalIndex, totalElement) {
                        var row = mainFooter.clone();
                        row.addClass("grandTotal");
                        var cellList = $("td", row);
                        $(columnModel).each(function (cellIndex, modelElement) {
                            var cell = cellList.get(cellIndex);
                            var isCustomFormater = typeof (modelElement.formatter) === "function";
                            var rawValue = totalElement[modelElement.name];
                            var value;
                            if (isCustomFormater) {
                                value = modelElement.formatter(rawValue, modelElement.formatoptions, row);
                            } else {
                                var formatOptions = {};
                                formatOptions[modelElement.formatter] = modelElement.formatoptions;
                                value = $.fn.fmatter(modelElement.formatter, rawValue, formatOptions);
                            }
                            var titleValue = value;
                            if ($.isNumeric(rawValue) && rawValue < 0) {
                                var wrapper = document.createElement('div');
                                wrapper.innerHTML = value;
                                titleValue = wrapper.innerText;
                            }
                            $(cell).html(value).attr("title", titleValue);
                        });
                        row.insertBefore(mainFooter);
                    });
                }
            },

            setFooterColumns: function (param, columnNames) {
                var isShow = "showCol" === param;
                var footers = $("table.ui-jqgrid-ftable tr");
                if (isShow) {
                    $.each(columnNames, function (index, value) {
                        $('td[aria-describedby="' + value + '"]', footers).show();
                    });
                }
                else {
                    $.each(columnNames, function (index, value) {
                        $('td[aria-describedby="' + value + '"]', footers).hide();
                    });
                }
            },

            setNoInfo: function (message, $container) {
                $container = $container || $("body");
                var noInfoText = message || Site.getSingleResource("NoInfo");
                var htmlNoInfor = '<p id="noInfoRow" class="no-info-row">' + noInfoText + '</p>';

                var $noInforRow = $container.find('#noInfoRow');
                
                if ($noInforRow.length) {
                    $noInforRow.html(noInfoText);
                }
                else {
                    $container.find('.theme_jqGrid').append(htmlNoInfor);
                }
                $container.find("div.ui-jqgrid-sdiv").hide();
            },

            setNoInfoWithColspan: function (colspan) {
                var mainFooter = $(".ui-jqgrid-ftable");
                var info = Site.getSingleResource("NoInfo");

                if (mainFooter.length > 0) {
                    mainFooter.remove();
                }
                var contentTable = $("table.ui-jqgrid-htable");
                if (contentTable.find(".no-info-row").length === 0) {
                    var temps = '<tr role="row" class="no-info-row  ui-widget-content jqgrow ui-row-ltr" style="height:auto;">' +
                        ' <td style="text-align:center;" role="role="gridcell" colspan="' + colspan + '">' + info + '</td></tr>';
                    contentTable.append(temps);
                }

                $("div.ui-jqgrid-sdiv").hide();
            },

            setGroupFooters: function (colspan, summaryColspan, summaryRowCount, allowScrolling) {
                /// <summary>
                /// set colspan for footer rows
                /// </summary>
                /// <param name="colspan"></param>
                /// <param name="summaryColspan"></param>
                /// <param name="summaryRowCount"></param>

                summaryRowCount = summaryRowCount === undefined ? 0 : summaryRowCount;
                var footerTable = $("table.ui-jqgrid-ftable");
                var footerRowList = $("tr", footerTable);
                var rowCount = footerRowList.length;
                var columnIndex = 0;
                if (rowCount > 0) {
                    // Hide other columns to match the colspan & rowspan
                    var processFooter = function ($td, colspan) {
                        $td.each(function (j, cell) {
                            if (columnIndex < colspan) {
                                if ($(cell).is(":visible")) {
                                    $(cell).hide();
                                    columnIndex++;
                                }
                            }
                        });
                    };

                    for (var i = 0; i < rowCount - summaryRowCount; i++) {
                        columnIndex = 0;
                        processFooter($("td ", footerRowList[i]), colspan);
                    }

                    //#region Render total eur section
                    columnIndex = 0;
                    // Hide other eur columns to match the colspan & rowspan
                    for (var j = rowCount - summaryRowCount; j < rowCount; j++) {
                        columnIndex = 0;
                        processFooter($("td ", footerRowList[j]), summaryColspan);
                    }
                    var totalInText = Site.getSingleResource("Totalin");
                    //#region Render total eur section

                    var totalText = Site.getSingleResource("Total");
                    // Set colspan for total section
                    if (rowCount > 1) {
                        // Show total text
                        $("td:first-child", footerRowList[0]).attr("colspan", colspan)
                                .attr("rowspan", rowCount - summaryRowCount).css("display", "")
                                .css("width", "").html(totalText).attr("title", totalText);
                    }
                    else {
                        $("td:first-child", footerRowList[0]).css("display", "").attr("colspan", summaryColspan)
                            .css("width", "").html(totalInText + " EUR").attr("title", totalInText + " EUR");
                        //remove border style
                        $(".ui-jqgrid-sdiv .ui-jqgrid-hbox").css("border-top", "none");
                    }

                    // If there are many total rows such as total eur, total usd, ...
                    var currencyListString = footerTable.attr("data-total-currency-list");
                    if (currencyListString) {
                        var currencyList = currencyListString.split(",");
                        var rowspan = summaryRowCount / currencyList.length;
                        $(currencyList).each(function (i, currency) {
                            $("td.group-" + currency + ":first-child", footerTable)
                                    .attr("rowspan", rowspan).css("display", "")
                                    .attr("colspan", summaryColspan).html(totalInText + " " + currency)
                                    .attr("title", totalInText + " " + currency);
                            $("td.group-" + currency + ":gt(0)", footerTable).hide();
                            $("td.group-" + currency + ":first-child", footerTable).parent().addClass("summarytotal");
                        });
                    } else {
                        if (footerRowList.length > 1) {
                            $(footerRowList[footerRowList.length = 1]).hide();
                        }
                    }
                    /*set scrolling*/
                    if (allowScrolling) {
                        footerTable.closest(".ui-jqgrid-sdiv").addClass("jqgrid-footer-scroll-hacking");
                    }
                }
            },

            addSortableHeader: function ($grid, sortColumn, sortOrder, isLightText) {
                $grid.closest(".ui-jqgrid-view")
                        .find(".ui-jqgrid-sortable")
                        .each(function (index, element) {
                            var $this = $(element);
                            $this.find(".s-ico").remove();

                            if (element.id.indexOf(sortColumn) > -1) {
                                var sortClass = "sort-icon-" + sortOrder + (isLightText ? " light" : "");
                                var sortSpan = $("<span class='sort-icon'></span>");
                                sortSpan.addClass(sortClass);
                                $this.append(sortSpan);
                                $this.addClass("sortable sort-heading sorted-heading");
                            }
                        });
            },

            updateSortableHeader: function ($grid, sortColumn, sortOrder, isLightText) {
                var sortClass = "sort-icon-" + sortOrder + (isLightText ? " light" : "");
                sortColumn = "_" + sortColumn;

                $grid.closest(".ui-jqgrid-view")
                        .find(".ui-jqgrid-sortable")
                        .each(function (index, element) {
                            var $this = $(element);
                            $this.find(".s-ico").remove();

                            if (element.id.endsWith(sortColumn)) {
                                var sortSpan = $this.find(".sort-icon");
                                if (sortSpan.length) {
                                    sortSpan.removeClass().addClass("sort-icon " + sortClass);
                                }
                                else {
                                    sortSpan = $("<span class='sort-icon'></span>");
                                    sortSpan.addClass(sortClass);
                                    $this.append(sortSpan);
                                    $this.addClass("sortable sort-heading sorted-heading");
                                }
                            }
                            else {
                                $this.removeClass("sortable sort-heading sorted-heading");
                                $this.find(".sort-icon").remove();
                            }
                        });
            },

            removeCursorOnNonSortableHeader: function ($grid) {
                var cm = $grid[0].p.colModel;
                $.each($grid[0].grid.headers, function (index, value) {
                    var cmi = cm[index];
                    if (!cmi.sortable) {
                        $('.ui-jqgrid-sortable', value.el).css({ cursor: "default" });
                    }
                });
            },

            addSortableHeaders: function ($grid, sortColumn, sortOrder) {
                var cm = $grid[0].p.colModel;
                $.each($grid[0].grid.headers, function (index, value) {
                    var cmi = cm[index];
                    if (!cmi.sortable) {
                        $(".ui-jqgrid-sortable", value.el).css({ cursor: "default" });
                    }
                    if (cmi.index === sortColumn && sortOrder !== "") {
                        var header = $(".ui-jqgrid-sortable", value.el);
                        header.find(".s-ico").remove();
                        header.addClass("sortable sort-heading sorted-heading");
                        var sortClass = "sort-icon sort-icon-" + sortOrder;
                        header.append('<span class="' + sortClass + '"></span>');
                    }
                });
            }
        };
    })();

    return jqGridAdditional;
});