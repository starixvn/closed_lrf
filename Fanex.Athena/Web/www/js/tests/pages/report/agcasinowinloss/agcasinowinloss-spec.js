define([
    "jquery",
    "common/site",
    "pages/report/agcasinowinloss/agcasinowinloss",
    "pages/report/agcasinowinloss/agcasinowinloss.option",
    "pages/report/report",
    "lib/jqgrid/jquery.jqgrid.additional",
    "components/pluginhelper/daterangepicker",
    "helpers/daterange",
    "moment"],
    function ($, Site, AgCasinoWinLoss, AgCasinoWinLossOption, Report, jqGridAdditional, DatePicker, DateHelper) {
        describe("AgCasinoWinLoss", function () {
            beforeAll(function () {
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                    return url;
                });
                spyOn(Site, "initialize");
                spyOn(Site, "addUserGuide");
                spyOn(Site, "getSingleResource").and.callFake(function (str) {
                    return str;
                });
                spyOn(DatePicker, "initDateRangePicker");
                spyOn(DateHelper, "setConstraintMonthRange");
                spyOn(Site, "blockUI");
                spyOn(Site, "unBlockUI");
            });

            describe("initialize()", function () {
                it("all initial methods should be called", function () {
                    spyOn(AgCasinoWinLoss, "initEvent");

                    AgCasinoWinLoss.initialize();

                    expect(Site.initialize).toHaveBeenCalled();
                    expect(DatePicker.initDateRangePicker).toHaveBeenCalled();
                    expect(Site.addUserGuide).toHaveBeenCalled();
                    expect(DateHelper.setConstraintMonthRange).toHaveBeenCalled();
                    expect(AgCasinoWinLoss.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                beforeEach(function () {
                    $("body").off();
                });

                afterEach(function () {
                    $("body").off();
                });

                it("AgCasinoWinLoss.submit() should be called if submit button is clicked.", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    spyOn(AgCasinoWinLoss, "submit");

                    AgCasinoWinLoss.initEvent();
                    $('#SubmitButton').click();

                    expect(AgCasinoWinLoss.submit).toHaveBeenCalled();
                });

                it("Main form should be submitted if ExportToExcel button is clicked.", function () {
                    setFixtures('<form id="MainForm">'
                        + '<input type="hidden" id="IsExportExcel" />'
                        + '<button id="ExportToExcel"></button>'
                        + '</form>');
                    var spyEvent = spyOnEvent($('#MainForm'), 'submit');
                    $('#MainForm').submit(function () { return false; });

                    AgCasinoWinLoss.initEvent();
                    $('#ExportToExcel').click();

                    expect(spyEvent).toHaveBeenTriggered();
                });

                it("AgCasinoWinLoss.goBack(level) should be called if level link 1 is clicked.", function () {
                    setFixtures('<div id="level-link-container">'
                        + '<a class="level-link" data-level="1"></a>'
                        + '<a class="level-link" data-level="2"></a>'
                        + '</div>');
                    spyOn(AgCasinoWinLoss, "goBack");

                    AgCasinoWinLoss.initEvent();
                    $('.level-link').eq(0).click();

                    expect(AgCasinoWinLoss.goBack).toHaveBeenCalledWith(1);
                });

                it("AgCasinoWinLoss.drillDown(data) should be called if drilldown link is clicked with correct params.", function () {
                    setFixtures('<div class="main-content">'
                        + '<a class="drilldown" data-drilldown=\'{"link":1}\'></a>'
                        + '<a class="drilldown" data-drilldown=\'{"link":2}\'></a>'
                        + '</div>');
                    spyOn(AgCasinoWinLoss, "drillDown");

                    AgCasinoWinLoss.initEvent();
                    $('.drilldown').eq(0).click();

                    expect(AgCasinoWinLoss.drillDown).toHaveBeenCalledWith({ link: 1 });
                });

                it("off() jquery function should be called with correct parameter when window fire unload event", function () {
                    spyOn($.fn, "off");
                    AgCasinoWinLoss.initEvent();

                    $(window).unload();

                    expect($.fn.off).toHaveBeenCalledWith("resize");
                });

                it("resizeGrid function should be called when window fire resize event", function () {
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "updateGridWidth");

                    AgCasinoWinLoss.initEvent();
                    $(window).resize();

                    expect(jqGridAdditional.updateGridHeight).toHaveBeenCalled();
                    expect(jqGridAdditional.updateGridWidth).toHaveBeenCalled();
                });
            });

            describe("setExcelUrl(level, currencyId, custId, fdate, tdate)", function () {
                it("removes url params when level is 0", function () {
                    var level = 0;
                    var expectedUrl = "api/AgCasinoWinLossReport/Index";

                    AgCasinoWinLoss.setExcelUrl(level);

                    expect(AgCasinoWinLossOption.urlExcelData).toEqual(expectedUrl);
                });

                it("adds url params when level is not 0", function () {
                    var level = 1, currencyId = 1, custId = 1, fdate = new Date("01/01/2011"), tdate = new Date("01/31/2011");
                    var expectedUrl = "api/AgCasinoWinLossReport/Index?level=1&currencyId=1&custId=1&fdate=01/01/2011&tdate=01/31/2011";

                    AgCasinoWinLoss.setExcelUrl(level, currencyId, custId, fdate, tdate);

                    expect(AgCasinoWinLossOption.urlExcelData).toEqual(expectedUrl);
                });
            });

            describe("setReportTitle(currencyId, fromdate, todate)", function () {
                it(".report-title content should be correct", function () {
                    var currencyId = 1, fromdate = new Date("01/01/2011"), todate = new Date("01/31/2011");
                    var expectedTitle = "AGCasinoWinLoss, 01/01/2011 → 01/31/2011 - 1";
                    setFixtures('<div class="report-title"></div>');
                    spyOn(Report, "getCurrencyNameForReportTitle").and.callFake(function (currencyId) {
                        return currencyId;
                    });

                    AgCasinoWinLoss.setReportTitle(currencyId, fromdate, todate);

                    expect($(".report-title").html()).toEqual(expectedTitle);
                });
            });

            describe("submit()", function () {
                var submitData = {
                    IsExcludedTestData: "false",
                    CurrencyId: "1",
                    FromDate: "01/01/2011",
                    ToDate: "01/31/2011",
                    CurrencyName: "USD",
                    ReportBy: "1",
                    BaseCurrency: "USD"
                }

                var ajaxOption = {};
                var ajaxObj = jasmine.createSpyObj("ajaxObj", ["abort"]);

                beforeAll(function () {
                    spyOn($, "ajax").and.callFake(function (option) {
                        ajaxOption = option;
                        option.beforeSend();
                        option.complete();
                        option.success();

                        return ajaxObj;
                    });

                    spyOn(AgCasinoWinLoss, "setExcelUrl");
                    spyOn(AgCasinoWinLoss, "ajaxComplete");
                });

                it("AgCasinoWinLoss.ajaxComplete should be called after calling ajax successfully", function () {
                    AgCasinoWinLoss.submit();

                    expect(AgCasinoWinLoss.ajaxComplete).toHaveBeenCalled();
                });

                it("AgCasinoWinLoss.setExcelUrl should be called with correct param", function () {
                    AgCasinoWinLoss.submit();

                    expect(AgCasinoWinLoss.setExcelUrl).toHaveBeenCalledWith(0, 0, 0, "", "");
                });

                it("ajaxRequest.abort() should be called if ajaxRequest is not null", function () {
                    AgCasinoWinLoss.submit();

                    expect(ajaxObj.abort).toHaveBeenCalled();
                });

                it("post data should be gotten correctly", function () {
                    setFixtures('<form id="MainForm">'
                    + '<input name="IsExcludedTestData" value="' + submitData.IsExcludedTestData + '">'
                    + '<input name="CurrencyId" value="' + submitData.CurrencyId + '">'
                    + '<input name="FromDate" value="' + submitData.FromDate + '">'
                    + '<input name="ToDate" value="' + submitData.ToDate + '">'
                    + '<input name="CurrencyName" value="' + submitData.CurrencyName + '">'
                    + '<input name="ReportBy" value="' + submitData.ReportBy + '">'
                    + '<input name="BaseCurrency" value="' + submitData.BaseCurrency + '">'
                    + '</form>');

                    AgCasinoWinLoss.submit();

                    expect(ajaxOption.data).toEqual(submitData);
                });
            });

            describe("ajaxComplete(level, response)", function () {
                beforeEach(function () {
                    spyOn(AgCasinoWinLoss, "setReportTitle");
                    spyOn(Report, "renderBreadCrumb");
                    spyOn(AgCasinoWinLoss, "bindData");
                });

                it("does nothing if response data is null", function () {
                    var level = 0, response = null;

                    AgCasinoWinLoss.ajaxComplete(level, response);

                    expect(AgCasinoWinLoss.bindData).not.toHaveBeenCalled();
                });

                it("binds data if response data is not null", function () {
                    var level = 1, response = {};

                    AgCasinoWinLoss.ajaxComplete(level, response);

                    expect(Report.renderBreadCrumb).toHaveBeenCalled();
                    expect(AgCasinoWinLoss.bindData).toHaveBeenCalled();
                });

                it("does not set report title if level is not 0", function () {
                    var level = 1, response = {};

                    AgCasinoWinLoss.ajaxComplete(level, response);

                    expect(AgCasinoWinLoss.setReportTitle).not.toHaveBeenCalled();
                });

                it("sets report title if level is 0", function () {
                    var level = 0, response = {};

                    AgCasinoWinLoss.ajaxComplete(level, response);

                    expect(AgCasinoWinLoss.setReportTitle).toHaveBeenCalled();
                });

                it("Report.renderBreadCrumb should be called with correct param", function () {
                    var level = 0, response = {};

                    AgCasinoWinLoss.ajaxComplete(level, response);

                    expect(Report.renderBreadCrumb).toHaveBeenCalledWith(level);
                });
            });

            describe("lastDateOfMonth(year, month)", function () {
                it("returns the end date of month", function () {
                    var expectedDate = 31;

                    var actualDate = AgCasinoWinLoss.lastDateOfMonth(2011, 2);

                    expect(actualDate.getDate()).toEqual(expectedDate);
                });
            });

            describe("drillDown(data)", function () {
                var ajaxOption = {};
                var ajaxObj = jasmine.createSpyObj("ajaxObj", ["abort"]);
                var data = {
                    level: 1,
                    currencyId: 1,
                    custId: 1
                };

                beforeAll(function () {
                    spyOn($, "ajax").and.callFake(function (option) {
                        ajaxOption = option;
                        option.beforeSend();
                        option.complete();

                        return ajaxObj;
                    });
                });

                beforeEach(function () {
                    spyOn(AgCasinoWinLoss, "setExcelUrl");
                    spyOn(AgCasinoWinLoss, "ajaxComplete");
                    spyOn(AgCasinoWinLoss, "setReportTitle");
                });

                it("AgCasinoWinLoss.ajaxComplete should be called after calling ajax successfully", function () {
                    AgCasinoWinLoss.drillDown(data);
                    ajaxOption.success(null);

                    expect(AgCasinoWinLoss.ajaxComplete).toHaveBeenCalled();
                });

                it("AgCasinoWinLoss.setExcelUrl should be called after calling ajax successfully", function () {
                    AgCasinoWinLoss.drillDown(data);
                    ajaxOption.success(null);

                    expect(AgCasinoWinLoss.setExcelUrl).toHaveBeenCalled();
                });

                it("AgCasinoWinLoss.setReportTitle should be called if response has data", function () {
                    AgCasinoWinLoss.drillDown(data);
                    ajaxOption.success({
                        Data: [1]
                    });

                    expect(AgCasinoWinLoss.setReportTitle).toHaveBeenCalled();
                });

                it("AgCasinoWinLoss.setReportTitle should not be called if response has no data", function () {
                    AgCasinoWinLoss.drillDown(data);
                    ajaxOption.success({
                        Data: [1]
                    });

                    expect(AgCasinoWinLoss.setReportTitle).toHaveBeenCalled();
                });
            });
            describe("drilldown when ReportBy is 2", function () {
                var data = {
                    level: 1,
                    currencyId: 1,
                    custId: 1
                };

                beforeAll(function () {
                    spyOn($, "ajax").and.callFake(function (option) {
                        option.beforeSend();
                        option.complete();
                        option.success({
                            Data: [1]
                        });

                        return null;
                    });
                });

                beforeEach(function () {
                    spyOn(AgCasinoWinLoss, "setExcelUrl");
                });

                function setUpDate(todate) {
                    setFixtures('<form id="MainForm">'
                    + '<input name="IsExcludedTestData" value="false">'
                    + '<input name="CurrencyId" value="0">'
                    + '<input name="FromDate" value="01/05/2011">'
                    + '<input name="ToDate" value="' + todate + '">'
                    + '<input name="CurrencyName" value="USD">'
                    + '<input name="ReportBy" value="2">'
                    + '<input name="BaseCurrency" value="USD">'
                    + '</form>');

                    spyOn(Report, "renderBreadCrumb");
                    spyOn(AgCasinoWinLoss, "bindData");
                    spyOn(AgCasinoWinLoss, "setReportTitle");

                    AgCasinoWinLoss.submit();
                    AgCasinoWinLoss.ajaxComplete(0, {});
                }

                it("AgCasinoWinLoss.setReportTitle should be called with todate is end date of month if the drilldown todate is not equal to the submitted todate", function () {
                    setUpDate("02/10/2011");
                    data.level = 0;
                    data.datetime = "01/01/2011";

                    AgCasinoWinLoss.drillDown(data);

                    expect(AgCasinoWinLoss.setReportTitle).toHaveBeenCalledWith("0", new Date("01/05/2011"), new Date("01/31/2011"));
                });

                it("AgCasinoWinLoss.setReportTitle should be called with todate is the submitted date if the drilldown todate is equal to the submitted todate ", function () {
                    setUpDate("02/10/2011");
                    data.level = 1;
                    data.datetime = "02/01/2011";

                    AgCasinoWinLoss.drillDown(data);

                    expect(AgCasinoWinLoss.setReportTitle).toHaveBeenCalledWith(1, new Date("02/01/2011"), new Date("02/10/2011"));
                });
            });

            describe("goBack(level)", function () {
                beforeEach(function () {
                    spyOn(Report, "renderBreadCrumb");
                    spyOn(AgCasinoWinLoss, "bindData");
                    spyOn(AgCasinoWinLoss, "setExcelUrl");
                    spyOn(AgCasinoWinLoss, "setReportTitle");
                });

                it("AgCasinoWinLoss.setReportTitle should be called if level is 0", function () {
                    AgCasinoWinLoss.goBack(0);

                    expect(AgCasinoWinLoss.setReportTitle).toHaveBeenCalled();
                });

                it("all methods need to be called with level param is 0 when going back to level 0", function () {
                    AgCasinoWinLoss.goBack(0);

                    expect(Report.renderBreadCrumb).toHaveBeenCalledWith(0);
                    expect(AgCasinoWinLoss.bindData.calls.mostRecent().args[0]).toEqual(0);
                    expect(AgCasinoWinLoss.setExcelUrl.calls.mostRecent().args[0]).toEqual(0);
                });

                it("AgCasinoWinLoss.setReportTitle should not be called if level is not 0", function () {
                    AgCasinoWinLoss.goBack(1);

                    expect(AgCasinoWinLoss.setReportTitle).not.toHaveBeenCalled();
                });

                it("all methods need to be called with level param is 0 when going back to level 1", function () {
                    AgCasinoWinLoss.goBack(1);

                    expect(Report.renderBreadCrumb).toHaveBeenCalledWith(1);
                    expect(AgCasinoWinLoss.bindData.calls.mostRecent().args[0]).toEqual(1);
                });

                it("urlExcelData should be replace 'level=2' to 'level=1' when going back to level 1", function () {
                    AgCasinoWinLossOption.urlExcelData = "level=2";

                    AgCasinoWinLoss.goBack(1);

                    expect(AgCasinoWinLossOption.urlExcelData).toEqual("level=1");
                });

                it("does nothing when going back to level 2", function () {
                    AgCasinoWinLossOption.urlExcelData = "level=2";

                    AgCasinoWinLoss.goBack(2);

                    expect(Report.renderBreadCrumb).not.toHaveBeenCalled();
                    expect(AgCasinoWinLoss.bindData).not.toHaveBeenCalled();
                    expect(AgCasinoWinLoss.setExcelUrl).not.toHaveBeenCalled();
                    expect(AgCasinoWinLoss.setReportTitle).not.toHaveBeenCalled();
                });
            });

            describe("bindTotal(level, totalData, summaryTotal)", function () {
                it("all methods used for total row", function () {
                    spyOn(jqGridAdditional, "assignTotal");
                    spyOn(Report, "bindSummaryTotal");
                    spyOn(jqGridAdditional, "setGroupFooters");

                    AgCasinoWinLoss.bindTotal(0, 0, {});

                    expect(jqGridAdditional.assignTotal).toHaveBeenCalled();
                    expect(Report.bindSummaryTotal).toHaveBeenCalled();
                    expect(jqGridAdditional.setGroupFooters).toHaveBeenCalled();
                });
            });

            describe("bindData(level, response)", function () {
                var gridOption = {};

                beforeAll(function () {
                    spyOn(jqGridAdditional, "clearGrid");
                    spyOn(jqGridAdditional, "setNoInfo");
                    spyOn($.fn, "jqGrid");
                    spyOn(jqGridAdditional, "gridComplete");
                    spyOn(AgCasinoWinLoss, "bindTotal");
                    spyOn(AgCasinoWinLoss, "resizeGrid");
                    spyOn(AgCasinoWinLossOption, "getGridOption").and.callFake(function () {
                        return gridOption;
                    });
                });

                it("should clear Grid", function () {
                    AgCasinoWinLoss.bindData(0, {
                        Data: []
                    });

                    expect(jqGridAdditional.clearGrid).toHaveBeenCalled();
                });

                it("returns no row if no data", function () {
                    AgCasinoWinLoss.bindData(0, {
                        Data: []
                    });

                    expect(jqGridAdditional.setNoInfo).toHaveBeenCalled();
                });

                it("shows grid if data is not empty", function () {
                    AgCasinoWinLoss.bindData(0, {
                        Data: [1],
                        Total: [1]
                    });

                    expect($.fn.jqGrid).toHaveBeenCalled();
                });

                it("binds total data if grid is rendered completely", function () {
                    AgCasinoWinLoss.bindData(0, {
                        Data: [1],
                        Total: [1]
                    });
                    gridOption.gridComplete();

                    expect(jqGridAdditional.gridComplete).toHaveBeenCalled();
                    expect(AgCasinoWinLoss.bindTotal).toHaveBeenCalled();
                    expect(AgCasinoWinLoss.resizeGrid).toHaveBeenCalled();
                });
            });
        });
    });