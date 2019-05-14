define([
        "jquery",
        "common/site",
        "pages/report/report",
        "pages/report/activecustomersummary/activecustomersummary",
        "pages/report/activecustomersummary/activecustomersummary.option",
        "components/pluginhelper/daterangepicker",
        "components/pluginhelper/multiselect",
        "helpers/daterange",
        "lib/jqgrid/jquery.jqgrid.additional"],
    function ($, Site, Report, ActiveCustomerSummary, ActiveCustomerOption, DatePicker, MultiSelect, DateHelper, jqGridAdditional) {
        describe("ActiveCustomerSummary", function () {
            beforeAll(function () {
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                    return url;
                });
                spyOn(Site, "initialize");
                spyOn(Site, "addUserGuide");
                spyOn(Site, "getSingleResource").and.callFake(function (str) {
                    return str;
                });
                spyOn(MultiSelect, "initProductList");
                spyOn(DatePicker, "initDateRangePicker");
                spyOn(DateHelper, "setConstraintMonthRange");
                spyOn(Site, "blockUI");
                spyOn(Site, "unBlockUI");
            });

            describe("initialize()", function () {
                it("all initial methods should be called", function () {
                    spyOn(ActiveCustomerSummary, "initEvent");

                    ActiveCustomerSummary.initialize();

                    expect(Site.initialize).toHaveBeenCalled();
                    expect(Site.addUserGuide).toHaveBeenCalled();
                    expect(MultiSelect.initProductList).toHaveBeenCalled();
                    expect(DatePicker.initDateRangePicker).toHaveBeenCalled();
                    expect(DateHelper.setConstraintMonthRange).toHaveBeenCalled();
                    expect(ActiveCustomerSummary.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                beforeEach(function () {
                    $("body").off();
                });

                afterEach(function () {
                    $("body").off();
                });

                it("ActiveCustomerSummary.submit() should be called if submit button is clicked", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    spyOn(ActiveCustomerSummary, "submit");
                    spyOn(Report, "ValidProducts").and.returnValues(true);

                    ActiveCustomerSummary.initEvent();
                    $('#SubmitButton').click();

                    expect(ActiveCustomerSummary.submit).toHaveBeenCalled();
                });

                it("ActiveCustomerSummary.submit() should not be called if submit button is clicked with no product selected", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    spyOn(ActiveCustomerSummary, "submit");
                    spyOn(Report, "ValidProducts").and.returnValues(false);

                    ActiveCustomerSummary.initEvent();
                    $('#SubmitButton').click();

                    expect(ActiveCustomerSummary.submit).not.toHaveBeenCalled();
                });

                it("Main form should be submitted if ExportToExcel button is clicked", function () {
                    setFixtures('<form id="mainform">'
                        + '<input type="hidden" id="IsExportExcel" />'
                        + '<button id="ExportToExcel"></button>'
                        + '</form>');
                    var spyEvent = spyOnEvent($('#mainform'), 'submit');
                    spyOn(Report, "ValidProducts").and.returnValues(true);
                    $('#mainform').submit(function () { return false; });

                    ActiveCustomerSummary.initEvent();
                    $('#ExportToExcel').click();

                    expect(spyEvent).toHaveBeenTriggered();
                });

                it("Main form should not be submitted if ExportToExcel button is clicked with no product selected", function () {
                    setFixtures('<form id="mainform">'
                        + '<input type="hidden" id="IsExportExcel" />'
                        + '<button id="ExportToExcel"></button>'
                        + '</form>');
                    var spyEvent = spyOnEvent($('#mainform'), 'submit');
                    spyOn(Report, "ValidProducts").and.returnValues(false);
                    $('#mainform').submit(function () { return false; });

                    ActiveCustomerSummary.initEvent();
                    $('#ExportToExcel').click();

                    expect(spyEvent).not.toHaveBeenTriggered();
                });

                it("off() jquery function should be called with correct parameter when window fire unload event", function () {
                    spyOn($.fn, "off");
                    ActiveCustomerSummary.initEvent();

                    $(window).unload();

                    expect($.fn.off).toHaveBeenCalledWith("resize");
                });

                it("resizeGrid function should be called when window fire resize event", function () {
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "updateGridWidth");

                    ActiveCustomerSummary.initEvent();
                    $(window).resize();

                    expect(jqGridAdditional.updateGridHeight).toHaveBeenCalled();
                    expect(jqGridAdditional.updateGridWidth).toHaveBeenCalled();
                });
            });

            describe("setReportTitle(currencyId, fromdate, todate)", function () {
                it("title should be updated correctly after calling ajax successfully", function () {
                    setFixtures('<div class="panel-heading hide">'
                        + '<div class="report-title"></div>'
                        + '</div>');
                    var expectedTitle = "ActiveCustomerSummary, 01/01/2011 → 01/11/2011 - 1";
                    spyOn(Report, "getCurrencyNameForReportTitle").and.callFake(function (currencyId) {
                        return currencyId;
                    });

                    ActiveCustomerSummary.setReportTitle(1, "01/01/2011", "01/11/2011");

                    expect($(".report-title").html()).toEqual(expectedTitle);
                    expect($(".panel-heading").hasClass("hide")).toBe(false);
                });
            });

            describe("submit()", function () {
                var ajaxObj = jasmine.createSpyObj("ajaxObj", ["abort"]);
                var ajaxOpt;

                beforeAll(function () {
                    spyOn($, "ajax").and.callFake(function (option) {
                        option.beforeSend();
                        option.complete();

                        ajaxOpt = option;
                        return ajaxObj;
                    });
                });

                beforeEach(function () {
                    setFixtures('<form id="mainform">'
                                + '</form>');

                    spyOn(ActiveCustomerSummary, "bindData");
                    spyOn(ActiveCustomerSummary, "setReportTitle");
                });

                it("ActiveCustomerSummary.bindData should be called after calling ajax successfully", function () {
                    ActiveCustomerSummary.submit();

                    ajaxOpt.success();

                    expect(ActiveCustomerSummary.bindData).toHaveBeenCalled();
                });

                it("ActiveCustomerSummary.setReportTitle should be called after calling ajax successfully", function () {
                    ActiveCustomerSummary.submit();

                    ajaxOpt.success();

                    expect(ActiveCustomerSummary.setReportTitle).toHaveBeenCalled();
                });

                it("ActiveCustomerSummary.bindData should not be called after calling ajax successfully if response is null", function () {
                    ActiveCustomerSummary.submit();

                    ajaxOpt.success(null);

                    expect(ActiveCustomerSummary.bindData).not.toHaveBeenCalled();
                });

                it("ajaxRequest.abort() should be called if ajaxRequest is not null", function () {
                    ActiveCustomerSummary.submit();

                    expect(ajaxObj.abort).toHaveBeenCalled();
                });
            });

            describe("bindData(response)", function () {
                var gridOption = {
                    colModel: {},
                    pager: "#ppdata"
                };

                beforeAll(function () {
                    spyOn(jqGridAdditional, "clearGrid");
                    spyOn(jqGridAdditional, "setNoInfo");
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "updateGridWidth");
                    spyOn(ActiveCustomerOption, "getGridOption").and.callFake(function () {
                        return gridOption;
                    });
                });

                beforeEach(function () {
                    spyOn($.fn, "jqGrid");
                });

                it("jqGridAdditional.clearGrid should be called", function () {
                    ActiveCustomerSummary.bindData({ Data: [], ProductOptions: "{}" });

                    expect(jqGridAdditional.clearGrid).toHaveBeenCalled();
                });

                it("jqGridAdditional.setNoInfo should be called if response data is empty", function () {
                    ActiveCustomerSummary.bindData({ Data: [], ProductOptions: "{}" });

                    expect(jqGridAdditional.setNoInfo).toHaveBeenCalled();
                });

                it("grid should be rendered if response data is not empty", function () {
                    ActiveCustomerSummary.bindData({ Data: [1], ProductOptions: "{}" });

                    expect($.fn.jqGrid).toHaveBeenCalled();
                });

                it("pager should not be shown if total data is not greater than number rows of a page", function () {
                    setFixtures("<div id='ppdata'></div>");
                    ActiveCustomerOption.pageSize = 10;

                    ActiveCustomerSummary.bindData({ Data: [1, 2, 3, 4, 5], ProductOptions: "{}" });

                    expect($("#ppdata").is(":hidden")).toBe(true);
                });

                it("pager should be shown if total data is greater than number rows of a page", function () {
                    setFixtures("<div id='ppdata' style='display:none'></div>");
                    ActiveCustomerOption.pageSize = 2;

                    ActiveCustomerSummary.bindData({ Data: [1, 2, 3, 4, 5], ProductOptions: "{}" });

                    expect($("#ppdata").is(":hidden")).toBe(false);
                });

                describe("gridOption.onSortCol(index, columnIndex, sortOrder)", function () {
                    it("sortOrder and sortColumnName should be updated", function () {
                        gridOption.onSortCol("column1.", 0, "asc");

                        var data = ActiveCustomerSummary.getSubmitData();

                        expect(data.sortBy).toBe("column1");
                        expect(data.sortOrder).toBe("asc");
                    });
                });

                describe("gridOption.onPaging()", function () {
                    it("should be disabled paging if total data is not greater than number rows of a page", function () {
                        ActiveCustomerOption.pageSize = 50;

                        ActiveCustomerSummary.bindData({ Data: [1], ProductOptions: "{}" });

                        var result = gridOption.onPaging();

                        expect(result).toBe("stop");
                    });

                    it("should not be disabled paging if total data is not greater than number rows of a page", function () {
                        ActiveCustomerOption.pageSize = 2;

                        ActiveCustomerSummary.bindData({ Data: [1, 2, 3, 4, 5], ProductOptions: "{}" });

                        var result = gridOption.onPaging();

                        expect(result).not.toBe("stop");
                    });
                });

                describe("gridOption.gridComplete()", function () {
                    beforeEach(function () {
                        spyOn(jqGridAdditional, "gridComplete");
                        spyOn(jqGridAdditional, "addSortableHeaders");
                        spyOn(ActiveCustomerSummary, "bindTotal");
                        spyOn(ActiveCustomerOption, "setGroupHeaderColumns");
                        spyOn(jqGridAdditional, "updateSortableHeader");
                    });

                    it("jqGridAdditional.gridComplete should be called if grid is loaded at the first time(_onSorting and _onPaging are false)", function () {
                        ActiveCustomerSummary.bindData({ Data: [], ProductOptions: "{}" });

                        gridOption.gridComplete();

                        expect(jqGridAdditional.gridComplete).toHaveBeenCalled();
                    });

                    it("jqGridAdditional.updateSortableHeader should be called if grid is sorted", function () {
                        ActiveCustomerOption.pageSize = 2;
                        ActiveCustomerSummary.bindData({ Data: [1, 2, 3, 4, 5], ProductOptions: "{}" });
                        gridOption.onPaging();

                        gridOption.onSortCol("column1.", 0, "asc");

                        gridOption.gridComplete();

                        expect(jqGridAdditional.updateSortableHeader).toHaveBeenCalled();
                    });
                });
            });

            describe("bindTotal(grantTotalCustomer, colspan)", function () {
                it("updates total row with correct text", function () {
                    setFixtures('<div class="ui-jqgrid-ftable"><table>'
                        + '<tr></tr>'
                        + '<tr>'
                        + '<td></td>'
                        + '<td></td>'
                        + '</tr>'
                        + '</table></div>');
                    spyOn(jqGridAdditional, "formatInteger").and.callFake(function (number) {
                        return number;
                    });
                    var expectedText = "TotalActiveCustomer = 1";

                    ActiveCustomerSummary.bindTotal(1, 2);

                    expect($("td").html()).toBe(expectedText);
                    expect($("td").length).toBe(1);
                    expect($("td").prop("colSpan")).toBe(2);
                });
            });
        });
    });