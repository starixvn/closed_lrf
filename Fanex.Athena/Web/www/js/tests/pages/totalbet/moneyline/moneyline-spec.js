define(['jquery', 'common/site', 'pages/totalbet/totalbetsbase', 'components/refreshcountdown', 'pages/totalbet/moneyline/moneyline'],
    function ($, Site, Totalbets, RefreshCountDown, MoneyLine) {
        describe("MoneyLine", function () {
            describe("initialize()", function () {
                beforeEach(function () {
                    spyOn(Site, "initialize");
                    spyOn(Site, "addUserGuide");
                    spyOn(Site, "getSingleResource").and.callFake(function (name) { return name; });
                    spyOn(Totalbets, "initialize");
                    spyOn(MoneyLine, "initEvent");
                    spyOn(RefreshCountDown, "initEvent");

                    MoneyLine.initialize();
                });

                it("Site.initialize() should be called", function () {
                    expect(Site.initialize).toHaveBeenCalled();
                });
                it("Totalbets.initialize() should be called", function () {
                    expect(Totalbets.initialize).toHaveBeenCalled();
                });
                it("MoneyLine.initEvent() should be called", function () {
                    expect(MoneyLine.initEvent).toHaveBeenCalled();
                });
                it("Site.addUserGuide() should be called with correct parameters", function () {
                    expect(Site.addUserGuide).toHaveBeenCalledWith({ resourceName: "TotalBetsMoneyLine", title: "TotalBets - MoneyLine" });
                });
                it("RefreshCountDown.initEvent() should be called", function () {
                    expect(RefreshCountDown.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                it("MoneyLine.submit() should be called when '#SubmitButton' fired click event", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    MoneyLine.initEvent();

                    spyOn(MoneyLine, "submit");

                    $("#SubmitButton").click();

                    expect(MoneyLine.submit).toHaveBeenCalled();
                });
            });

            describe("submit()", function () {
                it("Site.blockUI() should be called", function () {
                    spyOn(Site, "blockUI");

                    MoneyLine.submit();

                    expect(Site.blockUI).toHaveBeenCalled();
                });

                it("submit function of jquery should be called", function () {
                    setFixtures('<div id="MoneyLineForm"></div>');
                    spyOn($.fn, "submit");

                    MoneyLine.submit();

                    expect($.fn.submit).toHaveBeenCalled();
                });
            });
        });
    });