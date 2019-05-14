define(['jquery', 'common/site', 'pages/totalbet/totalbetsbase', 'components/refreshcountdown', 'pages/totalbet/firstgoallastgoal/firstgoallastgoal'],
    function ($, Site, Totalbets, RefreshCountDown, FirstGoalLastGoal) {
        describe("FirstGoalLastGoal", function () {
            describe("initialize()", function () {
                beforeEach(function () {
                    spyOn(Site, "initialize");
                    spyOn(Site, "getSingleResource").and.callFake(function (name) { return name; });
                    spyOn(Site, "addUserGuide");
                    spyOn(Totalbets, "initialize");
                    spyOn(FirstGoalLastGoal, "initEvent");
                    spyOn(RefreshCountDown, "initEvent");

                    FirstGoalLastGoal.initialize();
                });

                it("Site.initialize() should be called", function () {
                    expect(Site.initialize).toHaveBeenCalled();
                });
                it("Totalbets.initialize() should be called", function () {
                    expect(Totalbets.initialize).toHaveBeenCalled();
                });
                it("FirstGoalLastGoal.initEvent() should be called", function () {
                    expect(FirstGoalLastGoal.initEvent).toHaveBeenCalled();
                });
                it("Site.addUserGuide() should be called with correct parameters", function () {
                    var title = "TotalBets - FGLG";
                    expect(Site.addUserGuide).toHaveBeenCalledWith({ resourceName: "TotalBetsFGLG", title: title });
                });
                it("RefreshCountDown.initEvent() should be called", function () {
                    expect(RefreshCountDown.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                it("FirstGoalLastGoal.submit() should be called when '#SubmitButton' fired click event", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    FirstGoalLastGoal.initEvent();

                    spyOn(FirstGoalLastGoal, "submit");

                    $("#SubmitButton").click();

                    expect(FirstGoalLastGoal.submit).toHaveBeenCalled();
                });

                it("Totalbets.viewRunningBetListMultiBettype(matchId, bettypeParameter) should be called with correct parameters when '.team' fired click event", function () {
                    setFixtures('<div id="reportContent"><div class="team"></div></div>');
                    var $team = $(".team");
                    $team.attr("data-match-id", 1);
                    FirstGoalLastGoal.initEvent();

                    spyOn(Totalbets, "viewRunningBetListMultiBettype");

                    $team.click();

                    expect(Totalbets.viewRunningBetListMultiBettype).toHaveBeenCalledWith("1", "14,127");
                });
            });

            describe("submit()", function () {
                it("Site.blockUI() should be called", function () {
                    spyOn(Site, "blockUI");

                    FirstGoalLastGoal.submit();

                    expect(Site.blockUI).toHaveBeenCalled();
                });

                it("submit function of jquery should be called", function () {
                    setFixtures('<div id="FirstGoalLastGoalForm"></div>');
                    spyOn($.fn, "submit");

                    FirstGoalLastGoal.submit();

                    expect($.fn.submit).toHaveBeenCalled();
                });
            });
        });
    });