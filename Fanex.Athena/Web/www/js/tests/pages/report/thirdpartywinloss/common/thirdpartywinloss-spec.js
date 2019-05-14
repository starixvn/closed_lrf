define([
    "jquery",
    "common/querystring",
    "common/site",
    "pages/report/thirdpartywinloss/common/thirdpartywinloss",
    "pages/report/report",
    "lib/jqgrid/jquery.jqgrid.additional",
    "components/pluginhelper/daterangepicker",
    "helpers/daterange",
    "common/popup"],
    function ($, QueryString, Site, ThirdPartyWinLoss, Report, jqGridAdditional, DatePicker, DateHelper, Popup) {
        describe("ThirdPartyWinLoss", function () {
            function setFixturesForFrom(IsExcludedTestData, CurrencyId, FromDate, ToDate, BaseCurrency) {
                appendSetFixtures('<form id="ThirdPartyWinLossForm">'
                                + '<input type="hidden" name="IsExcludedTestData" value="' + IsExcludedTestData + '" />'
                                + '<input type="text" name="CurrencyId" value="' + CurrencyId + '" />'
                                + '<input type="hidden" name="FromDate" value="' + FromDate + '" />'
                                + '<input type="hidden" name="ToDate" value="' + ToDate + '" />'
                                + '<input type="text" name="BaseCurrency" value="' + BaseCurrency + '" />'
                                + '<input type="hidden" name="DrawFilter" value="0" />'
                                + '<input type="hidden" name="ProductId" value="1" />'
                                + '<input type="hidden" name="ReportBy" value="0" />'
                                + '</form>');
            }

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

                spyOn(QueryString, "setParam").and.callFake(function (url, param, value) {
                    return url + "&" + param + "=" + value;
                });
            });

            describe("initialize()", function () {
                beforeEach(function () {
                    spyOn(ThirdPartyWinLoss, "initEvent");
                });

                it("all initial methods should be called", function () {
                    spyOn(ThirdPartyWinLoss, "initSetting");

                    ThirdPartyWinLoss.initialize();

                    expect(Site.initialize).toHaveBeenCalled();
                    expect(DatePicker.initDateRangePicker).toHaveBeenCalled();
                    expect(ThirdPartyWinLoss.initEvent).toHaveBeenCalled();
                    expect(ThirdPartyWinLoss.initSetting).toHaveBeenCalled();
                });

                it("Site.addUserGuide should be called if UserGuideResourceName is set", function () {
                    ThirdPartyWinLoss.initialize({
                        UserGuideResourceName: "UserGuide"
                    });

                    expect(Site.addUserGuide).toHaveBeenCalled();
                });

                it("DateHelper.setConstraintMonthRange should be called if ValidMonthRange is set", function () {
                    ThirdPartyWinLoss.initialize({
                        ValidMonthRange: 3
                    });

                    expect(DateHelper.setConstraintMonthRange).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                beforeEach(function () {
                    $("body").off();
                });

                afterEach(function () {
                    $("body").off();
                });

                it("ThirdPartyWinLoss.submit() should be called if submit button is clicked.", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    spyOn(ThirdPartyWinLoss, "submit");

                    ThirdPartyWinLoss.initEvent();
                    $('#SubmitButton').click();

                    expect(ThirdPartyWinLoss.submit).toHaveBeenCalled();
                });

                it("ThirdPartyWinLoss form should be submitted if ExportToExcel button is clicked.", function () {
                    setFixtures('<form id="ThirdPartyWinLossForm">'
                        + '<input type="hidden" id="IsExportExcel" />'
                        + '<button id="ExportToExcel"></button>'
                        + '</form>');
                    var spyEvent = spyOnEvent($('#ThirdPartyWinLossForm'), 'submit');
                    $('#ThirdPartyWinLossForm').submit(function () { return false; });

                    ThirdPartyWinLoss.initEvent();
                    $('#ExportToExcel').click();

                    expect(spyEvent).toHaveBeenTriggered();
                });

                it("ThirdPartyWinLoss.submit() should be called with correct params if drilldown link is clicked.", function () {
                    setFixtures('<div class="main-content">'
                        + '<a class="drilldown" data-drill-down=\'{"link":1}\'></a>'
                        + '<a class="drilldown" data-drill-down=\'{"link":2}\'></a>'
                        + '</div>');
                    spyOn(ThirdPartyWinLoss, "submit");

                    ThirdPartyWinLoss.initEvent();
                    $('.drilldown').eq(0).click();

                    expect(ThirdPartyWinLoss.submit).toHaveBeenCalledWith({ link: 1 });
                });

                it("Bet list popup should be opened with correct params if bet list link is clicked.", function () {
                    setFixtures('<div class="main-content">'
                                + '<a class="bet-list-link" '
                                + 'data-drill-down=\'{'
                                + '"DrillDownDate":"01/01/2011",'
                                + '"DrillDownCurrencyId":"0",'
                                + '"DrillDownCurrencyName":"EUR",'
                                + '"CustomerId":"1",'
                                + '"SystemId":"2",'
                                + '"ExternalId":"3"'
                                + '}\'></a>'
                                + '</div>');
                    setFixturesForFrom(false, 1, "01/01/2011", "01/11/2011", "usd");
                    spyOn(Report, "renderBreadCrumb");
                    spyOn(ThirdPartyWinLoss, "bindData");
                    spyOn(ThirdPartyWinLoss, "setReportTitle");
                    spyOn($, "ajax").and.callFake(function (option) {
                        option.success({});
                    });
                    spyOn(Report, "GetDrilldownDateRange").and.callFake(function (reportBy, fromDate, toDate, datetime) {
                        return {
                            FromDate: new Date(2011, 1, 1),
                            ToDate: new Date(2011, 1, 12)
                        };
                    });
                    spyOn(Popup, "openPopupWithIframe");
                    spyOn(Math, "min").and.callFake(function (num1, num2) {
                        return 650;
                    });
                    spyOn(Site, "setProductCodeListParam").and.callFake(function (url, code) {
                        return url;
                    });
                    ThirdPartyWinLoss.submit();

                    ThirdPartyWinLoss.initEvent();
                    $('.bet-list-link:eq(0)').click();

                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(
                        'LicenseeWinLossBetList/Index' +
                        '&fromdate=02/01/2011&todate=02/12/2011&excludetest=false&CurrencyId=0' + 
                        '&CurrencyName=EUR&drawfilter=0&custid=1&systemId=2&externalId=3' +
                        '&BaseCurrency=usd&excelfilename=ColossusBetsWinLossBetList',
                        { id: 'betlist-popup', width: 970, height: 700, title: 'CustomerBetList' });
                });

                it("off() jquery function should be called with correct parameter when window fire unload event", function () {
                    spyOn($.fn, "off");
                    ThirdPartyWinLoss.initEvent();

                    $(window).unload();

                    expect($.fn.off).toHaveBeenCalledWith("resize");
                });

                it("resizeGrid function should be called when window fire resize event", function () {
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "updateGridWidth");

                    ThirdPartyWinLoss.initEvent();
                    $(window).resize();

                    expect(jqGridAdditional.updateGridHeight).toHaveBeenCalled();
                    expect(jqGridAdditional.updateGridWidth).toHaveBeenCalled();
                });

                describe("('.level-link').click()", function () {
                    beforeEach(function () {
                        setFixtures('<div id="level-link-container">'
                                    + '<a class="level-link" data-level=0></a>'
                                    + '<a class="level-link" data-level=1></a>'
                                    + '<a class="level-link" data-level=2></a>'
                                    + '</div>');

                        spyOn(Report, "renderBreadCrumb");
                        spyOn(ThirdPartyWinLoss, "bindData");
                        spyOn(ThirdPartyWinLoss, "setReportTitle");

                        ThirdPartyWinLoss.initSetting({
                            GridOption: {
                                urlExcelData: "urlExcelData"
                            },
                            ReportTitle: "ReportTitle"
                        });
                    });

                    it("does nothing if level is 2", function () {
                        ThirdPartyWinLoss.initEvent();

                        $('.level-link').eq(2).click();

                        expect(Report.renderBreadCrumb).not.toHaveBeenCalled();
                        expect(ThirdPartyWinLoss.bindData).not.toHaveBeenCalled();
                        expect(ThirdPartyWinLoss.setReportTitle).not.toHaveBeenCalled();
                    });

                    it("ThirdPartyWinLoss.setReportTitle() should be called if level is 0", function () {
                        setFixturesForFrom(false, 1, "01/01/2011", "01/11/2011", "usd");
                        spyOn($, "ajax").and.callFake(function (option) {
                            option.success({});
                        });
                        ThirdPartyWinLoss.submit();
                        ThirdPartyWinLoss.initEvent();

                        $('.level-link').eq(0).click();

                        expect(ThirdPartyWinLoss.setReportTitle).toHaveBeenCalled();
                    });

                    it("ThirdPartyWinLoss.bindData() should be called if level is less than 2", function () {
                        ThirdPartyWinLoss.initEvent();

                        $('.level-link').eq(1).click();

                        expect(ThirdPartyWinLoss.bindData).toHaveBeenCalled();
                    });
                });
            });

            describe("submit(drillDownData)", function () {
                var ajaxOption = {};
                var ajaxObj = jasmine.createSpyObj("ajaxObj", ["abort"]);

                beforeAll(function () {
                    spyOn($, "ajax").and.callFake(function (option) {
                        ajaxOption = option;
                        option.beforeSend();
                        option.complete();

                        return ajaxObj;
                    });
                });

                beforeEach(function () {
                    setFixturesForFrom(false, 1, "01/01/2011", "01/11/2011", "usd");

                    spyOn(Report, "renderBreadCrumb");
                    spyOn(ThirdPartyWinLoss, "bindData");
                    spyOn(ThirdPartyWinLoss, "setReportTitle");
                });

                it("ThirdPartyWinLoss.setReportTitle should be called after calling ajax successfully", function () {
                    ThirdPartyWinLoss.submit();
                    ajaxOption.success({});

                    expect(ThirdPartyWinLoss.setReportTitle).toHaveBeenCalled();
                });

                it("ThirdPartyWinLoss.bindData should be called after calling ajax successfully", function () {
                    ThirdPartyWinLoss.submit();
                    ajaxOption.success({});

                    expect(ThirdPartyWinLoss.bindData).toHaveBeenCalled();
                });

                it("ThirdPartyWinLoss.bindData should not be called after calling ajax successfully if response data is null", function () {
                    ThirdPartyWinLoss.submit();
                    ajaxOption.success(null);

                    expect(ThirdPartyWinLoss.bindData).not.toHaveBeenCalled();
                });

                it("Report.GetDrilldownDateRange should be called if submitting with drillDownData", function () {
                    spyOn(Report, "GetDrilldownDateRange").and.callFake(function (reportBy, fromDate, toDate, datetime) {
                        return {
                            FromDate: new Date(2011, 01, 01),
                            ToDate: new Date(2011, 01, 11)
                        };
                    });

                    ThirdPartyWinLoss.submit({
                        Level: 0,
                        CurrencyId: 1,
                        CustId: 2,
                        Datetime: "2011/01/01"
                    });
                    ajaxOption.success({});

                    expect(Report.GetDrilldownDateRange).toHaveBeenCalled();
                });

                it("sets up excel URL if level is greater than 0", function () {
                    spyOn(Report, "GetDrilldownDateRange").and.callFake(function (reportBy, fromDate, toDate, datetime) {
                        return {
                            FromDate: new Date(2011, 01, 01),
                            ToDate: new Date(2011, 01, 11)
                        };
                    });

                    ThirdPartyWinLoss.submit({
                        Level: 1,
                        CurrencyId: 1,
                        CustId: 2,
                        Datetime: "2011/01/01"
                    });
                    ajaxOption.success({});

                    expect(QueryString.setParam).toHaveBeenCalled();
                });

                it("ajaxRequest.abort() should be called if ajaxRequest is not null", function () {
                    ThirdPartyWinLoss.submit();

                    expect(ajaxObj.abort).toHaveBeenCalled();
                });
            });

            describe("setReportTitle(currencyId, fromdate, todate)", function () {
                it("title should be shown correctly", function () {
                    setFixtures('<div class="panel-heading hide">'
                        + '<div class="report-title"></div>'
                        + '</div>');
                    ThirdPartyWinLoss.initSetting({
                        GridOption: {
                            urlExcelData: "urlExcelData"
                        },
                        ReportTitle: "Title"
                    });
                    spyOn(Report, "getCurrencyNameForReportTitle").and.callFake(function (currencyId) { return currencyId; });
                    var expectedTitle = "Title, 01/01/2011 → 01/11/2011 - 0";

                    ThirdPartyWinLoss.setReportTitle(0, "01/01/2011", "01/11/2011");

                    expect($(".report-title").html()).toEqual(expectedTitle);
                    expect($(".panel-heading").hasClass("hide")).toBe(false);
                });
            });

            describe("bindData(level, response)", function () {
                var gridOption = jasmine.createSpyObj("gridOption", ["setGroupHeader"]);
                gridOption.urlExcelData = "urlExcelData",
                gridOption.getGridOption = function () {
                    return gridOption;
                }

                beforeAll(function () {
                    spyOn(jqGridAdditional, "clearGrid");
                    spyOn(jqGridAdditional, "setNoInfo");

                    ThirdPartyWinLoss.initSetting({
                        GridOption: gridOption,
                        ReportTitle: "ReportTitle"
                    });
                });

                it("jqGridAdditional.clearGrid should be called", function () {
                    ThirdPartyWinLoss.bindData(0, {
                        Data: []
                    });

                    expect(jqGridAdditional.clearGrid).toHaveBeenCalled();
                });

                it("jqGridAdditional.setNoInfo should be called if response data is empty", function () {
                    ThirdPartyWinLoss.bindData(0, {
                        Data: []
                    });

                    expect(jqGridAdditional.setNoInfo).toHaveBeenCalled();
                });

                it("$.jqGrid should be called if response data is not empty", function () {
                    spyOn($.fn, "jqGrid");

                    ThirdPartyWinLoss.bindData(0, {
                        Data: [1]
                    });

                    expect($.fn.jqGrid).toHaveBeenCalled();
                });

                it("setGroupHeader() should be called if response data is not empty", function () {
                    spyOn($.fn, "jqGrid");

                    ThirdPartyWinLoss.bindData(0, {
                        Data: [1]
                    });

                    expect(gridOption.setGroupHeader).toHaveBeenCalled();
                });

                it("jqGridAdditional.gridComplete should be called when gridComplete() is called ", function () {
                    spyOn($.fn, "jqGrid");
                    spyOn(jqGridAdditional, "gridComplete");
                    spyOn(ThirdPartyWinLoss, "bindTotal");
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "updateGridWidth");

                    ThirdPartyWinLoss.bindData(0, {
                        Data: [1]
                    });
                    gridOption.gridComplete();

                    expect(jqGridAdditional.gridComplete).toHaveBeenCalled();
                });

                it("ThirdPartyWinLoss.bindTotal should be called when gridComplete() is called ", function () {
                    spyOn($.fn, "jqGrid");
                    spyOn(jqGridAdditional, "gridComplete");
                    spyOn(ThirdPartyWinLoss, "bindTotal");
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "updateGridWidth");

                    ThirdPartyWinLoss.bindData(0, {
                        Data: [1]
                    });
                    gridOption.gridComplete();

                    expect(ThirdPartyWinLoss.bindTotal).toHaveBeenCalled();
                });

                it("resizeGrid should be called when gridComplete() is called ", function () {
                    spyOn($.fn, "jqGrid");
                    spyOn(jqGridAdditional, "gridComplete");
                    spyOn(ThirdPartyWinLoss, "bindTotal");
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "updateGridWidth");

                    ThirdPartyWinLoss.bindData(0, {
                        Data: [1]
                    });
                    gridOption.gridComplete();

                    expect(jqGridAdditional.updateGridHeight).toHaveBeenCalled();
                    expect(jqGridAdditional.updateGridWidth).toHaveBeenCalled();
                });
            });

            describe("bindTotal(level, totalData, summaryTotal)", function () {
                beforeAll(function () {
                    ThirdPartyWinLoss.initSetting({
                        GridOption: {
                            urlExcelData: "urlExcelData",
                            getTotalColModel: function () {
                            },
                            totalColspan: [0, 1, 2]
                        },
                        ReportTitle: "ReportTitle"
                    });

                    spyOn(jqGridAdditional, "assignTotal");
                    spyOn(Report, "bindSummaryTotal");
                    spyOn(jqGridAdditional, "setGroupFooters");
                });

                it("render total methods should be called", function () {
                    ThirdPartyWinLoss.bindTotal(0, {}, {});

                    expect(jqGridAdditional.assignTotal).toHaveBeenCalled();
                    expect(Report.bindSummaryTotal).toHaveBeenCalled();
                    expect(jqGridAdditional.setGroupFooters).toHaveBeenCalled();
                });
            });
        });
    });