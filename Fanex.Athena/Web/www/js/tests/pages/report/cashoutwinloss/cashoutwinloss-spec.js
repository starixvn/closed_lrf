define(["jquery", "common/querystring", "common/site", "pages/report/cashoutwinloss/cashoutwinloss.option", "pages/report/report", "lib/jqgrid/jquery.jqgrid.additional",
        "components/pluginhelper/daterangepicker", "common/popup", "helpers/daterange", "pages/report/cashoutwinloss/cashoutwinloss",
        "extensions/jquery.extension", "lib/jqgrid/jquery.jqGrid.min"],
    function ($, QueryString, Site, CashOutWinLossOption, Report, jqGridAdditional, DatePicker, Popup, DateHelper, CashOutWinLoss) {
        describe("CashOutWinLoss", function () {
            var ajaxOption, ajaxRequest;
            function CreateSubmitData(submitData) {
                setFixtures('<div id="MainForm"></div>');
                spyOn($.fn, "serializeObject").and.returnValues(submitData);
                spyOn(CashOutWinLoss, "setExcelUrl");

                ajaxRequest = jasmine.createSpyObj('ajaxRequest', ['abort']);
                spyOn($, "ajax").and.callFake(function (option) { ajaxOption = option; return ajaxRequest; });
            }

            function CreateCacheData(level, response) {
                var submitData = {
                    FromDate: "04/01/2017",
                    ToDate: "04/20/2017",
                    CurrencyId: 1,
                    IsExcludedTestData: true,
                    ReportBy: 1
                };
                CreateSubmitData(submitData);

                appendSetFixtures('<input id="CurrencyId" value="1" /> <div id="BaseCurrency" data-original="EUR"></div>');
                spyOn(CashOutWinLoss, "setReportTitle");
                spyOn(CashOutWinLoss, "bindData");
                spyOn(Report, "renderBreadCrumb");

                // Create _submitData by calling submit function
                CashOutWinLoss.submit();
                ajaxOption.success(response);
            }

            beforeAll(function () {
                spyOn(Site, "getSingleResource").and.callFake(function (resource) { return resource; });
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) { return url; });
            });

            describe("initialize()", function () {
                beforeEach(function () {
                    spyOn(Site, "initialize");
                    spyOn(DatePicker, "initDateRangePicker");
                    spyOn(Site, "addUserGuide");
                    spyOn(DateHelper, "setConstraintMonthRange");
                    spyOn(CashOutWinLoss, "initEvent");
                    spyOn(CashOutWinLoss, "initSetting");
                    spyOn(CashOutWinLoss, "registerGlobalFunction");

                    CashOutWinLoss.initialize();
                });

                it("Site.initialize() should be called", function () {
                    expect(Site.initialize).toHaveBeenCalled();
                });
                it("DatePicker.initDateRangePicker() should be called", function () {
                    expect(DatePicker.initDateRangePicker).toHaveBeenCalled();
                });
                it("Site.addUserGuide(option) should be called with correct parameter", function () {
                    expect(Site.addUserGuide).toHaveBeenCalledWith({ resourceName: "CashOutWL", title: "CashOutWinLoss" });
                });
                it("DateHelper.setConstraintMonthRange(monthRange, url) should be called with correct parameter", function () {
                    expect(DateHelper.setConstraintMonthRange).toHaveBeenCalledWith(3, "api/CashOutWinLossReport/Index");
                });
                it("CashOutWinLoss.initEvent() should be called", function () {
                    expect(CashOutWinLoss.initEvent).toHaveBeenCalled();
                });
                it("CashOutWinLoss.initSetting() should be called", function () {
                    expect(CashOutWinLoss.initSetting).toHaveBeenCalled();
                });
                it("CashOutWinLoss.registerGlobalFunction() should be called", function () {
                    expect(CashOutWinLoss.registerGlobalFunction).toHaveBeenCalled();
                });
            });

            describe("initSetting()", function () {
                beforeEach(function () {
                    setFixtures('<input id="IsLicenseeOfferBA" value="1" /> <input id="drillDownLicenseeId" value="1" />');
                    CashOutWinLoss.initSetting();
                });

                it("CashOutWinLossOption.isLicenseeOfferBA should be correct", function () {
                    expect(CashOutWinLossOption.isLicenseeOfferBA).toBe(true);
                });
            });

            describe("registerGlobalFunction()", function () {
                it("window.cashoutDrillDown function should be exist", function () {
                    CashOutWinLoss.registerGlobalFunction();

                    var result = !!window.cashoutDrillDown;

                    expect(result).toBe(true);
                });
            });

            describe("initEvent()", function () {
                beforeEach(function () {
                    setFixtures('<button id="SubmitButton"></button> <button id="ExportToExcel"></button> <input id="IsExportExcel" />' +
                        '<div id="MainForm"></div>' +
                        '<div id="level-link-container"><div class="level-link" data-level="0"></div><div class="level-link" data-level="1"></div><div class="level-link" data-level="2"></div></div>' +
                        '<div class="bet-list-link" data-drill-down="data"></div>'
                        );

                    $("body").off("*");
                    CashOutWinLoss.initEvent();
                    spyOn(CashOutWinLoss, "submit");
                });

                afterEach(function () {
                    $("body").off("*");
                });

                it("#IsExportExcel should has value is false when #SubmitButton fire click event", function () {
                    $("#SubmitButton").click();

                    var result = $("#IsExportExcel").val();

                    expect(result).toBe("false");
                });

                it("CashOutWinLoss.submit() should be called when #SubmitButton fire click event", function () {
                    $("#SubmitButton").click();

                    expect(CashOutWinLoss.submit).toHaveBeenCalled();
                });

                it("action attribute of #MainForm should be correct when #ExportToExcel fire click event", function () {
                    $("#ExportToExcel").click();

                    var result = $("#MainForm").attr("action");

                    expect(result).toBe("api/CashOutWinLossReport/Index");
                });

                it("#MainForm should be submitted when #ExportToExcel fire click event", function () {
                    var spyEvent = spyOnEvent($("#MainForm"), "submit");
                    $("#ExportToExcel").click();

                    expect(spyEvent).toHaveBeenTriggered();
                });

                it("CashOutWinLoss.goBack(level) should be called with correct parameter when level is 1 and '.level-link' fire click event", function () {
                    spyOn(CashOutWinLoss, "goBack");

                    $(".level-link[data-level='1']").click();

                    expect(CashOutWinLoss.goBack).toHaveBeenCalledWith(1);
                });

                it("CashOutWinLoss.goBack(level) should not be called with correct parameter when level is 2 and '.level-link' fire click event", function () {
                    spyOn(CashOutWinLoss, "goBack");

                    $(".level-link[data-level='2']").click();

                    expect(CashOutWinLoss.goBack).not.toHaveBeenCalled();
                });

                it("CashOutWinLoss.openBetlistPopUp(dataDrilldown) should be called when '.bet-list-link' fire click event", function () {
                    spyOn(CashOutWinLoss, "openBetlistPopUp");

                    $(".bet-list-link").click();

                    expect(CashOutWinLoss.openBetlistPopUp).toHaveBeenCalledWith("data");
                });

                it("resizeGrid function should be called when window fire resize event", function () {
                    spyOn(CashOutWinLoss, "resizeGrid");

                    $(window).resize();

                    expect(CashOutWinLoss.resizeGrid).toHaveBeenCalled();
                });

                it("off() jquery function should be called with correct parameter when window fire unload event", function () {
                    spyOn($.fn, "off");

                    $(window).unload();

                    expect($.fn.off).toHaveBeenCalledWith("resize");
                });
            });

            describe("submit()", function () {
                var request;
                beforeEach(function (done) {
                    setFixtures('<div id="MainForm"></div>');
                    spyOn($.fn, "serializeObject").and.returnValues({ Data: [{ Index: 1 }] });

                    spyOn(Site, "blockUI");
                    spyOn(Site, "unBlockUI");
                    spyOn(CashOutWinLoss, "setExcelUrl");
                    spyOn(CashOutWinLoss, "ajaxComplete");

                    jasmine.Ajax.install();
                    jasmine.Ajax
                            .stubRequest("api/CashOutWinLossReport/Index")
                            .andReturn({
                                'status': 200,
                                'contentType': 'application/json',
                                'responseText': '{ "Data": [1,2] }'
                            });

                    CashOutWinLoss.submit();
                    request = jasmine.Ajax.requests.mostRecent();

                    setTimeout(done, 10);
                });

                afterEach(function () {
                    jasmine.Ajax.uninstall();
                });

                it("request url should be correct", function () {
                    var expectedUrl = "api/CashOutWinLossReport/Index";
                    expect(request.url).toBe(expectedUrl);
                });

                it("CashOutWinLoss.setExcelUrl() should be called with correct parameter", function () {
                    expect(CashOutWinLoss.setExcelUrl).toHaveBeenCalledWith(0, 0, 0, "", "");
                });

                it("CashOutWinLoss.ajaxComplete() should be called with correct parameter", function () {
                    expect(CashOutWinLoss.ajaxComplete).toHaveBeenCalledWith(0, { Data: [1,2] });
                });

                it("Site.blockUI() should be called", function () {
                    expect(Site.blockUI).toHaveBeenCalled();
                });

                it("Site.unBlockUI() should be called", function () {
                    expect(Site.unBlockUI).toHaveBeenCalled();
                });
            });

            describe("setExcelUrl(level, currencyId, custId, fdate, tdate)", function () {
                var originalUrl;

                beforeEach(function () {
                    originalUrl = CashOutWinLossOption.urlExcelData;
                });

                afterEach(function () {
                    CashOutWinLossOption.urlExcelData = originalUrl;
                });

                it("CashOutWinLossOption.urlExcelData should be correct when level > 0", function () {
                    var fdate = new Date(2017, 3, 1), tdate = new Date(2017, 3, 20);
                    var level = 1, currencyId = 2, custId = 3;
                    var expectedUrl = "api/CashOutWinLossReport/Index?level=1&currencyId=2&custId=3&fdate=04/01/2017&tdate=04/20/2017";

                    CashOutWinLoss.setExcelUrl(level, currencyId, custId, fdate, tdate);

                    expect(CashOutWinLossOption.urlExcelData).toBe(expectedUrl);
                    
                });

                it("CashOutWinLossOption.urlExcelData should be correct when level = 0", function () {
                    var fdate = new Date(2017, 3, 1), tdate = new Date(2017, 3, 20);
                    var level = 0, currencyId = 2, custId = 3;
                    var expectedUrl = "api/CashOutWinLossReport/Index";

                    CashOutWinLoss.setExcelUrl(level, currencyId, custId, fdate, tdate);

                    expect(CashOutWinLossOption.urlExcelData).toBe(expectedUrl);
                });
            });

            describe("ajaxComplete(level, response)", function () {
                beforeEach(function () {
                    var submitData = {
                        FromDate: "04/01/2017",
                        ToDate: "04/20/2017"
                    };
                    CreateSubmitData(submitData);

                    appendSetFixtures('<input id="CurrencyId" value="1" />');
                    spyOn(Site, "blockUI");
                    spyOn(Site, "unBlockUI");
                    spyOn(CashOutWinLoss, "setReportTitle");
                    spyOn(CashOutWinLoss, "bindData");
                    spyOn(Report, "renderBreadCrumb");

                    // Create _submitData by calling submit function
                    CashOutWinLoss.submit();
                    ajaxOption.success(null);
                });

                it("CashOutWinLoss.setReportTitle() should be called with correct parameter when level is 0", function () {
                    var level = 0, response = {};
                    CashOutWinLoss.ajaxComplete(level, response);

                    expect(CashOutWinLoss.setReportTitle).toHaveBeenCalledWith("1", "04/01/2017", "04/20/2017");
                });

                it("CashOutWinLoss.setReportTitle() should not be called with correct parameter when level is 1", function () {
                    var level = 1, response = {};
                    CashOutWinLoss.ajaxComplete(level, response);

                    expect(CashOutWinLoss.setReportTitle).not.toHaveBeenCalled();
                });

                it("Report.renderBreadCrumb() should be called with correct parameter", function () {
                    var level = 1, response = {};
                    CashOutWinLoss.ajaxComplete(level, response);

                    expect(Report.renderBreadCrumb).toHaveBeenCalledWith(level);
                });

                it("CashOutWinLoss.bindData() should be called with correct parameter", function () {
                    var level = 1, response = {};
                    CashOutWinLoss.ajaxComplete(level, response);

                    expect(CashOutWinLoss.bindData).toHaveBeenCalledWith(level, response);
                });
            });

            describe("setReportTitle(currencyId, fromdate, todate)", function () {
                beforeEach(function () {
                    setFixtures('<div class="report-title"></div> <div class="panel-heading hide"></div>');

                    spyOn(Report, "getCurrencyNameForReportTitle").and.returnValues("EUR");
                });

                it(".report-title should has correct html content", function () {
                    var expectedResult = "CashOutWinLoss, 04/01/2017 → 04/20/2017 - EUR";
                    var currencyId = 1, fromdate = new Date(2017, 3, 1), todate = new Date(2017, 3, 20);

                    CashOutWinLoss.setReportTitle(currencyId, fromdate, todate);
                    var result = $(".report-title").html();

                    expect(result).toBe(expectedResult);
                });

                it(".panel-heading should not contain class hide", function () {
                    var currencyId = 1, fromdate = new Date(2017, 3, 1), todate = new Date(2017, 3, 20);

                    CashOutWinLoss.setReportTitle(currencyId, fromdate, todate);
                    var result = $(".panel-heading").hasClass("hide");

                    expect(result).toBe(false);
                });
            });

            describe("bindData(level, response)", function () {
                var gridOption;
                beforeEach(function () {
                    setFixtures('<div id="ReportGrid"></div>');
                    spyOn(jqGridAdditional, "clearGrid");
                    spyOn(jqGridAdditional, "setNoInfo");
                    spyOn($.fn, "jqGrid").and.callFake(function (option) { gridOption = option; });
                    spyOn(CashOutWinLossOption, "getGridOption").and.returnValues({});
                });

                it("jqGridAdditional.clearGrid() should be called with correct parameter", function () {
                    var level = 0, response = { Data: [] };
                    CashOutWinLoss.bindData(level, response);

                    expect(jqGridAdditional.clearGrid).toHaveBeenCalledWith("ReportGrid");
                });

                it("jqGridAdditional.setNoInfo() should be called when has no data", function () {
                    var level = 0, response = { Data: [] };
                    CashOutWinLoss.bindData(level, response);

                    expect(jqGridAdditional.setNoInfo).toHaveBeenCalled();
                });

                it("gridOption should has correct value when jqGrid function is called", function () {
                    var expected = {
                        data: [1, 2],
                        rowTotal: 2
                    };
                    var level = 0, response = { Data: [1, 2] };
                    CashOutWinLoss.bindData(level, response);

                    expect(gridOption.data).toEqual(expected.data);
                    expect(gridOption.rowTotal).toEqual(expected.rowTotal);
                });

                describe("gridOption.gridComplete()", function () {
                    beforeEach(function () {
                        appendSetFixtures('<div id="pg_ppdata">Paging Data</div> <div class="ui-jqgrid-ftable">Ftable HTML content</div> <div id="footer"></div>');
                        spyOn(jqGridAdditional, "gridComplete");
                        spyOn(CashOutWinLoss, "bindTotal");
                        spyOn(CashOutWinLossOption, "setGroupHeaders");
                        spyOn(CashOutWinLoss, "resizeGrid");
                        spyOn(Site, "unBlockUI");
                    });

                    it("functions should be called with correct parameter, if any", function () {
                        var level = 0, response = { Data: [1, 2], Total: [3,4], SummaryTotal: [4,5] };
                        CashOutWinLoss.bindData(level, response);
                        gridOption.gridComplete();

                        expect(jqGridAdditional.gridComplete).toHaveBeenCalled();
                        expect(CashOutWinLoss.bindTotal).toHaveBeenCalledWith(level, [3, 4], [4, 5]);
                        expect(CashOutWinLossOption.setGroupHeaders).toHaveBeenCalledWith($("#ReportGrid"));
                        expect(CashOutWinLoss.resizeGrid).toHaveBeenCalled();
                        expect(Site.unBlockUI).toHaveBeenCalled();
                    });

                    it("DOM elements should have correct state", function () {
                        var level = 0, response = { Data: [1, 2], Total: [3, 4], SummaryTotal: [4, 5] };
                        CashOutWinLoss.bindData(level, response);
                        gridOption.gridComplete();
                        var isPagingVisible = $("#pg_ppdata").is(":visible");
                        var footerHtmlContent = $("#footer").html();

                        expect(isPagingVisible).toBe(false);
                        expect(footerHtmlContent).toBe("Ftable HTML content");
                    });
                });
            });

            describe("bindTotal(level, totalData, summaryTotal)", function () {
                var columnModel = {}, summaryRowCount = 10;
                beforeEach(function () {
                    spyOn(CashOutWinLossOption, "getTotalColModel").and.returnValues(columnModel);
                    spyOn(jqGridAdditional, "assignTotal");
                    spyOn(Report, "bindSummaryTotal").and.returnValues(summaryRowCount);
                    spyOn(jqGridAdditional, "setGroupFooters");
                });

                it("functions should be called with correct parameter, if any", function () {
                    var level = 0, totalData = [1, 2], summaryTotal = [3, 4];
                    var summaryColSpan = 3;
                    CashOutWinLoss.bindTotal(level, totalData, summaryTotal);

                    expect(CashOutWinLossOption.getTotalColModel).toHaveBeenCalledWith(level);
                    expect(jqGridAdditional.assignTotal).toHaveBeenCalledWith(totalData, columnModel);
                    expect(Report.bindSummaryTotal).toHaveBeenCalledWith(columnModel, summaryTotal);
                    expect(jqGridAdditional.setGroupFooters).toHaveBeenCalledWith(2, summaryColSpan, summaryRowCount);
                });
            });

            describe("resizeGrid()", function () {
                beforeEach(function () {
                    setFixtures('<div id="ReportGrid"></div>');
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "updateGridWidth");

                    CashOutWinLoss.resizeGrid();
                });

                it("functions should be called with correct parameter if any", function () {
                    expect(jqGridAdditional.updateGridHeight).toHaveBeenCalled();
                    expect(jqGridAdditional.updateGridWidth).toHaveBeenCalledWith($("#ReportGrid"));
                });
            });

            describe("drillDown(level, currencyId, customerId, datetime)", function () {
                var submitData = {
                    FromDate: "04/01/2017",
                    ToDate: "04/20/2017",
                    CurrencyId: 0,
                    IsExcludedTestData: true,
                    ReportBy: 1,
                    BaseCurrency: "EUR",
                    CurrencyName: "EUR"
                };

                beforeEach(function () {                
                    CreateSubmitData(submitData);

                    appendSetFixtures('<div id="BaseCurrency" data-original="EUR"></div>');

                    spyOn(Report, "GetDrilldownDateRange").and.returnValues({ FromDate: new Date(2017, 3, 1), ToDate: new Date(2017, 3, 20) });
                    spyOn(Site, "blockUI");
                    spyOn(Site, "unBlockUI");

                    CashOutWinLoss.submit();
                    ajaxOption.success(null);
                });

                it("ajaxOption should be correct with level 0", function () {
                    var param =
                    {
                        IsExcludedTestData: true,
                        CurrencyId: 0,
                        FromDate: "04/01/2017",
                        ToDate: "04/20/2017",
                        ReportBy: 1,
                        BaseCurrency: "EUR"
                    };

                    var level = 0, currencyId = 0, customerId = 2, datetime = "2017-04-21T00:00:00";
                    CashOutWinLoss.drillDown(level, currencyId, customerId, datetime);

                    var postData = JSON.stringify(param);
                    var url = "api/CashOutWinLossReport/Index?level=0&currencyId=0&custId=2&fdate=04/01/2017&tdate=04/20/2017";

                    expect(ajaxOption.type).toBe("POST");
                    expect(ajaxOption.url).toBe(url);
                    expect(ajaxOption.data).toBe(postData);
                    expect(ajaxOption.dataType).toBe("json");
                    expect(ajaxOption.contentType).toBe("application/json");
                    expect(ajaxOption.cache).toBe(false);

                    ajaxOption.beforeSend();
                    expect(Site.blockUI).toHaveBeenCalled();
                    ajaxOption.complete();
                    expect(Site.unBlockUI).toHaveBeenCalled();
                });

                it("url of ajaxOption should be correct with level 1", function () {
                    var level = 1, currencyId = 2, customerId = 2, datetime = "2017-04-21T00:00:00";
                    CashOutWinLoss.drillDown(level, currencyId, customerId, datetime);

                    var url = "api/CashOutWinLossReport/Index?level=1&currencyId=2&custId=2&fdate=04/01/2017&tdate=04/20/2017";

                    expect(ajaxOption.url).toBe(url);
                });

                describe("success function", function () {
                    beforeEach(function () {
                        spyOn(CashOutWinLoss, "ajaxComplete");
                        spyOn(CashOutWinLoss, "setReportTitle");
                    });

                    it("CashOutWinLoss.ajaxComplete(level, response) should be called with correct parameter", function () {
                        var level = 1, currencyId = 2, customerId = 2, datetime = "2017-04-21T00:00:00";
                        CashOutWinLoss.drillDown(level, currencyId, customerId, datetime);

                        ajaxOption.success(null);

                        expect(CashOutWinLoss.ajaxComplete).toHaveBeenCalledWith(1, null);
                    });

                    it("CashOutWinLoss.setReportTitle() should be called with correct parameter with level is 1", function () {
                        var level = 1, currencyId = 2, customerId = 2, datetime = "2017-04-21T00:00:00";
                        var response = { Data: [1, 2] };
                        CashOutWinLoss.drillDown(level, currencyId, customerId, datetime);

                        ajaxOption.success(response);

                        expect(CashOutWinLoss.setReportTitle).toHaveBeenCalledWith(2, new Date(2017, 3, 1), new Date(2017, 3, 20), submitData.BaseCurrency);
                    });

                    it("CashOutWinLoss.setReportTitle() should be called with correct parameter with level is 0", function () {
                        var level = 0, currencyId = 2, customerId = 2, datetime = "2017-04-21T00:00:00";
                        var response = { Data: [1, 2] };
                        CashOutWinLoss.drillDown(level, currencyId, customerId, datetime);

                        ajaxOption.success(response);

                        expect(CashOutWinLoss.setReportTitle).toHaveBeenCalledWith(level, new Date(2017, 3, 1), new Date(2017, 3, 20));
                    });

                    it("CashOutWinLoss.setExcelUrl() should be called with correct parameter with level is 0", function () {
                        var level = 0, currencyId = 2, customerId = 2, datetime = "2017-04-21T00:00:00";
                        var response = { Data: [1, 2] };
                        CashOutWinLoss.drillDown(level, currencyId, customerId, datetime);

                        ajaxOption.success(response);

                        expect(CashOutWinLoss.setExcelUrl).toHaveBeenCalledWith(level, currencyId, customerId, new Date(2017, 3, 1), new Date(2017, 3, 20));
                    });
                });
            });

            describe("goBack(level)", function () {
                var originalLicenseeId;
                var originalExcelUrl;

                beforeEach(function () {
                    originalExcelUrl = CashOutWinLossOption.urlExcelData;
                });

                afterEach(function () {
                    CashOutWinLossOption.urlExcelData - originalExcelUrl;
                });

                it("functions should be called with correct parameter (if any) when level is 0", function () {
                    var level = 0, response = {};

                    CreateCacheData(level, response);
                    CashOutWinLoss.goBack(level);

                    expect(Report.renderBreadCrumb).toHaveBeenCalledWith(level);
                    expect(CashOutWinLoss.bindData).toHaveBeenCalledWith(level, response);
                    expect(CashOutWinLoss.setExcelUrl).toHaveBeenCalledWith(0, 0, 0, "", "");
                    expect(CashOutWinLoss.setReportTitle).toHaveBeenCalledWith("1", "04/01/2017", "04/20/2017");
                });

                it("url excel should be correct when level is 1", function () {
                    var level = 1, response = {};
                    CashOutWinLossOption.urlExcelData = "localhost?level=2";

                    CreateCacheData(level, response);
                    CashOutWinLoss.goBack(level);

                    expect(CashOutWinLossOption.urlExcelData).toBe("localhost?level=1");
                });

                it("Nothing happen if level is 2", function () {
                    var level = 2, response = {};

                    CreateCacheData(level, response);
                    CashOutWinLoss.goBack(level);

                    expect(CashOutWinLoss.setExcelUrl.calls.count()).toBe(1);
                    expect(CashOutWinLoss.setReportTitle.calls.count()).toBe(1);
                    expect(CashOutWinLossOption.urlExcelData).toBe(originalExcelUrl);
                });
            });

            describe("openBetlistPopUp(dataDrilldown)", function () {
                it("Report.GetDrilldownDateRange and Popup.openPopup(url, option) should be called with correct parameter", function () {
                    var dataDrilldown = '{"DrillDownDate":"2017-04-21","DrillDownCurrencyId":1,"DrillDownCurrencyName":"EUR","CustomerId":2,"ExternalId":"3","SystemId":"4"}';
                    
                    spyOn($.fn, "height").and.returnValues(1000);
                    spyOn(Report, "GetDrilldownDateRange").and.returnValues({ FromDate: new Date(2017, 3, 1), ToDate: new Date(2017, 3, 20) });
                    spyOn(Site, "setProductOptionOriginalParamList").and.callFake(function (url) { return url + "&original=test"; });
                    spyOn(Popup, "openPopupWithIframe");

                    var submitData = {
                        FromDate: "04/01/2017",
                        ToDate: "04/20/2017",
                        CurrencyId: 1,
                        IsExcludedTestData: true,
                        ReportBy: 1,
                        DrawFilter: 1,
                        BaseCurrency: "EUR",
                        CurrencyName: "EUR"
                    };
                    CreateSubmitData(submitData);
                    CashOutWinLoss.submit();

                    var url = "CustomerWinLossBetList/Index?fromdate=04/01/2017&todate=04/20/2017&excludetest=true&CurrencyId=1&" + 
                        "CurrencyName=EUR&drawfilter=1&custid=2&systemId=4&externalId=3&BaseCurrency=EUR&" + 
                        "excelfilename=CashOutWinLossBetList&productcodelist=CO";
                    var expectedUrl = url.replace(/[&|?][^=]*/g, function (match) {
                        return match.toLowerCase();
                    });
                    var option = { id: "betlist-popup", width: 970, height: 700, title: "CustomerBetList" };

                    CashOutWinLoss.openBetlistPopUp(dataDrilldown);

                    expect(Report.GetDrilldownDateRange).toHaveBeenCalledWith(submitData.ReportBy, submitData.FromDate, submitData.ToDate, "2017-04-21");
                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(expectedUrl, option);
                });
            });

            describe("lastDateOfMonth(year, month)", function () {
                it("result should be returned correctly", function () {
                    var result = CashOutWinLoss.lastDateOfMonth(2017, 2).date();

                    expect(result).toBe(30);
                });
            });
        });
    });