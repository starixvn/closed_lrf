define(['jquery', 'common/site', 'pages/totalbet/totalbetsbase', 'components/refreshcountdown', 'pages/totalbet/halftimefulltime/halftimefulltime'],
    function ($, Site, Totalbets, RefreshCountDown, HalfTimeFullTime) {
        describe("HalfTimeFullTime", function () {
            describe("initialize()", function () {
                beforeEach(function () {
                    spyOn(Site, "initialize");
                    spyOn(Site, "getSingleResource").and.callFake(function (name) { return name; });
                    spyOn(Site, "addUserGuide");
                    spyOn(Totalbets, "initialize");
                    spyOn(HalfTimeFullTime, "initEvent");
                    spyOn(RefreshCountDown, "initEvent");

                    HalfTimeFullTime.initialize();
                });

                it("Site.initialize() should be called", function () {
                    expect(Site.initialize).toHaveBeenCalled();
                });
                it("Totalbets.initialize() should be called", function () {
                    expect(Totalbets.initialize).toHaveBeenCalled();
                });
                it("HalfTimeFullTime.initEvent() should be called", function () {
                    expect(HalfTimeFullTime.initEvent).toHaveBeenCalled();
                });
                it("Site.addUserGuide() should be called with correct parameters", function () {
                    expect(Site.addUserGuide).toHaveBeenCalledWith({ resourceName: "TotalBetsHTFT", title: "TotalBets - HTFT" });
                });
                it("RefreshCountDown.initEvent() should be called", function () {
                    expect(RefreshCountDown.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                it("HalfTimeFullTime.submit() should be called when '#SubmitButton' fired click event", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    HalfTimeFullTime.initEvent();

                    spyOn(HalfTimeFullTime, "submit");

                    $("#SubmitButton").click();

                    expect(HalfTimeFullTime.submit).toHaveBeenCalled();
                });

                it("Totalbets.viewRunningBetListMatch(matchId, betType) should be called with correct parameters when '.team' fired click event", function () {
                    setFixtures('<div id="reportContent"><div class="team" data-match-id="1"></div></div>');
                    HalfTimeFullTime.initEvent();

                    spyOn(Totalbets, "viewRunningBetListMatch");

                    $(".team").click();

                    expect(Totalbets.viewRunningBetListMatch).toHaveBeenCalledWith("1", 16);
                });
            });

            describe("submit()", function () {
                it("Site.blockUI() should be called", function () {
                    spyOn(Site, "blockUI");

                    HalfTimeFullTime.submit();

                    expect(Site.blockUI).toHaveBeenCalled();
                });

                it("submit function of jquery should be called", function () {
                    setFixtures('<div id="HalfTimeFullTimeForm"></div>');
                    spyOn($.fn, "submit");

                    HalfTimeFullTime.submit();

                    expect($.fn.submit).toHaveBeenCalled();
                });
            });
        });
    });