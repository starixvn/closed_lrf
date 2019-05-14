define(["jquery", "common/site", "pages/report/activecustomersummary/activecustomersummary.option"],
    function ($, Site, ActiveCustomerOption) {
        describe("ActiveCustomerOption", function () {
            beforeAll(function () {
                spyOn(Site, "getResources").and.callFake(function (resources) {
                    return resources;
                });

                spyOn(Site, "getSingleResource").and.callFake(function (resource) {
                    return resource;
                });
            });

            describe("getGridOption(productOptions, totalRows)", function () {
                it("should add column for each product in productOptions", function () {
                    var result = ActiveCustomerOption.getGridOption([{ Code: "Code1", Name: "Code1", Status: true }, { Code: "Code2", Name: "Code2", Status: false }], 10);

                    expect(result.colModel.length).toBe(4);
                    expect(result.colModel[ActiveCustomerOption.dateColumnIndex + 1].index).toBe("CustomerCount.Code1");
                });

                it("should disable sorting if total row is 1", function () {
                    var result = ActiveCustomerOption.getGridOption([{ Code: "Code3", Name: "Code3", Status: true }, { Code: "Code4", Name: "Code4", Status: false }], 1);

                    $.each(result.colModel, function (index, value) {
                        expect(value.sortable).toBe(false);
                    });
                });

                it("product column should be shown '-' is status is false", function () {
                    var result = ActiveCustomerOption.getGridOption([{ Code: "Code5", Name: "Code5", Status: false }, { Code: "Code6", Name: "Code6", Status: true }], 1);

                    expect(result.colModel[ActiveCustomerOption.dateColumnIndex + 1].index).toBe("CustomerCount.Code5");
                    expect(result.colModel[ActiveCustomerOption.dateColumnIndex + 1].formatter()).toBe("-");
                    expect(result.colModel[ActiveCustomerOption.dateColumnIndex + 1].sortable).toBe(false);
                });
            });

            describe("setGroupHeaderColumns(grid, productOptions)", function () {
                it("setGroupHeaders should be called with correct params", function () {
                    setFixtures('<div id="grid"></div>');
                    spyOn($.fn, "jqGrid");

                    ActiveCustomerOption.setGroupHeaderColumns($("#grid"), [{ Code: "Code1", Name: "Code1", Status: true }, { Code: "Code2", Name: "Code2", Status: false }]);

                    expect($.fn.jqGrid).toHaveBeenCalledWith("setGroupHeaders", {
                        useColSpanStyle: true,
                        groupHeaders: [{
                            startColumnName: "Code1",
                            numberOfColumns: 2,
                            titleText: "Product"
                        }]
                    });
                });
            });
        });
    });