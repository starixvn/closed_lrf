define(['jquery', 'common/site', 'components/pluginhelper/daterangepicker', 'pages/report/winlossbyleague/winlossbyleague.option',
    'pages/report/winlossbyleague/winlossbyleague.filter', 'pages/report/winlossbyleague/winlossbyleague', 'pages/report/report', 'lib/jqgrid/jquery.jqgrid.additional', 'common/popup',
    'components/pluginhelper/multiselect', "components/paging", "helpers/excel"],
        function ($, Site, DatePicker, WinLossByLeagueOption, WinLossByLeagueFilter, WinLossByLeague, Report, jqGridAdditional, Popup, MultiSelect, PagingHelper, ExcelHelper) {
            describe("WinLossByLeague", function () {
                function createPostData(data) {
                    setFixtures('<input id="CurrencyName" value="USD" />');
                    spyOn(WinLossByLeagueFilter, "isValid").and.returnValue(true);
                    spyOn($.fn, "serializeObject").and.returnValue(data);
                    spyOn($, "ajax").and.returnValue({ abort: function () { } });

                    WinLossByLeague.submit();
                }

                beforeAll(function () {
                    spyOn(Site, "getSingleResource").and.callFake(function (resource) { return resource; });
                    spyOn(Site, "initialize");
                    spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                        return url;
                    });
                });

                describe("ajaxPaging()", function () {
                    beforeAll(function () {
                        spyOn(PagingHelper, "getSetting");
                        spyOn(WinLossByLeague, "drillDown");

                        WinLossByLeague.ajaxPaging();
                    });

                    it("PagingHelper.getSetting() should be called", function () {
                        expect(PagingHelper.getSetting).toHaveBeenCalled();
                    });

                    it("WinLossByLeague.drillDown(leagueid, leaguename) should be called with correct parameters", function () {
                        expect(WinLossByLeague.drillDown).toHaveBeenCalledWith(-1, null);
                    });
                });

                describe("initialize()", function () {
                    it("WinLossByLeague.initEvent() should be called", function () {
                        spyOn(WinLossByLeague, "initEvent");
                        spyOn(WinLossByLeagueFilter, "initialize");

                        WinLossByLeague.initialize();

                        expect(WinLossByLeague.initEvent).toHaveBeenCalled();
                        expect(WinLossByLeagueFilter.initialize).toHaveBeenCalled();
                    });
                });

                describe("initEvent()", function () {
                    var $submitButton;

                    beforeEach(function () {
                        setFixtures("<input type='button' id='SubmitButton' />");
                        appendSetFixtures("<div id='level-link-container'><div class='level-link' data-level='0'></div></div>");
                        appendSetFixtures("<div class='main-content'><div id='leagueHeader' data-leagueid='1'>League Name Here</div>" + 
                                            "<div class='drilldown' data-custid='1' data-externalid='2' data-systemid='3' /></div>");
                        appendSetFixtures("<div id='ExportToExcel'></div>");
                        $submitButton = $('#SubmitButton');

                        WinLossByLeague.initEvent();
                    });

                    it("WinLossByLeague.submit() should be called when '#SubmitButton' fired click event", function () {
                        spyOn(WinLossByLeague, "submit");

                        $submitButton.click();

                        expect(WinLossByLeague.submit).toHaveBeenCalled();
                    });

                    it("WinLossByLeague.submit() should be called when '.level-link' fired click event", function () {
                        spyOn(WinLossByLeague, "submit");

                        $('.level-link').click();

                        expect(WinLossByLeague.submit).toHaveBeenCalled();
                    });

                    it("WinLossByLeague.submit() should be not called when '.level-link' fired click event if level is 1", function () {
                        spyOn(WinLossByLeague, "submit");
                        $('.level-link').attr('data-level', 1);

                        $('.level-link').click();

                        expect(WinLossByLeague.submit).not.toHaveBeenCalled();
                    });

                    it("WinLossByLeague.drillDown(leagueid, leaguename) should be called when '#leagueHeader' is clicked", function () {
                        spyOn(WinLossByLeague, "drillDown");

                        $('#leagueHeader').click();

                        expect(WinLossByLeague.drillDown).toHaveBeenCalledWith(1, 'League Name Here');
                    });

                    it("WinLossByLeague.drillDownBetList(custid, leagueid, leaguename) should be called when '.drilldown' fired click event", function () {
                        spyOn(WinLossByLeague, "drillDownBetList");

                        $('.drilldown').click();

                        expect(WinLossByLeague.drillDownBetList).toHaveBeenCalledWith(1, 2, 3);
                    });

                    it("ExcelHelper.exportExcel() should be called when '#ExportToExcel' is clicked", function () {
                        spyOn(ExcelHelper, "exportExcel");

                        $('#ExportToExcel').click();

                        expect(ExcelHelper.exportExcel).toHaveBeenCalledWith(jasmine.any(Object), "api/WinLossByLeagueReport/Excel");
                    });

                    it("WinLossByLeague.resizeGrid() function should be called when window fire resize event", function () {
                        spyOn(WinLossByLeague, "resizeGrid");

                        $(window).resize();

                        expect(WinLossByLeague.resizeGrid).toHaveBeenCalled();
                    });

                    it("$(window).off() should be called with correct parameter when window fire unload event", function () {
                        spyOn($.fn, "off");

                        $(window).unload();

                        expect($.fn.off).toHaveBeenCalledWith("resize");
                    });
                });

                describe("resizeGrid()", function () {
                    it("Corresponding methods should be called", function () {
                        setFixtures('<div id="ReportGrid"></div>');
                        spyOn(jqGridAdditional, "updateGridHeight");
                        spyOn(jqGridAdditional, "updateGridWidth");

                        WinLossByLeague.resizeGrid();

                        expect(jqGridAdditional.updateGridHeight).toHaveBeenCalled();
                        expect(jqGridAdditional.updateGridWidth).toHaveBeenCalledWith($("#ReportGrid"), true);
                    });
                });

                describe("setReportTitle(level, minOdds, fromdate, todate)", function () {
                    it("Report title should be correct text when level = 0", function () {
                        var titleExpected = 'WinLossByLeague, 2/01/2016 → 2/29/2016 - Currency:  undefined - MinimumOdds : 1';

                        setFixtures("<div class='report-title' id='caption' />");

                        WinLossByLeague.setReportTitle(0, 1, "2016/02/01", "2016/02/29");

                        expect($("#caption").html()).toBe(titleExpected);
                    });

                    it("Report title should be correct text  when level = 1", function () {
                        var titleExpected = 'null &gt; CustomerWinLoss, 2/01/2016 → 2/29/2016 - Currency:  undefined - MinimumOdds : 1';

                        setFixtures("<div class='report-title' id='caption' />");

                        WinLossByLeague.setReportTitle(1, 1, "2016/02/01", "2016/02/29");

                        expect($("#caption").html()).toBe(titleExpected);
                    });
                });

                describe("ajaxComplete", function () {
                    beforeEach(function () {
                        spyOn(Report, "renderBreadCrumb");
                        spyOn(WinLossByLeague, "bindData");
                        spyOn(WinLossByLeague, "setReportTitle");
                    });

                    it("Nothing happen if response param has null value", function () {
                        WinLossByLeague.ajaxComplete(0, null);

                        expect(WinLossByLeague.bindData).not.toHaveBeenCalled();
                        expect(Report.renderBreadCrumb).not.toHaveBeenCalled();
                    });

                    it("WinLossByLeague.setReportTitle() should be called if level is 0", function () {
                        WinLossByLeague.ajaxComplete(0, {});

                        expect(WinLossByLeague.setReportTitle).toHaveBeenCalled();
                    });

                    it("WinLossByLeague.setReportTitle() should NOT be called if level param greater than 0", function () {
                        WinLossByLeague.ajaxComplete(1, {});

                        expect(WinLossByLeague.setReportTitle).not.toHaveBeenCalled();
                    });

                    it("Report.renderBreadCrumb(level) should be called with correct parameter", function () {
                        var level = 1;
                        WinLossByLeague.ajaxComplete(level, {});

                        expect(Report.renderBreadCrumb).toHaveBeenCalledWith(level);
                    });

                    it("WinLossByLeague.bindData(level) should be called with correct parameter", function () {
                        var level = 1;
                        var response = { Data: "Hello" };

                        WinLossByLeague.ajaxComplete(level, response);

                        expect(WinLossByLeague.bindData).toHaveBeenCalledWith(level, response);
                    });
                });

                describe("submit()", function () {
                    var request;
                    beforeEach(function (done) {
                        jasmine.Ajax.install();

                        var submitData = {
                            BaseCurrency: "eur"
                        };

                        setFixtures('<form id="SearchForm"></form>');
                        appendSetFixtures('<input id="CurrencyName" value="ABC" />');
                        appendSetFixtures('<select id="League"><option value="100" selected>League Test</option></select>');
                        spyOn($.fn, "serializeObject").and.returnValue(submitData);
                        spyOn(WinLossByLeague, "ajaxComplete");
                        spyOn(Site, "blockUI");
                        spyOn(Site, "unBlockUI");

                        jasmine.Ajax
                                .stubRequest("api/WinLossByLeagueReport/Index")
                                .andReturn({
                                    'status': 200,
                                    'contentType': 'application/json',
                                    'responseText': '{ "ProductOptions": "SB,RC" }'
                                });

                        setTimeout(done, 10);
                    });
                    afterEach(function () {
                        jasmine.Ajax.uninstall();
                    });

                    it("request url should be correct", function () {
                        spyOn(WinLossByLeagueFilter, "isValid").and.returnValue(true);
                        var expectedUrl = "api/WinLossByLeagueReport/Index";

                        WinLossByLeague.submit();
                        request = jasmine.Ajax.requests.mostRecent();

                        expect(request.url).toBe(expectedUrl);
                    });
                    it("Site.blockUI() should be called", function () {
                        spyOn(WinLossByLeagueFilter, "isValid").and.returnValue(true);

                        WinLossByLeague.submit();

                        expect(Site.blockUI).toHaveBeenCalled();
                    });
                    it("Site.blockUI() should not be called if filter is not valid", function () {
                        spyOn(WinLossByLeagueFilter, "isValid").and.returnValue(false);

                        WinLossByLeague.submit();

                        expect(Site.blockUI).not.toHaveBeenCalled();
                    });
                    it("Site.unBlockUI() should be called", function () {
                        spyOn(WinLossByLeagueFilter, "isValid").and.returnValue(true);

                        WinLossByLeague.submit();

                        expect(Site.unBlockUI).toHaveBeenCalled();
                    });
                    it("WinLossByLeague.ajaxComplete(level, response) should be called with correct parameters", function () {
                        spyOn(WinLossByLeagueFilter, "isValid").and.returnValue(true);

                        WinLossByLeague.submit();

                        expect(WinLossByLeague.ajaxComplete).toHaveBeenCalledWith(0, { ProductOptions: "SB,RC" });
                    });
                });

                describe("drillDownBetList(custId, externalId, systemId)", function () {
                    var postData;
                    beforeAll(function () {
                        postData = {
                            BaseCurrency: "eur",
                            Odds: 0,
                            FromDate: "06/01/2017",
                            ToDate: "06/30/2017",
                            CurrencyId: 1,
                            Match: 2,
                            ShowWin: true,
                            ShowLoss: true,
                            ShowDraw: true
                        };
                        createPostData(postData);
                    });

                    it("WinLossByLeagueFilter.buildProductCodeList() should be called with correct parameter", function () {
                        spyOn(WinLossByLeagueFilter, "buildProductCodeList").and.returnValue([]);
                        spyOn(window, "open");

                        WinLossByLeague.drillDownBetList(0, 0, 0);

                        expect(WinLossByLeagueFilter.buildProductCodeList).toHaveBeenCalledWith(postData);
                    });

                    it("window.open() should be called", function () {
                        spyOn(WinLossByLeagueFilter, "buildProductCodeList").and.returnValue(["SB"]);
                        spyOn(window, "open");

                        WinLossByLeague.drillDownBetList(0, 0, 0);

                        var url = "WinlossByLeagueBetList/Index?IsConvert=true&Odds=0&FromDate=06%2F01%2F2017&ToDate=06%2F30%2F2017&BaseCurrency=EUR" +
                            "&CurrencyId=1&CurrencyName=USD&CustId=0&ExternalId=0&SystemId=0&LeagueId=-1&MatchId=2&ShowWin=true&ShowLoss=true&ShowDraw=true&ProductCodeList=SB";

                        expect(window.open).toHaveBeenCalledWith(url, "", 'modal=no');
                    });
                });

                describe("drillDown(leagueid, leaguename)", function () {
                    var leagueid = 1000;
                    var submitData;
                    beforeEach(function () {
                        submitData = {};

                        spyOn(WinLossByLeagueFilter, "buildProductsParams");
                        spyOn(WinLossByLeague, "setReportTitle");
                        spyOn(WinLossByLeague, "ajaxComplete");
                        spyOn($, "ajax").and.returnValue({ abort: function () { } });
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

                    it("leagueid should be posted to server", function () {
                        WinLossByLeague.drillDown(leagueid, "leaguename");

                        var postdata = $.ajax.calls.mostRecent().args[0].data;
                        expect(postdata.League).toBe(leagueid);
                    });

                    it("request url should be correct", function () {
                        WinLossByLeague.drillDown(leagueid, "leaguename");
                        var requestUrl = $.ajax.calls.mostRecent().args[0].url;

                        expect(requestUrl).toBe("api/WinLossByLeagueReport/Index");
                    });

                    it("Site.blockUI() should be called with beforeSend function of ajax option", function () {
                        spyOn(Site, "blockUI");
                        WinLossByLeague.drillDown(leagueid, "leaguename");
                        var ajaxOption = $.ajax.calls.mostRecent().args[0];

                        expect(Site.blockUI).not.toHaveBeenCalled();

                        ajaxOption.beforeSend();

                        expect(Site.blockUI).toHaveBeenCalled();
                    });
                    it("Site.unBlockUI() should be called with complete function of ajax option", function () {
                        spyOn(Site, "unBlockUI");
                        WinLossByLeague.drillDown(leagueid, "leaguename");
                        var ajaxOption = $.ajax.calls.mostRecent().args[0];

                        expect(Site.unBlockUI).not.toHaveBeenCalled();

                        ajaxOption.complete();

                        expect(Site.unBlockUI).toHaveBeenCalled();
                    });

                    describe("success function of ajax option", function () {
                        it("WinLossByLeague.ajaxComplete(level, response) should be called with correct parameter", function () {
                            WinLossByLeague.drillDown(leagueid, "leaguename");
                            var ajaxOption = $.ajax.calls.mostRecent().args[0];

                            ajaxOption.success({ Data: [] });

                            expect(WinLossByLeague.ajaxComplete.calls.mostRecent().args).toEqual([jasmine.any(Number), { Data: [] }]);
                        });

                        it("WinLossByLeague.setReportTitle() should be called with correct level", function () {
                            WinLossByLeague.drillDown(leagueid, "leaguename");
                            var ajaxOption = $.ajax.calls.mostRecent().args[0];

                            ajaxOption.success({ Data: [1] });

                            var args = WinLossByLeague.setReportTitle.calls.mostRecent().args;
                            expect(args[0]).toBe(1);
                        });

                        it("#paging is hidden if totalrows = 0", function () {
                            spyOn(PagingHelper, "render");
                            spyOn(WinLossByLeague, "resizeGrid");
                            setFixtures('<div id="paging" style="display: none"></div>');

                            WinLossByLeague.drillDown(leagueid, "leaguename");
                            var ajaxOption = $.ajax.calls.mostRecent().args[0];

                            ajaxOption.success({ Data: [1], TotalRows: 0 });

                            expect($("#paging").is(":hidden")).toBe(true);
                            expect(PagingHelper.render).not.toHaveBeenCalled();
                            expect(WinLossByLeague.resizeGrid).not.toHaveBeenCalled();
                        });

                        it("#paging is show if totalrows > 0", function () {
                            spyOn(PagingHelper, "render");
                            spyOn(WinLossByLeague, "resizeGrid");
                            setFixtures('<div id="paging" style="display: none"></div>');

                            WinLossByLeague.drillDown(leagueid, "leaguename");
                            var ajaxOption = $.ajax.calls.mostRecent().args[0];

                            ajaxOption.success({ Data: [1], TotalRows: 1 });

                            expect($("#paging").is(":hidden")).toBe(false);
                            expect(PagingHelper.render).toHaveBeenCalled();
                            expect(WinLossByLeague.resizeGrid).toHaveBeenCalled();
                        });
                    });
                });

                describe("bindTotal(level, totalData)", function () {
                    it("WinLossByLeagueOption.getColModel(level) should be called with correct parameter", function () {
                        spyOn(WinLossByLeagueOption, "getColModel");

                        WinLossByLeague.bindTotal(0, 100);

                        expect(WinLossByLeagueOption.getColModel).toHaveBeenCalledWith(0);
                    });

                    it("jqGridAdditional.assignTotal(totalData, columnModel) should be called", function () {
                        spyOn(jqGridAdditional, "assignTotal");

                        WinLossByLeague.bindTotal(0, 100);

                        expect(jqGridAdditional.assignTotal).toHaveBeenCalled();
                    });

                    it("jqGridAdditional.assignTotal(totalData, columnModel) should be called with correct parameter", function () {
                        spyOn(jqGridAdditional, "setGroupFooters");

                        WinLossByLeague.bindTotal(0, 100);

                        expect(jqGridAdditional.setGroupFooters).toHaveBeenCalledWith(2, 0, 0);
                    });

                    it("jqGridAdditional.setGroupFooters should be called with correct parameter", function () {
                        spyOn(jqGridAdditional, "setGroupFooters");

                        WinLossByLeague.bindTotal(1, 100);

                        expect(jqGridAdditional.setGroupFooters).toHaveBeenCalledWith(3, 0, 0);
                    });
                });

                describe("bindData(level, response)", function () {
                    var gridOption = {};
                    beforeEach(function () {
                        setFixtures("<div id='ReportGrid'></div>");

                        spyOn(jqGridAdditional, "clearGrid");
                        spyOn(WinLossByLeagueOption, "getGridOption").and.returnValue(gridOption);
                        spyOn($.fn, "jqGrid");
                        spyOn(jqGridAdditional, "gridComplete");
                        spyOn(WinLossByLeague, "resizeGrid");

                        WinLossByLeague.bindData(2, { Data: [1, 2, 3], Total: [4, 5, 6] });
                    });

                    it("jqGridAdditional.clearGrid(reportId) should be called with correct parameter", function () {
                        expect(jqGridAdditional.clearGrid).toHaveBeenCalledWith("ReportGrid");
                    });
                    it("WinLossByLeagueOption.getGridOption(level) should be called with correct parameter", function () {
                        expect(WinLossByLeagueOption.getGridOption).toHaveBeenCalledWith(2);
                    });
                    it("jqGrid function of jquery should be called", function () {
                        expect($.fn.jqGrid).toHaveBeenCalled();
                    });
                    it("Corresponding methods should be called when calling gridOption.gridComplete()", function () {
                        spyOn(WinLossByLeague, "bindTotal");
                        spyOn(Site, "unBlockUI");

                        gridOption.gridComplete();

                        expect(jqGridAdditional.gridComplete).toHaveBeenCalled();
                        expect(WinLossByLeague.bindTotal).toHaveBeenCalled();
                        expect(WinLossByLeague.resizeGrid).toHaveBeenCalled();
                        expect(Site.unBlockUI).toHaveBeenCalled();
                    });

                    it("jqGridAdditional.setNoInfo() should be called if response data is empty", function () {
                        spyOn(jqGridAdditional, 'setNoInfo');

                        WinLossByLeague.bindData(2, { Data: [] });

                        expect(jqGridAdditional.setNoInfo).toHaveBeenCalled();
                    });

                    it("WinLossByLeagueOption.addLeagueGroupRow() should be called with correct params if level = 0", function () {
                        setFixtures("<select id='League'><option value='999' selected>League Name</option></select>");
                        spyOn(WinLossByLeagueOption, "addLeagueGroupRow");

                        WinLossByLeague.bindData(0, { Data: [0] });

                        expect(WinLossByLeagueOption.addLeagueGroupRow).toHaveBeenCalledWith('999', 'League Name');
                    });
                });
            });
        });