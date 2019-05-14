define(["jquery", "common/site", "pages/report/settledmatchcount/settledmatchcount"], function ($, Site, SettledMatchCount) {
    describe("SettledMatchCount", function () {
        beforeAll(function () {
            spyOn(Site, "getSingleResource").and.callFake(function (text) {
                return text;
            });
        });

        describe("initialize()", function () {
            beforeEach(function () {
                spyOn(Site, "initialize");
                spyOn(Site, "addUserGuide");

                SettledMatchCount.initialize();
            });

            it("Site.initialize() should be called", function () {
                expect(Site.initialize).toHaveBeenCalled();
            });

            it("Site.addUserGuide(option) should be called with correct parameter", function () {
                expect(Site.addUserGuide).toHaveBeenCalledWith({ resourceName: "SettledMatchCount", title: "SettledMatchCount", height: 220 });
            });
        });
    });
});