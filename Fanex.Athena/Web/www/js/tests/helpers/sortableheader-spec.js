define(["jquery", "helpers/sortableheader"], function ($, SortableHeader) {
    describe("SortableHeader", function () {
        describe("createSortingIcon(sortHandler)", function () {
            describe("when Row Count less or equal 1", function () {
                it(".sort-heading class should be removed", function () {
                    setFixtures('<input id="RowCount" value="1" />' +
                        '<div id="header-content"><div class="sortable sort-heading"><div></div>'
                        );

                    SortableHeader.createSortingIcon();

                    var result = $("#header-content .sortable").hasClass("sort-heading");

                    expect(result).toBe(false);
                });
            });

            describe("when Row Count greater than 1", function () {
                beforeEach(function () {
                    setFixtures('<input id="RowCount" value="2" /> <input id="SortColumn" value="Col1" /> <input id="SortDirection" value="DESC" />' +
                        '<div id="header-content">' +
                        '<div class="sortable"><div class="sort-heading" data-column-name="Col1"></div></div>' +
                        '<div class="sortable"><div class="sort-heading" data-column-name="Col2"></div></div>' +
                        '</div>' +
                        '<select id="CurrencyId"><option selected>USD<option></select>' +
                        '<input id="CurrencyName" value="" />'
                        );
                });

                it("Col1 should has class 'sorted-heading'", function () {
                    SortableHeader.createSortingIcon();

                    var result = $("#header-content .sortable .sort-heading[data-column-name='Col1']").hasClass("sorted-heading");

                    expect(result).toBe(true);
                });

                it("Col1 should has correct html content when SortDirection is DESC", function () {
                    SortableHeader.createSortingIcon();

                    var expected = '<span class="sort-icon sort-icon-desc"></span>';
                    var result = $("#header-content .sortable .sort-heading[data-column-name='Col1']").html();

                    expect(result).toBe(expected);
                });

                it("Col1 should has correct html content when SortDirection is ASC", function () {
                    $("#SortDirection").val("ASC");
                    SortableHeader.createSortingIcon();

                    var expected = '<span class="sort-icon sort-icon-asc"></span>';
                    var result = $("#header-content .sortable .sort-heading[data-column-name='Col1']").html();

                    expect(result).toBe(expected);
                });

                describe("Click on header to sort", function () {
                    var sortHandler;
                    beforeEach(function () {
                        sortHandler = jasmine.createSpy('sortHandler');
                        SortableHeader.createSortingIcon(sortHandler);
                    });

                    it("#SortColumn should has correct value when clicking on Col2", function () {
                        var $col2 = $(".sort-heading[data-column-name='Col2']").closest(".sortable");

                        $col2.click();
                        var result = $("#SortColumn").val();

                        expect(result).toBe("Col2");
                    });

                    it("#SortDirection should has correct value when clicking on Col1", function () {
                        var $col1 = $(".sort-heading[data-column-name='Col1']").closest(".sortable");

                        $col1.click();
                        var result = $("#SortDirection").val();

                        expect(result).toBe("ASC");
                    });

                    it("#SortDirection should has correct value when clicking on Col2 and current value is 'DESC'", function () {
                        var $col2 = $(".sort-heading[data-column-name='Col2']").closest(".sortable");

                        $col2.click();
                        var result = $("#SortDirection").val();

                        expect(result).toBe("ASC");
                    });

                    it("#SortDirection should has correct value when clicking on Col2 and current value is 'ASC'", function () {
                        $("#SortDirection").val("ASC");
                        sortHandler = function () { };
                        SortableHeader.createSortingIcon(sortHandler);
                        var $col2 = $(".sort-heading[data-column-name='Col2']").closest(".sortable");

                        $col2.click();
                        var result = $("#SortDirection").val();

                        expect(result).toBe("DESC");
                    });

                    it("#CurrencyName should has correct value", function () {
                        var $col2 = $(".sort-heading[data-column-name='Col2']").closest(".sortable");

                        $col2.click();
                        var result = $("#CurrencyName").val();

                        expect(result).toBe("USD");
                    });

                    it("sortHandler function should be called with correct parameter", function () {
                        var $col2 = $(".sort-heading[data-column-name='Col2']").closest(".sortable");

                        $col2.click();

                        expect(sortHandler).toHaveBeenCalledWith("Col2");
                    });
                });
            });
        });
    });
});