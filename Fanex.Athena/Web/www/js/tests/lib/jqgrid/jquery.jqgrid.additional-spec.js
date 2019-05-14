define(['jquery', 'common/site', 'lib/jqgrid/jquery.jqgrid.additional', 'lib/jqgrid/jquery.jqGrid.min'],
	function ($, Site, jqGridAdditional) {
	    describe("jqGridAdditional", function () {
	        beforeEach(function () {
	            spyOn(Site, "getSingleResource").and.callFake(function (text) {
	                return text;
	            });
	        });

	        describe("DECIMAL_FORMAT_OPTIONS", function () {
	            it("Initial value of DECIMAL_FORMAT_OPTIONS should be correct", function () {
	                var formatOptions = jqGridAdditional.DECIMAL_FORMAT_OPTIONS;
	                expect(formatOptions.decimalSeparator).toEqual(".");
	                expect(formatOptions.thousandsSeparator).toEqual(",");
	                expect(formatOptions.decimalPlaces).toEqual(2);
	            })
	        });

	        describe("updateGridHeight()", function () {
	            beforeEach(function () {
	                window.innerHeight = 1000;
	                var $bdiv = $(sandbox({ class: 'ui-jqgrid-bdiv', style: 'width: 300px; height: 500px; top: 20px; position:relative;' }));
	                var $gridContainer = $(sandbox({ id: 'gview_ReportGrid', style: 'width: 100px; height: 500px; margin-top: 10px;' }));

	                $bdiv.append('<table id="ReportGrid" style="width: 200px; height: 700px;"></table>');
	                $gridContainer.append($bdiv);
	                $gridContainer.append(sandbox({ class: 'ui-jqgrid-sdiv', style: 'height: 20px' }));
	                $gridContainer.append(sandbox({ class: 'ui-jqgrid-pager', style: 'width: 100px; height: 10px' }));
	                $('body').prepend($gridContainer);
	            });

	            afterEach(function () {
	                $('#gview_ReportGrid').remove();
	            });

	            it("max-height css value of '.ui-jqgrid-bdiv' in jqgrid should be correct", function () {
	                jqGridAdditional.updateGridHeight();
	                var cssMaxHeight = $('.ui-jqgrid-bdiv').css('max-height');

	                expect(cssMaxHeight).toEqual('907px');
	            });
	        });

	        describe("updateGridWidth(grid)", function () {
	            var $reportGrid;
	            beforeEach(function () {
	                var $gridContainer = $(sandbox({ class: 'theme_jqGrid', style: 'width: 800px; height: 100px;' }));
	                $gridContainer.append('<div class="ui-jqgrid-hbox"></div>');
	                $gridContainer.append('<div class="ui-jqgrid-bdiv"><table id="ReportGrid" class="ui-jqgrid-btable"><tr class="jqgfirstrow"><td style="width:100px;"></td></tr></table></div>');
	                $gridContainer.append('<div class="ui-jqgrid-hdiv"><table class="ui-jqgrid-htable"></table></div>');
	                $gridContainer.append('<div class="ui-jqgrid-sdiv"><table class="ui-jqgrid-ftable"></table></div>');
	                $('body').prepend($gridContainer);
	                $reportGrid = $('#ReportGrid');

	                spyOn($.fn, "setGridParam");
	                spyOn($.fn.jqGrid, "setGridWidth");
	            });

	            afterEach(function () {
	                $('.theme_jqGrid').remove();
	            });

	            it("'setGridParam' function of jqgrid should be called with correct parameter", function () {
	                jqGridAdditional.updateGridWidth($reportGrid);
	                expect($.fn.setGridParam).toHaveBeenCalledWith({ shrinkToFit: false });
	            });

	            it("'setGridWidth' function of jqgrid should be called with correct parameter", function () {
	                jqGridAdditional.updateGridWidth($reportGrid);
	                expect($.fn.jqGrid.setGridWidth).toHaveBeenCalled();
	            });

	            it("Width of grid should be correct", function () {
	                jqGridAdditional.updateGridWidth($reportGrid);
	                var cssWidth = $reportGrid.css('width');
	                expect(cssWidth).toEqual('780px');
	            })
	        });

	        describe("formatInteger(value)", function () {

	            it("format number by adding commas", function () {
	                var result = jqGridAdditional.formatInteger(1234567);
	                expect(result).toBe("1,234,567");
	            });

	            it("format number (as string) by adding commas", function () {
	                var result = jqGridAdditional.formatInteger("12345");
	                expect(result).toBe("12,345");
	            });
	        });

	        describe("excludeCol(colName, colModel, excludedCol)", function () {
	            it("return a column model object after excluding some columns", function () {
	                var columnNames = [
                        "A", "B", "C"
	                ];
	                var columnModels = [
                        { name: "A" }, { name: "C" }, { name: "B" }
	                ];
	                var excludeColumns = ["C", "B"];
	                var result = jqGridAdditional.excludeCol(columnNames, columnModels, excludeColumns);
	                expect(result).toEqual({ colName: ["A"], colModel: [{ name: "A" }] });
	            });
	        });

	        describe("getLicenseeWLNote(productOptionJson, caption)", function () {
	            it("return a note string for valid products", function () {
	                var productOptions = '[{ "Code": "SB", "Status": false }, { "Code": "LC", "Status": true }]';

	                var result = jqGridAdditional.getLicenseeWLNote(productOptions, "Hello");
	                expect(result).toBe("Hello(LC)");
	            });
	        });

	        describe("rowSpanSetting(rowId, val, rawObject)", function () {
	            it('when RowSpan < 0, returns \' style="display:none;" \'', function () {
	                var result = jqGridAdditional.rowSpanSetting(null, null, { RowSpan: -1 });
	                expect(result).toBe(' style="display:none;" ');
	            });

	            it('when RowSpan = 0, returns \'\'', function () {
	                var result = jqGridAdditional.rowSpanSetting(null, null, { RowSpan: 0 });
	                expect(result).toBe('');
	            });

	            it('when RowSpan > 1, returns \' rowspan="{RowSpan}"\'', function () {
	                var result = jqGridAdditional.rowSpanSetting(null, null, { RowSpan: 2 });
	                expect(result).toBe(' rowspan="2"');
	            });
	        });

	        describe("setNoInfo(message)", function () {
	            it("div.ui-jqgrid-sdiv should be hidden", function () {
	                setFixtures('<div class="ui-jqgrid-sdiv"></div>');
	                jqGridAdditional.setNoInfo("No Information");
	                expect($("div.ui-jqgrid-sdiv").is(":visible")).toBe(false);
	            });

	            it("first td contains text of param 'message'", function () {
	                setFixtures('<div class="theme_jqGrid"></div>');
	                jqGridAdditional.setNoInfo("No Info Message");
	                expect($("#noInfoRow").text()).toBe('No Info Message');
	            });

	        });

	        describe("setNoInfoWithColspan(columnModel, message)", function () {
	            it("div.ui-jqgrid-sdiv should be hidden", function () {
	                setFixtures('<div class="ui-jqgrid-sdiv"></div>');
	                jqGridAdditional.setNoInfoWithColspan(1);
	                expect($("div.ui-jqgrid-sdiv").is(":visible")).toBe(false);
	            });

	            it("table.ui-jqgrid-htable should not contains a td.hide", function () {
	                setFixtures('<div class="ui-jqgrid-sdiv"></div>');
	                setFixtures('<table class="ui-jqgrid-htable"></table>');
	                jqGridAdditional.setNoInfoWithColspan(1);
	                expect($("table.ui-jqgrid-htable td.hide").length).toBe(0);
	            });

	            it("first td contains text of 'NoInfo' (from resource)", function () {
	                setFixtures('<div class="ui-jqgrid-ftable"></div>');
	                setFixtures('<table class="ui-jqgrid-htable"></table>');
	                jqGridAdditional.setNoInfoWithColspan(1);
	                expect($("table.ui-jqgrid-htable td:first").text()).toBe('NoInfo');
	            });
	        });

	        describe("addSortableHeader($grid, sortColumn, sortOrder, isLightText)", function () {
	            beforeEach(function () {
	                setFixtures('<div id="grid" class="ui-jqgrid-view">' +
                        '<table><tr><th><div id="Grid_Date" class="ui-jqgrid-sortable"><span class="s-ico"></span></div></th>' +
                        '<th><div id="Grid_SystemId" class="ui-jqgrid-sortable"><span class="s-ico"></span></div></th>' +
                        '</tr></table></div>');
	            });

	            it("'.s-ico' should be removed", function () {
	                jqGridAdditional.addSortableHeader($("#grid"), "Date", "asc");
	                var result = $(".s-ico").length;

	                expect(result).toBe(0);
	            });

	            it("Date column should has correct child element when sorting on it", function () {
	                jqGridAdditional.addSortableHeader($("#grid"), "Date", "desc");
	                var result = $("#Grid_Date").html();

	                expect(result).toBe('<span class="sort-icon sort-icon-desc"></span>');
	            });

	            it("Date column should has correct child element with light text when sorting on it", function () {
	                jqGridAdditional.addSortableHeader($("#grid"), "Date", "desc", true);
	                var result = $("#Grid_Date").html();

	                expect(result).toBe('<span class="sort-icon sort-icon-desc light"></span>');
	            });

	            it("SystemId column should has correct class name when sorting on it", function () {
	                jqGridAdditional.addSortableHeader($("#grid"), "SystemId", "asc");
	                var $column = $("#Grid_SystemId");
	                var result = $column.hasClass("sortable") || $column.hasClass("sort-heading") || $column.hasClass("sorted-heading");

	                expect(result).toBe(true);
	            });
	        });
	    });
	}
);