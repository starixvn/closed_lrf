define([
    "jquery",
    "common/querystring",
    "common/site",
    "pages/report/report",
    "pages/report/platformwinloss/platformwinloss.option",
    "pages/report/platformwinloss/platformwinloss",
    "lib/jqgrid/jquery.jqgrid.additional",
    "components/pluginhelper/monthpicker",
    "components/pluginhelper/multiselect",
    "common/popup",
    "helpers/excel"
],
    function ($, QueryString, Site, Report, PlatformWinLossOption, PlatformWinLoss, jqGridAdditional, MonthPicker, MultiSelect, Popup, ExcelHelper) {
        describe("PlatformWinLoss", function () {
            beforeAll(function () {
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                    return url;
                });
                spyOn(Site, "initialize");
                spyOn(Site, "getSingleResource").and.callFake(function (str) {
                    if (str === "Viewin") {
                        return "View in {0}";
                    }
                    return str;
                });
                spyOn(MultiSelect, "initProductList");
                spyOn(MonthPicker, "initMonthPicker");
            });

            describe("initialize()", function () {
                it("Site.initialize() should be called", function () {
                    PlatformWinLoss.initialize();

                    expect(Site.initialize).toHaveBeenCalled();
                });

                it("initEvent() should be call when initialize() is called", function () {
                    spyOn(PlatformWinLoss, 'initEvent');

                    PlatformWinLoss.initialize();

                    expect(PlatformWinLoss.initEvent).toHaveBeenCalled();
                });

                it("Site.addUserGuide() should be call when initialize() is called with correct params.", function () {
                    spyOn(Site, 'addUserGuide');

                    PlatformWinLoss.initialize();

                    expect(Site.addUserGuide).toHaveBeenCalledWith({
                        resourceName: "PlatformWinLoss",
                        title: Site.getSingleResource("PlatformWinLoss")
                    });
                });

                it("initSetting() should be call when initialize() is called", function () {
                    spyOn(PlatformWinLoss, 'initSetting');

                    PlatformWinLoss.initialize();

                    expect(PlatformWinLoss.initSetting).toHaveBeenCalled();
                });

                it("platforms should be assigned data", function () {
                    PlatformWinLoss.initialize();

                    expect(Site.getSingleResource).toHaveBeenCalledWith("All");
                    expect(Site.getSingleResource).toHaveBeenCalledWith("Asia");
                    expect(Site.getSingleResource).toHaveBeenCalledWith("China");
                    expect(Site.getSingleResource).toHaveBeenCalledWith("Euro");
                    expect(Site.getSingleResource).toHaveBeenCalledWith("Wap");
                    expect(Site.getSingleResource).toHaveBeenCalledWith("Mobile");
                });

                it("PlatformWinLossOption.hasCustomerComm should be assigned data from #IsAllowedCustomerCommission.", function () {
                    setFixtures('<input id="IsAllowedCustomerCommission" value="true">');

                    PlatformWinLoss.initialize();

                    expect(PlatformWinLossOption.hasCustomerComm).toBe(true);
                });
            });

            describe("PlatformWinLossOption.gridOption.onSortCol(index)", function () {
                var _sortColumn = "PlatformType";
                var data = [{ Index: 1, PlatformType: 3 }, { Index: 1, PlatformType: 2 }, { Index: 1, PlatformType: 4 }];
                var gridOption = {};

                beforeAll(function () {
                    jasmine.Ajax.install();

                    spyOn($.fn, "serializeObject").and.returnValue({
                        FromDate: "5/1/2017",
                        ToDate: "5/7/2017"
                    });

                    var grid = $("#ReportGrid");
                    spyOn(grid, "getGridParam").and.returnValue(50);
                    spyOn(Report, "ValidProducts").and.returnValue(true);
                    spyOn(Site, "blockUI");
                    spyOn(PlatformWinLossOption, "getGridOption").and.returnValue(gridOption);
                    spyOn($.fn, "jqGrid");
                    spyOn(jqGridAdditional, "setGroupCustomerWLColumns");
                    spyOn(jqGridAdditional, "addSortableHeader");
                    spyOn(Report, "renderBreadCrumb");
                    spyOn(Site, "unBlockUI");

                    jasmine.Ajax
                            .stubRequest("api/PlatformWinLossReport/Index")
                            .andReturn({
                                responseText: JSON.stringify({
                                    Data: data,
                                    ProductOptions: '[{"Code":"SB","Status":true}]'
                                })
                            });

                    PlatformWinLoss.submit(); //set value for cache data
                    PlatformWinLoss.drillDown(1, { ProductCode: "SB", PlatformType: 1 }); // set level = 1
                });

                afterAll(function () {
                    jasmine.Ajax.uninstall();
                });

                beforeEach(function () {
                    jasmine.clock().install();
                });

                afterEach(function () {
                    jasmine.clock().uninstall();
                });

                it("Site.blockUI() should be called", function () {
                    PlatformWinLossOption.gridOption.onSortCol(_sortColumn);
                    jasmine.clock().tick(101);

                    expect(Site.blockUI).toHaveBeenCalled();
                });

                it("Site.unBlockUI() should be called", function () {
                    PlatformWinLossOption.gridOption.onSortCol(_sortColumn);
                    jasmine.clock().tick(101);

                    expect(Site.unBlockUI).toHaveBeenCalled();
                });

                it("data should be sorted ascending", function () {
                    var expectedData = [
                            { Index: 1, PlatformType: 2, Id: 2 },
                            { Index: 2, PlatformType: 3, Id: 1 },
                            { Index: 3, PlatformType: 4, Id: 3 }];
                    var expectedResponse = {
                        Data: data,
                        ProductOptions: '[{"Code":"SB","Status":true}]'
                    };
                    var expectedProductOpts = [{ Code: "SB", Status: true }];
                    var level = 1;

                    PlatformWinLossOption.gridOption.onSortCol(_sortColumn);
                    jasmine.clock().tick(101);

                    //expect(PlatformWinLoss.bindData.calls.argsFor(1)).toEqual([level, expectedResponse, expectedProductOpts]);
                    expect(gridOption.datastr).toEqual(expectedData);
                });

                it("data should be sorted descending", function () {
                    var expectedData = [
                            { Index: 1, PlatformType: 4, Id: 3 },
                            { Index: 2, PlatformType: 3, Id: 1 },
                            { Index: 3, PlatformType: 2, Id: 2 }];
                    var expectedResponse = {
                        Data: data,
                        ProductOptions: '[{"Code":"SB","Status":true}]'
                    };
                    var expectedProductOpts = [{ Code: "SB", Status: true }];
                    var level = 1;

                    PlatformWinLossOption.gridOption.onSortCol(_sortColumn);
                    jasmine.clock().tick(101);

                    //expect(PlatformWinLoss.bindData.calls.argsFor(1)).toEqual([level, expectedResponse, expectedProductOpts]);
                    expect(gridOption.datastr).toEqual(expectedData);
                });
            });

            describe("initEvent()", function () {
                beforeEach(function () {
                    $("body").off();
                });

                afterEach(function () {
                    $("body").off();
                });

                it("#PlatformWinLoss.submit() should be called if submit button is clicked.", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    spyOn(PlatformWinLoss, "submit");

                    PlatformWinLoss.initEvent();
                    $('#SubmitButton').click();

                    expect(PlatformWinLoss.submit).toHaveBeenCalled();
                });

                it("#PlatformWinLoss.exportToExcel() should be called if ExportToExcel button is clicked.", function () {
                    setFixtures('<div id="ExportToExcel"></div>');
                    spyOn(PlatformWinLoss, "exportToExcel");

                    PlatformWinLoss.initEvent();
                    $('#ExportToExcel').click();

                    expect(PlatformWinLoss.exportToExcel).toHaveBeenCalled();
                });

                it("PlatformWinLoss.drillDown(level, data) should be called if .drilldown is clicked with correct param", function () {
                    setFixtures('<div class="main-content"><a class="drilldown" href="javascript:;" data-drill-down="{PlatformType:1,ProductCode:SB}">Sportsbook</a></div>');
                    spyOn(PlatformWinLoss, "drillDown");

                    PlatformWinLoss.initEvent();
                    $('.drilldown').click();

                    expect(PlatformWinLoss.drillDown).toHaveBeenCalledWith(1, '{PlatformType:1,ProductCode:SB}');
                });

                it("goBack() should be called with correct param when .level-link is clicked.", function () {
                    jasmine.Ajax.install();

                    spyOn($.fn, "serializeObject").and.returnValue({
                        FromDate: "5/1/2017",
                        ToDate: "5/7/2017"
                    });
                    spyOn(Report, "ValidProducts").and.returnValue(true);

                    jasmine.Ajax
                            .stubRequest("api/PlatformWinLossReport/Index")
                            .andReturn({
                                responseText: JSON.stringify({
                                    Data: [{ index: 1 }, { index: 2 }, { index: 4 }],
                                    ProductOptions: '[{"Code":"SB","Status":true}, {"Code":"RB","Status":false}, {"Code":"AB","Status":false}]'
                                })
                            });

                    spyOn(PlatformWinLoss, "setReportTitle");
                    spyOn(Report, "renderBreadCrumb");
                    spyOn(PlatformWinLoss, "bindData");

                    PlatformWinLoss.submit();

                    setFixtures('<div id="level-link-container"><div class="level-link" data-level="0"></div></div>');

                    PlatformWinLoss.initEvent();

                    $('.level-link').click();

                    expect(Report.renderBreadCrumb).toHaveBeenCalledWith(0);
                    expect(PlatformWinLoss.bindData).toHaveBeenCalled();

                    jasmine.Ajax.uninstall();
                });

                it("goBack() is not called when data-level in .level-link is greater than 0.", function () {
                    setFixtures('<div id="level-link-container"><div class="level-link" data-level="1"></div></div>');
                    spyOn(Report, 'renderBreadCrumb');
                    spyOn(PlatformWinLoss, 'bindData');

                    PlatformWinLoss.initEvent();
                    $('.level-link').click();

                    expect(Report.renderBreadCrumb).not.toHaveBeenCalled();
                    expect(PlatformWinLoss.bindData).not.toHaveBeenCalled();
                });

                it("PlatformWinLoss.openBetlistPopUp(onlevel, dataDrillDown) should be called if .bet-list-link is clicked.", function () {
                    setFixtures('<div class="main-content"><div class="bet-list-link"></div></div>');
                    spyOn(PlatformWinLoss, "openBetlistPopUp");

                    PlatformWinLoss.initEvent();
                    $('.bet-list-link').click();

                    expect(PlatformWinLoss.openBetlistPopUp).toHaveBeenCalled();
                });

                it("resizeGrid function should be called when window fire resize event", function () {
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "updateGridWidth");

                    PlatformWinLoss.initEvent();
                    $(window).resize();

                    expect(jqGridAdditional.updateGridHeight).toHaveBeenCalled();
                    expect(jqGridAdditional.updateGridWidth).toHaveBeenCalled();
                });

                it("off() jquery function should be called with correct parameter when window fire unload event", function () {
                    spyOn($.fn, "off");
                    PlatformWinLoss.initEvent();

                    $(window).unload();

                    expect($.fn.off).toHaveBeenCalledWith("resize");
                });
            });

            describe("submit()", function () {
                beforeAll(function () {
                    jasmine.Ajax.install();

                    var formData = {
                        DrawFilter: "1",
                        PlatformType: "0",
                        CurrencyId: "0",
                        FromDate: "5/1/2017",
                        ToDate: "5/7/2017",
                        CurrencyName: "ALL",
                        Excludetest: "True",
                        BaseCurrency: "eur"
                    };

                    jasmine.Ajax
                            .stubRequest("api/PlatformWinLossReport/Index")
                            .andReturn({
                                responseText: JSON.stringify({
                                    Data: [{ index: 1 }, { index: 2 }, { index: 4 }],
                                    ProductOptions: '[{"Code":"SB","Status":true}, {"Code":"RB","Status":false}, {"Code":"AB","Status":false}]'
                                })
                            });

                    spyOn($.fn, "serializeObject").and.returnValue(formData);
                });

                afterAll(function () {
                    jasmine.Ajax.uninstall();
                });

                beforeEach(function () {
                    spyOn(PlatformWinLoss, "setReportTitle");
                    spyOn(Report, "renderBreadCrumb");
                    spyOn(PlatformWinLoss, "bindData");
                });

                it("PlatformWinLoss.setReportTitle should be called when valid Product", function () {
                    spyOn(Report, "ValidProducts").and.returnValue(true);

                    PlatformWinLoss.submit();

                    expect(PlatformWinLoss.setReportTitle).toHaveBeenCalled();
                });

                it("Report.renderBreadCrumb should be called with correct parameter when valid Product", function () {
                    spyOn(Report, "ValidProducts").and.returnValue(true);
                    PlatformWinLoss.submit();
                    expect(Report.renderBreadCrumb).toHaveBeenCalledWith(0);
                });

                it("PlatformWinLoss.bindData should be called when valid Product", function () {
                    spyOn(Report, "ValidProducts").and.returnValue(true);

                    PlatformWinLoss.submit();

                    expect(PlatformWinLoss.bindData).toHaveBeenCalled();
                });

                it("PlatformWinLoss.setReportTitle not should be called when invalid Product", function () {
                    spyOn(Report, "ValidProducts").and.returnValue(false);

                    PlatformWinLoss.submit();

                    expect(PlatformWinLoss.setReportTitle).not.toHaveBeenCalled();
                });

                it("Report.renderBreadCrumb not should be called with correct parameter when invalid Product", function () {
                    spyOn(Report, "ValidProducts").and.returnValue(false);

                    PlatformWinLoss.submit();

                    expect(Report.renderBreadCrumb).not.toHaveBeenCalledWith(0);
                });

                it("PlatformWinLoss.bindData not should be called when invalid Product", function () {
                    spyOn(Report, "ValidProducts").and.returnValue(false);

                    PlatformWinLoss.submit();

                    expect(PlatformWinLoss.bindData).not.toHaveBeenCalled();
                });
            });

            describe("exportToExcel(level)", function () {
                var data = {
                    DrawFilter: "1",
                    PlatformType: "0",
                    CurrencyId: "0",
                    FromDate: "5/1/2017",
                    ToDate: "5/7/2017",
                    CurrencyName: "ALL",
                    Excludetest: "True",
                    BaseCurrency: "eur"
                };

                beforeAll(function () {
                    var form = $("#platformwinloss");
                    spyOn(Site, "clone").and.returnValue(data);
                    spyOn(ExcelHelper, "exportExcel");
                });

                it("ExcelHelper.exportExcel should be called with correct parameter", function () {
                    var level = 1;

                    PlatformWinLoss.exportToExcel(level);

                    expect(data.Level).toBe(level);
                    expect(data.IsExportExcel).toBe(true);
                    expect(ExcelHelper.exportExcel).toHaveBeenCalledWith(data, PlatformWinLossOption.urlExcelData);
                });
            });

            describe("bindData(level, response, productOptions)", function () {
                var gridOption = {};

                beforeEach(function () {
                    spyOn(jqGridAdditional, "clearGrid");
                    spyOn(jqGridAdditional, "setNoInfo");
                    spyOn(PlatformWinLossOption, "getGridOption").and.returnValue(gridOption);
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "updateGridWidth");
                    spyOn(jqGridAdditional, "setGroupCustomerWLColumns");
                    spyOn(jqGridAdditional, "addSortableHeader");
                });

                it("jqGridAdditional.setNoInfo should be called when empty data", function () {
                    PlatformWinLoss.bindData(0, { Data: [] }, {});

                    expect(jqGridAdditional.setNoInfo).toHaveBeenCalled();
                });

                it("jqGridAdditional.setNoInfo should not be called when has data", function () {
                    setFixtures('<table id="ReportGrid" class="table" data-hidden-column=""></table>');
                    var reportGrid = $("#ReportGrid");
                    spyOn(reportGrid, "jqGrid");

                    PlatformWinLoss.bindData(0, { Data: [{ index: 1 }] }, {});

                    expect(reportGrid.jqGrid).not.toHaveBeenCalled();
                    expect(jqGridAdditional.setNoInfo).not.toHaveBeenCalled();
                });

                it("treeGrid should be set if level is 0", function () {
                    PlatformWinLoss.bindData(0, { Data: [{ index: 1 }] }, {});

                    expect(gridOption.treeGrid).toBe(true);
                    expect(gridOption.rowNum).toBe(1);
                });

                it("treeGrid should not be set if level is 1", function () {
                    PlatformWinLoss.bindData(1, { Data: [{ index: 1 }] }, {});

                    expect(gridOption.treeGrid).toBe(false);
                    expect(gridOption.rowNum).not.toBe(-1);
                });

                it("jqGridAdditional.setGroupCustomerWLColumns should be called if hasCustomerComm is true", function () {
                    var $input = setFixtures('<input id="IsAllowedCustomerCommission" value="true">');
                    PlatformWinLoss.initialize();

                    PlatformWinLoss.bindData(1, { Data: [{ index: 1 }] }, {});

                    expect(jqGridAdditional.setGroupCustomerWLColumns).toHaveBeenCalled();
                });

                it("jqGridAdditional.setGroupCustomerWLColumns should not be called if hasCustomerComm is false", function () {
                    var $input = setFixtures('<input id="IsAllowedCustomerCommission" value="false">');
                    PlatformWinLoss.initialize();

                    PlatformWinLoss.bindData(1, { Data: [{ index: 1 }] }, {});

                    expect(jqGridAdditional.setGroupCustomerWLColumns).not.toHaveBeenCalled();
                });

                it("jqGridAdditional.addSortableHeader should not be called if level is 0", function () {
                    PlatformWinLoss.bindData(0, { Data: [{ index: 1 }] }, {});

                    expect(jqGridAdditional.addSortableHeader).not.toHaveBeenCalled();
                });

                it("jqGridAdditional.addSortableHeader should be called if level is 1", function () {
                    jasmine.Ajax.install();
                    jasmine.clock().install();

                    var _sortColumn = "PlatformType";
                    var data = [{ Index: 1, PlatformType: 3 }, { Index: 1, PlatformType: 2 }, { Index: 1, PlatformType: 4 }];
                    spyOn($.fn, "serializeObject").and.returnValue({
                        FromDate: "5/1/2017",
                        ToDate: "5/7/2017"
                    });

                    var grid = $("#ReportGrid");
                    spyOn(grid, "getGridParam").and.returnValue(50);
                    spyOn(Report, "ValidProducts").and.returnValue(true);
                    spyOn(Site, "blockUI");
                    spyOn(PlatformWinLoss, "setReportTitle");
                    spyOn(Report, "renderBreadCrumb");
                    spyOn(Site, "unBlockUI");

                    jasmine.Ajax
                            .stubRequest("api/PlatformWinLossReport/Index")
                            .andReturn({
                                responseText: JSON.stringify({
                                    Data: data,
                                    ProductOptions: '[{"Code":"SB","Status":true}]'
                                })
                            });

                    PlatformWinLoss.submit();
                    PlatformWinLoss.drillDown(1, { PlatformType: 0 });
                    PlatformWinLossOption.gridOption.onSortCol(_sortColumn);
                    jasmine.clock().tick(101);

                    expect(jqGridAdditional.addSortableHeader).toHaveBeenCalled();

                    jasmine.Ajax.uninstall();
                    jasmine.clock().uninstall();
                });
            });

            describe("PlatformWinLossOption.gridOption.onPaging(pgButton)", function () {
                beforeAll(function () {
                    spyOn(PlatformWinLossOption, "getGridOption").and.callFake(function (level, productOptoins) {
                        return PlatformWinLossOption.gridOption;
                    });
                    spyOn(jqGridAdditional, "clearGrid");
                    spyOn(jqGridAdditional, "gridComplete");
                    spyOn(PlatformWinLoss, "bindTotal");
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "addSortableHeader");
                });

                it("return top if numOfRow less than PlatformWinLossOption.pageSize", function () {
                    var data = [{ Index: 1, PlatformType: 3 }, { Index: 1, PlatformType: 2 }, { Index: 1, PlatformType: 4 }];

                    PlatformWinLoss.bindData(0, { Data: data }, {});
                    var returnData = PlatformWinLossOption.gridOption.onPaging("pager");

                    expect(returnData).toBe("stop");
                });

                it("Site.blockUI should be called if numOfRow greater than PlatformWinLossOption.pageSize and pgButton is not disabled", function () {
                    setFixtures('<div id="pager"></div>');
                    spyOn(Site, "blockUI");
                    var data = [];
                    for (var i = 0; i < 51; i++) {
                        data.push({ Index: i, PlatformType: i })
                    }

                    PlatformWinLoss.bindData(0, { Data: data }, {});
                    PlatformWinLossOption.gridOption.onPaging("pager");

                    expect(Site.blockUI).toHaveBeenCalled();
                });

                it("Site.blockUI should not be called if numOfRow greater than PlatformWinLossOption.pageSize and pgButton is disabled", function () {
                    setFixtures('<div id="pager" class="ui-state-disabled"></div>');
                    spyOn(Site, "blockUI");
                    var data = [];
                    for (var i = 0; i < 51; i++) {
                        data.push({ Index: i, PlatformType: i })
                    }

                    PlatformWinLoss.bindData(0, { Data: data }, {});
                    PlatformWinLossOption.gridOption.onPaging("pager");

                    expect(Site.blockUI).not.toHaveBeenCalled();
                });
            });

            describe("PlatformWinLossOption.gridOption.gridComplete()", function () {
                beforeAll(function () {
                    spyOn(PlatformWinLossOption, "getGridOption").and.callFake(function (level, productOptoins) {
                        return PlatformWinLossOption.gridOption;
                    });
                    spyOn(jqGridAdditional, "clearGrid");
                    spyOn(jqGridAdditional, "gridComplete");
                    spyOn(PlatformWinLoss, "bindTotal");
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "addSortableHeader");
                });

                it("#pg_ppdata should be hide if level is 0 or numOfRow < PlatformWinLossOption.pageSize", function () {
                    setFixtures('<div id="pg_ppdata"></div>');
                    var data = [{ Index: 1, PlatformType: 3 }, { Index: 1, PlatformType: 2 }, { Index: 1, PlatformType: 4 }];

                    PlatformWinLoss.bindData(0, { Data: data }, {});
                    PlatformWinLossOption.gridOption.gridComplete();

                    expect($("#pg_ppdata").is(":hidden")).toBe(true);
                });

                it("#pg_ppdata should be show if level is 1 and numOfRow > PlatformWinLossOption.pageSize", function () {
                    setFixtures('<div id="pg_ppdata"></div>');
                    var data = [];
                    for (var i = 0; i < 51; i++) {
                        data.push({ Index: i, PlatformType: i })
                    }

                    PlatformWinLoss.bindData(1, { Data: data }, {});
                    PlatformWinLossOption.gridOption.gridComplete();

                    expect($("#pg_ppdata").is(":hidden")).toBe(false);
                });

                it(".ui-jqgrid-ftable html should be set by #footer html", function () {
                    setFixtures('<div class="ui-jqgrid-ftable"></div><div id="footer">footer</div>');
                    var data = [];
                    for (var i = 0; i < 51; i++) {
                        data.push({ Index: i, PlatformType: i })
                    }

                    PlatformWinLoss.bindData(1, { Data: data }, {});
                    PlatformWinLossOption.gridOption.onPaging("pager");
                    PlatformWinLossOption.gridOption.gridComplete();

                    expect($(".ui-jqgrid-ftable").text()).toBe("footer");
                });

                it("columnheader should be removed ui-jqgrid-sortable if level is 0", function () {
                    setFixtures('<th role="columnheader"><div class="ui-jqgrid-sortable"></div></th>');

                    PlatformWinLoss.bindData(0, { Data: [{ Index: 1 }] }, {});
                    PlatformWinLossOption.gridOption.gridComplete();

                    expect($("th[role='columnheader']").find("div").hasClass("ui-jqgrid-sortable")).toBe(false);
                });

                it("columnheader should not be removed ui-jqgrid-sortable if level is 1", function () {
                    setFixtures('<th role="columnheader"><div class="ui-jqgrid-sortable"></div></th>');

                    PlatformWinLoss.bindData(1, { Data: [{ Index: 1 }] }, {});
                    PlatformWinLossOption.gridOption.gridComplete();

                    expect($("th[role='columnheader']").find("div").hasClass("ui-jqgrid-sortable")).toBe(true);
                });
            });

            describe("bindTotal(level, totalData, summaryTotal)", function () {
                var columnModel = [{ index: "index", name: "index" }];
                beforeAll(function () {
                    jasmine.Ajax.install();

                    spyOn($.fn, "serializeObject").and.returnValue({
                        FromDate: "5/1/2017",
                        ToDate: "5/7/2017"
                    });
                    spyOn(Report, "ValidProducts").and.returnValue(true);

                    jasmine.Ajax
                            .stubRequest("api/PlatformWinLossReport/Index")
                            .andReturn({
                                responseText: JSON.stringify({
                                    Data: [{ index: 1 }, { index: 2 }, { index: 4 }],
                                    ProductOptions: '[{"Code":"SB","Status":true}, {"Code":"RB","Status":false}, {"Code":"AB","Status":false}]'
                                })
                            });

                    spyOn(PlatformWinLoss, "setReportTitle");
                    spyOn(Report, "renderBreadCrumb");
                    spyOn(PlatformWinLoss, "bindData");

                    spyOn(QueryString, "setParams");
                    spyOn(Site, "setProductOptionParam");
                    spyOn(Popup, "openPopupWithIframe");

                    PlatformWinLoss.submit();
                    PlatformWinLoss.drillDown(1, { PlatformType: "0" });

                    spyOn(PlatformWinLossOption, "getColModel").and.returnValue(columnModel);
                    spyOn(jqGridAdditional, "assignTotal");
                    spyOn(jqGridAdditional, "setGroupFooters")
                });

                afterAll(function () {
                    jasmine.Ajax.uninstall();
                });

                it("assignTotal should be called with correct parameter if level is 0", function () {
                    var totalData = [{ index: 1 }];

                    PlatformWinLoss.bindTotal(0, totalData);

                    expect(jqGridAdditional.assignTotal).toHaveBeenCalledWith(totalData, columnModel);
                    expect(jqGridAdditional.setGroupFooters).toHaveBeenCalledWith(1);
                });

                it("bindSummaryTotal should be called with correct parameter if level is 1", function () {
                    spyOn(Report, "bindSummaryTotal");
                    var summaryTotal = [{ index: 1 }];

                    PlatformWinLoss.bindTotal(1, {}, summaryTotal);

                    expect(Report.bindSummaryTotal).toHaveBeenCalledWith(columnModel, summaryTotal);
                });
            });

            describe("setReportTitle(data)", function () {
                var data = {
                    CurrencyId: "0",
                    PlatformType: "0",
                    ProductOptions: [{ Code: "SB", Status: true }],
                    FromDate: "05/01/2017",
                    ToDate: "05/07/2017"
                };

                beforeAll(function () {
                    spyOn(PlatformWinLoss, "initEvent");
                    spyOn(PlatformWinLoss, "initSetting");

                    PlatformWinLoss.initialize();
                });

                beforeEach(function () {
                    setFixtures('<div class="test-block"></div>')
                    $('.test-block').append("<div class='report-title'></div>");
                    $('.test-block').append("<div class='panel-heading hide'></div>");
                });

                it("Set title with all currency", function () {
                    $('.test-block').append("<select id='CurrencyId'><option value='0'>ALL</option></select>");
                    var expectedCurrency = "AllCurrencies";

                    PlatformWinLoss.setReportTitle(data);

                    var title = $(".report-title").text();
                    expect(title).toContain(expectedCurrency);
                });

                it("class 'hide' should be removed in .panel-heading", function () {
                    PlatformWinLoss.setReportTitle(data);

                    var hasClass = $(".panel-heading").hasClass("hide");
                    expect(hasClass).toBe(false);
                });

                it("Set title with specific currency", function () {
                    $('.test-block').append("<select id='CurrencyId'><option value='9'>AUD</option></select>");
                    var expectedCurrency = "AUD";
                    data.CurrencyId = 9;

                    PlatformWinLoss.setReportTitle(data);

                    var title = $(".report-title").html();
                    expect(title).toContain(expectedCurrency);
                });

                it("Set title with valid base currency", function () {
                    $('.test-block').append("<select id='CurrencyId'><option value='9'>AUD</option></select>");
                    $('.test-block').append('<select id="BaseCurrency"><option value="usd" selected="selected">EUR</option></select>');
                    var expectedCurrency = "USD";

                    PlatformWinLoss.setReportTitle(data);

                    var title = $(".report-title").html();
                    expect(title).toContain(expectedCurrency);
                });

                it("Set title with invalid base currency", function () {
                    $('.test-block').append("<select id='CurrencyId'><option value='9'>AUD</option></select>");
                    $('.test-block').append('<select id="BaseCurrency"><option value="" selected="">AUD</option></select>');
                    var expectedCurrency = "AUD";

                    PlatformWinLoss.setReportTitle(data);
                    var title = $(".report-title").html();

                    expect(title).toContain(expectedCurrency);
                });

                it("Set title with one product", function () {
                    data.ProductOptions = [{ Code: "SB", Status: true }];
                    var expectedCurrency = "SB";

                    PlatformWinLoss.setReportTitle(data);

                    var title = $(".report-title").html();
                    expect(title).toContain(expectedCurrency);
                });

                it("Set title with more than one product", function () {
                    data.ProductOptions = [{ Code: "SB", Status: true }, { Code: "BA", Status: true }, { Code: "RB", Status: false }];
                    var expectedCurrency = "SB, BA";

                    PlatformWinLoss.setReportTitle(data);

                    var title = $(".report-title").html();
                    expect(title).toContain(expectedCurrency);
                });

                it("Set title with all products", function () {
                    data.ProductOptions = [{ Code: "SB", Status: true }, { Code: "BA", Status: true }, { Code: "RB", Status: true }];
                    var expectedCurrency = "Product: All";

                    PlatformWinLoss.setReportTitle(data);

                    var title = $(".report-title").html();
                    expect(title).toContain(expectedCurrency);
                });
            });

            describe("drillDown(level, data)", function () {
                var drillDownData = { PlatformType: 0 };
                beforeAll(function () {
                    jasmine.Ajax.install();

                    var data = [{ index: 1 }, { index: 2 }, { index: 4 }];
                    spyOn(Report, "ValidProducts").and.returnValue(true);

                    jasmine.Ajax
                            .stubRequest("api/PlatformWinLossReport/Index")
                            .andReturn({
                                responseText: JSON.stringify({
                                    Data: data,
                                    ProductOptions: '[{"Code":"SB","Status":true}, {"Code":"RB","Status":false}]',
                                    FromDate: "05/01/2017",
                                    ToDate: "05/07/2017"
                                })
                            });

                    spyOn(PlatformWinLoss, "setReportTitle");
                    spyOn(Report, "renderBreadCrumb");
                    spyOn(PlatformWinLoss, "bindData");

                    PlatformWinLoss.submit();
                });

                afterAll(function () {
                    jasmine.Ajax.uninstall();
                });

                it("Drill down from parent", function () {
                    spyOn(Site, "clone").and.returnValue(drillDownData);

                    PlatformWinLoss.drillDown(1, drillDownData);

                    expect(drillDownData.ProductOptions).toEqual([{ Code: "SB", Status: true }, { Code: "RB", Status: false }]);
                });

                it("Drill down from leaf", function () {
                    drillDownData.ProductCode = "SB";
                    spyOn(Site, "clone").and.returnValue(drillDownData);

                    PlatformWinLoss.drillDown(1, drillDownData);

                    expect(drillDownData.ProductOptions).toEqual([{ Code: "SB", Status: true }]);
                });
            });

            describe("openBetlistPopUp(onlevel, dataDrillDown)", function () {
                var param = {};
                var dataDrillDown = {
                    CustomerId: 1,
                    SystemId: 2,
                    ExternalId: 3,
                    DrillDownCurrencyId: 4,
                    DrillDownCurrencyName: "usd"
                };

                beforeAll(function () {
                    jasmine.Ajax.install();

                    spyOn($.fn, "serializeObject").and.returnValue({
                        FromDate: "5/1/2017",
                        ToDate: "5/7/2017",
                        IsExcludedTestData: false,
                        DrawFilter: 0,
                        BaseCurrency: "usd"
                    });
                    spyOn(Report, "ValidProducts").and.returnValue(true);

                    jasmine.Ajax
                            .stubRequest("api/PlatformWinLossReport/Index")
                            .andReturn({
                                responseText: JSON.stringify({
                                    Data: [{ index: 1 }, { index: 2 }, { index: 4 }],
                                    ProductOptions: '[{"Code":"SB","Status":true}, {"Code":"RB","Status":false}, {"Code":"AB","Status":true}, {"Code":"PP","Status":true}]'
                                })
                            });

                    spyOn(PlatformWinLoss, "setReportTitle");
                    spyOn(Report, "renderBreadCrumb");
                    spyOn(PlatformWinLoss, "bindData");

                    spyOn(QueryString, "setParams");
                    spyOn(Site, "setProductOptionParam");
                    spyOn(Popup, "openPopupWithIframe");
                    spyOn(Site, "setProductCodeListParam");

                    PlatformWinLoss.submit();
                    PlatformWinLoss.drillDown(1, { PlatformType: 0 });
                });

                afterAll(function () {
                    jasmine.Ajax.uninstall();
                });

                beforeEach(function () {
                    spyOn(Site, "clone").and.returnValue(param);
                });

                it("QueryString.setParams should be called with correct parameters", function () {
                    var expectedParam = {
                        FromDate: "5/1/2017",
                        ToDate: "5/7/2017",
                        PlatformType: 0,
                        ExcludeTest: false,
                        CurrencyId: dataDrillDown.DrillDownCurrencyId,
                        CurrencyName: dataDrillDown.DrillDownCurrencyName,
                        DrawFilter: 0,
                        CustId: dataDrillDown.CustomerId,
                        SystemId: dataDrillDown.SystemId,
                        ExternalId: dataDrillDown.ExternalId,
                        BaseCurrency: "usd"
                    };

                    PlatformWinLoss.openBetlistPopUp(1, dataDrillDown);

                    expect(QueryString.setParams).toHaveBeenCalledWith("PlatformWinLossBetList/Index", expectedParam);
                });

                it("Site.setProductOptionParam should not be called with code included in BETLIST_IGNORED_PRODUCTS", function () {
                    PlatformWinLoss.openBetlistPopUp(1, dataDrillDown);

                    var expectedProductCode = ["SB"];

                    expect(Site.setProductCodeListParam.calls.mostRecent().args[1]).toEqual(expectedProductCode);
                });

                it("Popup.openPopupWithIframe should be called", function () {
                    PlatformWinLoss.openBetlistPopUp(1, dataDrillDown);

                    expect(Popup.openPopupWithIframe).toHaveBeenCalled();
                });
            });
        });
    }
);