define(['jquery', 'common/site', 'pages/totalbet/totalbetsbase', 'components/refreshcountdown', 'pages/totalbet/homedrawawaynobet/homedrawawaynobet'],
    function ($, Site, Totalbets, RefreshCountDown, HomeDrawAwayNoBet) {
        describe("HomeDrawAwayNoBet", function () {
            describe("initialize()", function () {
                beforeEach(function () {
                    spyOn(Site, "initialize");
                    spyOn(Site, "addUserGuide");
                    spyOn(Site, "getSingleResource").and.callFake(function (name) { return name; });
                    spyOn(Totalbets, "initialize");
                    spyOn(HomeDrawAwayNoBet, "initEvent");
                    spyOn(RefreshCountDown, "initEvent");

                    HomeDrawAwayNoBet.initialize();
                });

                it("Site.initialize() should be called", function () {
                    expect(Site.initialize).toHaveBeenCalled();
                });
                it("Totalbets.initialize() should be called", function () {
                    expect(Totalbets.initialize).toHaveBeenCalled();
                });
                it("HomeDrawAwayNoBet.initEvent() should be called", function () {
                    expect(HomeDrawAwayNoBet.initEvent).toHaveBeenCalled();
                });
                it("Site.addUserGuide() should be called with correct parameters", function () {
                    expect(Site.addUserGuide).toHaveBeenCalledWith({ resourceName: "TotalBetsHomeDrawAwayNoBet", title: "TotalBets - HomeDrawAwayNoBet" });
                });
                it("RefreshCountDown.initEvent() should be called", function () {
                    expect(RefreshCountDown.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                it("HomeDrawAwayNoBet.submit() should be called when '#SubmitButton' fired click event", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    HomeDrawAwayNoBet.initEvent();

                    spyOn(HomeDrawAwayNoBet, "submit");

                    $("#SubmitButton").click();

                    expect(HomeDrawAwayNoBet.submit).toHaveBeenCalled();
                });

                it("Totalbets.viewRunningBetListMatch(matchId, bettypeParameter) should be called with correct parameters when '.team' fired click event", function () {
                    setFixtures('<div id="reportContent"><div class="team" data-match-id="1"></div></div>');
                    HomeDrawAwayNoBet.initEvent();

                    spyOn(Totalbets, "viewRunningBetListMatch");

                    $(".team").click();

                    expect(Totalbets.viewRunningBetListMatch).toHaveBeenCalledWith("1", 14);
                });
            });

            describe("submit()", function () {
                it("Site.blockUI() should be called", function () {
                    spyOn(Site, "blockUI");

                    HomeDrawAwayNoBet.submit();

                    expect(Site.blockUI).toHaveBeenCalled();
                });

                it("submit function of jquery should be called", function () {
                    setFixtures('<div id="FirstGoalLastGoalForm"></div>');
                    spyOn($.fn, "submit");

                    HomeDrawAwayNoBet.submit();

                    expect($.fn.submit).toHaveBeenCalled();
                });
            });
        });
    });