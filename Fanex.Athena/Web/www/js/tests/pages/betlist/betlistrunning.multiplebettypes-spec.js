define(['jquery', 'common/site', 'pages/betlist/betlist', 'pages/betlist/betlistrunning.multiplebettypes'],
    function ($, Site, BetList, BetListRunningBettypes) {
        describe("BetListRunningBettypes", function () {
            beforeAll(function () {                
                spyOn(BetList, "initialize");
                spyOn(BetList, "loadData");
                spyOn(Site, "getSingleResource").and.callFake(function (text) {
                    return text;
                });
                spyOn(Site, "resolveClientUrl").and.callFake(function (text) {
                    return text;
                });
            });

            describe("initialize()", function () {
                it("initEvent() should be called.", function () {
                    spyOn(BetListRunningBettypes, "initEvent");
                    BetListRunningBettypes.initialize();
                    
                    expect(BetListRunningBettypes.initEvent).toHaveBeenCalled();
                });

                it("submit() should be called.", function () {
                    spyOn(BetListRunningBettypes, "submit");
                    BetListRunningBettypes.initialize();

                    expect(BetListRunningBettypes.submit).toHaveBeenCalled();
                });

                it("Site.addUserGuide() should be called with correct parameters.", function () {
                    setFixtures('<input id="userGuideName" value="BetListRunningBettypesUserGuide"></input>');
                    appendSetFixtures('<input id="title" value="BetListRunningBettypesTitle"></input>');
                    spyOn(Site, "addUserGuide");
                    BetListRunningBettypes.initialize();

                    expect(Site.addUserGuide).toHaveBeenCalledWith({
                        resourceName: "BetListRunningBettypesUserGuide",
                        title: "TotalBets - BetListRunningBettypesTitle"
                    });
                });
            });

            describe("initEvent()", function () {
                it("submit() should be called when #SubmitButton is clicked.", function () {
                    setFixtures('<input id="SubmitButton" type="button" />');
                    spyOn(BetListRunningBettypes, "submit");

                    BetListRunningBettypes.initEvent();
                    $("#SubmitButton").click();

                    expect(BetListRunningBettypes.submit).toHaveBeenCalled();
                });

                it("#ExportToExcel is clicked - Site.redirect() should be called with correct url", function () {
                    setFixtures('<input id="ExportToExcel" type="button" />');
                    spyOn(Site, "redirect");
                    spyOn(Site, "getCurrentUrl").and.returnValue("localhost");
                    var sortParam = {
                        SortBy: "Column1",
                        SortOrder: "abc"
                    };
                    spyOn(BetList, "getSortParams").and.returnValue(sortParam);
                    var url = "localhost?CurrencyName=&IsExportExcel=true&SortBy=Column1&SortOrder=abc";
                    var expectedUrl = url.replace(/[&|?][^=]*/g, function (match) {
                        return match.toLowerCase();
                    });

                    BetListRunningBettypes.initEvent();
                    $("#ExportToExcel").click();

                    expect(Site.redirect).toHaveBeenCalledWith(expectedUrl);
                });

                it("#ExportToExcel is clicked - do not have sortParam - Site.redirect() should be called with correct url", function () {
                    setFixtures('<input id="ExportToExcel" type="button" />');
                    spyOn(Site, "redirect");
                    spyOn(Site, "getCurrentUrl").and.returnValue("localhost");
                    spyOn(BetList, "getSortParams").and.returnValue(null);
                    var url = "localhost?CurrencyName=&IsExportExcel=true";
                    var expectedUrl = url.replace(/[&|?][^=]*/g, function (match) {
                        return match.toLowerCase();
                    });

                    BetListRunningBettypes.initEvent();
                    $("#ExportToExcel").click();

                    expect(Site.redirect).toHaveBeenCalledWith(expectedUrl);
                });
            });

            describe("submit()", function () {
                beforeAll(function () {
                    spyOn(Site, 'getLocation').and.callFake(function () {
                        return {
                            pathname: "/HelloPede"
                        };
                    });
                });

                it("BetList.initialize() should be called.", function () {
                    BetListRunningBettypes.submit();

                    expect(BetList.initialize).toHaveBeenCalled();
                });

                it("BetList.loadData() should be called with correct parameter.", function () {

                    BetListRunningBettypes.submit();

                    expect(BetList.loadData).toHaveBeenCalledWith(jasmine.any(Object), 'api/RunningBettypesBetList/HelloPede');
                });
            });
        });
});