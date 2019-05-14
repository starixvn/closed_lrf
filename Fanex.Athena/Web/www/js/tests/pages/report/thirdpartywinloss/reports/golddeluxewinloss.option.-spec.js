define([
    "jquery",
    "common/site",
    "lib/jqgrid/jquery.jqgrid.additional",
    "pages/report/thirdpartywinloss/common/thirdpartywinloss.option",
    "pages/report/thirdpartywinloss/reports/golddeluxewinloss.option"],
    function ($, Site, jqGridAdditional, ThirdPartyWinLossOption, GoldDeluxeWinLossOption) {
        describe("GoldDeluxeWinLossOption", function () {
            var externalIdIndex = 2;
            var systemIdIndex = 3;
            var dateIndex = 1;
            var currencyIndex = 4;

            describe("getColModel(level, reportBy))", function () {
                it("hides columns systemId if level is 0", function () {
                    var result = GoldDeluxeWinLossOption.getColModel(0, 0);

                    expect(result[systemIdIndex].hidden).toBe(true);
                });

                it("hides column date if level is greater than 0", function () {
                    var result = GoldDeluxeWinLossOption.getColModel(1, 0);

                    expect(result[dateIndex].hidden).toBe(true);
                });

                it("hides columns externalId if level is less than 2", function () {
                    var result = GoldDeluxeWinLossOption.getColModel(1, 0);

                    expect(result[externalIdIndex].hidden).toBe(true);
                });

                it("updates formatter of columns systemId if level is 1", function () {
                    var result = GoldDeluxeWinLossOption.getColModel(1, 0);

                    expect(typeof (result[systemIdIndex].formatter)).toBe("function");
                });

                it("date column format should be 'm/d/Y' if reportBy is daily", function () {
                    var result = GoldDeluxeWinLossOption.getColModel(1, 1);

                    expect(result[dateIndex].formatoptions.newformat).toBe("m/d/Y");
                });

                it("GoldDeluxeWinLossOption.currencyFormatter should be called with level 1 when formatting currency column if level is 0 and licensee is 12bet", function () {
                    spyOn(GoldDeluxeWinLossOption, "currencyFormatter");
                    GoldDeluxeWinLossOption.licenseeId = 1;

                    var result = GoldDeluxeWinLossOption.getColModel(0, 1);
                    result[currencyIndex].formatter(0, {}, {});

                    expect(GoldDeluxeWinLossOption.currencyFormatter).toHaveBeenCalledWith(0, {}, {}, 1);
                });

                it("GoldDeluxeWinLossOption.currencyFormatter should be called with level 2 when formatting currency column if level is 0 and licensee is not 12bet", function () {
                    spyOn(GoldDeluxeWinLossOption, "currencyFormatter");
                    GoldDeluxeWinLossOption.licenseeId = 2;

                    var result = GoldDeluxeWinLossOption.getColModel(0, 1);
                    result[currencyIndex].formatter(0, {}, {});

                    expect(GoldDeluxeWinLossOption.currencyFormatter).toHaveBeenCalledWith(0, {}, {}, 2);
                });
            });
        });
    });