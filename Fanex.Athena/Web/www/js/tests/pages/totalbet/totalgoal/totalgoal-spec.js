define(['jquery', 'common/site', 'pages/totalbet/totalbetsbase', 'components/refreshcountdown', 'pages/totalbet/totalgoal/totalgoal'],
    function ($, Site, Totalbets, RefreshCountDown, TotalGoal) {
        describe("TotalGoal", function () {
            describe("initialize()", function () {
                beforeEach(function () {
                    spyOn(Site, "initialize");
                    spyOn(Site, "getSingleResource").and.callFake(function (name) { return name; });
                    spyOn(Site, "addUserGuide");
                    spyOn(Totalbets, "initialize");
                    spyOn(TotalGoal, "initEvent");
                    spyOn(RefreshCountDown, "initEvent");

                    TotalGoal.initialize();
                });

                it("Site.initialize() should be called", function () {
                    expect(Site.initialize).toHaveBeenCalled();
                });
                it("Totalbets.initialize() should be called", function () {
                    expect(Totalbets.initialize).toHaveBeenCalled();
                });
                it("TotalGoal.initEvent() should be called", function () {
                    expect(TotalGoal.initEvent).toHaveBeenCalled();
                });
                it("Site.addUserGuide() should be called with correct parameters", function () {
                    expect(Site.addUserGuide).toHaveBeenCalledWith({ resourceName: "TotalBetsTotalGoal", title: "TotalBets - TotalGoal" });
                });
                it("RefreshCountDown.initEvent() should be called", function () {
                    expect(RefreshCountDown.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                it("TotalGoal.submit() should be called when '#SubmitButton' fired click event", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    TotalGoal.initEvent();

                    spyOn(TotalGoal, "submit");

                    $("#SubmitButton").click();

                    expect(TotalGoal.submit).toHaveBeenCalled();
                });

                it("Totalbets.viewRunningBetListMultiBettype(matchId, bettypeParameter) should be called with correct parameters when '.team' fired click event", function () {
                    setFixtures('<div id="reportContent"><div class="team" data-match-id="1"></div></div>');
                    TotalGoal.initEvent();

                    spyOn(Totalbets, "viewRunningBetListMultiBettype");

                    $(".team").click();

                    expect(Totalbets.viewRunningBetListMultiBettype).toHaveBeenCalledWith("1", "6,126");
                });
            });

            describe("submit()", function () {
                it("Site.blockUI() should be called", function () {
                    spyOn(Site, "blockUI");

                    TotalGoal.submit();

                    expect(Site.blockUI).toHaveBeenCalled();
                });

                it("submit function of jquery should be called", function () {
                    setFixtures('<div id="TotalGoalForm"></div>');
                    spyOn($.fn, "submit");

                    TotalGoal.submit();

                    expect($.fn.submit).toHaveBeenCalled();
                });
            });
        });
    });