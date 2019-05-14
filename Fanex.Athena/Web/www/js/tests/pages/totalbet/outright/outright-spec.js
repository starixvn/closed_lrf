define(['jquery', 'common/site', 'pages/totalbet/totalbetsbase', 'components/refreshcountdown', 'pages/totalbet/outright/outright'],
    function ($, Site, Totalbets, RefreshCountDown, Outright) {
        describe("Outright", function () {
            describe("initialize()", function () {
                beforeEach(function () {
                    spyOn(Site, "initialize");
                    spyOn(Site, "getSingleResource").and.callFake(function (name) { return name; });
                    spyOn(Site, "addUserGuide");
                    spyOn(Totalbets, "initialize");
                    spyOn(Outright, "initEvent");
                    spyOn(RefreshCountDown, "initEvent");

                    Outright.initialize();
                });

                it("Site.initialize() should be called", function () {
                    expect(Site.initialize).toHaveBeenCalled();
                });
                it("Totalbets.initialize() should be called", function () {
                    expect(Totalbets.initialize).toHaveBeenCalled();
                });
                it("Outright.initEvent() should be called", function () {
                    expect(Outright.initEvent).toHaveBeenCalled();
                });
                it("Site.addUserGuide() should be called with correct parameters", function () {
                    expect(Site.addUserGuide).toHaveBeenCalledWith({ resourceName: "TotalBetsOutright", title: "TotalBets - Outright" });
                });
                it("RefreshCountDown.initEvent() should be called", function () {
                    expect(RefreshCountDown.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                it("Outright.submit() should be called when '#SubmitButton' fired click event", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    Outright.initEvent();

                    spyOn(Outright, "submit");

                    $("#SubmitButton").click();

                    expect(Outright.submit).toHaveBeenCalled();
                });

                it("Totalbets.viewRunningBetListMatch(matchId, betType) should be called with correct parameters when '.team' fired click event", function () {
                    setFixtures('<div id="reportContent"><div class="team" data-match-id="1"></div></div>');
                    Outright.initEvent();

                    spyOn(Totalbets, "viewRunningBetListMatch");

                    $(".team").click();

                    expect(Totalbets.viewRunningBetListMatch).toHaveBeenCalledWith("1", 10);
                });
            });

            describe("submit()", function () {
                it("Site.blockUI() should be called", function () {
                    spyOn(Site, "blockUI");

                    Outright.submit();

                    expect(Site.blockUI).toHaveBeenCalled();
                });

                it("submit function of jquery should be called", function () {
                    setFixtures('<div id="OutrightForm"></div>');
                    spyOn($.fn, "submit");

                    Outright.submit();

                    expect($.fn.submit).toHaveBeenCalled();
                });
            });
        });
    });