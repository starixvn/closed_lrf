define(["jquery", "common/site", "components/pluginhelper/daterangepicker", "common/popup", "components/scrollablegrid", "pages/report/result/result", "extensions/jquery.extension"],
    function ($, Site, DatePicker, Popup, GridHelper, Result) {
        describe("Result", function () {
            beforeAll(function () {
                spyOn(Site, "getSingleResource").and.callFake(function (resource) { if (resource === "Viewin") { return resource + " EUR"; } return resource; });
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) { return url; });
            });

            describe("initialize()", function () {
                beforeEach(function () {
                    spyOn(Site, "initialize");
                    spyOn(DatePicker, "initSingleDatePicker");
                    spyOn(DatePicker, "initDateRangePicker");
                    spyOn(Result, "initEvent");

                    Result.initialize();
                });

                it("Site.initialize() should be called", function () {
                    expect(Site.initialize).toHaveBeenCalled();
                });
                it("DatePicker.initSingleDatePicker() should be called with correct parameter", function () {
                    expect(DatePicker.initSingleDatePicker).toHaveBeenCalledWith("Date");
                });
                it("DatePicker.initDateRangePicker() should be called", function () {
                    expect(DatePicker.initDateRangePicker).toHaveBeenCalled();
                });
                it("Result.initEvent() should be called", function () {
                    expect(Result.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                beforeEach(function () {
                    $("*").off();
                    setFixtures('<div id="submitOutright" data-isoutright="0"></div>' +
                        '<div id="resultContent"><a class="detail-link" data-match-id="1"></a></div>' +
                        '<input id="Date" value="03/03/2017" />' +
                        '<button id="SubmitButton"></button>' +
                        '<button id="submitNormal"></button>' +
                        '<input id="FromDate" value="03/01/2017" /> <input id="ToDate" value="03/31/2017" />' +
                        '<button id="submitToday" data-date="03/03/2017"></button>' +
                        '<button id="submitYesterday" data-date="03/31/2017"></button>' +
                        '<button id="ExportToExcel"></button>' +
                        '<select id="ddlSport"><option value="1" selected>1</option><option value="2">2</option></select>' +
                        '<select id="ddlLeague"><option value="3" selected>3</option><option value="3">3</option></select>' +
                        '<button id="submitKeno"></button>' +
                        '<button id="submitLottery"></button>'
                        );

                    Result.initEvent();
                });

                afterEach(function () {
                    $("*").off();
                });

                it("Popup.openPopupWithIframe(url, popupOption) should be called with correct parameter when '.detail-link' fire click event", function () {
                    var url = "ResultReport/ResultDetail?matchid=1&SportType=0";
                    var popupOption = { id: "result-popup", width: 775, height: 520, title: "Result" };
                    spyOn(Popup, "openPopupWithIframe");

                    $(".detail-link").click();

                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(url, popupOption);
                });

                describe("'#submitOutright' fire click event", function () {
                    beforeEach(function () {
                        spyOn(Result, "showOutRight");
                        spyOn(DatePicker, "setValueForDateRange");
                        spyOn(Result, "submit");
                    });

                    describe("Can submit button", function () {
                        beforeEach(function () {
                            spyOn(Result, "canSubmit").and.returnValue(true);
                            $("#submitOutright").click();
                        });

                        it("Result.showOutRight(isOutRight) should be called with correct parameter", function () {
                            expect(Result.showOutRight).toHaveBeenCalledWith(true);
                        });
                        it("DatePicker.setValueForDateRange(startDate) should be called with correct parameter", function () {
                            expect(DatePicker.setValueForDateRange).toHaveBeenCalledWith("03/03/2017");
                        });
                        it("Result.submit() should be called", function () {
                            expect(Result.submit).toHaveBeenCalled();
                        });
                    });

                    describe("Submit button is disabled", function () {
                        it("Nothing happen when clicking ", function () {
                            spyOn(Result, "canSubmit").and.returnValue(false);
                            $("#submitOutright").click();

                            expect(Result.showOutRight).not.toHaveBeenCalled();
                            expect(DatePicker.setValueForDateRange).not.toHaveBeenCalled();
                            expect(Result.submit).not.toHaveBeenCalled();
                        });
                    });
                });

                describe("'#submitNormal' fire click event", function () {
                    beforeEach(function () {
                        spyOn(Result, "showOutRight");
                        spyOn(DatePicker, "setValueForSingleDate");
                        spyOn(Result, "submit");
                    });

                    describe("Can submit button", function () {
                        beforeEach(function () {
                            spyOn(Result, "canSubmit").and.returnValue(true);
                            $("#submitNormal").click();
                        });

                        it("Result.showOutRight(isOutRight) should be called with correct parameter", function () {
                            expect(Result.showOutRight).toHaveBeenCalledWith(false);
                        });
                        it("DatePicker.setValueForSingleDate(element, value) should be called with correct parameter", function () {
                            expect(DatePicker.setValueForSingleDate).toHaveBeenCalledWith($("#Date"), "03/01/2017");
                        });
                        it("Result.submit() should be called", function () {
                            expect(Result.submit).toHaveBeenCalled();
                        });
                    });

                    describe("Submit button is disabled", function () {
                        it("Nothing happen when clicking ", function () {
                            spyOn(Result, "canSubmit").and.returnValue(false);
                            $("#submitNormal").click();

                            expect(Result.showOutRight).not.toHaveBeenCalled();
                            expect(DatePicker.setValueForSingleDate).not.toHaveBeenCalled();
                            expect(Result.submit).not.toHaveBeenCalled();
                        });
                    });
                });

                it("Result.submit() should be called when '#SubmitButton' fire click event", function () {
                    spyOn(Result, "submit");
                    $("#SubmitButton").click();
                    expect(Result.submit).toHaveBeenCalled();
                });

                describe("'#submitToday' fire click event", function () {
                    beforeEach(function () {
                        spyOn(Result, "clearExcelExport");
                        spyOn(Result, "clearResult");
                        spyOn(Result, "updateDateInput");
                        spyOn(Result, "getData");

                        $("#submitToday").click();
                    });

                    it("Result.clearExcelExport() should be called", function () {
                        expect(Result.clearExcelExport).toHaveBeenCalled();
                    });
                    it("Result.clearResult() should be called", function () {
                        expect(Result.clearResult).toHaveBeenCalled();
                    });
                    it("Result.getData() should be called", function () {
                        expect(Result.getData).toHaveBeenCalled();
                    });
                    it("Result.updateDateInput(isShowOutRight) should be called with correct parameter", function () {
                        expect(Result.updateDateInput).toHaveBeenCalledWith(false);
                    });
                });

                describe("'#submitYesterday' fire click event", function () {
                    beforeEach(function () {
                        spyOn(Result, "clearExcelExport");
                        spyOn(Result, "clearResult");
                        spyOn(Result, "updateDateInput");
                        spyOn(Result, "getData");

                        $("#submitYesterday").click();
                    });

                    it("Result.clearExcelExport() should be called", function () {
                        expect(Result.clearExcelExport).toHaveBeenCalled();
                    });
                    it("Result.clearResult() should be called", function () {
                        expect(Result.clearResult).toHaveBeenCalled();
                    });
                    it("Result.getData() should be called", function () {
                        expect(Result.getData).toHaveBeenCalled();
                    });
                    it("Result.updateDateInput(isShowOutRight) should be called with correct parameter", function () {
                        expect(Result.updateDateInput).toHaveBeenCalledWith(false);
                    });
                });

                describe("'#ExportToExcel' fire click event", function () {
                    beforeEach(function () {
                        spyOn(Result, "setDateParam");
                        spyOn(Result, "getData");
                        $("#ExportToExcel").click();
                    });

                    it("Result.setDateParam() should be called with correct parameter", function () {
                        expect(Result.setDateParam).toHaveBeenCalledWith(false);
                    });
                    it("Result.getData() should be called", function () {
                        expect(Result.getData).toHaveBeenCalled();
                    });
                });

                describe("'#ddlSport' fire change event", function () {
                    beforeEach(function () {
                        spyOn(Result, "clearExcelExport");
                        spyOn(Result, "clearLeagueFilter");
                        spyOn(Result, "getData");

                        $("#ddlSport").change();
                    });

                    it("Result.clearExcelExport() should be called", function () {
                        expect(Result.clearExcelExport).toHaveBeenCalled();
                    });
                    it("Result.clearLeagueFilter() should be called", function () {
                        expect(Result.clearLeagueFilter).toHaveBeenCalled();
                    });
                    it("Result.getData() should be called", function () {
                        expect(Result.getData).toHaveBeenCalled();
                    });
                });

                describe("'#ddlLeague' fire change event", function () {
                    beforeEach(function () {
                        spyOn(Result, "clearExcelExport");
                        spyOn(Result, "getReportData");

                        $("#ddlLeague").change();
                    });

                    it("Result.clearExcelExport() should be called", function () {
                        expect(Result.clearExcelExport).toHaveBeenCalled();
                    });
                    it("Result.getReportData() should be called", function () {
                        expect(Result.getReportData).toHaveBeenCalled();
                    });
                });

                describe("window fire resize event", function () {
                    beforeEach(function () {
                        spyOn(GridHelper, "resizeGrid");
                    });

                    it("GridHelper.resizeGrid($element) should be called with correct parameter when '.fn-rs-content-scroll' exist", function () {
                        appendSetFixtures('<div class="fn-rs-content-scroll"></div>');
                        $(window).resize();
                        expect(GridHelper.resizeGrid).toHaveBeenCalledWith($(".fn-rs-content-scroll"));
                    });
                });

                it(".off() function should be called when window fire unload event", function () {
                    spyOn($.fn, "off");
                    $(window).unload();
                    expect($.fn.off).toHaveBeenCalledWith("resize");
                });

                it("Result.showKeno() should be called when '#submitKeno' exist and fire event", function () {
                    spyOn(Result, "showKeno");
                    $("#submitKeno").click();
                    expect(Result.showKeno).toHaveBeenCalled();
                });

                it("Result.showLottery() should be called when '#submitLottery' exist and fire event", function () {
                    spyOn(Result, "showLottery");
                    $("#submitLottery").click();
                    expect(Result.showLottery).toHaveBeenCalled();
                });
            });

            describe("submit()", function () {
                beforeEach(function () {
                    setFixtures('<div id="submitOutright" data-isoutright="1"></div>');
                    spyOn(Result, "clearExcelExport");
                    spyOn(Result, "clearResult");
                    spyOn(Result, "setDateParam");
                    spyOn(Result, "getData");

                    Result.submit();
                });

                it("Result.clearExcelExport() should be called", function () {
                    expect(Result.clearExcelExport).toHaveBeenCalled();
                });
                it("Result.clearResult() should be called", function () {
                    expect(Result.clearResult).toHaveBeenCalled();
                });
                it("Result.setDateParam() should be called with correct parameter", function () {
                    expect(Result.setDateParam).toHaveBeenCalledWith(true);
                });
                it("Result.getData() should be called", function () {
                    expect(Result.getData).toHaveBeenCalled();
                });
            });

            describe("showKeno()", function () {
                var request;
                beforeEach(function (done) {
                    spyOn(window, "open").and.returnValue({});
                    spyOn(window, "clearInterval");
                    spyOn(Result, "extendKenoSession");
                    spyOn(Site, "blockUI");
                    spyOn(Site, "unBlockUI");

                    jasmine.Ajax.install();

                    jasmine.Ajax
                        .stubRequest(/ResultKenoReport\/Index.*/)
                        .andReturn({
                            'status': 200,
                            'contentType': 'application/json',
                            'responseText': '{ "UserId": 1, "Url": "localhost/keno" }'
                        });

                    Result.showKeno();
                    request = jasmine.Ajax.requests.mostRecent();

                    setTimeout(done, 10);
                });

                afterEach(function () {
                    jasmine.Ajax.uninstall();
                });

                it("window.open should be called with correct parameter", function () {
                    expect(window.open).toHaveBeenCalledWith("localhost/keno", '_blank', 'left=20,top=20,width=950,height=650,toolbar=1,resizable=1,scrollbars,status=1');
                });

                it("url should be correct when ajax request is called", function () {
                    expect(request.url.indexOf("ResultKenoReport/Index") > -1).toBe(true);
                });
                it("Site.blockUI should be called", function () {
                    expect(Site.blockUI).toHaveBeenCalled();
                });
                it("Site.unBlockUI should be called", function () {
                    expect(Site.unBlockUI).toHaveBeenCalled();
                });
                it("Result.extendKenoSession should be called when ajax request successfully response", function () {
                    expect(Result.extendKenoSession).toHaveBeenCalled();
                });
            });

            describe("showLottery()", function () {
                var request;
                beforeEach(function (done) {
                    spyOn(window, "open").and.returnValue({});
                    spyOn(window, "clearInterval");
                    spyOn(Result, "extendLotterySession");
                    spyOn(Site, "blockUI");
                    spyOn(Site, "unBlockUI");

                    jasmine.Ajax.install();

                    jasmine.Ajax
                        .stubRequest(/ResultKenoReport\/Index.*/)
                        .andReturn({
                            'status': 200,
                            'contentType': 'application/json',
                            'responseText': '{ "UserId": 1, "Url": "localhost/keno" }'
                        });

                    Result.showLottery();
                    request = jasmine.Ajax.requests.mostRecent();

                    setTimeout(done, 10);
                });

                afterEach(function () {
                    jasmine.Ajax.uninstall();
                });

                it("window.open should be called with correct parameter", function () {
                    expect(window.open).toHaveBeenCalledWith("localhost/keno", '_blank', 'left=20,top=20,width=950,height=650,toolbar=1,resizable=1,scrollbars,status=1');
                });

                it("url should be correct when ajax request is called", function () {
                    expect(request.url.indexOf("ResultKenoReport/Index") > -1).toBe(true);
                });
                it("Site.blockUI should be called", function () {
                    expect(Site.blockUI).toHaveBeenCalled();
                });
                it("Site.unBlockUI should be called", function () {
                    expect(Site.unBlockUI).toHaveBeenCalled();
                });
                it("Result.extendLotterySession should be called when ajax request successfully response", function () {
                    expect(Result.extendLotterySession).toHaveBeenCalled();
                });
            });

            describe("extendKenoSession()", function () {
                beforeEach(function () {
                    jasmine.clock().install();
                });
                afterEach(function () {
                    jasmine.clock().uninstall();
                });

                it("ajax option should not be called if user is undefined", function () {
                    var option;
                    spyOn($, "ajax").and.callFake(function (opt) { option = opt; });

                    Result.extendKenoSession(1);
                    jasmine.clock().tick(6001);

                    expect(option).toEqual(undefined);
                });

                it("ajax option should has correct value", function () {
                    var option;
                    spyOn($, "ajax").and.callFake(function (opt) { option = opt; });
                    var expectedOption = {
                        type: "POST",
                        cache: false,
                        data: {
                            userId: 2,
                            vendorProductId: 1
                        },
                        url: "ResultKenoReport/KeepSession"
                    };

                    Result.extendKenoSession(1, 2);
                    jasmine.clock().tick(6001);

                    expect(option).toEqual(expectedOption);
                });
            });

            describe("extendLotterySession()", function () {
                beforeEach(function () {
                    jasmine.clock().install();
                });
                afterEach(function () {
                    jasmine.clock().uninstall();
                });

                it("ajax option should not be called if user is undefined", function () {
                    var option;
                    spyOn($, "ajax").and.callFake(function (opt) { option = opt; });

                    Result.extendLotterySession(1);
                    jasmine.clock().tick(6001);

                    expect(option).toEqual(undefined);
                });

                it("ajax option should has correct value", function () {
                    var option;
                    spyOn($, "ajax").and.callFake(function (opt) { option = opt; });
                    var expectedOption = {
                        type: "POST",
                        cache: false,
                        data: {
                            userId: 2,
                            vendorProductId: 1
                        },
                        url: "ResultKenoReport/KeepSession"
                    };

                    Result.extendLotterySession(1, 2);
                    jasmine.clock().tick(6001);

                    expect(option).toEqual(expectedOption);
                });
            });

            describe("getData()", function () {
                beforeEach(function () {
                    $("*").off();
                    setFixtures('<div id="submitOutright" data-isoutright="0"></div>' +
                        '<button id="ExportToExcel"></button>' +
                        '<button id="submitToday"></button>'
                        );

                    spyOn(Result, "exportExcel");
                    spyOn(Result, "getFilter");

                    Result.initEvent();
                });

                afterEach(function () {
                    $("*").off();
                });

                it("Result.exportExcel() should be called when param.IsExportExcel is true", function () {
                    spyOn(Result, "setDateParam");
                    $("#ExportToExcel").click();

                    expect(Result.exportExcel).toHaveBeenCalled();
                });
                it("Result.getFilter() should be called when param.IsExportExcel is false", function () {
                    spyOn(Result, "clearExcelExport");
                    spyOn(Result, "clearResult");
                    $("#submitToday").click();

                    expect(Result.getFilter).toHaveBeenCalled();
                });
            });

            describe("exportExcel()", function () {
                afterEach(function () {
                    $("*").off();
                });
                it("'#iframeForExportExcel' has correct value of src attribute", function () {
                    setFixtures('<div id="submitOutright" data-isoutright="1"></div>' +
                        '<input id="Date" value="03/03/2017" />' +
                        '<input id="FromDate" value="03/01/2017" /> <input id="ToDate" value="03/31/2017" />' +
                        '<button id="ExportToExcel"></button>' +
                        '<select id="ddlSport"><option value="1" selected>1</option><option value="2">2</option></select>' +
                        '<select id="ddlLeague"><option value="3" selected>3</option><option value="3">3</option></select>' +
                        '<div id="iframeForExportExcel"></div>'
                        );

                    Result.initEvent();

                    var expectedUrl = "ResultReport/ResultExcel?FromDate=03/01/2017&ToDate=03/31/2017&IsOutRight=true&SportId=1&LeagueId=3&IsExportExcel=true";

                    $("#ExportToExcel").click();
                    var result = $('#iframeForExportExcel').attr('src');

                    expect(result).toBe(expectedUrl);
                });
            });

            describe("getFilter()", function () {
                beforeEach(function () {
                    jasmine.Ajax.install();
                });
                afterEach(function () {
                    jasmine.Ajax.uninstall();
                });

                it("url of ajax request should be correct", function (done) {
                    jasmine.Ajax
                        .stubRequest("ResultReport/GetSports");
                    Result.getFilter();
                    var request = jasmine.Ajax.requests.mostRecent();
                    setTimeout(done, 10);

                    expect(request.url).toBe("ResultReport/GetSports");
                });

                describe("ajax has response value", function () {
                    beforeEach(function (done) {
                        spyOn(Result, "renderFilter");
                        spyOn(Result, "getReportData");
                        spyOn(Site, "blockUI");

                        jasmine.Ajax
                            .stubRequest("ResultReport/GetSports")
                            .andReturn({
                                'status': 200,
                                'contentType': 'application/json',
                                'responseText': '{ "Sports": ["SB", "RC"] }'
                            });

                        Result.getFilter();
                        setTimeout(done, 10);
                    });

                    it("Result.renderFilter() should be called with correct parameter", function () {
                        expect(Result.renderFilter).toHaveBeenCalledWith({ Sports: ["SB", "RC"] });
                    });
                    it("Result.getReportData() should be called", function () {
                        expect(Result.getReportData).toHaveBeenCalled();
                    });
                    it("Site.blockUI() should be called", function () {
                        expect(Site.blockUI).toHaveBeenCalled();
                    });
                });

                describe("ajax has not response value", function () {
                    beforeEach(function (done) {
                        setFixtures('<div id="noInfoRow" style="display: none;">No information</div>');
                        spyOn(Result, "renderFilter");
                        spyOn(Site, "blockUI");
                        spyOn(Site, "unBlockUI");

                        jasmine.Ajax
                            .stubRequest("ResultReport/GetSports")
                            .andReturn({
                                'status': 200,
                                'contentType': 'application/json',
                                'responseText': 'null'
                            });

                        Result.getFilter();
                        setTimeout(done, 10);
                    });

                    it("'#noInfoRow' should be visible", function () {
                        expect($("#noInfoRow")).toBeVisible();
                    });
                    it("Site.blockUI() should be called", function () {
                        expect(Site.blockUI).toHaveBeenCalled();
                    });
                    it("Site.unBlockUI() should be called", function () {
                        expect(Site.unBlockUI).toHaveBeenCalled();
                    });
                });
            });

            describe("getReportData()", function () {
                beforeEach(function () {
                    jasmine.Ajax.install();
                });
                afterEach(function () {
                    jasmine.Ajax.uninstall();
                });

                it("url of ajax request should be correct", function (done) {
                    jasmine.Ajax
                        .stubRequest("ResultReport/Index");
                    Result.getReportData();
                    var request = jasmine.Ajax.requests.mostRecent();
                    setTimeout(done, 10);

                    expect(request.url).toBe("ResultReport/Index");
                });

                describe("ajax has response value", function () {
                    beforeEach(function (done) {
                        setFixtures('<div id="noInfoRow" style="display: block;">No information</div>' +
                            '<div id="resultContent"></div>'
                            );
                        spyOn(Site, "blockUI");
                        spyOn(Site, "unBlockUI");
                        spyOn(GridHelper, "resizeGrid");

                        jasmine.Ajax
                            .stubRequest("ResultReport/Index")
                            .andReturn({
                                'status': 200,
                                'contentType': 'text/html',
                                'responseText': '<div>Result <div class="fn-rs-content-scroll">Scrolling</div></div>'
                            });

                        Result.getReportData();
                        setTimeout(done, 10);
                    });

                    it("'#noInfoRow' should be hidden", function () {
                        expect($("#noInfoRow")).toBeHidden();
                    });
                    it("'#resultContent' should has correct html content", function () {
                        expect($("#resultContent").html()).toBe('<div>Result <div class="fn-rs-content-scroll">Scrolling</div></div>');
                    });
                    it("Site.blockUI() should be called", function () {
                        expect(Site.blockUI).toHaveBeenCalled();
                    });
                    it("Site.unBlockUI() should be called", function () {
                        expect(Site.unBlockUI).toHaveBeenCalled();
                    });
                });

                describe("ajax has not response value", function () {
                    beforeEach(function (done) {
                        setFixtures('<div id="noInfoRow" style="display: none;">No information</div>');
                        spyOn(Site, "blockUI");
                        spyOn(Site, "unBlockUI");

                        jasmine.Ajax
                            .stubRequest("ResultReport/Index")
                            .andReturn({
                                'status': 200,
                                'contentType': 'text/html',
                                'responseText': ''
                            });

                        Result.getReportData();
                        setTimeout(done, 10);
                    });

                    it("'#noInfoRow' should be visible", function () {
                        expect($("#noInfoRow")).toBeVisible();
                    });
                    it("Site.blockUI() should be called", function () {
                        expect(Site.blockUI).toHaveBeenCalled();
                    });
                    it("Site.unBlockUI() should be called", function () {
                        expect(Site.unBlockUI).toHaveBeenCalled();
                    });
                });
            });

            describe("renderFilter()", function () {
                describe("Has data", function () {
                    beforeEach(function () {
                        setFixtures('<div id="sportAndLeagueFilter">Filter</div>' +
                            '<div id="noInfoRow" style="display: block;">No information</div>'
                            );

                        spyOn(Result, "renderSportFilter");
                        spyOn(Result, "renderLeagueFilter");
                        spyOn(Site, "initSelectElements");

                        Result.renderFilter({ Sports: ["SB", "RC"], Leagues: ["V-League", "Premier League"] });
                    });

                    it("Result.renderSportFilter(sportData) should be called", function () {
                        expect(Result.renderSportFilter).toHaveBeenCalledWith(["SB", "RC"]);
                    });
                    it("Result.renderLeagueFilter(leagueData) should be called", function () {
                        expect(Result.renderLeagueFilter).toHaveBeenCalledWith(["V-League", "Premier League"]);
                    });
                    it("Site.initSelectElements() should be called", function () {
                        expect(Site.initSelectElements).toHaveBeenCalled();
                    });
                    it("'#sportAndLeagueFilter' should has correct css", function () {
                        var result = $("#sportAndLeagueFilter").css("visibility");

                        expect(result).toBe("visible");
                    });
                    it("'#noInfoRow' should be hidden", function () {
                        expect($("#noInfoRow")).toBeHidden();
                    });
                });

                describe("has no data", function () {
                    it("'#sportAndLeagueFilter' should has correct css", function () {
                        setFixtures('<div id="sportAndLeagueFilter">Filter</div>');
                        Result.renderFilter(null);

                        var result = $("#sportAndLeagueFilter").css("visibility");

                        expect(result).toBe("hidden");
                    });
                });
            });

            describe("renderSportFilter(sportData)", function () {
                it("'#ddlSport' should has correct html content when has sport data", function () {
                    setFixtures('<select id="ddlSport"></select>');
                    var data = [{ SportId: 1, SportName: "SB" }];

                    spyOn(Result, "clearExcelExport");
                    spyOn(Result, "clearResult");
                    spyOn(Result, "setDateParam");
                    spyOn(Result, "getData");

                    Result.submit();

                    Result.renderSportFilter(data);
                    var expectedResult = '<option value="1">SB</option>';

                    expect($("#ddlSport").html()).toBe(expectedResult);
                });
                it("'#ddlSport' should has correct html content When has no sport data", function () {
                    setFixtures('<select id="ddlSport"></select>');

                    spyOn(Result, "clearExcelExport");
                    spyOn(Result, "clearResult");
                    spyOn(Result, "setDateParam");
                    spyOn(Result, "getData");

                    Result.submit();

                    Result.renderSportFilter([]);

                    expect($("#ddlSport").html()).toBe("");
                });
            });

            describe("renderLeagueFilter(leagueData)", function () {
                it("'#ddlLeague' should has correct html content when has sport data", function () {
                    setFixtures('<select id="ddlLeague"></select>');
                    var data = [{ LeagueId: 1, LeagueName: "V-League" }];

                    Result.renderLeagueFilter(data);
                    var expectedResult = '<option value="1">V-League</option>';

                    expect($("#ddlLeague").html()).toBe(expectedResult);
                });
                it("'#ddlLeague' should has correct html content When has no sport data", function () {
                    setFixtures('<select id="ddlLeague"></select>');

                    Result.renderLeagueFilter(null);

                    expect($("#ddlLeague").html()).toBe("");
                });
            });

            describe("clearResult()", function () {
                beforeEach(function () {
                    setFixtures('<select id="ddlSport"><option value="1">SB</option></select>' +
                        '<div id="resultContent">Result</div>' +
                        '<div id="sportAndLeagueFilter">Filter</div>'
                        );

                    spyOn(Result, "clearLeagueFilter");

                    Result.clearResult();
                });

                it("Result.clearLeagueFilter() should be called", function () {
                    expect(Result.clearLeagueFilter).toHaveBeenCalled();
                });
                it("'#ddlSport' should has empty content", function () {
                    expect($("#ddlSport").html()).toBe("");
                });
                it("'#resultContent' should has empty content", function () {
                    expect($("#resultContent").html()).toBe("");
                });
                it("'#sportAndLeagueFilter' should has correct css", function () {
                    var result = $("#sportAndLeagueFilter").css("visibility");

                    expect(result).toBe("hidden");
                });
            });

            describe("clearLeagueFilter()", function () {
                it("'#ddlLeague' should has correct html content", function () {
                    setFixtures('<select id="ddlLeague"><option value="0"></option><option value="1">V-League</option></select>');

                    Result.clearLeagueFilter();

                    expect($("#ddlLeague").html()).toBe('<option value="0"></option>');
                });
            });

            describe("clearExcelExport()", function () {
                it("'#iframeForExportExcel' should has src attribute is empty", function () {
                    setFixtures('<div id="iframeForExportExcel"></div>');

                    Result.clearExcelExport();

                    expect($("#iframeForExportExcel").attr("src")).toBe("");
                });
            });

            describe("showOutRight(isShow)", function () {
                beforeEach(function () {
                    setFixtures('<div id="singleDate">Single Date</div>' +
                        '<div id="dateRange">Date Range</div>' +
                        '<div id="submitOutright">Submit Outright</div>' +
                        '<div id="submitNormal">Submit Normal</div>'
                        );
                });

                it("Elements should have properly attribute when isShow param equal true", function () {
                    Result.showOutRight(true);

                    expect($("#singleDate")).toBeHidden();
                    expect($("#dateRange")).toBeVisible();
                    expect($("#submitOutright").hasClass("active")).toBe(true);
                    expect($("#submitNormal").hasClass("active")).toBe(false);
                    expect($("#submitOutright").attr("data-isOutright")).toBe("1");
                });

                it("Elements should have properly attribute when isShow param equal false", function () {
                    Result.showOutRight(false);

                    expect($("#singleDate")).toBeVisible();
                    expect($("#dateRange")).toBeHidden();
                    expect($("#submitOutright").hasClass("active")).toBe(false);
                    expect($("#submitNormal").hasClass("active")).toBe(true);
                    expect($("#submitOutright").attr("data-isOutright")).toBe("0");
                });
            });

            describe("canSubmit(element)", function () {
                it("Function should return false when element has class 'active'", function () {
                    setFixtures('<button class="active" id="SubmitButton">Click!</button>');

                    var canSubmit = Result.canSubmit($("#SubmitButton"));

                    expect(canSubmit).toBe(false);
                });
                it("Function should return true when element has no class 'active'", function () {
                    setFixtures('<button class="abc" id="SubmitButton">Click!</button>');

                    var canSubmit = Result.canSubmit($("#SubmitButton"));

                    expect(canSubmit).toBe(true);
                });
            });

            describe("updateDateInput(isShowOutright)", function () {
                beforeEach(function () {
                    setFixtures('<div id="submitOutright" data-isoutright="1"></div>' +
                        '<input id="Date" value="03/03/2017" />' +
                        '<input id="FromDate" value="03/01/2017" /> <input id="ToDate" value="03/31/2017" />'
                        );
                    spyOn(Result, "clearExcelExport");
                    spyOn(Result, "clearResult");
                    spyOn(Result, "getData");

                    spyOn(DatePicker, "setValueForDateRange");
                    spyOn(DatePicker, "setValueForSingleDate");
                });

                it("DatePicker.setValueForDateRange(startDate, endDate) should be called with correct parameter when isShowOutright is true", function () {
                    Result.submit();
                    Result.updateDateInput(true);

                    expect(DatePicker.setValueForDateRange).toHaveBeenCalledWith("03/01/2017", "03/31/2017");
                });
                it("DatePicker.setValueForSingleDate($element, value) should be called with correct parameter when isShowOutright is false", function () {
                    $("#submitOutright").attr("data-isoutright", 0);
                    Result.submit();
                    Result.updateDateInput(false);

                    expect(DatePicker.setValueForSingleDate).toHaveBeenCalledWith($("#Date"), "03/03/2017");
                });
            });

            describe("stopAjaxRequest(request)", function () {
                it("should call request.abort()", function () {
                    var request = {
                        abort: function () { }
                    };

                    spyOn(request, 'abort');

                    Result.stopAjaxRequest(request);

                    expect(request.abort).toHaveBeenCalled();
                });
            });
        });
    });