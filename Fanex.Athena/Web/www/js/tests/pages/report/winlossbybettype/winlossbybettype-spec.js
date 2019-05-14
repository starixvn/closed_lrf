define([
    "jquery",
    "common/site",
    "common/querystring",
    "components/pluginhelper/daterangepicker",
    "components/scrollablegrid",
    "helpers/sortableheader",
    "pages/report/winlossbybettype/winlossbybettype",
    "extensions/jquery.extension"],
    function ($, Site, QueryString, DatePicker, GridHelper, SortableHeader, WinLossByBetType) {
        describe("WinLossByBetType", function () {
            beforeAll(function () {
                spyOn(Site, "getSingleResource").and.callFake(function (resource) { return resource; });
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) { return url; });
            });

            describe("initialize", function () {
                beforeEach(function () {
                    spyOn(Site, "initialize");
                    spyOn(GridHelper, "resizeGrid");
                    spyOn(WinLossByBetType, "initDateRangePicker");
                    spyOn(SortableHeader, "createSortingIcon");
                    spyOn(Site, "addUserGuide");
                    spyOn(WinLossByBetType, "initEvent");

                    WinLossByBetType.initialize();
                });

                it("Site.initialize() should be called", function () {
                    expect(Site.initialize).toHaveBeenCalled();
                });
                it("GridHelper.resizeGrid() should be called", function () {
                    expect(GridHelper.resizeGrid).toHaveBeenCalled();
                });
                it("WinLossByBetType.initDateRangePicker() should be called", function () {
                    expect(WinLossByBetType.initDateRangePicker).toHaveBeenCalled();
                });
                it("SortableHeader.createSortingIcon() should be called with correct parameter", function () {
                    expect(SortableHeader.createSortingIcon).toHaveBeenCalledWith(WinLossByBetType.submitForm);
                });
                it("Site.addUserGuide() should be called with correct parameter", function () {
                    expect(Site.addUserGuide).toHaveBeenCalledWith({
                        resourceName: "WinLossByBetType",
                        title: "WinLossByBetType"
                    });
                });
                it("WinLossByBetType.initEvent() should be called", function () {
                    expect(WinLossByBetType.initEvent).toHaveBeenCalled();
                });
            });

            describe("initDateRangePicker()", function () {
                it("DatePicker.initDateRangePicker() should be called with correct parameter", function () {
                    var ranges = ["Today", "Yesterday", "Currentweek"];
                    var firstDayOfWeekIsMonday = false;
                    spyOn(DatePicker, "initDateRangePicker");

                    WinLossByBetType.initDateRangePicker();

                    expect(DatePicker.initDateRangePicker).toHaveBeenCalledWith(firstDayOfWeekIsMonday, ranges);
                });
            });

            describe("initEvent()", function () {
                beforeEach(function () {
                    $("body").off();
                    setFixtures('<button id="ExportToExcel"></button><input id="IsExportExcel" /><div id="WinLossByBetTypeForm"></div>' +
                        '<button id="SubmitButton"></button>' +
                        '<div class="body-content"><a class="bet-list-link" data-bettype="1"></a></div>');

                    WinLossByBetType.initEvent();
                });

                afterEach(function () {
                    $("body").off();
                });

                it("'#ExportToExcel' fired click event - '#IsExportExcel' should has correct value", function () {
                    $("#ExportToExcel").click();

                    var result = $("#IsExportExcel").val();

                    expect(result).toBe("true");
                });

                it("'#ExportToExcel' fired click event - '#WinLossByBetTypeForm' fire submit event", function () {
                    spyOn($.fn, "submit");

                    $("#ExportToExcel").click();

                    expect($.fn.submit).toHaveBeenCalled();
                });

                it("'#SubmitButton' fired click event - WinLossByBetType.submitForm should be called", function () {
                    spyOn(WinLossByBetType, "submitForm");

                    $("#SubmitButton").click();

                    expect(WinLossByBetType.submitForm).toHaveBeenCalled();
                });

                it("'.bet-list-link' fired click event - WinLossByBetType.viewBetList() should be called with correct parameter", function () {
                    spyOn(WinLossByBetType, "viewBetList");

                    $(".bet-list-link").click();

                    expect(WinLossByBetType.viewBetList).toHaveBeenCalledWith(1);
                });

                it("GridHelper.resizeGrid() should be called when window fire resize event", function () {
                    spyOn(GridHelper, "resizeGrid");

                    $(window).resize();

                    expect(GridHelper.resizeGrid).toHaveBeenCalled();
                });

                it("off() jquery function should be called with correct parameter when window fire unload event", function () {
                    spyOn($.fn, "off");

                    $(window).unload();

                    expect($.fn.off).toHaveBeenCalledWith("resize");
                });
            });

            describe("viewBetList(betType)", function () {
                beforeEach(function () {
                    setFixtures('<input id="FromDate" value="05/01/2017" /> <input id="ToDate" value="05/29/2017" />');
                    spyOn(Site, "setLicenseeOptionOriginalParam").and.callFake(function (url) { return url; });
                    spyOn(Site, "blockUI");
                    spyOn(Site, "redirect");

                    WinLossByBetType.viewBetList(1);
                });

                it("Site.blockUI() should be called", function () {
                    expect(Site.blockUI).toHaveBeenCalled();
                });

                it("Site.redirect(url) should be called with correct parameter", function () {
                    var expectedParam = "WinLossByBetTypeBetList/Index?fromdate=05/01/2017&todate=05/29/2017&bettype=1";

                    expect(Site.redirect).toHaveBeenCalledWith(expectedParam);
                });
            });

            describe("submitForm()", function () {
                beforeEach(function () {
                    setFixtures('<input id="IsExportExcel" /><div id="WinLossByBetTypeForm"></div>');
                    spyOn($.fn, "submit");

                    WinLossByBetType.submitForm();
                });

                it("'#IsExportExcel' should has correct value", function () {
                    var result = $("#IsExportExcel").val();

                    expect(result).toBe("false");
                });

                it("'#WinLossByBetTypeForm' fire submit event", function () {
                    expect($.fn.submit).toHaveBeenCalled();
                });
            });
        });
    });