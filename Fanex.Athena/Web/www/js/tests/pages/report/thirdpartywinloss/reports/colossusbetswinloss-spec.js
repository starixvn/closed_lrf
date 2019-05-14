define([
    "pages/report/thirdpartywinloss/common/thirdpartywinloss",
    "pages/report/thirdpartywinloss/reports/colossusbetswinloss",
    "pages/report/thirdpartywinloss/reports/colossusbetswinloss.option"],
    function (ThirdPartyWinLoss, ColossusBetsWinLoss, ColossusBetsWinLossOption) {
        describe("ColossusBetsWinLoss", function () {
            beforeAll(function () {
                spyOn(ThirdPartyWinLoss, "initialize");
            });

            describe("initialize()", function () {
                it("ThirdPartyWinLoss.initialize should be called with correct params", function () {
                    ColossusBetsWinLoss.initialize();

                    expect(ThirdPartyWinLoss.initialize).toHaveBeenCalledWith({
                        UserGuideResourceName: "ColossusBetsWL",
                        UserGuideTitle: "ColossusBetsWinLoss",
                        ValidMonthRange: 0,
                        ReportTitle: "ColossusBetsWinLoss",
                        GridOption: ColossusBetsWinLossOption
                    });
                });
            });
        });
    });