define(['jquery', 'common/site', 'common/querystring', 'components/pluginhelper/daterangepicker', 'pages/report/winlossbyproduct/winlossbyproduct.option',
    'pages/report/winlossbyproduct/winlossbyproduct', 'pages/report/report', 'lib/jqgrid/jquery.jqgrid.additional', 'common/popup',
    'components/pluginhelper/multiselect', 'helpers/daterange', 'helpers/excel', 'components/pluginhelper/autocomplete'],
        function ($, Site, QueryString, DatePicker, WinLossByProductOption, WinLossByProduct, Report, jqGridAdditional, Popup, MultiSelect, DateHelper, ExcelHelper, AutoComplete) {
            describe("WinLossByProduct", function () {
                var ajaxOption;
                function createSubmitData(expectedData, response) {
                    var defaultSubmitData = {
                        ProductOptions: "[]",
                        DrawFilter: 1,
                        CurrencyId: 1,
                        ReportBy: 1,
                        FromDate: "07/01/2017",
                        ToDate: "07/31/2017",
                        CurrencyName: "EUR",
                        IsExcludedTestData: true,
                        SystemId: 1,
                        MemberId: 2
                    };

                    $.extend(defaultSubmitData, expectedData);

                    var formData = {
                        DrawFilter: defaultSubmitData.DrawFilter,
                        CurrencyId: defaultSubmitData.CurrencyId,
                        ReportBy: defaultSubmitData.ReportBy,
                        FromDate: defaultSubmitData.FromDate,
                        ToDate: defaultSubmitData.ToDate,
                        CurrencyName: defaultSubmitData.CurrencyName,
                        IsExcludedTestData: defaultSubmitData.IsExcludedTestData
                    };

                    spyOn(Report, "setOriginalProduct");
                    spyOn(Report, "ValidProducts").and.returnValue(true);
                    spyOn(Site, "updateOriginalLicenseeOption");
                    spyOn($.fn, "serializeObject").and.returnValue(formData);
                    spyOn($, "ajax").and.callFake(function (option) { ajaxOption = option; return { abort: function () { } }; });

                    spyOn(WinLossByProduct, "setExcelUrl");
                    spyOn(WinLossByProduct, "ajaxComplete");

                    var defaultResponse = {
                        ProductOptions: defaultSubmitData.ProductOptions,
                        SystemId: defaultSubmitData.SystemId,
                        MemberId: defaultSubmitData.MemberId
                    };

                    WinLossByProduct.submit();
                    ajaxOption.success(response || defaultResponse);
                }

                beforeAll(function () {
                    spyOn(Site, "getSingleResource").and.callFake(function (resource) { return resource; });
                    spyOn(DateHelper, "setConstraintMonthRange");
                    spyOn(Site, "addUserGuide");
                    spyOn(Site, "initialize");
                    spyOn(MultiSelect, "initProductList");
                    spyOn(DatePicker, "initDateRangePicker");
                    spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                        return url;
                    });
                });

                describe("initialize()", function () {
                    beforeAll(function () {
                        spyOn(WinLossByProduct, "initEvent");
                        spyOn(WinLossByProduct, "initSetting");
                        spyOn(AutoComplete, "initialize");
                    });

                    beforeEach(function () {
                        WinLossByProduct.initialize();
                    });

                    it("WinLossByProduct.initEvent() should be called", function () {
                        expect(WinLossByProduct.initEvent).toHaveBeenCalled();
                    });
                    it("WinLossByProduct.initSetting() should be called", function () {
                        expect(WinLossByProduct.initSetting).toHaveBeenCalled();
                    });

                    it("DateHelper.setConstraintMonthRange(monthRange, url) should be called with correct parameter", function () {
                        expect(DateHelper.setConstraintMonthRange).toHaveBeenCalledWith(3, "api/WinLossByProductReport/Index");
                    });
                    it("Site.addUserGuide(options) should be called with correct parameter", function () {
                        expect(Site.addUserGuide).toHaveBeenCalledWith({ resourceName: "WinLossByProduct", title: Site.getSingleResource("WinLossByProduct") });
                    });
                    it("AutoComplete.initialize(option) should be called with correct parameter", function () {
                        expect(AutoComplete.initialize).toHaveBeenCalledWith({ url: Site.resolveClientUrl("SearchCustomerAPI/SearchCustomer"), target: "#Username" });
                    });
                });

                describe("initSetting()", function () {
                    it("Properties of WinLossByProductOption should be correct", function () {
                        setFixtures("<input id='IsAllowedCustomerCommission' value='true' />");
                        appendSetFixtures("<input id='IsAllowedBACommission' value='false' />");
                        appendSetFixtures("<input id='drillDownLicenseeId' value='34' />");

                        WinLossByProduct.initSetting();

                        expect(WinLossByProductOption.hasCustomerComm).toBe(true);
                        expect(WinLossByProductOption.IsAllowBA).toBe(false);
                        expect(WinLossByProductOption.licenseeId).toBe(34);
                    });
                });

                describe("initEvent()", function () {
                    beforeEach(function () {
                        setFixtures("<div class='bet-list-link' data-drill-down='2' />");

                        appendSetFixtures("<div id='SubmitButton' />");
                        appendSetFixtures('<div class="main-content">' +
                            '<a class="drilldown"></a>' +
                            '</div>');
                        appendSetFixtures("<div id='ExportToExcel' />");
                        appendSetFixtures("<input id='IsExportExcel' />");

                        appendSetFixtures("<div id='level-link-container'><div class='level-link' data-level='1' /></div>");

                        $("body").off("click", "**");
                        WinLossByProduct.initEvent();
                    });

                    it("WinLossByProduct.openBetlistPopUp(dataDrillDown) should be called with correct parameter when '.bet-list-link' fired click event", function () {
                        spyOn(WinLossByProduct, "openBetlistPopUp");

                        $(".bet-list-link").click();

                        expect(WinLossByProduct.openBetlistPopUp).toHaveBeenCalledWith("2");
                    });

                    it("WinLossByProduct.submit() should be called when '#SubmitButton' fired click event", function () {
                        spyOn(WinLossByProduct, "submit");

                        $("#SubmitButton").click();

                        expect(WinLossByProduct.submit).toHaveBeenCalled();
                    });

                    it("'#IsExportExcel' value should be false", function () {
                        spyOn(WinLossByProduct, "submit");

                        $("#SubmitButton").click();

                        expect($("#IsExportExcel").val()).toBe("false");
                    });

                    it("WinLossByProduct.goBack(level) should be called with correct parameter when '.level-link' fired click event", function () {
                        spyOn(WinLossByProduct, "goBack");

                        $(".level-link").click();

                        expect(WinLossByProduct.goBack).toHaveBeenCalledWith(1);
                    });

                    it("WinLossByProduct.goBack(level) should NOT be called if the value of attribute 'data-level' >= 2", function () {
                        spyOn(WinLossByProduct, "goBack");
                        $(".level-link").attr('data-level', 2);
                        $(".level-link").click();

                        expect(WinLossByProduct.goBack).not.toHaveBeenCalled();
                    });

                    it("ExcelHelper.exportExcel() should be called when '#ExportToExcel' fired click event", function () {
                        spyOn(ExcelHelper, "exportExcel");
                        spyOn($.fn, "serializeObject").and.returnValue({ Username: "" });

                        $("#ExportToExcel").click();

                        expect(ExcelHelper.exportExcel).toHaveBeenCalledWith({ Username: null }, WinLossByProductOption.urlExcelData);
                    });

                    it("WinLossByProduct.drillDown() should be called when '.drilldown' fired click event", function () {
                        spyOn(WinLossByProduct, "drillDown");
                        spyOn($.fn, "data").and.returnValue({
                            level: 1,
                            currencyId: 2,
                            custId: 3,
                            datetime: "05/01/2017",
                            currencyName: "USD"
                        });

                        $(".drilldown").click();

                        expect(WinLossByProduct.drillDown).toHaveBeenCalledWith(1, 2, 3, "05/01/2017", "USD");
                    });
                });

                describe("setExcelUrl(level, currencyId, custId, fdate, tdate, currencyName)", function () {
                    it("WinLossByProductOption.urlExcelData should has correct data with level 0", function () {
                        var expected = 'api/WinLossByProductReport/Index';

                        WinLossByProduct.setExcelUrl(0, 2, 221, "Apr 15, 2016", "Apr 20, 2016", "UUS");

                        expect(WinLossByProductOption.urlExcelData).toBe(expected);
                    });

                    it("WinLossByProductOption.urlExcelData should has correct data with level 1", function () {
                        var expected = 'api/WinLossByProductReport/Index?' +
                            'level=1' + '&currencyId=2' + '&custId=221' + '&fdate=05/01/2017' + '&tdate=05/30/2017';

                        WinLossByProduct.setExcelUrl(1, 2, 221, "2017-05-01T00:00:00", "2017-05-30T00:00:00", "UUS");

                        expect(WinLossByProductOption.urlExcelData).toContain(expected);
                    });
                });

                describe("ajaxComplete(level, response)", function () {
                    beforeEach(function () {
                        setFixtures("<input type='checkbox' name='ReportBy' checked='checked' value='test' />");

                        spyOn(Report, "renderBreadCrumb");
                        spyOn(WinLossByProduct, "bindData");
                        WinLossByProductOption.licenseeId = 100;
                    });

                    it("Report.renderBreadCrumb(level) should be called with correct parameter", function () {
                        WinLossByProduct.ajaxComplete(2, {});

                        expect(Report.renderBreadCrumb).toHaveBeenCalledWith(2, 100);
                    });

                    it("WinLossByProduct.bindData(level, reportBy, response) should be called with correct parameter", function () {
                        WinLossByProduct.ajaxComplete(2, {});

                        expect(WinLossByProduct.bindData).toHaveBeenCalledWith(2, undefined, {});
                    });

                    it("WinLossByProduct.bindData(level, reportBy, response) should not be called if response data is null", function () {
                        WinLossByProduct.ajaxComplete(2, null);

                        expect(WinLossByProduct.bindData).not.toHaveBeenCalled();
                    });
                });

                describe("submit()", function () {
                    var TESTURL = "testurl";
                    var originalUrl = WinLossByProductOption.urlData;
                    var request;
                    var validProducts = false;

                    beforeEach(function (done) {
                        WinLossByProductOption.urlData = TESTURL;
                        spyOn(Report, "setOriginalProduct");
                        spyOn(Report, "ValidProducts").and.returnValue(validProducts);
                        spyOn(Site, "updateOriginalLicenseeOption");

                        spyOn($.fn, "serializeObject").and.returnValue({ Username: "test" });

                        spyOn(WinLossByProduct, "setReportTitle");
                        spyOn(WinLossByProduct, "setExcelUrl");
                        spyOn(WinLossByProduct, "ajaxComplete");

                        jasmine.Ajax.install();
                        jasmine.Ajax
                            .stubRequest(Site.resolveClientUrl(TESTURL))
                            .andReturn({
                                'status': 200,
                                'contentType': 'application/x-www-form-urlencoded; charset=UTF-8',
                                'responseText': '{"ProductOptions": []}'
                            });
                        WinLossByProduct.submit();

                        request = jasmine.Ajax.requests.mostRecent();
                        setTimeout(done, 10);
                    });

                    afterEach(function () {
                        validProducts = true;
                        WinLossByProductOption.urlData = originalUrl;
                        jasmine.Ajax.uninstall();
                    });

                    it("should be returned false id product is not valid", function () {
                        expect(Site.updateOriginalLicenseeOption).not.toHaveBeenCalled();
                    });

                    it("ajax request should be called with correct url", function () {
                        expect(request.url).toBe(TESTURL);
                    });

                    it("Report.setOriginalProduct() should be called", function () {
                        expect(Report.setOriginalProduct).toHaveBeenCalled();
                    });
                    it("Report.ValidProducts() should be called", function () {
                        expect(Report.ValidProducts).toHaveBeenCalled();
                    });
                    it("Site.updateOriginalLicenseeOption() should be called", function () {
                        expect(Site.updateOriginalLicenseeOption).toHaveBeenCalled();
                    });
                    it("WinLossByProduct.setReportTitle(currencyId, fromdate, todate, currencyName) should be called", function () {
                        expect(WinLossByProduct.setReportTitle).toHaveBeenCalled();
                    });
                    it("WinLossByProduct.setExcelUrl(level, currencyId, custId, fdate, tdate, currencyName) should be called", function () {
                        expect(WinLossByProduct.setExcelUrl).toHaveBeenCalled();
                    });
                    it("WinLossByProduct.ajaxComplete(level, response) should be called", function () {
                        expect(WinLossByProduct.ajaxComplete).toHaveBeenCalled();
                    });
                });

                describe("setReportTitle(currencyId, fromdate, todate, currencyName)", function () {
                    it("'div.report-title' should be correct  with no product option", function () {
                        var submitData = { ProductOptions: null, SystemId: null };
                        createSubmitData(submitData);

                        setFixtures("<div class='report-title' />");

                        WinLossByProduct.setReportTitle(1, new Date("Apr 10, 2015"), new Date("Apr 15, 2015"), "USD");

                        expect($('.report-title').html()).toBe('WinLossByProduct, 04/10/2015 → 04/15/2015 - Viewin');
                    });

                    it("'div.report-title' should be correct  with product option value", function () {
                        var submitData = { ProductOptions: JSON.stringify([{ Code: "SB", Status: true }]), SystemId: null };
                        createSubmitData(submitData);
                        setFixtures("<div class='report-title' />");

                        WinLossByProduct.setReportTitle(1, new Date("Apr 10, 2015"), new Date("Apr 15, 2015"), "USD");

                        expect($('.report-title').html()).toBe('WinLossByProduct, 04/10/2015 → 04/15/2015 - Viewin, LicenseeW_L (SB)');
                    });

                    it("When not pass currencyName param - Report.getCurrencyNameForReportTitle(currencyId) should be called with correct parameter", function () {
                        spyOn(Report, "getCurrencyNameForReportTitle");
                        setFixtures("<div class='report-title' />");

                        WinLossByProduct.setReportTitle(1, new Date("Apr 10, 2015"), new Date("Apr 15, 2015"));

                        expect(Report.getCurrencyNameForReportTitle).toHaveBeenCalledWith(1);
                    });

                    it("'div.report-title' should be correct", function () {
                        spyOn(Report, "setOriginalProduct");
                        spyOn(Report, "ValidProducts").and.returnValue(true);
                        spyOn(Site, "updateOriginalLicenseeOption");
                        spyOn(WinLossByProduct, "setExcelUrl").and.returnValue(true);
                        spyOn(WinLossByProduct, "ajaxComplete");
                        spyOn($.fn, "serializeObject").and.returnValue({
                            DrawFilter: 1,
                            CurrencyId: 3,
                            ReportBy: 0,
                            FromDate: "01/01/2017",
                            ToDate: "01/30/2017",
                            CurrencyName: "USD",
                            IsExcludedTestData: false
                        });

                        spyOn($, "ajax").and.callFake(function (options) {
                            options.success({
                                ProductOptions: '[{"Code":"SB","Name":"Sportsbook","Status":true},{"Code":"RB","Name":"Racing","Status":false}]',
                                SystemId: 1,
                                MemberId: 2
                            });
                        }).and.returnValue({
                            abort: function () { }
                        });
                        spyOn($, "parseJSON").and.returnValue([{ "Code": "SB", "Name": "Sportsbook", "Status": true }, { "Code": "RB", "Name": "Racing", "Status": false }]);

                        WinLossByProduct.submit();

                        setFixtures("<div class='report-title' />");

                        WinLossByProduct.setReportTitle(1, new Date("Apr 10, 2015"), new Date("Apr 15, 2015"), "USD");

                        expect($('.report-title').html()).toBe('WinLossByProduct, 04/10/2015 → 04/15/2015 - Viewin, LicenseeW_L (SB)');
                    });
                });

                describe("bindData(level, reportBy, response)", function () {
                    beforeEach(function () {
                        spyOn(jqGridAdditional, "clearGrid");
                    });

                    it("jqGridAdditional.clearGrid(reportId) should be called", function () {
                        spyOn(WinLossByProductOption, "getGridOption").and.returnValue({});

                        WinLossByProduct.bindData(0, "test", { Data: [{ Id: 0, Name: "foo" }], Total: [{ Id: 0, Name: "foo" }] });

                        expect(jqGridAdditional.clearGrid).toHaveBeenCalled();
                    });
                    it("WinLossByProductOption.getGridOption(level, reportBy) should be called", function () {
                        spyOn(WinLossByProductOption, "getGridOption").and.returnValue({});

                        WinLossByProduct.bindData(0, "test", { Data: [{ Id: 0, Name: "foo" }], Total: [{ Id: 0, Name: "foo" }] });

                        expect(WinLossByProductOption.getGridOption).toHaveBeenCalled();
                    });
                    it("jqGridAdditional.setNoInfo should be called if response data is empty", function () {
                        spyOn(jqGridAdditional, "setNoInfo");

                        WinLossByProduct.bindData(0, "test", { Data: [] });

                        expect(jqGridAdditional.setNoInfo).toHaveBeenCalled();
                    });

                    describe("gridOption.onPaging(pgButton)", function () {
                        var gridOption = {};
                        beforeEach(function () {
                            spyOn(WinLossByProductOption, "getGridOption").and.returnValue(gridOption);
                        });

                        it("stop paging if level is not 2", function () {
                            WinLossByProduct.bindData(1, "test", { Data: [{ Id: 0, Name: "foo" }], Total: [{ Id: 0, Name: "foo" }] });

                            var result = gridOption.onPaging();

                            expect(result).toEqual("stop");
                        });

                        it("Site.blockUI() should be called if pgButton is not disabled", function () {
                            setFixtures('<div id="pgButton"></div>');
                            spyOn(Site, "blockUI");
                            WinLossByProductOption.pageSize = 0;

                            WinLossByProduct.bindData(2, "test", { Data: [{ Id: 0, Name: "foo" }], Total: [{ Id: 0, Name: "foo" }] });

                            gridOption.onPaging("pgButton");

                            expect(Site.blockUI).toHaveBeenCalled();
                        });

                        it("Site.blockUI() should not be called if pgButton is disabled", function () {
                            setFixtures('<div id="pgButton" class="ui-state-disabled"></div>');
                            spyOn(Site, "blockUI");
                            WinLossByProductOption.pageSize = 0;

                            WinLossByProduct.bindData(2, "test", { Data: [{ Id: 0, Name: "foo" }], Total: [{ Id: 0, Name: "foo" }] });

                            gridOption.onPaging("pgButton");

                            expect(Site.blockUI).not.toHaveBeenCalled();
                        });
                    });

                    describe("gridOption.gridComplete()", function () {
                        var gridOption = {
                            colModel: [{
                                id: "Index",
                                hidden: false
                            }]
                        };
                        beforeEach(function () {
                            spyOn(WinLossByProductOption, "getGridOption").and.returnValue(gridOption);
                            spyOn(jqGridAdditional, "gridComplete");
                            spyOn(WinLossByProduct, "rowSpanByLevel");
                            spyOn(WinLossByProduct, "bindTotal");
                            spyOn(WinLossByProduct, "resizeGrid");
                            spyOn(WinLossByProduct, "reUpdateGridWidth");
                            spyOn(jqGridAdditional, "setGroupCustomerWLColumns");
                            spyOn(Site, "unBlockUI");
                        });

                        it("#pg_ppdata should be hide if level is not 2", function () {
                            setFixtures('<div id="pg_ppdata"></div>');

                            WinLossByProduct.bindData(1, "test", { Data: [{ Id: 0, Name: "foo" }], Total: [{ Id: 0, Name: "foo" }] });

                            gridOption.gridComplete();

                            expect($("#pg_ppdata").is(":hidden")).toEqual(true);
                        });

                        it("#pg_ppdata should be shown if level 2 has paging", function () {
                            setFixtures('<div id="pg_ppdata" style="display:none"></div>');
                            WinLossByProductOption.pageSize = 0;

                            WinLossByProduct.bindData(2, "test", { Data: [{ Id: 0, Name: "foo" }], Total: [{ Id: 0, Name: "foo" }] });

                            gridOption.gridComplete();

                            expect($("#pg_ppdata").is(":hidden")).toEqual(false);
                        });

                        it("bindTotal should not be called if level 2 is paging", function () {
                            setFixtures('<div id="pg_ppdata" style="display:none"></div>');
                            WinLossByProductOption.pageSize = 0;

                            WinLossByProduct.bindData(2, "test", { Data: [{ Id: 0, Name: "foo" }], Total: [{ Id: 0, Name: "foo" }] });
                            gridOption.onPaging();

                            gridOption.gridComplete();

                            expect(WinLossByProduct.bindTotal).not.toHaveBeenCalled();
                        });

                        it("bindTotal should be called if level is not 2 and page is not paging", function () {
                            setFixtures('<div id="pg_ppdata" style="display:none"></div>');
                            WinLossByProductOption.pageSize = 0;

                            WinLossByProduct.bindData(1, "test", { Data: [{ Id: 0, Name: "foo" }], Total: [{ Id: 0, Name: "foo" }] });

                            gridOption.gridComplete();

                            expect(WinLossByProduct.bindTotal).toHaveBeenCalled();
                        });

                        it("jqGridAdditional.setGroupCustomerWLColumn should not be called if report does not have Customer Commission", function () {
                            setFixtures('<div id="pg_ppdata" style="display:none"></div>');
                            WinLossByProductOption.hasCustomerComm = false;

                            WinLossByProduct.bindData(1, "test", { Data: [{ Id: 0, Name: "foo" }], Total: [{ Id: 0, Name: "foo" }] });

                            gridOption.gridComplete();

                            expect(jqGridAdditional.setGroupCustomerWLColumns).not.toHaveBeenCalled();
                        });

                        it("jqGridAdditional.setGroupCustomerWLColumn should be called if report has Customer Commission", function () {
                            setFixtures('<div id="pg_ppdata" style="display:none"></div>');
                            WinLossByProductOption.hasCustomerComm = true;

                            WinLossByProduct.bindData(1, "test", { Data: [{ Id: 0, Name: "foo" }], Total: [{ Id: 0, Name: "foo" }] });

                            gridOption.gridComplete();

                            expect(jqGridAdditional.setGroupCustomerWLColumns).toHaveBeenCalled();
                        });
                    });
                });

                describe("reUpdateGridWidth()", function () {
                    it("should be update if table has scroll bar", function () {
                        spyOn($.fn, "hasHorizontalScrollBar").and.returnValue(true);
                        spyOn($.fn, "hasVerticalScrollBar").and.returnValue(true);
                        spyOn($.fn, "css");

                        WinLossByProduct.reUpdateGridWidth();

                        expect($.fn.css).toHaveBeenCalled();
                    });
                });

                describe("rowSpanByLevel($grid, level)", function () {
                    var $grid;
                    beforeEach(function () {
                        $grid = jasmine.createSpyObj("$grid", ["tableRowSpan"]);
                    });

                    it("$.fn.tableRowSpan should be called with correct params when level is 0", function () {
                        WinLossByProduct.rowSpanByLevel($grid, 0);

                        expect($grid.tableRowSpan).toHaveBeenCalledWith([0, 4]);
                    });

                    it("$.fn.tableRowSpan should be called with correct params when level is 1", function () {
                        WinLossByProduct.rowSpanByLevel($grid, 1);

                        expect($grid.tableRowSpan).toHaveBeenCalledWith([0, WinLossByProductOption.systemIdIndex], WinLossByProductOption.currencyIndex);
                    });

                    it("$.fn.tableRowSpan should be called with correct params when level is 2", function () {
                        WinLossByProduct.rowSpanByLevel($grid, 2);

                        expect($grid.tableRowSpan).toHaveBeenCalledWith([0, WinLossByProductOption.externalIdIndex, WinLossByProductOption.systemIdIndex],
                                                     WinLossByProductOption.currencyIndex);
                    });
                });

                describe("bindTotal(level, totalData, summaryTotal)", function () {
                    beforeEach(function () {
                        spyOn(WinLossByProductOption, "getTotalColModel").and.returnValue([]);
                        WinLossByProductOption.totalColspan = [0, 1, 2];
                        WinLossByProductOption.totalColspanFakeLicensee = [1, 2, 3];
                        spyOn(WinLossByProduct, "reverse").and.returnValue([]);
                        spyOn(Report, "bindSummaryTotal").and.returnValue(2);
                        spyOn(jqGridAdditional, "setGroupFooters");
                    });

                    it("Report.bindSummaryTotal should be called with correct params when licensee is not fake", function () {
                        spyOn(Site, "isFakeLicensee").and.returnValue(false);

                        WinLossByProduct.bindTotal(0, [], []);

                        expect(Report.bindSummaryTotal).toHaveBeenCalledWith([], []);
                        expect(jqGridAdditional.setGroupFooters).toHaveBeenCalledWith(0, 1, 2, true);
                    });

                    it("Report.bindSummaryTotal should be called with correct params when licensee is fake", function () {
                        spyOn(Site, "isFakeLicensee").and.returnValue(true);

                        WinLossByProduct.bindTotal(0, [], []);

                        expect(Report.bindSummaryTotal).toHaveBeenCalledWith([], []);
                        expect(jqGridAdditional.setGroupFooters).toHaveBeenCalledWith(1, 2, 2, true);
                    });
                });

                describe("reverse(objectData)", function () {
                    it("Report.bindSummaryTotal should be called with correct params", function () {
                        spyOn(Site, "clone").and.callFake(function (obj) {
                            return obj;
                        });
                        spyOn(Array.prototype, "reverse");
                        var objectData = {
                            EUR: [{ ProductCode: "SB", Date: "0001-01-01T00:00:00", RowSpan: 0, Index: 0, ExternalId: null }],
                            GBP: [{ ProductCode: "SB", Date: "0001-01-01T00:00:00", RowSpan: 0, Index: 0, ExternalId: null }],
                            USD: [{ ProductCode: "SB", Date: "0001-01-01T00:00:00", RowSpan: 0, Index: 0, ExternalId: null }]
                        };

                        WinLossByProduct.reverse(objectData);

                        expect(Array.prototype.reverse).toHaveBeenCalled();
                    });
                });

                describe("goBack(level)", function () {
                    beforeEach(function () {
                        spyOn(Report, "renderBreadCrumb");
                        spyOn(WinLossByProduct, "bindData");
                        spyOn(WinLossByProduct, "setExcelUrl");
                        spyOn(WinLossByProduct, "setReportTitle");
                    });

                    it("setExcelUrl and setReportTitle should be called when going back to level 0", function () {
                        WinLossByProduct.goBack(0);

                        expect(WinLossByProduct.setExcelUrl).toHaveBeenCalled();
                        expect(WinLossByProduct.setReportTitle).toHaveBeenCalled();
                    });

                    it("url excel should be change when going back to level 1", function () {
                        WinLossByProduct.goBack(1);

                        expect(WinLossByProduct.setExcelUrl).not.toHaveBeenCalled();
                        expect(WinLossByProduct.setReportTitle).not.toHaveBeenCalled();
                        expect(WinLossByProductOption.urlExcelData).toContain("level=1");
                    });
                });

                describe("openBetlistPopUp(dataDrillDown)", function () {
                    beforeEach(function () {
                        spyOn($, "parseJSON").and.callFake(function (obj) {
                            return obj;
                        });
                        spyOn(QueryString, "setParams").and.callFake(function (url, obj) {
                            return url + "?param";
                        });
                        spyOn(Site, "setProductOptionOriginalParamList").and.callFake(function (url) {
                            return url;
                        });
                        spyOn(Site, "setLicenseeOptionOriginalParam").and.callFake(function (url) {
                            return url;
                        });
                        spyOn(Report, "GetDrilldownDateRange").and.returnValue({
                            FromDate: new Date("05/01/2017"),
                            ToDate: new Date("05/30/2017")
                        });
                        spyOn(Math, "min").and.returnValue(200);
                        spyOn(Popup, "openPopupWithIframe");
                    });

                    it("Popup.openPopupWithIframe should be called with correct params", function () {
                        var dataDrillDown = {
                            DrillDownFromDate: "05/01/2017",
                            DrillDownToDate: "05/30/2017"
                        };

                        var url = "LicenseeWinLossBetList/Index?param";

                        WinLossByProduct.openBetlistPopUp(dataDrillDown);

                        expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(url, { id: "betlist-popup", width: 950, height: 250, title: "CustomerBetList" });
                    });

                    it("Popup.openPopupWithIframe should be called with correct params", function () {
                        var dataDrillDown = {
                            DrillDownFromDate: new Date("05/01/2017"),
                            DrillDownToDate: new Date("05/30/2017")
                        };

                        var url = "LicenseeWinLossBetList/Index?param";

                        WinLossByProduct.openBetlistPopUp(dataDrillDown);

                        expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(url, { id: "betlist-popup", width: 950, height: 250, title: "CustomerBetList" });
                    });
                });

                describe("drillDown(level, currencyId, customerId, datetime, currencyName)", function () {
                    var dateRange = {
                        FromDate: new Date("01/01/2017"),
                        ToDate: new Date("01/30/2017")
                    };

                    beforeAll(function () {
                        spyOn(Report, "GetDrilldownDateRange").and.returnValue(dateRange);
                        spyOn(Site, "blockUI");
                        spyOn(Site, "unBlockUI");
                        spyOn($, "parseJSON").and.returnValue("[]");
                        spyOn(JSON, "stringify").and.returnValue("[]");
                    });

                    it("setExcelUrl and setReportTitle should be called with correct params when level is 1", function () {
                        spyOn(WinLossByProduct, "ajaxComplete");
                        var level = 1,
                            currencyId = 0,
                            customerId = 1,
                            datetime = "01/01/2017",
                            currencyName = "ALL";
                        spyOn(WinLossByProduct, "setReportTitle");
                        spyOn(WinLossByProduct, "setExcelUrl");
                        spyOn($, "ajax").and.callFake(function (options) {
                            options.beforeSend();
                            options.success({
                                Data: [{
                                    Index: 1
                                }]
                            });
                            options.complete();

                            return { abort: function () { } };
                        });

                        WinLossByProduct.drillDown(level, currencyId, customerId, datetime, currencyName);

                        expect(WinLossByProduct.setExcelUrl).toHaveBeenCalledWith(level, currencyId, customerId, dateRange.FromDate, dateRange.ToDate, currencyName);
                        expect(WinLossByProduct.setReportTitle).toHaveBeenCalled();
                    });

                    it("response is null - Notihng happen", function () {
                        spyOn(WinLossByProduct, "ajaxComplete");
                        var level = 1,
                            currencyId = 0,
                            customerId = 1,
                            datetime = "01/01/2017",
                            currencyName = "ALL";
                        spyOn(WinLossByProduct, "setReportTitle");
                        spyOn(WinLossByProduct, "setExcelUrl");
                        spyOn($, "ajax").and.callFake(function (options) {
                            options.beforeSend();
                            options.success(null);
                            options.complete();

                            return { abort: function () { } };
                        });

                        WinLossByProduct.drillDown(level, currencyId, customerId, datetime, currencyName);

                        expect(WinLossByProduct.setExcelUrl).not.toHaveBeenCalled();
                        expect(WinLossByProduct.setReportTitle).not.toHaveBeenCalled();
                    });
                });

                describe("call success in ajax option", function () {
                    var dateRange = {
                        FromDate: new Date("01/01/2017"),
                        ToDate: new Date("01/30/2017")
                    };
                    it("level > 0 and currencyId = 0 - WinLossByProduct.setReportTitle should be called with correct parameter", function () {
                        spyOn(Report, "GetDrilldownDateRange").and.returnValue(dateRange);
                        spyOn($, "parseJSON").and.returnValue("[]");
                        spyOn(WinLossByProduct, "setReportTitle");
                        var level = 1,
                            currencyId = "0",
                            customerId = 1,
                            datetime = "01/01/2017",
                            currencyName = "ALL";

                        var response = {
                            Data: [{
                                Index: 1
                            }]
                        };
                        createSubmitData({ CurrencyId: "0" }, response);

                        WinLossByProduct.drillDown(level, currencyId, customerId, datetime, currencyName);
                        ajaxOption.success(response);

                        var result = WinLossByProduct.setReportTitle.calls.mostRecent().args;

                        expect(result).toEqual([currencyId, dateRange.FromDate, dateRange.ToDate, currencyName]);
                    });
                });
            });
        });