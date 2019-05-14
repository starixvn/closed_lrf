define(['jquery', "common/querystring", 'common/site', 'components/pluginhelper/daterangepicker', 'pages/report/licenseewinloss/licenseewinloss.option', 'pages/report/licenseewinloss/licenseewinloss',
    'pages/report/report', 'lib/jqgrid/jquery.jqgrid.additional', 'common/popup', 'components/pluginhelper/multiselect', "helpers/daterange", "helpers/downloader", "components/toast"],
    function ($, QueryString, Site, DatePicker, LicenseeWinLossOption, LicenseeWinLoss, Report, jqGridAdditional, Popup, MultiSelect, DateHelper, Downloader, Toast) {
        describe("LicenseeWinLoss", function () {
            beforeAll(function () {
                spyOn(Site, "getSingleResource").and.callFake(function (text) {
                    if (text === "Viewin") {
                        return "Viewin {0}";
                    }

                    return text;
                });
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                    return url;
                });
                spyOn(Site, "initialize");
                spyOn(MultiSelect, "initProductList");
                spyOn(DatePicker, "initDateRangePicker");
                spyOn(DateHelper, "setConstraintMonthRange");
            });

            describe("initialize()", function () {
                it("Site.initialize() should be called", function () {
                    LicenseeWinLoss.initialize();

                    expect(Site.initialize).toHaveBeenCalled();
                });

                it("LicenseeWinLossOption.licenseeId should be assigned data from #drillDownLicenseeId.", function () {
                    var $input = setFixtures('<input id="drillDownLicenseeId" value="1">');

                    LicenseeWinLoss.initialize();

                    expect(LicenseeWinLossOption.licenseeId).toBe(1);
                });

                it("initEvent() should be call when initialize() is called", function () {
                    spyOn(LicenseeWinLoss, 'initEvent');

                    LicenseeWinLoss.initialize();

                    expect(LicenseeWinLoss.initEvent).toHaveBeenCalled();
                });

                it("Site.addUserGuide() should be call when initialize() is called with correct params.", function () {
                    spyOn(Site, 'addUserGuide');

                    LicenseeWinLoss.initialize();

                    expect(Site.addUserGuide).toHaveBeenCalledWith({
                        resourceName: "LicenseeWL",
                        title: Site.getSingleResource("LicenseeWinLoss")
                    });
                });
            });

            describe("initEvent()", function () {
                beforeEach(function () {
                    $("body").off();
                });

                afterEach(function () {
                    $("body").off();
                });

                it("#IsExportExcel should have value 'false' when #SubmitButton is clicked.", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    appendSetFixtures('<div id="IsExportExcel"></div>');
                    spyOn(LicenseeWinLoss, "submit");

                    LicenseeWinLoss.initEvent();

                    $('#SubmitButton').click();
                    expect($('#IsExportExcel').val()).toBe(false);
                });

                describe("Export excel", function () {
                    beforeEach(function () {
                        setFixtures('<div id="ExportToExcel"></div>');
                        appendSetFixtures('<form id="licenseewinloss"><input type="hidden" name="CurrencyId" value="0" /></form>');

                        spyOn(LicenseeWinLoss, "exportExcel");

                        LicenseeWinLoss.initEvent();
                    });

                    it("call LicenseeWinLoss.exportExcel with correct data", function () {
                        var postData = { CurrencyId: '0' };
                        spyOn($.fn, "serializeObject").and.returnValue(postData);

                        $('#ExportToExcel').click();

                        expect(LicenseeWinLoss.exportExcel).toHaveBeenCalledWith(LicenseeWinLossOption.urlExcelData, postData, "LicenseeWinLoss.xls");
                    });
                });

                it("#LicenseeWinLoss.goBack() is not called when data-level in .level-link is greater than 1.", function () {
                    setFixtures('<div id="level-link-container"><div class="level-link" data-level="2"></div></div>');

                    spyOn(LicenseeWinLoss, 'goBack');

                    LicenseeWinLoss.initEvent();
                    $('.level-link').click();

                    expect(LicenseeWinLoss.goBack).not.toHaveBeenCalled();
                });

                it("#LicenseeWinLoss.goBack() should be called with correct param when .level-link is clicked.", function () {
                    setFixtures('<div id="level-link-container"><div class="level-link" data-level="0"></div></div>');

                    spyOn(LicenseeWinLoss, 'goBack');

                    LicenseeWinLoss.initEvent();
                    $('.level-link').click();

                    expect(LicenseeWinLoss.goBack).toHaveBeenCalledWith(0);
                });

                it("LicenseeWinLoss.openBetlistPopUp(datadrilldown) should be called if .bet-list-link is clicked.", function () {
                    setFixtures('<div class="bet-list-link"></div>');

                    spyOn(LicenseeWinLoss, "openBetlistPopUp");
                    LicenseeWinLoss.initEvent();
                    $('.bet-list-link').click();
                    expect(LicenseeWinLoss.openBetlistPopUp).toHaveBeenCalled();
                });

                it("resizeGrid function should be called when window fire resize event", function () {
                    spyOn(LicenseeWinLoss, "resizeGrid");
                    LicenseeWinLoss.initEvent();

                    $(window).resize();

                    expect(LicenseeWinLoss.resizeGrid).toHaveBeenCalled();
                });

                it("off() jquery function should be called with correct parameter when window fire unload event", function () {
                    spyOn($.fn, "off");
                    LicenseeWinLoss.initEvent();

                    $(window).unload();

                    expect($.fn.off).toHaveBeenCalledWith("resize");
                });
            });

            describe("exportExcel", function () {
                var ajaxOption;

                beforeEach(function () {
                    spyOn(Downloader, "download");
                    spyOn(Toast, "show");

                    spyOn($, "ajax").and.callFake(function (option) {
                        option.beforeSend();
                        ajaxOption = option;
                    });
                });

                it("ajax settings should be correct", function () {
                    var postData = { CurrencyId: '0' };
                    var url = "Test";
                    LicenseeWinLoss.exportExcel(url, postData);

                    expect(ajaxOption.type).toBe("POST");
                    expect(ajaxOption.dataType).toBe("binary");
                    expect(ajaxOption.responseType).toBe("blob");
                    expect(ajaxOption.url).toBe(url);
                    expect(ajaxOption.data).toEqual(postData);
                });

                it("beforeSend - Toast.show should be called", function () {
                    LicenseeWinLoss.exportExcel("", {}, "");

                    expect(Toast.show).toHaveBeenCalled();
                });

                it("call success of ajax function - Downloader.download should be called with correct parameter", function () {
                    var fileName = "fileName";
                    LicenseeWinLoss.exportExcel("", {}, fileName);

                    var response = "Binary Data";
                    ajaxOption.success(response);

                    expect(Downloader.download).toHaveBeenCalledWith(response, fileName);
                });
            });

            describe("setExcelUrl(level, currencyId, custId, fdate, tdate, currencyName)", function () {
                var originalExcelUrl = LicenseeWinLossOption.urlExcelData;
                afterEach(function () {
                    LicenseeWinLossOption.urlExcelData = originalExcelUrl;
                });

                it("All input fields should have correct value when level grater than 0", function () {
                    LicenseeWinLoss.setExcelUrl(1, 2, 3, '02/01/2001', '02/01/2001', 'UUS');

                    expect(LicenseeWinLossOption.urlExcelData).toBe('api/LicenseeWinLossReport/Index?level=1&currencyId=2&custId=3&fdate=02/01/2001&tdate=02/01/2001&currencyName=UUS');
                });

                it("All input fields should have correct value when level equal 0", function () {
                    LicenseeWinLoss.setExcelUrl(0, 2, 3, new Date(2001, 1, 1), new Date(2001, 1, 1), 'UUS');

                    expect(LicenseeWinLossOption.urlExcelData).toBe('api/LicenseeWinLossReport/Index');
                });
            });

            describe("setReportTitle(currencyId, fromdate, todate, currencyName)", function () {
                it("currencyName is empty - .report-title should has correct html content with currency name gotten by CurrencyId", function () {
                    setFixtures('<div class="report-title"></div>');
                    spyOn(Report, "getCurrencyNameForReportTitle").and.returnValue("Viewin EUR");
                    var date = new Date(2001, 1, 1);

                    LicenseeWinLoss.setReportTitle('-1', date, date);

                    expect($('.report-title').html()).toBe('LicenseeWinLoss, 02/01/2001 → 02/01/2001 - Viewin EUR');
                });

                it("currencyName is not empty - .report-title should has correct html content with currency name", function () {
                    setFixtures('<div class="report-title"></div>');
                    spyOn(Report, "getCurrencyNameForReportTitle").and.returnValue("Viewin EUR");
                    var date = new Date(2001, 1, 1);
                    var currencyName = "USD";

                    LicenseeWinLoss.setReportTitle('-1', date, date, currencyName);

                    expect($('.report-title').html()).toBe('LicenseeWinLoss, 02/01/2001 → 02/01/2001 - Viewin USD');
                });

                it("class 'hide' should be removed in .panel-heading", function () {
                    setFixtures('<div class="panel-heading hide"></div>');
                    spyOn(Report, "getCurrencyNameForReportTitle").and.returnValue("Viewin EUR");
                    var date = new Date(2001, 1, 1);

                    LicenseeWinLoss.setReportTitle('-1', date, date);
                    var hasClass = $(".panel-heading").hasClass("hide");

                    expect(hasClass).toBe(false);
                });
            });

            describe("showPromotionPrizeLink", function () {
                beforeEach(function () {
                    setFixtures('<div id="ExportPromotionPrizeLink"></div>');
                });

                it("LicenseeWinLoss.showPromotionPrizeLink(true) - Show Export Promotion Prize Link", function () {
                    LicenseeWinLoss.showPromotionPrizeLink(true);

                    expect($("#ExportPromotionPrizeLink").css("display")).toEqual("block");
                });

                it("LicenseeWinLoss.showPromotionPrizeLink(false) - Hide Export Promotion Prize Link", function () {
                    LicenseeWinLoss.showPromotionPrizeLink(false);

                    expect($("#ExportPromotionPrizeLink").css("display")).toEqual("none");
                });
                
            });

            describe("ajaxComplete", function () {
                beforeEach(function () {
                    setFixtures('<input name="ReportBy" type="checkbox" checked value="1" />' +
                        '<input id="CurrencyId" value="1" />' +
                        '<input id="FromDate" value="03/01/2017" /> <input id="ToDate" value="03/31/2017" />');
                    spyOn(Report, "renderBreadCrumb");
                    spyOn(LicenseeWinLoss, "bindData");
                    spyOn(LicenseeWinLoss, "setReportTitle");
                    spyOn(LicenseeWinLoss, "showPromotionPrizeLink");
                    LicenseeWinLossOption.licenseeId = 0;
                });

                it("Hide PromotionPrizeLink if response param has null value", function () {
                    LicenseeWinLoss.ajaxComplete(0, null);

                    expect(Report.renderBreadCrumb).not.toHaveBeenCalled();
                    expect(LicenseeWinLoss.showPromotionPrizeLink).toHaveBeenCalledWith(false);
                });

                it("LicenseeWinLoss.setReportTitle(currencyId, fromDate, toDate) should be called with correct parameter if level param is 0", function () {
                    LicenseeWinLoss.ajaxComplete(0, { Data: "Hello", Total: [] });

                    expect(LicenseeWinLoss.setReportTitle).toHaveBeenCalledWith("1", "03/01/2017", "03/31/2017");
                });

                it("LicenseeWinLoss.setReportTitle(currencyId, fromDate, toDate) should not be called with correct parameter if level param greater than 0", function () {
                    LicenseeWinLoss.ajaxComplete(1, { Data: "Hello", Total: [] });

                    expect(LicenseeWinLoss.setReportTitle).not.toHaveBeenCalled();
                });

                it("Report.renderBreadCrumb(level, licenseeId) should be called with correct parameter", function () {
                    LicenseeWinLoss.ajaxComplete(0, { Data: "Hello", Total: [] });

                    expect(Report.renderBreadCrumb).toHaveBeenCalledWith(0, 0);
                });

                it("LicenseeWinLoss.bindData(level) should be called with correct parameter", function () {
                    LicenseeWinLoss.ajaxComplete(0, { Data: "Hello", Total: [] });

                    expect(LicenseeWinLoss.bindData).toHaveBeenCalledWith(0, "1", { Data: "Hello", Total: [] });
                });

                it("LicenseeWinLoss.showPromotionPrizeLink should be called with 'true' if has Promotion Prize", function () {
                    LicenseeWinLoss.ajaxComplete(0, { Data: "Hello", Total: [], PromotionPrize: '1' });

                    expect(LicenseeWinLoss.showPromotionPrizeLink).toHaveBeenCalledWith(true);
                });

                it("LicenseeWinLoss.showPromotionPrizeLink should be called with 'false' if does not have Promotion Prize", function () {
                    LicenseeWinLoss.ajaxComplete(0, { Data: "Hello", Total: [], PromotionPrize: '' });

                    expect(LicenseeWinLoss.showPromotionPrizeLink).toHaveBeenCalledWith(false);
                });
            });

            describe("submit()", function () {
                describe("Products is valid", function () {
                    var request;
                    var submitData;
                    beforeEach(function (done) {
                        jasmine.Ajax.install();

                        submitData = {
                            ProductOptions: "SB, RC",
                            DrawFilter: 0,
                            CurrencyId: 1,
                            ReportBy: 1,
                            FromDate: "03/01/2017",
                            ToDate: "03/31/2017",
                            CurrencyName: "EUR",
                            IsExcludedTestData: true
                        };

                        setFixtures('<form id="licenseewinloss"></form>');
                        spyOn(Report, "setOriginalProduct");
                        spyOn(Site, "updateOriginalLicenseeOption");
                        spyOn(Report, "ValidProducts").and.returnValue(true);
                        spyOn($.fn, "serializeObject").and.returnValue(submitData);
                        spyOn(LicenseeWinLoss, "setExcelUrl");
                        spyOn(LicenseeWinLoss, "ajaxComplete");
                        spyOn(Site, "blockUI");
                        spyOn(Site, "unBlockUI");

                        jasmine.Ajax
                                .stubRequest("api/LicenseeWinLossReport/Index")
                                .andReturn({
                                    'status': 200,
                                    'contentType': 'application/json',
                                    'responseText': '{ "ProductOptions": "SB,RC" }'
                                });

                        LicenseeWinLoss.submit();
                        request = jasmine.Ajax.requests.mostRecent();

                        setTimeout(done, 10);
                    });
                    afterEach(function () {
                        jasmine.Ajax.uninstall();
                    });

                    it("request url should be correct", function () {
                        var expectedUrl = "api/LicenseeWinLossReport/Index";

                        expect(request.url).toBe(expectedUrl);
                    });
                    it("Report.setOriginalProduct() should be called", function () {
                        expect(Report.setOriginalProduct).toHaveBeenCalled();
                    });
                    it("Site.updateOriginalLicenseeOption() should be called", function () {
                        expect(Site.updateOriginalLicenseeOption).toHaveBeenCalled();
                    });
                    it("Site.blockUI() should be called", function () {
                        expect(Site.blockUI).toHaveBeenCalled();
                    });
                    it("Site.unBlockUI() should be called", function () {
                        expect(Site.unBlockUI).toHaveBeenCalled();
                    });
                    it("LicenseeWinLoss.setExcelUrl(level, currencyId, custId, fdate, tdate, currencyName) should be called with correct parameters", function () {
                        expect(LicenseeWinLoss.setExcelUrl).toHaveBeenCalledWith(0, 0, 0, "", "", "");
                    });
                    it("LicenseeWinLoss.ajaxComplete(level, response) should be called with correct parameters", function () {
                        expect(LicenseeWinLoss.ajaxComplete).toHaveBeenCalledWith(0, { ProductOptions: "SB,RC" });
                    });
                    describe("Export Promotion Prize excel", function () {
                        beforeEach(function () {
                            setFixtures('<div id="ExportPromotionPrizeLink"></div>');
                            spyOn(LicenseeWinLoss, "exportExcel");

                            LicenseeWinLoss.initEvent();
                        });

                        it("level = 0 - call LicenseeWinLoss.exportExcel with correct data", function () {
                            var token = "123456";
                            spyOn(Site, "getXsrfToken").and.returnValue(token);

                            var expectedParamData = {
                                __RequestVerificationToken: token,
                                FromDate: submitData.FromDate,
                                ToDate: submitData.ToDate,
                                CurrencyId: submitData.CurrencyId,
                                CurrencyName: submitData.CurrencyName,
                                IsExcludedTestData: submitData.IsExcludedTestData,
                                AgentId: submitData.AgentId
                            };

                            $('#ExportPromotionPrizeLink').click();

                            expect(LicenseeWinLoss.exportExcel).toHaveBeenCalledWith(LicenseeWinLossOption.urlPromotionPrizeExcelData, expectedParamData, "PP_PromotionPrize.xls");
                        });
                    });
                });

                describe("Product is invalid", function () {
                    beforeEach(function () {
                        setFixtures('<form id="licenseewinloss"></form>');
                        spyOn(Report, "setOriginalProduct");
                        spyOn(Site, "updateOriginalLicenseeOption");
                        spyOn(Report, "ValidProducts").and.returnValue(false);
                        spyOn($.fn, "serializeObject");
                    });

                    it("Function return false", function () {
                        var result = LicenseeWinLoss.submit();

                        expect(result).toBe(false);
                    });

                    it("serializeObject() function is not called", function () {
                        LicenseeWinLoss.submit();

                        expect($.fn.serializeObject).not.toHaveBeenCalled();
                    });
                });
            });

            describe("sortData(arrayData)", function () {
                var arrayData;
                beforeEach(function () {
                    arrayData = [{ Index: 1, Column2: "A" }, { Index: 2, Column2: "B" }];
                    jasmine.clock().install();

                    setFixtures('<input name="ReportBy" type="checkbox" checked value="1" />');
                    spyOn(Report, "renderBreadCrumb");

                    spyOn(Site, "blockUI");
                    spyOn(LicenseeWinLoss, "bindData");
                    spyOn(LicenseeWinLoss, "setReportTitle");
                    spyOn(Site, "unBlockUI");

                    LicenseeWinLoss.ajaxComplete(0, { Data: arrayData }); //set value for cache data
                    LicenseeWinLossOption.gridOption.onSortCol("Column2");
                    jasmine.clock().tick(101);
                });
                afterEach(function () {
                    jasmine.clock().uninstall();
                });

                it("Array data should be returned with ascending order at first time", function () {
                    var result = LicenseeWinLoss.sortData(arrayData);

                    expect(result).toEqual([{ Index: 1, Column2: "A", Id: 1 }, { Index: 2, Column2: "B", Id: 2 }]);
                });

                it("Array data should be returned with descending order at second time", function () {
                    var result = LicenseeWinLoss.sortData(arrayData);

                    expect(result).toEqual([{ Index: 1, Column2: "B", Id: 2 }, { Index: 2, Column2: "A", Id: 1 }]);
                });

                it("Array data should be returned with ascending order at third time", function () {
                    var result = LicenseeWinLoss.sortData(arrayData);

                    expect(result).toEqual([{ Index: 1, Column2: "A", Id: 1 }, { Index: 2, Column2: "B", Id: 2 }]);
                });
            });

            describe("lastDateOfMonth(year, month)", function () {
                it("Value should return correctly", function () {
                    var expected = "Fri Mar 31 2017";

                    var result = LicenseeWinLoss.lastDateOfMonth(2017, 2).toDateString();

                    expect(result).toBe(expected);
                });
            });

            describe("drillDown(level, currencyId, customerId, datetime, currencyName, keepSorting)", function () {
                var submitData;
                beforeEach(function () {
                    submitData = {
                        ProductOptions: '["SB","RC"]',
                        DrawFilter: 0,
                        CurrencyId: 1,
                        ReportBy: 2,
                        FromDate: "2017-03-01T00:00:00",
                        ToDate: "2017-03-31T00:00:00",
                        CurrencyName: "EUR",
                        IsExcludedTestData: true
                    };

                    setFixtures('<form id="licenseewinloss"></form> <input id="BaseCurrency" data-original="EUR" />');
                    spyOn(Report, "setOriginalProduct");
                    spyOn(Site, "updateOriginalLicenseeOption");
                    spyOn(Report, "ValidProducts").and.returnValue(true);
                    spyOn($.fn, "serializeObject").and.returnValue(submitData);
                    spyOn(LicenseeWinLoss, "setExcelUrl");
                    spyOn(LicenseeWinLoss, "ajaxComplete");
                    spyOn($, "ajax").and.returnValues(null, { abort: function () { } });
                    spyOn(Report, "GetDrilldownDateRange").and.returnValues({ FromDate: new Date(2017, 2, 1), ToDate: new Date(2017, 2, 31) });
                });
                afterEach(function () {
                    submitData = {
                        ProductOptions: '["SB","RC"]',
                        DrawFilter: 0,
                        CurrencyId: 1,
                        ReportBy: 2,
                        FromDate: "2017-03-01T00:00:00",
                        ToDate: "2017-03-31T00:00:00",
                        CurrencyName: "EUR",
                        IsExcludedTestData: true
                    };
                });

                it("property data of ajax option should be correct", function () {
                    LicenseeWinLoss.submit();
                    var ajaxOptionForCreateSubmitData = $.ajax.calls.mostRecent().args[0];
                    ajaxOptionForCreateSubmitData.success(submitData);

                    LicenseeWinLoss.drillDown(1, 9, 0, '2017-02-04T00:00:00', 'EUR');
                    var ajaxOptionForDrillingDown = $.ajax.calls.mostRecent().args[0];
                    var dataOptionResult = $.parseJSON(ajaxOptionForDrillingDown.data);

                    expect(dataOptionResult.ProductOptions).toEqual(["SB", "RC"]);
                    expect(dataOptionResult.DrawFilter).toBe(submitData.DrawFilter);
                    expect(dataOptionResult.CurrencyId).toBe(submitData.CurrencyId);
                    expect(dataOptionResult.ReportBy).toBe(submitData.ReportBy);
                    expect(new Date(dataOptionResult.FromDate)).toEqual(new Date(submitData.FromDate));
                    expect(new Date(dataOptionResult.ToDate)).toEqual(new Date(submitData.ToDate));
                    expect(dataOptionResult.IsExcludedTestData).toBe(submitData.IsExcludedTestData);
                });

                it("url of ajax option should be correct when month of date param equal with month in FromDate and ToDate", function () {
                    LicenseeWinLoss.submit();
                    var ajaxOptionForCreateSubmitData = $.ajax.calls.mostRecent().args[0];
                    ajaxOptionForCreateSubmitData.success(submitData);

                    LicenseeWinLoss.drillDown(2, 9, 0, '2017-03-04T00:00:00', 'EUR', true);
                    var ajaxOptionForDrillingDown = $.ajax.calls.mostRecent().args[0];

                    var resultUrl = ajaxOptionForDrillingDown.url;
                    var expectedUrl = "api/LicenseeWinLossReport/Index?level=2&currencyId=9&custId=0&fdate=03/01/2017&tdate=03/31/2017";

                    expect(resultUrl).toBe(expectedUrl);
                });

                it("Site.blockUI() should be called with beforeSend function of ajax option", function () {
                    spyOn(Site, "blockUI");
                    LicenseeWinLoss.submit();
                    var ajaxOptionForCreateSubmitData = $.ajax.calls.mostRecent().args[0];
                    ajaxOptionForCreateSubmitData.success(submitData);

                    LicenseeWinLoss.drillDown(2, 9, 0, '2017-03-04T00:00:00', 'EUR', true);
                    var ajaxOptionForDrillingDown = $.ajax.calls.mostRecent().args[0];

                    ajaxOptionForDrillingDown.beforeSend();

                    expect(Site.blockUI).toHaveBeenCalled();
                });
                it("Site.unBlockUI() should be called with complete function of ajax option", function () {
                    spyOn(Site, "unBlockUI");
                    LicenseeWinLoss.submit();
                    var ajaxOptionForCreateSubmitData = $.ajax.calls.mostRecent().args[0];
                    ajaxOptionForCreateSubmitData.success(submitData);

                    LicenseeWinLoss.drillDown(2, 9, 0, '2017-03-04T00:00:00', 'EUR', true);
                    var ajaxOptionForDrillingDown = $.ajax.calls.mostRecent().args[0];

                    ajaxOptionForDrillingDown.complete();

                    expect(Site.unBlockUI).toHaveBeenCalled();
                });

                describe("success function of ajax option", function () {
                    it("LicenseeWinLoss.ajaxComplete(level, response) should be called with correct parameter", function () {
                        LicenseeWinLoss.submit();
                        var ajaxOptionForCreateSubmitData = $.ajax.calls.mostRecent().args[0];
                        ajaxOptionForCreateSubmitData.success(submitData);

                        LicenseeWinLoss.drillDown(2, 9, 0, '2017-03-04T00:00:00', 'EUR', true);
                        var ajaxOptionForDrillingDown = $.ajax.calls.mostRecent().args[0];
                        ajaxOptionForDrillingDown.success({ Data: [] });

                        expect(LicenseeWinLoss.ajaxComplete.calls.mostRecent().args).toEqual([2, { Data: [] }]);
                    });

                    it("LicenseeWinLoss.setExcelUrl(level, currencyId, customerId, fdate, tdate, currencyName) should be called with correct parameter", function () {
                        LicenseeWinLoss.submit();
                        var ajaxOptionForCreateSubmitData = $.ajax.calls.mostRecent().args[0];
                        ajaxOptionForCreateSubmitData.success(submitData);

                        LicenseeWinLoss.drillDown(0, 9, 0, '2017-03-04T00:00:00', 'EUR', true);
                        var ajaxOptionForDrillingDown = $.ajax.calls.mostRecent().args[0];
                        ajaxOptionForDrillingDown.success({ Data: [{ Name: "Test" }] });

                        var args = LicenseeWinLoss.setExcelUrl.calls.mostRecent().args;
                        expect(args[0]).toBe(0);
                        expect(args[1]).toBe(9);
                        expect(args[2]).toBe(0);
                        expect(args[3]).toEqual('03/01/2017');
                        expect(args[4]).toEqual('03/31/2017');
                        expect(args[5]).toBe("EUR");
                    });

                    it("LicenseeWinLoss.setReportTitle should be called with correct parameter", function () {
                        LicenseeWinLoss.submit();
                        var ajaxOptionForCreateSubmitData = $.ajax.calls.mostRecent().args[0];
                        ajaxOptionForCreateSubmitData.success(submitData);

                        spyOn(LicenseeWinLoss, "setReportTitle");
                        LicenseeWinLoss.drillDown(1, 9, 0, '2017-03-04T00:00:00', 'EUR', true);
                        var ajaxOptionForDrillingDown = $.ajax.calls.mostRecent().args[0];
                        ajaxOptionForDrillingDown.success({ Data: [{ Name: "Test" }] });

                        var args = LicenseeWinLoss.setReportTitle.calls.mostRecent().args;
                        expect(args[0]).toBe(1);
                        expect(args[1]).toEqual(new Date(2017, 2, 1));
                        expect(args[2]).toEqual(new Date(2017, 2, 31));
                    });

                    it("LicenseeWinLoss.setReportTitle should be called with correct parameter when level > 0 & currencyId === 0 & BaseCurrency is empty", function () {
                        setFixtures('<form id="licenseewinloss"></form> <input id="BaseCurrency" data-original="" />');

                        submitData.CurrencyId = 0;
                        LicenseeWinLoss.submit();
                        var ajaxOptionForCreateSubmitData = $.ajax.calls.mostRecent().args[0];
                        ajaxOptionForCreateSubmitData.success(submitData);

                        spyOn(LicenseeWinLoss, "setReportTitle");

                        var currencyName = "USD"
                        LicenseeWinLoss.drillDown(1, 9, 0, '2017-03-04T00:00:00', currencyName);
                        var ajaxOptionForDrillingDown = $.ajax.calls.mostRecent().args[0];
                        ajaxOptionForDrillingDown.success({ Data: [{ Name: "Test" }] });

                        var args = LicenseeWinLoss.setReportTitle.calls.mostRecent().args;
                        expect(args[0]).toBe(9);
                        expect(args[1]).toEqual(new Date(2017, 2, 1));
                        expect(args[2]).toEqual(new Date(2017, 2, 31));
                        expect(args[3]).toEqual(currencyName);
                    });

                    it("LicenseeWinLoss.setReportTitle should be called with correct parameter when level > 0 & currencyId === 0 & BaseCurrency is not empty", function () {
                        setFixtures('<form id="licenseewinloss"></form> <input id="BaseCurrency" data-original="EUR" />');

                        submitData.CurrencyId = 0;
                        LicenseeWinLoss.submit();
                        var ajaxOptionForCreateSubmitData = $.ajax.calls.mostRecent().args[0];
                        ajaxOptionForCreateSubmitData.success(submitData);

                        spyOn(LicenseeWinLoss, "setReportTitle");

                        var currencyName = "USD"
                        LicenseeWinLoss.drillDown(1, 9, 0, '2017-03-04T00:00:00', currencyName);
                        var ajaxOptionForDrillingDown = $.ajax.calls.mostRecent().args[0];
                        ajaxOptionForDrillingDown.success({ Data: [{ Name: "Test" }], PromotionPrize: '0' });

                        var args = LicenseeWinLoss.setReportTitle.calls.mostRecent().args;
                        expect(args[0]).toBe(9);
                        expect(args[1]).toEqual(new Date(2017, 2, 1));
                        expect(args[2]).toEqual(new Date(2017, 2, 31));
                        expect(args[3]).toEqual("EUR");
                    });

                    it("LicenseeWinLoss.updateDrilldownData should be called with correct parameter", function () {
                        spyOn(LicenseeWinLoss, "updateDrilldownData");

                        LicenseeWinLoss.submit();
                        var ajaxOptionForCreateSubmitData = $.ajax.calls.mostRecent().args[0];
                        ajaxOptionForCreateSubmitData.success(submitData);   

                        spyOn(LicenseeWinLoss, "setReportTitle");

                        var currencyId = 9;
                        var currencyName = 'EUR';
                        var custId = 0;
                        LicenseeWinLoss.drillDown(1, currencyId, custId, '2017-03-04T00:00:00', currencyName, true);

                        var ajaxOptionForDrillingDown = $.ajax.calls.mostRecent().args[0];
                        ajaxOptionForDrillingDown.success({ Data: [{ Name: "Test" }], PromotionPrize: '0' });

                        var args = LicenseeWinLoss.updateDrilldownData.calls.mostRecent().args;
                        expect(args[0]).toBe(currencyId);
                        expect(args[1]).toEqual(currencyName);
                        expect(args[2]).toEqual('03/01/2017');
                        expect(args[3]).toEqual('03/31/2017');
                        expect(args[4]).toEqual(custId);
                    });

                    describe("Export Promotion Prize excel", function () {
                        var currencyId = 9;
                        var currencyName = 'EUR';
                        var custId = 0;
                        beforeEach(function () {
                            setFixtures('<div id="ExportPromotionPrizeLink"></div>');
                            spyOn(LicenseeWinLoss, "exportExcel");

                            LicenseeWinLoss.initEvent();

                            LicenseeWinLoss.submit();
                            var ajaxOptionForCreateSubmitData = $.ajax.calls.mostRecent().args[0];
                            ajaxOptionForCreateSubmitData.success(submitData);

                            spyOn(LicenseeWinLoss, "setReportTitle");

                            LicenseeWinLoss.drillDown(1, currencyId, custId, '2017-03-04T00:00:00', currencyName, true);

                            var ajaxOptionForDrillingDown = $.ajax.calls.mostRecent().args[0];
                            ajaxOptionForDrillingDown.success({ Data: [{ Name: "Test" }], PromotionPrize: '0' });
                        });

                        it("level <> 0 - call LicenseeWinLoss.exportExcel with correct data", function () {
                            var token = "123456";
                            spyOn(Site, "getXsrfToken").and.returnValue(token);

                            var expectedParamData = {
                                __RequestVerificationToken: token,
                                FromDate: '03/01/2017',
                                ToDate: '03/31/2017',
                                CurrencyId: currencyId,
                                CurrencyName: currencyName,
                                IsExcludedTestData: submitData.IsExcludedTestData,
                                AgentId: custId
                            };

                            $('#ExportPromotionPrizeLink').click();

                            expect(LicenseeWinLoss.exportExcel).toHaveBeenCalledWith(LicenseeWinLossOption.urlPromotionPrizeExcelData, expectedParamData, "PP_PromotionPrize.xls");
                        });
                    });
                });
            });

            describe("bindTotal(level, totalData, summaryTotal)", function () {
                var submitData;
                beforeEach(function () {
                    submitData = {
                        ProductOptions: '["SB","RC"]',
                        DrawFilter: 0,
                        CurrencyId: 1,
                        ReportBy: 2,
                        FromDate: "2017-03-01T00:00:00",
                        ToDate: "2017-03-31T00:00:00",
                        CurrencyName: "EUR",
                        IsExcludedTestData: true
                    };

                    setFixtures('<form id="licenseewinloss"></form> <input id="BaseCurrency" data-original="EUR" />');

                    spyOn(Report, "setOriginalProduct");
                    spyOn(Site, "updateOriginalLicenseeOption");
                    spyOn(Report, "ValidProducts").and.returnValue(true);
                    spyOn($.fn, "serializeObject").and.returnValue(submitData);
                    spyOn(LicenseeWinLoss, "setExcelUrl");
                    spyOn(LicenseeWinLoss, "ajaxComplete");
                    spyOn($, "ajax").and.returnValue({ abort: function () { } });

                    LicenseeWinLoss.submit();
                    var ajaxOption = $.ajax.calls.mostRecent().args[0];
                    ajaxOption.success(submitData);

                    spyOn(LicenseeWinLossOption, "getTotalColModel").and.returnValue([{ Name: "Col1" }]);
                    spyOn(jqGridAdditional, "assignTotal");
                    spyOn(jqGridAdditional, "setGroupFooters");
                    spyOn(Report, "bindSummaryTotal").and.returnValue(3);
                });
                afterEach(function () {
                    submitData = {
                        ProductOptions: '["SB","RC"]',
                        DrawFilter: 0,
                        CurrencyId: 1,
                        ReportBy: 2,
                        FromDate: "2017-03-01T00:00:00",
                        ToDate: "2017-03-31T00:00:00",
                        CurrencyName: "EUR",
                        IsExcludedTestData: true
                    };
                });

                it("LicenseeWinLossOption.getTotalColModel(level, productOptions) should be called with correct parameter", function () {
                    LicenseeWinLoss.bindTotal(1, { Total: [1, 2] }, 3);

                    expect(LicenseeWinLossOption.getTotalColModel).toHaveBeenCalledWith(1, ["RC", "SB"]);
                });
                it("jqGridAdditional.assignTotal(totalData, columnModel) should be called with correct parameter", function () {
                    LicenseeWinLoss.bindTotal(1, { Total: [1, 2] }, 3);

                    expect(jqGridAdditional.assignTotal).toHaveBeenCalledWith({ Total: [1, 2] }, [{ Name: "Col1" }]);
                });
                it("Report.bindSummaryTotal(columnModel, summaryTotal) should be called with correct parameter", function () {
                    LicenseeWinLoss.bindTotal(1, { Total: [1, 2] }, 3);

                    expect(Report.bindSummaryTotal).toHaveBeenCalledWith([{ Name: "Col1" }], 3);
                });
                it("jqGridAdditional.setGroupFooters should be called with correct parameter if level is 2", function () {
                    LicenseeWinLoss.bindTotal(2, { Total: [1, 2] }, 3);

                    expect(jqGridAdditional.setGroupFooters).toHaveBeenCalledWith(3, 4, 3);
                });
            });

            describe("openBetlistPopUp(dataDrillDown)", function () {
                var submitData, dataDrilldown;
                beforeEach(function () {
                    submitData = {
                        ProductOptions: '["SB","RC"]',
                        DrawFilter: 0,
                        CurrencyId: 1,
                        ReportBy: 2,
                        FromDate: "03/01/2017",
                        ToDate: "03/31/2017",
                        CurrencyName: "EUR",
                        IsExcludedTestData: true
                    };

                    setFixtures('<form id="licenseewinloss"></form> <input id="BaseCurrency" data-original="EUR" />');

                    spyOn(Report, "setOriginalProduct");
                    spyOn(Site, "updateOriginalLicenseeOption");
                    spyOn($.fn, "serializeObject").and.returnValue(submitData);
                    spyOn(Report, "ValidProducts").and.returnValue(true);
                    spyOn(LicenseeWinLoss, "setExcelUrl");
                    spyOn(LicenseeWinLoss, "ajaxComplete");
                    spyOn($, "ajax").and.returnValue({ abort: function () { } });
                    spyOn(Site, "setProductOptionOriginalParamList").and.callFake(function (url) { return url; });
                    spyOn(Popup, "openPopupWithIframe");
                    $(window).height(300);

                    dataDrilldown = '{"DrillDownFromDate":"01/01/2017","DrillDownToDate":"03/20/2017","DrillDownCurrencyId":9,"DrillDownCurrencyName":"AUD",' +
                        '"CustomerId":6507355,"ExternalId":"DEWSNIP","SystemId":"12BETAUD01159"}';
                });
                afterEach(function () {
                    submitData = {
                        ProductOptions: '["SB","RC"]',
                        DrawFilter: 0,
                        CurrencyId: 1,
                        ReportBy: 2,
                        FromDate: "03/01/2017",
                        ToDate: "03/31/2017",
                        CurrencyName: "EUR",
                        IsExcludedTestData: true
                    };
                });

                describe("Report by monthly", function () {
                    it("Popup.openPopupWithIframe(url, option) should be called with correct parameter", function () {
                        LicenseeWinLoss.submit();
                        var ajaxOption = $.ajax.calls.mostRecent().args[0];
                        ajaxOption.success(submitData);

                        LicenseeWinLoss.openBetlistPopUp(dataDrilldown);

                        var url = 'LicenseeWinLossBetList/Index?fromdate=01/01/2017&todate=01/31/2017&excludetest=true&currencyid=9&currencyname=AUD&' +
                            'drawfilter=0&custid=6507355&systemid=12BETAUD01159&externalid=DEWSNIP&basecurrency=EUR';
                        var popupOption = { id: "betlist-popup", width: 970, height: 250, title: "CustomerBetList" };

                        var args = Popup.openPopupWithIframe.calls.mostRecent().args;
                        var optionResult = args[1];

                        expect(args[0].toLowerCase()).toBe(url.toLowerCase());
                        expect(optionResult.id).toBe(popupOption.id);
                        expect(optionResult.width).toBe(popupOption.width);
                        expect(optionResult.title).toBe(popupOption.title);
                    });

                    it("Popup.openPopupWithIframe(url, option) should be called with correct parameter when DrillDownDate equal to date in submit data", function () {
                        submitData.FromDate = "01/10/2017";
                        submitData.ToDate = "01/15/2017";

                        LicenseeWinLoss.submit();
                        var ajaxOption = $.ajax.calls.mostRecent().args[0];
                        ajaxOption.success(submitData);

                        LicenseeWinLoss.openBetlistPopUp(dataDrilldown);

                        var url = 'LicenseeWinLossBetList/Index?fromdate=01/10/2017&todate=01/15/2017&excludetest=true&currencyid=9&currencyname=AUD&' +
                            'drawfilter=0&custid=6507355&systemid=12BETAUD01159&externalid=DEWSNIP&basecurrency=EUR';
                        var popupOption = { id: "betlist-popup", width: 970, height: 250, title: "CustomerBetList" };

                        var args = Popup.openPopupWithIframe.calls.mostRecent().args;
                        var optionResult = args[1];

                        expect(args[0].toLowerCase()).toBe(url.toLowerCase());
                        expect(optionResult.id).toBe(popupOption.id);
                        expect(optionResult.width).toBe(popupOption.width);
                        expect(optionResult.title).toBe(popupOption.title);
                    });
                });

                describe("Report not by monthly", function () {
                    afterEach(function () {
                        submitData = {
                            ProductOptions: '["SB","RC"]',
                            DrawFilter: 0,
                            CurrencyId: 1,
                            ReportBy: 2,
                            FromDate: "03/01/2017",
                            ToDate: "03/31/2017",
                            CurrencyName: "EUR",
                            IsExcludedTestData: true
                        };
                    });
                    it("Popup.openPopupWithIframe(url, option) should be called with correct parameter", function () {
                        submitData.ReportBy = 1;
                        LicenseeWinLoss.submit();
                        var ajaxOption = $.ajax.calls.mostRecent().args[0];
                        ajaxOption.success(submitData);

                        LicenseeWinLoss.openBetlistPopUp(dataDrilldown);

                        var url = 'LicenseeWinLossBetList/Index?fromdate=01/01/2017&todate=03/20/2017&excludetest=true&currencyid=9&currencyname=AUD&' +
                            'drawfilter=0&custid=6507355&systemid=12BETAUD01159&externalid=DEWSNIP&basecurrency=EUR';
                        var popupOption = { id: "betlist-popup", width: 970, height: 250, title: "CustomerBetList" };

                        var args = Popup.openPopupWithIframe.calls.mostRecent().args;
                        var optionResult = args[1];

                        expect(args[0].toLowerCase()).toBe(url.toLowerCase());
                        expect(optionResult.id).toBe(popupOption.id);
                        expect(optionResult.width).toBe(popupOption.width);
                        expect(optionResult.title).toBe(popupOption.title);
                    });
                });
            });

            describe("bindData(level, reportBy, response)", function () {
                var submitData, gridOption;
                var data = [{ Index: 1, Column2: "A" }, { Index: 2, Column2: "B" }];

                beforeEach(function () {
                    submitData = {
                        ProductOptions: '["SB","RC"]',
                        DrawFilter: 0,
                        CurrencyId: 1,
                        ReportBy: 2,
                        FromDate: "2017-03-01T00:00:00",
                        ToDate: "2017-03-31T00:00:00",
                        CurrencyName: "EUR",
                        IsExcludedTestData: true
                    };

                    setFixtures('<form id="licenseewinloss"></form> <div id="ReportGrid"></div>');

                    spyOn(Report, "setOriginalProduct");
                    spyOn(Site, "updateOriginalLicenseeOption");
                    spyOn($.fn, "serializeObject").and.returnValue(submitData);
                    spyOn(Report, "ValidProducts").and.returnValue(true);
                    spyOn(LicenseeWinLoss, "setExcelUrl");
                    spyOn(LicenseeWinLoss, "ajaxComplete");
                    spyOn($, "ajax").and.returnValue({ abort: function () { } });

                    spyOn(jqGridAdditional, "clearGrid");
                    spyOn(jqGridAdditional, "setNoInfo");
                    spyOn(LicenseeWinLossOption, "getGridOption").and.returnValue({});
                    spyOn($.fn, "jqGrid").and.callFake(function (option) { gridOption = option; });
                    spyOn(LicenseeWinLossOption, "setGroupHeaderColumns");
                    spyOn(LicenseeWinLossOption, "restoreExpanse");

                    LicenseeWinLoss.submit();
                    var ajaxOption = $.ajax.calls.mostRecent().args[0];
                    ajaxOption.success(submitData);
                });

                it("jqGridAdditional.clearGrid(grid) should be called with correct parameter", function () {
                    LicenseeWinLoss.bindData(0, 2, { Data: [] });

                    expect(jqGridAdditional.clearGrid).toHaveBeenCalledWith("ReportGrid");
                });
                it("jqGridAdditional.setNoInfo() should be called", function () {
                    LicenseeWinLoss.bindData(0, 2, { Data: [] });

                    expect(jqGridAdditional.setNoInfo).toHaveBeenCalled();
                });
                it("jqGrid function should be called with correct grid option value", function () {
                    LicenseeWinLoss.bindData(0, 2, { Data: data, Total: [1] });

                    expect($.fn.jqGrid).toHaveBeenCalled();
                    expect(gridOption.rownumbers).toBe(true);
                    expect(gridOption.data).toEqual(data);
                    expect(gridOption.userData).toEqual({});
                    expect(gridOption.rowNum).toBe(2000);
                    expect(gridOption.rowList).toEqual([50, 100, 200, 300, 400, 500, 1000, 2000]);
                    expect(gridOption.rowTotal).toBe(2);
                    expect(gridOption.pager).toBe("#ppdata");
                });

                it("jqGridAdditional.addSortableHeader should called if allowing sorting", function () {
                    spyOn(jqGridAdditional, "addSortableHeader");
                    spyOn(LicenseeWinLoss, "sortData").and.callFake(function (data) { return data });
                    jasmine.clock().install();

                    LicenseeWinLossOption.gridOption.onSortCol(1);
                    jasmine.clock().tick(101);

                    expect(jqGridAdditional.addSortableHeader).toHaveBeenCalled();
                    jasmine.clock().uninstall();
                });

                describe("gridOption.onPaging(pgButton)", function () {
                    it("Should return 'stop' when level not equal 2", function () {
                        LicenseeWinLoss.bindData(0, 2, { Data: data, Total: [1] });

                        var result = gridOption.onPaging("Test");

                        expect(result).toBe("stop");
                    });

                    it("Should return 'stop' when numOfRow not greater than LicenseeWinLossOption.pageSize", function () {
                        LicenseeWinLoss.bindData(2, 2, { Data: data, Total: [1] });

                        var result = gridOption.onPaging("Test");

                        expect(result).toBe("stop");
                    });

                    it("Site.blockUI() should be called when pgButton not has class 'ui-state-disabled'", function () {
                        var defaultPagesize = LicenseeWinLossOption.pageSize;
                        appendSetFixtures('<button id="pgButton"></button>');
                        LicenseeWinLossOption.pageSize = 1;
                        spyOn(Site, "blockUI");

                        gridOption.onPaging("pgButton");
                        LicenseeWinLossOption.pageSize = defaultPagesize;

                        expect(Site.blockUI).toHaveBeenCalled();
                    });

                    it("Site.blockUI() should not be called when pgButton has class 'ui-state-disabled'", function () {
                        var defaultPagesize = LicenseeWinLossOption.pageSize;
                        appendSetFixtures('<button id="pgButton" class="ui-state-disabled"></button>');
                        LicenseeWinLossOption.pageSize = 2;
                        spyOn(Site, "blockUI");

                        gridOption.onPaging("pgButton");
                        LicenseeWinLossOption.pageSize = defaultPagesize;

                        expect(Site.blockUI).not.toHaveBeenCalled();
                    });
                });

                describe("gridOption.gridComplete()", function () {
                    var originalPageSize;
                    beforeEach(function () {
                        spyOn(jqGridAdditional, "gridComplete");
                        spyOn(LicenseeWinLoss, "resizeGrid");
                        spyOn(LicenseeWinLossOption, "addProductButton");
                        spyOn(Site, "unBlockUI");
                        spyOn(LicenseeWinLoss, "bindTotal");

                        originalPageSize = LicenseeWinLossOption.pageSize;
                    });

                    afterEach(function () {
                        LicenseeWinLossOption.pageSize = originalPageSize;
                    });

                    it("jqGridAdditional.gridComplete() should be called", function () {
                        LicenseeWinLoss.bindData(2, 2, { Data: data, Total: [1] });

                        gridOption.gridComplete();

                        expect(jqGridAdditional.gridComplete).toHaveBeenCalled();
                    });

                    it("LicenseeWinLoss.resizeGrid() should be called", function () {
                        LicenseeWinLoss.bindData(2, 2, { Data: data, Total: [1] });

                        gridOption.gridComplete();

                        expect(LicenseeWinLoss.resizeGrid).toHaveBeenCalled();
                    });

                    it("LicenseeWinLoss.bindTotal() should be called with correct parameter", function () {
                        LicenseeWinLoss.bindData(2, 2, { Data: data, Total: [1], SummaryTotal: [2] });

                        gridOption.gridComplete();

                        expect(LicenseeWinLoss.bindTotal).toHaveBeenCalledWith(2, [1], [2]);
                    });

                    it("#footer should has correct html content when onPaging is false or level is not 2", function () {
                        appendSetFixtures('<div class="ui-jqgrid-ftable">Footer Content</div> <div id="footer"></div>');
                        LicenseeWinLoss.bindData(1, 2, { Data: data, Total: [1], SummaryTotal: [2] });

                        gridOption.gridComplete();
                        var result = $("#footer").html();

                        expect(result).toBe("Footer Content");
                    });

                    it("LicenseeWinLossOption.addProductButton should be called with correct parameter", function () {
                        LicenseeWinLoss.bindData(2, 2, { Data: data, Total: [1] });

                        gridOption.gridComplete();

                        expect(LicenseeWinLossOption.addProductButton).toHaveBeenCalledWith($("#ReportGrid"), "jqgh_ReportGrid", "ReportGrid", ["RC", "SB"]);
                    });

                    it("LicenseeWinLossOption.addProductButton should not be called when Total data is empty", function () {
                        LicenseeWinLoss.bindData(2, 2, { Data: data, Total: [] });

                        gridOption.gridComplete();

                        expect(LicenseeWinLossOption.addProductButton).not.toHaveBeenCalled();
                    });

                    it("#pg_ppdata should be showed when level is 2 and rowNum greater than pagesize", function () {
                        appendSetFixtures('<button id="pg_ppdata"></button>');
                        LicenseeWinLoss.bindData(2, 2, { Data: data, Total: [1] });
                        LicenseeWinLossOption.pageSize = 1;

                        gridOption.gridComplete();

                        expect($("#pg_ppdata")).toBeVisible();
                    });

                    it(".ui-jqgrid-ftable should has correct html content when onPaging is true and level is 2", function () {
                        LicenseeWinLoss.bindData(2, 2, { Data: data, Total: [] });
                        appendSetFixtures('<button id="pgButton"></button>' +
                            '<div class="ui-jqgrid-ftable"></div>' +
                            '<div id="footer">Footer Content</div>');
                        LicenseeWinLossOption.pageSize = 1;

                        gridOption.onPaging("pgButton");
                        gridOption.gridComplete();
                        var result = $(".ui-jqgrid-ftable").html();

                        expect(result).toBe("Footer Content");
                    });

                    it("#pg_ppdata should be hidden when level is not 2", function () {
                        appendSetFixtures('<button id="pg_ppdata"></button>');
                        LicenseeWinLoss.bindData(1, 2, { Data: data, Total: [1] });

                        gridOption.gridComplete();

                        expect($("#pg_ppdata")).not.toBeVisible();
                    });
                });
            });

            describe("resizeGrid()", function () {
                beforeEach(function () {
                    setFixtures('<div id="ReportGrid"></div>');
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "updateGridWidth");

                    LicenseeWinLoss.resizeGrid();
                });

                it("jqGridAdditional.updateGridHeight() should be called", function () {
                    expect(jqGridAdditional.updateGridHeight).toHaveBeenCalled();
                });
                it("jqGridAdditional.updateGridWidth($grid) should be called", function () {
                    expect(jqGridAdditional.updateGridWidth).toHaveBeenCalledWith($("#ReportGrid"));
                });
            });

            describe("openBetlistPopUp(dataDrillDown)", function () {
                beforeAll(function () {
                    spyOn($, "ajax").and.callFake(function (option) {
                        option.success({ ProductOptions: [] });

                        return {
                            abort: function () { }
                        };
                    });

                    spyOn(Math, "min").and.returnValue(650);

                    spyOn(QueryString, "setParam").and.callFake(function (url, param, value) {
                        return url + "&" + param + "=" + value;
                    });

                    spyOn(Site, "setProductOptionOriginalParamList").and.callFake(function (url) {
                        return url;
                    });
                });

                beforeEach(function () {
                    spyOn(Popup, "openPopupWithIframe");
                });

                function setupSubmitData(reportBy, fromdate, todate) {
                    setFixtures('<form id="licenseewinloss">'
                        + '<input name="DrawFilter" value="0">'
                        + '<input name="IsExcludedTestData" value="false">'
                        + '<input name="CurrencyId" value="0">'
                        + '<input name="CurrencyName" value="usd">'
                        + '<input name="ReportBy" value="' + reportBy + '">'
                        + '<input name="FromDate" value="' + fromdate + '">'
                        + '<input name="ToDate" value="' + todate + '">'
                        + '<input id="BaseCurrency" data-original="eur">'
                        + '</form>');

                    spyOn(Report, "setOriginalProduct");
                    spyOn(Site, "updateOriginalLicenseeOption");
                    spyOn(Report, "ValidProducts").and.returnValue(true);

                    spyOn(LicenseeWinLoss, "setExcelUrl");
                    spyOn(LicenseeWinLoss, "ajaxComplete");

                    LicenseeWinLoss.submit();
                }

                it("Popup.openPopupWithIframe should be called with correct params", function () {
                    setupSubmitData(1, "01/01/2011", "01/11/2011");
                    var drillDown = {
                        DrillDownFromDate: new Date(2011, 0, 1),
                        DrillDownToDate: new Date(2011, 0, 11),
                        DrillDownCurrencyId: 1,
                        DrillDownCurrencyName: "eur",
                        CustomerId: 2,
                        SystemId: 3,
                        ExternalId: 4
                    };
                    LicenseeWinLoss.openBetlistPopUp(JSON.stringify(drillDown));

                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(
                        "LicenseeWinLossBetList/Index&fromdate=01/01/2011&todate=01/11/2011&excludetest=false&CurrencyId=1&CurrencyName=eur&drawfilter=0&custid=2&systemId=3&externalId=4&BaseCurrency=eur",
                        {
                            id: "betlist-popup", width: 970, height: 700, title: "CustomerBetList"
                        });
                });

                it("Popup.openPopupWithIframe should be called with fromdate is 1 if drill down month if fall into summitted date", function () {
                    setupSubmitData(2, "01/01/2011", "02/11/2011");
                    var drillDown = {
                        DrillDownFromDate: new Date(2011, 1, 5),
                        DrillDownToDate: new Date(2011, 1, 11),
                        DrillDownCurrencyId: 1,
                        DrillDownCurrencyName: "eur",
                        CustomerId: 2,
                        SystemId: 3,
                        ExternalId: 4
                    };
                    LicenseeWinLoss.openBetlistPopUp(JSON.stringify(drillDown));

                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(
                        "LicenseeWinLossBetList/Index&fromdate=02/01/2011&todate=02/11/2011&excludetest=false&CurrencyId=1&CurrencyName=eur&drawfilter=0&custid=2&systemId=3&externalId=4&BaseCurrency=eur",
                        {
                            id: "betlist-popup", width: 970, height: 700, title: "CustomerBetList"
                        });
                });

                it("Popup.openPopupWithIframe should be called with fromdate is summitted fromdate if drill down month is equal summitted fromdate month", function () {
                    setupSubmitData(2, "02/05/2011", "02/11/2011");
                    var drillDown = {
                        DrillDownFromDate: new Date(2011, 1, 5),
                        DrillDownToDate: new Date(2011, 1, 11),
                        DrillDownCurrencyId: 1,
                        DrillDownCurrencyName: "eur",
                        CustomerId: 2,
                        SystemId: 3,
                        ExternalId: 4
                    };
                    LicenseeWinLoss.openBetlistPopUp(JSON.stringify(drillDown));

                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(
                        "LicenseeWinLossBetList/Index&fromdate=02/05/2011&todate=02/11/2011&excludetest=false&CurrencyId=1&CurrencyName=eur&drawfilter=0&custid=2&systemId=3&externalId=4&BaseCurrency=eur",
                        {
                            id: "betlist-popup", width: 970, height: 700, title: "CustomerBetList"
                        });
                });

                it("Popup.openPopupWithIframe should be called with todate is end day of month if drill down month is less than summitted todate month", function () {
                    setupSubmitData(2, "02/05/2011", "03/11/2011");
                    var drillDown = {
                        DrillDownFromDate: new Date(2011, 1, 5),
                        DrillDownToDate: new Date(2011, 1, 11),
                        DrillDownCurrencyId: 1,
                        DrillDownCurrencyName: "eur",
                        CustomerId: 2,
                        SystemId: 3,
                        ExternalId: 4
                    };
                    LicenseeWinLoss.openBetlistPopUp(JSON.stringify(drillDown));

                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(
                        "LicenseeWinLossBetList/Index&fromdate=02/05/2011&todate=02/28/2011&excludetest=false&CurrencyId=1&CurrencyName=eur&drawfilter=0&custid=2&systemId=3&externalId=4&BaseCurrency=eur",
                        {
                            id: "betlist-popup", width: 970, height: 700, title: "CustomerBetList"
                        });
                });
            });
        });
    });