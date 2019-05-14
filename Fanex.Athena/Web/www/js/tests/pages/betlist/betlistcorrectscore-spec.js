define(['jquery', 'common/site', 'pages/betlist/betlist', 'pages/betlist/betlistcorrectscore'],
    function ($, Site, BetList, BetListCorrectScore) {
        describe("CorrectScoreBetList", function () {
            beforeAll(function () {
                spyOn(BetList, "initialize");
                spyOn(BetList, "loadData");
                spyOn(Site, "getSingleResource").and.callFake(function (text) {
                    return text;
                });
            });

            describe("initialize()", function () {
                it("initEvent() should be called.", function () {
                    spyOn(BetListCorrectScore, "initEvent");
                    BetListCorrectScore.initialize();
                    
                    expect(BetListCorrectScore.initEvent).toHaveBeenCalled();
                });

                it("submit() should be called.", function () {
                    spyOn(BetListCorrectScore, "submit");
                    BetListCorrectScore.initialize();

                    expect(BetListCorrectScore.submit).toHaveBeenCalled();
                });

                it("Site.addUserGuide() should be called with correct parameters.", function () {
                    spyOn(Site, "addUserGuide");
                    BetListCorrectScore.initialize();

                    expect(Site.addUserGuide).toHaveBeenCalledWith({
                        resourceName: "TotalBetsCorrectScore",
                        title: "TotalBets - CorrectScore"
                    });
                });
            });

            describe("initEvent()", function () {
                it("submit() should be called when #SubmitButton is clicked.", function () {
                    setFixtures('<input id="SubmitButton" type="button" />');
                    spyOn(BetListCorrectScore, "submit");

                    BetListCorrectScore.initEvent();
                    $("#SubmitButton").click();

                    expect(BetListCorrectScore.submit).toHaveBeenCalled();
                });

                it("form submit() should be called when #ExportToExcel is clicked.", function () {
                    setFixtures('<form id="CorrectScoreBetListForm"></form><input id="ExportToExcel" type="button" />');
                    
                    $('#CorrectScoreBetListForm').submit(function () { return false; });

                    var spyEvent = spyOnEvent($('#CorrectScoreBetListForm'), 'submit');

                    BetListCorrectScore.initEvent();
                    $("#ExportToExcel").click();

                    expect(spyEvent).toHaveBeenTriggered();
                });
            });

            describe("submit()", function () {
                it("BetList.initialize() should be called.", function () {
                    BetListCorrectScore.submit();

                    expect(BetList.initialize).toHaveBeenCalled();
                });

                it("BetList.loadData() should be called.", function () {
                    spyOn(Site, "resolveClientUrl").and.callFake(function (text) {
                        return text;
                    });

                    BetListCorrectScore.submit();

                    expect(BetList.loadData).toHaveBeenCalledWith(jasmine.any(Object), 'api/CorrectScoreBetList/Index');
                });
            });
        });
});