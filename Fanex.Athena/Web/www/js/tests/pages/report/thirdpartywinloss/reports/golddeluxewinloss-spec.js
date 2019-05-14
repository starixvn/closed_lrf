define([
    "pages/report/thirdpartywinloss/common/thirdpartywinloss",
    "pages/report/thirdpartywinloss/reports/golddeluxewinloss",
    "pages/report/thirdpartywinloss/reports/golddeluxewinloss.option"],
    function (ThirdPartyWinLoss, GoldDeluxeWinLoss, GoldDeluxeWinLossOption) {
        describe("GoldDeluxeWinLoss", function () {
            beforeAll(function () {
                spyOn(ThirdPartyWinLoss, "initialize");
            });

            describe("initialize()", function () {
                it("ThirdPartyWinLoss.initialize should be called with correct params", function () {
                    GoldDeluxeWinLoss.initialize();

                    expect(ThirdPartyWinLoss.initialize).toHaveBeenCalledWith({
                        UserGuideResourceName: "GoldDeluxeWL",
                        UserGuideTitle: "GoldDeluxeWinLoss",
                        ValidMonthRange: 3,
                        ReportTitle: "GoldDeluxeWinLoss",
                        GridOption: GoldDeluxeWinLossOption
                    });
                });
            });
        });
    });