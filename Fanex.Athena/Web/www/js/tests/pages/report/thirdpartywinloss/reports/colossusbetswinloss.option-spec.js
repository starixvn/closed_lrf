define([
    "jquery",
    "common/site",
    "lib/jqgrid/jquery.jqgrid.additional",
    "pages/report/thirdpartywinloss/common/thirdpartywinloss.option",
    "pages/report/thirdpartywinloss/reports/colossusbetswinloss.option"],
    function ($, Site, jqGridAdditional, ThirdPartyWinLossOption, ColossusBetsWinLossOption) {
        describe("ColossusBetsWinLossOption", function () {
            var externalIdIndex = 2;
            var systemIdIndex = 3;
            var dateIndex = 1;
            var currencyIndex = 4;

            beforeAll(function () {
                spyOn(Site, "getSingleResource").and.callFake(function (str) {
                    return str;
                });
            });

            describe("getColModel(level, reportBy))", function () {
                it("hides columns externalId and systemId if level is 0", function () {
                    var result = ColossusBetsWinLossOption.getColModel(0, 0);

                    expect(result[externalIdIndex].hidden).toBe(true);
                    expect(result[systemIdIndex].hidden).toBe(true);
                    expect(result[dateIndex].hidden).toBe(false);
                });

                it("hides column date if level is greater than 0", function () {
                    var result = ColossusBetsWinLossOption.getColModel(1, 0);

                    expect(result[externalIdIndex].hidden).toBe(false);
                    expect(result[systemIdIndex].hidden).toBe(false);
                    expect(result[dateIndex].hidden).toBe(true);
                });

                it("updates formatter of columns externalId and systemId if level is 1", function () {
                    var result = ColossusBetsWinLossOption.getColModel(1, 0);

                    expect(typeof (result[externalIdIndex].formatter)).toBe("function");
                    expect(typeof (result[systemIdIndex].formatter)).toBe("function");
                });

                it("date column format should be 'm/d/Y' if reportBy is daily", function () {
                    var result = ColossusBetsWinLossOption.getColModel(1, 1);

                    expect(result[dateIndex].formatoptions.newformat).toBe("m/d/Y");
                });

                it("ColossusBetsWinLossOption.setDrillDownLink should be called with correct params when formatting date column", function () {
                    spyOn(ColossusBetsWinLossOption, "setDrillDownLink");
                    spyOn($.fn, "fmatter").and.callFake(function () {
                        return 0;
                    });

                    var result = ColossusBetsWinLossOption.getColModel(1, 1);
                    result[dateIndex].formatter(0, {}, { Date: "01/01/2011" });

                    expect(ColossusBetsWinLossOption.setDrillDownLink).toHaveBeenCalledWith(1, 0, 0, "01/01/2011", 0);
                });

                it("ColossusBetsWinLossOption.currencyFormatter should be called with correct params when formatting currency column if level is 0", function () {
                    spyOn(ColossusBetsWinLossOption, "currencyFormatter");

                    var result = ColossusBetsWinLossOption.getColModel(0, 1);
                    result[currencyIndex].formatter(0, {}, {});

                    expect(ColossusBetsWinLossOption.currencyFormatter).toHaveBeenCalledWith(0, {}, {}, 1);
                });
            });

            describe("setGroupHeader($grid))", function () {
                it("should be called setGroupHeaders method", function () {
                    setFixtures("<div id='grid'></div>");
                    spyOn($.fn, "jqGrid");

                    ColossusBetsWinLossOption.setGroupHeader($("#grid"));

                    expect($.fn.jqGrid).toHaveBeenCalledWith("setGroupHeaders", {
                        useColSpanStyle: true,
                        groupHeaders: [{
                            startColumnName: "MemberWinning",
                            numberOfColumns: 2,
                            titleText: "AmtLessThan30kGBP"
                        }]
                    });
                });
            });
        });
    });