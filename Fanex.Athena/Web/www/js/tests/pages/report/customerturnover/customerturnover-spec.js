define([
    "jquery",
    "common/site",
    "lib/jqgrid/jquery.jqgrid.additional",
    "pages/report/customerturnover/customerturnover",
    "pages/report/customerturnover/customerturnover.option",
    "components/pluginhelper/autocomplete",
    "components/pluginhelper/daterangepicker",
    "helpers/daterange",
    "components/paging",
    "lib/jquery.multiselect.nlevel"],
    function ($, Site, jqGridAdditional, CustomerTurnover, CustomerTurnoverOption, AutoComplete, DatePicker, DateHelper, PagingHelper) {
        describe("CustomerTurnover", function () {
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
                    spyOn(CustomerTurnover, "initEvent");
                    spyOn(CustomerTurnover, "initSetting");
                    spyOn(CustomerTurnover, "initAutoComplete");
                    spyOn(CustomerTurnover, "initTicketFilter");
                    spyOn(CustomerTurnover, "initProductTree");

                    CustomerTurnover.initialize();

                    expect(Site.initialize).toHaveBeenCalled();
                    expect(Site.addUserGuide).toHaveBeenCalled();
                    expect(DatePicker.initDateRangePicker).toHaveBeenCalled();
                    expect(CustomerTurnover.initEvent).toHaveBeenCalled();
                    expect(CustomerTurnover.initSetting).toHaveBeenCalled();
                    expect(CustomerTurnover.initAutoComplete).toHaveBeenCalled();
                    expect(CustomerTurnover.initTicketFilter).toHaveBeenCalled();
                    expect(CustomerTurnover.initProductTree).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                beforeEach(function () {
                    $("body").off();
                });

                afterEach(function () {
                    $("body").off();
                });

                it("CustomerTurnover.submit() should be called if submit button is clicked", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    spyOn(CustomerTurnover, "checkValidFilter").and.returnValues(true);
                    spyOn(CustomerTurnover, "submit");

                    CustomerTurnover.initEvent();
                    $('#SubmitButton').click();

                    expect(CustomerTurnover.submit).toHaveBeenCalled();
                });

                it("CustomerTurnover.submit() should not be called if submit button is clicked with invalid filter", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    spyOn(CustomerTurnover, "checkValidFilter").and.returnValues(false);
                    spyOn(CustomerTurnover, "submit");

                    CustomerTurnover.initEvent();
                    $('#SubmitButton').click();

                    expect(CustomerTurnover.submit).not.toHaveBeenCalled();
                });

                it("CustomerTurnover.exportToExcel() should be called if excel button is clicked", function () {
                    setFixtures('<div id="ExportToExcel"></div>');
                    spyOn(CustomerTurnover, "exportToExcel");

                    CustomerTurnover.initEvent();
                    $('#ExportToExcel').click();

                    expect(CustomerTurnover.exportToExcel).toHaveBeenCalled();
                });

                it("off() jquery function should be called with correct parameter when window fire unload event", function () {
                    spyOn($.fn, "off");
                    CustomerTurnover.initEvent();

                    $(window).unload();

                    expect($.fn.off).toHaveBeenCalledWith("resize");
                });

                it("resizeGrid function should be called when window fire resize event", function () {
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "updateGridWidth");

                    CustomerTurnover.initEvent();
                    $(window).resize();

                    expect(jqGridAdditional.updateGridHeight).toHaveBeenCalled();
                    expect(jqGridAdditional.updateGridWidth).toHaveBeenCalled();
                });

                describe("Odds.keypress(event)", function () {
                    it("preventDefault() should be called if key code is not number or control key", function () {
                        setFixtures('<input id="Odds" type="text"></input>');
                        CustomerTurnover.initEvent();

                        var event = jQuery.Event("keypress", { which: 7 });
                        $("#Odds").trigger(event);

                        expect(event.isDefaultPrevented()).toBe(true);
                    });

                    it("preventDefault() should not be called if key code is control key", function () {
                        setFixtures('<input id="Odds" type="text"></input>');
                        CustomerTurnover.initEvent();

                        var event = jQuery.Event("keypress", { which: 8 });
                        $("#Odds").trigger(event);

                        expect(event.isDefaultPrevented()).toBe(false);
                    });

                    it("preventDefault() should not be called if key code is number key", function () {
                        setFixtures('<input id="Odds" type="text"></input>');
                        CustomerTurnover.initEvent();

                        var event = jQuery.Event("keypress", { which: 48 });
                        $("#Odds").trigger(event);

                        expect(event.isDefaultPrevented()).toBe(false);
                    });
                });
            });

            describe("initSetting()", function () {
                it("initials state for CustomerTurnoverOption", function () {
                    setFixtures('<input id="IsAllowedCustomerCommission" type="text" value="False"></input>');

                    CustomerTurnover.initSetting();

                    expect(CustomerTurnoverOption.hasCustomerComm).toBe(false);
                });
            });

            describe("initTicketFilter()", function () {
                beforeEach(function () {
                    setFixtures('<div id="TickerFilter">'
                        + '<input type="checkbox"></input>'
                        + '<input type="checkbox"></input>'
                        + '</div>');

                    spyOn($.fn, "checkboxgroup");

                    CustomerTurnover.initTicketFilter();
                });

                it("$.fn.checkboxgroup() should be called", function () {
                    expect($.fn.checkboxgroup).toHaveBeenCalled();
                });

                it("CustomerTurnover.checkValidFilter() should be called if ticker filter is changed", function () {
                    spyOn(CustomerTurnover, "checkValidFilter");

                    $("#TickerFilter input[type=checkbox]").eq(0).trigger("click");

                    expect(CustomerTurnover.checkValidFilter).toHaveBeenCalled();
                });
            });

            describe("initProductTree()", function () {
                var productTreeOption = {}, betTypeSelectOption = {};
                var initProductTree;

                beforeAll(function () {
                    spyOn($, "getJSON").and.callFake(function (url, callback) {
                        initProductTree = callback;
                    });

                    spyOn(CustomerTurnover, "checkValidFilter");

                    CustomerTurnover.initProductTree();
                });

                it("product tree and bet type multiselect should be rendered", function () {
                    spyOn($.fn, "multiSelect").and.callFake(function (option) {
                        if (this.selector === "#grid-products-multiselect") {
                            productTreeOption = option;
                        }
                        else {
                            betTypeSelectOption = option;
                        }
                    });

                    initProductTree([]);

                    expect(productTreeOption).not.toBe(undefined);
                    expect(betTypeSelectOption).not.toBe(undefined);
                });

                describe("renderProductTree()", function () {
                    var ajaxObj = jasmine.createSpyObj("ajaxObj", ["abort"]);

                    beforeAll(function () {
                        betTypeSelectOption = null;

                        spyOn($, "ajax").and.callFake(function (option) {
                            option.success([]);

                            return ajaxObj;
                        });

                        spyOn($.fn, "multiSelect").and.callFake(function (option) {
                            if (option === "getCheckedItems") {
                                return ["2-3", "0-0"];
                            }

                            if (this.selector === "#grid-products-multiselect") {
                                productTreeOption = option;
                            }
                            else {
                                betTypeSelectOption = option;
                            }
                        });

                        var productData = [{
                            ParentId: -1,
                            ID: 1,
                            Name: "Parent",
                            Checked: true,
                        }, {
                            ParentId: 1,
                            ID: 2,
                            Name: "Child1",
                            Checked: true,
                        }, {
                            ParentId: 1,
                            ID: 3,
                            Name: "Child2",
                            Checked: true,
                        }];

                        initProductTree(productData);
                    });

                    it("should be renderd with correct data structure", function () {
                        var expectedData = [{
                            Id: "0",
                            Value: "-1-1",
                            Text: "Parent",
                            Checked: true,
                            ParrentId: -1,
                            Enable: true,
                            Css: "",
                            CssClass: "",
                            Items: [{
                                Id: "0-0",
                                Value: "1-2",
                                Text: "Child1",
                                ParrentId: 1,
                                Checked: true,
                                Enable: true,
                                Css: "",
                                CssClass: "",
                                GroupName: "Parent"
                            }, {
                                Id: "0-1",
                                Value: "1-3",
                                Text: "Child2",
                                ParrentId: 1,
                                Checked: true,
                                Enable: true,
                                Css: "",
                                CssClass: "",
                                GroupName: "Parent"
                            }
                            ]
                        }];

                        expect(productTreeOption.listData).toEqual(expectedData);
                    });

                    it("bet type multiselect should be loaded if a product item is clicked", function () {
                        productTreeOption.onCheck();

                        expect(betTypeSelectOption).not.toBe(null);
                    });
                });

                describe("loadBettypes()", function () {
                    var ajaxObj = jasmine.createSpyObj("ajaxObj", ["abort"]);
                    var getBetTypeOption = {};

                    beforeAll(function () {
                        betTypeSelectOption = null;

                        spyOn($, "ajax").and.callFake(function (option) {
                            option.beforeSend();
                            option.complete();

                            getBetTypeOption = option;

                            return ajaxObj;
                        });

                        spyOn($.fn, "multiSelect").and.callFake(function (option) {
                            if (option === "getCheckedItems") {
                                return ["2-3", "1-2", "-1-4", "4-5", "6-7", 1];
                            }

                            if (this.selector === "#grid-products-multiselect") {
                                productTreeOption = option;
                            }
                            else {
                                betTypeSelectOption = option;
                            }
                        });

                        var productData = [{
                            ParentId: -1,
                            ID: 1,
                            Name: "Parent1",
                            Checked: true,
                        }, {
                            ParentId: 1,
                            ID: 2,
                            Name: "Child1",
                            Checked: true,
                        }, {
                            ParentId: 1,
                            ID: 3,
                            Name: "Child2",
                            Checked: true,
                        }, {
                            ParentId: -1,
                            ID: 4,
                            Name: "Parent2",
                            Checked: true,
                        }, {
                            ParentId: 4,
                            ID: 5,
                            Name: "Child3",
                            Checked: true,
                        }, {
                            ParentId: 6,
                            ID: 7,
                            Name: "Child4",
                            Checked: true,
                        }];

                        initProductTree(productData);
                    });

                    it("gets bet type form server with correct request data", function () {
                        var expectedData = [{
                            ParentId: 1,
                            ID: 2,
                            Name: "Child1",
                            Checked: true,
                        }, {
                            ParentId: -1,
                            ID: 1,
                            Name: "Parent1",
                            Checked: true,
                        }, {
                            ParentId: -1,
                            ID: 4,
                            Name: "Parent2",
                            Checked: true,
                        }, {
                            ParentId: 4,
                            ID: 5,
                            Name: "Child3",
                            Checked: true,
                        }, {
                            ParentId: 6,
                            ID: 7,
                            Name: "Child4",
                            Checked: true,
                        }];

                        productTreeOption.onCheck();

                        expect(getBetTypeOption.data).toEqual(JSON.stringify(expectedData));
                    });

                    it("bet type multiselect should be rendered with correct data", function () {
                        var betTypeData = [{
                            ID: 1,
                            Name: "Type1",
                            Checked: true
                        }, {
                            ID: 2,
                            Name: "Type2",
                            Checked: true
                        }];
                        var expectedData = [{
                            Id: "BetType-1",
                            Value: 1,
                            Text: "Type1",
                            Checked: true,
                            Enable: true,
                            Css: "",
                            CssClass: ""
                        }, {
                            Id: "BetType-2",
                            Value: 2,
                            Text: "Type2",
                            Checked: true,
                            Enable: true,
                            Css: "",
                            CssClass: ""
                        }];

                        getBetTypeOption.success(betTypeData);

                        expect(betTypeSelectOption.listData).toEqual(expectedData);
                    });

                    it("updates checked bey type list when a item is checked", function () {
                        betTypeSelectOption.onCheck();

                        var postData = CustomerTurnover.getPostData();

                        expect(postData.bettypes).toEqual([{
                            ID: 1,
                            Name: "Type1",
                            Checked: true
                        }]);
                    });
                });
            });

            describe("initAutoComplete()", function () {
                it("AutoComplete.initialize should be called with correct params", function () {
                    spyOn(AutoComplete, "initialize");

                    CustomerTurnover.initAutoComplete();

                    expect(AutoComplete.initialize).toHaveBeenCalledWith({
                        url: "SearchCustomerAPI/SearchCustomer",
                        target: "#Username"
                    });
                });
            });

            describe("submit()", function () {
                var ajaxObj = jasmine.createSpyObj("ajaxObj", ["abort"]);

                function setFixturesForFrom(userName) {
                    setFixtures('<form id="CustomerTurnoverReport">'
                                + '<input type="hidden" name="FromDate" value="01/01/2011" />'
                                + '<input type="hidden" name="ToDate" value="01/11/2011" />'
                                + '<input type="hidden" name="ReportBy" value="1" />'
                                + '<input type="hidden" name="ShowWin" value="False" />'
                                + '<input type="hidden" name="ShowLoss" value="False" />'
                                + '<input type="hidden" name="ShowDraw" value="False" />'
                                + '<input type="text" name="Odds" value="0" />'
                                + '<input type="text" name="Username" value="' + userName + '" />'
                                + '<input type="hidden" name="CurrencyId" value="0" />'
                                + '<input type="hidden" name="IsExportExcel" value="False" />'
                                + '<input type="hidden" name="CurrencyName" value="usd" />'
                                + '</form>');
                }

                beforeAll(function () {
                    spyOn($, "ajax").and.callFake(function (option) {
                        option.beforeSend();
                        option.complete();
                        option.success();

                        return ajaxObj;
                    });
                });

                beforeEach(function () {
                    spyOn(CustomerTurnover, "bindData");
                });

                it("CustomerTurnover.bindData should be called after calling ajax successfully", function () {
                    setFixturesForFrom("");

                    CustomerTurnover.submit();

                    expect(CustomerTurnover.bindData).toHaveBeenCalled();
                });

                it("title should be updated correctly after calling ajax successfully", function () {
                    setFixturesForFrom("");
                    appendSetFixtures('<div class="panel-heading hide">'
                        + '<div class="report-title"></div>'
                        + '</div>');
                    var expectedTitle = "Customer Turnover, 01/01/2011 → 01/11/2011 - Currency: usd - MinimumOdds: 0";

                    CustomerTurnover.submit();

                    expect($(".report-title").html()).toEqual(expectedTitle);
                    expect($(".panel-heading").hasClass("hide")).toBe(false);
                });

                it("title should be updated correctly with user name after calling ajax successfully", function () {
                    setFixturesForFrom("Username");
                    appendSetFixtures('<div class="panel-heading hide">'
                        + '<div class="report-title"></div>'
                        + '</div>');
                    appendSetFixtures('<div id="SubmitButton"></div>');
                    spyOn(CustomerTurnover, "checkValidFilter").and.returnValues(true);

                    var expectedTitle = "Customer Turnover, 01/01/2011 → 01/11/2011 - Currency: usd - MinimumOdds: 0 - Username: Username";

                    CustomerTurnover.initEvent();
                    $('#SubmitButton').click();

                    expect($(".report-title").html()).toEqual(expectedTitle);
                    expect($(".panel-heading").hasClass("hide")).toBe(false);
                });

                it("ajaxRequest.abort() should be called if ajaxRequest is not null", function () {
                    setFixturesForFrom("");

                    CustomerTurnover.submit();

                    expect(ajaxObj.abort).toHaveBeenCalled();
                });
            });

            describe("bindData(response)", function () {
                var gridOption = {
                    totalColspan: 0,
                    colModel: {}
                };

                beforeAll(function () {
                    spyOn(jqGridAdditional, "clearGrid");
                    spyOn(jqGridAdditional, "setNoInfo");
                    spyOn(CustomerTurnoverOption, "getGridOption").and.callFake(function () {
                        return gridOption;
                    });
                });

                beforeEach(function () {
                    spyOn($.fn, "jqGrid");
                    spyOn(PagingHelper, "render");
                });

                it("jqGridAdditional.clearGrid should be called", function () {
                    CustomerTurnover.bindData({ TotalRow: 0, Data: [0] });

                    expect(jqGridAdditional.clearGrid).toHaveBeenCalled();
                });

                it("jqGridAdditional.setNoInfo should be called if response data is empty", function () {
                    CustomerTurnover.bindData({ TotalRow: 0, Data: [0] });

                    expect(jqGridAdditional.setNoInfo).toHaveBeenCalled();
                });

                it("grid should be rendered if response data is not empty", function () {
                    CustomerTurnover.bindData({ TotalRow: 2000, Data: [1] });

                    expect($.fn.jqGrid).toHaveBeenCalled();
                });

                it("pager should not be rendered if total data is not greater than number rows of a page", function () {
                    CustomerTurnover.bindData({ TotalRow: 1, Data: [1] });

                    expect(PagingHelper.render).not.toHaveBeenCalled();
                });

                it("pager should be rendered if total data is greater than number rows of a page", function () {
                    CustomerTurnover.bindData({ TotalRow: 2000, Data: [1] });

                    expect(PagingHelper.render).toHaveBeenCalled();
                });

                describe("gridComplete(gridOption, response)", function () {
                    beforeEach(function () {
                        spyOn(jqGridAdditional, "gridComplete");
                        spyOn(jqGridAdditional, "assignTotal");
                        spyOn(jqGridAdditional, "setGroupFooters");
                        spyOn(jqGridAdditional, "setGroupCustomerWLColumns");
                        spyOn(jqGridAdditional, "removeCursorOnNonSortableHeader");
                        spyOn(jqGridAdditional, "updateGridHeight");
                        spyOn(jqGridAdditional, "updateGridWidth");

                        CustomerTurnover.bindData({ TotalRow: 1, Data: [1] });
                    });

                    it("jqGridAdditional.gridComplete should be called", function () {
                        gridOption.gridComplete(gridOption, {
                            Total: {}
                        });

                        expect(jqGridAdditional.gridComplete).toHaveBeenCalled();
                    });

                    it("jqGridAdditional.setGroupCustomerWLColumns should be called if report has Customer comm", function () {
                        CustomerTurnoverOption.hasCustomerComm = true;

                        gridOption.gridComplete(gridOption, {
                            Total: {}
                        });

                        expect(jqGridAdditional.setGroupCustomerWLColumns).toHaveBeenCalled();
                    });
                });
            });

            describe("exportToExcel()", function () {
                it("Excel form should be submitted", function () {
                    setFixtures('<form id="CustomerTurnoverForm"></form><form id="CustomerTurnoverReport"></form>');
                    var spyEvent = spyOnEvent($('#CustomerTurnoverForm'), 'submit');
                    spyOn(CustomerTurnover, "checkValidFilter").and.returnValues(true);
                    $('#CustomerTurnoverForm').submit(function () { return false; });

                    CustomerTurnover.exportToExcel();

                    expect(spyEvent).toHaveBeenTriggered();
                });

                it("Excel form should not be submitted if invalid filter", function () {
                    setFixtures('<form id="CustomerTurnoverForm"></form>');
                    var spyEvent = spyOnEvent($('#CustomerTurnoverForm'), 'submit');
                    spyOn(CustomerTurnover, "checkValidFilter").and.returnValues(false);
                    $('#CustomerTurnoverForm').submit(function () { return false; });

                    CustomerTurnover.exportToExcel();

                    expect(spyEvent).not.toHaveBeenTriggered();
                });
            });

            describe("ajaxPaging()", function () {
                beforeEach(function () {
                    spyOn(PagingHelper, "getSetting");
                    spyOn(CustomerTurnover, "submit");
                });

                it("updates paging data", function () {
                    CustomerTurnover.ajaxPaging();

                    expect(PagingHelper.getSetting).toHaveBeenCalled();
                });

                it("CustomerTurnover.submit() should be called", function () {
                    CustomerTurnover.ajaxPaging();

                    expect(CustomerTurnover.submit).toHaveBeenCalled();
                });
            });

            describe("checkValidFilter()", function () {
                var ajaxObj = jasmine.createSpyObj("ajaxObj", ["abort"]);
                var getBetTypeOption = {};

                beforeAll(function () {
                    spyOn($, "getJSON").and.callFake(function (url, callback) {
                        callback([{
                            ParentId: -1,
                            ID: 1,
                            Name: "Parent",
                            Checked: true,
                        }]);
                    });

                    spyOn($.fn, "multiSelect").and.callFake(function (option) {
                        if (option === "getCheckedItems") {
                            return ["-1-1"];
                        }
                    });

                    spyOn($, "ajax").and.callFake(function (option) {
                        getBetTypeOption = option;

                        return ajaxObj;
                    });

                    CustomerTurnover.initProductTree();
                });

                beforeEach(function () {
                    setFixtures('<div id="TickerFilter">'
                        + '<input type="checkbox"></input>'
                        + '<input type="checkbox"></input></div>'
                        + '<div id="SubmitButton"></div>'
                        + '<div id="BetTypeList"></div>');
                });

                it("returns false if no ticket filter checked", function () {
                    getBetTypeOption.success([1]);

                    var result = CustomerTurnover.checkValidFilter();

                    expect(result).toBe(false);
                    expect($("#SubmitButton").prop("disabled")).toBe(true);
                    expect($("#BetTypeList").hasClass("invalid")).toBe(false);
                });

                it("returns false if no bet type selected", function () {
                    getBetTypeOption.success([]);
                    $("#TickerFilter input[type='checkbox']").prop("checked", true);

                    var result = CustomerTurnover.checkValidFilter();

                    expect(result).toBe(false);
                    expect($("#SubmitButton").prop("disabled")).toBe(true);
                    expect($("#BetTypeList").hasClass("invalid")).toBe(true);
                });

                it("returns true if bet type is selected and ticket filter is checked", function () {
                    getBetTypeOption.success([1]);
                    $("#TickerFilter input[type='checkbox']").prop("checked", true);

                    var result = CustomerTurnover.checkValidFilter();

                    expect(result).toBe(true);
                    expect($("#SubmitButton").prop("disabled")).toBe(false);
                    expect($("#BetTypeList").hasClass("invalid")).toBe(false);
                });
            });
        });
    });