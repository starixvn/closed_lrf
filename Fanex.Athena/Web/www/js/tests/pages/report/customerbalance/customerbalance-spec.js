define([
    "jquery",
    "common/site",
    "lib/jqgrid/jquery.jqgrid.additional",
    "pages/report/customerbalance/customerbalance",
    "pages/report/customerbalance/customerbalance.option",
    "components/pluginhelper/daterangepicker",
    "components/pluginhelper/multiselect",
    "helpers/daterange",
    "components/paging",
    "pages/report/report"],
    function ($, Site, jqGridAdditional, CustomerBalance, CustomerBalanceOption, DatePicker, MultiSelect, DateHelper, PagingHelper, Report) {
        describe("CustomerBalance", function () {
            beforeAll(function () {
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                    return url;
                });
                spyOn(Site, "initialize");
                spyOn(Site, "addUserGuide");
                spyOn(Site, "getSingleResource").and.callFake(function (str) {
                    if (str === "Viewin") {
                        return str + " {0}";
                    }
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
                    spyOn(CustomerBalance, "initEvent");
                    spyOn(CustomerBalance, "initSetting");

                    CustomerBalance.initialize();

                    expect(Site.initialize).toHaveBeenCalled();
                    expect(Site.addUserGuide).toHaveBeenCalled();
                    expect(MultiSelect.initProductList).toHaveBeenCalled();
                    expect(DatePicker.initDateRangePicker).toHaveBeenCalled();
                    expect(DateHelper.setConstraintMonthRange).toHaveBeenCalled();
                    expect(CustomerBalance.initEvent).toHaveBeenCalled();
                    expect(CustomerBalance.initSetting).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                beforeEach(function () {
                    $("body").off();
                });

                afterEach(function () {
                    $("body").off();
                });

                it("CustomerBalance.submit() should be called if submit button is clicked", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    spyOn(CustomerBalance, "submit");
                    spyOn(Report, "ValidProducts").and.returnValues(true);

                    CustomerBalance.initEvent();
                    $('#SubmitButton').click();

                    expect(CustomerBalance.submit).toHaveBeenCalled();
                });

                it("CustomerBalance.submit() should not be called if submit button is clicked with no product selected", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    spyOn(CustomerBalance, "submit");
                    spyOn(Report, "ValidProducts").and.returnValues(false);

                    CustomerBalance.initEvent();
                    $('#SubmitButton').click();

                    expect(CustomerBalance.submit).not.toHaveBeenCalled();
                });

                it("Main form should be submitted if ExportToExcel button is clicked", function () {
                    setFixtures('<form id="CustomerBalanceForm">'
                        + '<input type="hidden" id="IsExportExcel" />'
                        + '<button id="ExportToExcel"></button>'
                        + '</form>');
                    var spyEvent = spyOnEvent($('#CustomerBalanceForm'), 'submit');
                    spyOn(Report, "ValidProducts").and.returnValues(true);
                    $('#CustomerBalanceForm').submit(function () { return false; });

                    CustomerBalance.initEvent();
                    $('#ExportToExcel').click();

                    expect(spyEvent).toHaveBeenTriggered();
                });

                it("Main form should not be submitted if ExportToExcel button is clicked with no product selected", function () {
                    setFixtures('<form id="CustomerBalanceForm">'
                        + '<input type="hidden" id="IsExportExcel" />'
                        + '<button id="ExportToExcel"></button>'
                        + '</form>');
                    var spyEvent = spyOnEvent($('#CustomerBalanceForm'), 'submit');
                    spyOn(Report, "ValidProducts").and.returnValues(false);
                    $('#CustomerBalanceForm').submit(function () { return false; });

                    CustomerBalance.initEvent();
                    $('#ExportToExcel').click();

                    expect(spyEvent).not.toHaveBeenTriggered();
                });

                it("off() jquery function should be called with correct parameter when window fire unload event", function () {
                    spyOn($.fn, "off");
                    CustomerBalance.initEvent();

                    $(window).unload();

                    expect($.fn.off).toHaveBeenCalledWith("resize");
                });

                it("resizeGrid function should be called when window fire resize event", function () {
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "updateGridWidth");

                    CustomerBalance.initEvent();
                    $(window).resize();

                    expect(jqGridAdditional.updateGridHeight).toHaveBeenCalled();
                    expect(jqGridAdditional.updateGridWidth).toHaveBeenCalled();
                });
            });

            describe("initSetting()", function () {
                it("initials state for CustomerBalanceOption", function () {
                    setFixtures('<input type="hidden" id="IsAllowedCustomerCommission" value="False" />'
                        + '<input type="hidden" id="IsAllowedBACommission" value="True" />');

                    CustomerBalance.initSetting();

                    expect(CustomerBalanceOption.hasCustomerComm).toBe(false);
                    expect(CustomerBalanceOption.isAllowBA).toBe(true);
                });
            });

            describe("submit()", function () {
                var ajaxObj = jasmine.createSpyObj("ajaxObj", ["abort"]);

                beforeAll(function () {
                    spyOn($, "ajax").and.callFake(function (option) {
                        option.beforeSend();
                        option.complete();
                        option.success();

                        return ajaxObj;
                    });
                });

                beforeEach(function () {
                    setFixtures('<form id="CustomerBalanceForm">'
                                + '<input type="text" name="CurrencyName" value="usd" />'
                                + '<input type="hidden" name="FromDate" value="01/01/2011" />'
                                + '<input type="hidden" name="ToDate" value="01/11/2011" />'
                                + '</form>');

                    spyOn(CustomerBalance, "bindData");
                });

                it("CustomerBalance.bindData should be called after calling ajax successfully", function () {
                    CustomerBalance.submit();

                    expect(CustomerBalance.bindData).toHaveBeenCalled();
                });

                it("title should be updated correctly after calling ajax successfully", function () {
                    setFixtures('<div class="panel-heading hide">'
                        + '<div class="report-title"></div>'
                        + '</div>');
                    var expectedTitle = "CustomerBalance, 01/01/2011 → 01/11/2011, Viewin usd";

                    CustomerBalance.submit();

                    expect($(".report-title").html()).toEqual(expectedTitle);
                    expect($(".panel-heading").hasClass("hide")).toBe(false);
                });

                it("ajaxRequest.abort() should be called if ajaxRequest is not null", function () {
                    CustomerBalance.submit();

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
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "updateGridWidth");
                    spyOn(CustomerBalanceOption, "getGridOption").and.callFake(function () {
                        return gridOption;
                    });
                });

                beforeEach(function () {
                    spyOn($.fn, "jqGrid");
                    spyOn(CustomerBalanceOption, "setGroupHeaderColumns");
                    spyOn(PagingHelper, "render");
                });

                it("jqGridAdditional.clearGrid should be called", function () {
                    CustomerBalance.bindData({ TotalRows: 0 });

                    expect(jqGridAdditional.clearGrid).toHaveBeenCalled();
                });

                it("jqGridAdditional.setNoInfo should be called if response data is empty", function () {
                    CustomerBalance.bindData({ TotalRows: 0 });

                    expect(jqGridAdditional.setNoInfo).toHaveBeenCalled();
                    expect(CustomerBalanceOption.setGroupHeaderColumns).not.toHaveBeenCalled();
                });

                it("grid should be rendered if response data is not empty", function () {
                    CustomerBalance.bindData({ TotalRows: 2000, Data: [1] });

                    expect($.fn.jqGrid).toHaveBeenCalled();
                    expect(CustomerBalanceOption.setGroupHeaderColumns).toHaveBeenCalled();
                });

                it("pager should not be rendered if total data is not greater than number rows of a page", function () {
                    CustomerBalance.bindData({ TotalRows: 1, Data: [1] });

                    expect(PagingHelper.render).not.toHaveBeenCalled();
                });

                it("pager should be rendered if total data is greater than number rows of a page", function () {
                    CustomerBalance.bindData({ TotalRows: 2000, Data: [1] });

                    expect(PagingHelper.render).toHaveBeenCalled();
                });

                describe("gridOption.onSortCol(index)", function () {
                    beforeEach(function () {
                        spyOn(CustomerBalance, "submit");

                        jasmine.clock().install();
                    });

                    afterEach(function () {
                        jasmine.clock().uninstall();
                    });

                    it("should not be sorted if grid has only 1 row", function () {
                        spyOn(CustomerBalanceOption, "getOrderColumnCode");
                        CustomerBalance.bindData({ TotalRows: 1, Data: [1] });

                        gridOption.onSortCol(0);
                        jasmine.clock().tick(101);

                        expect(CustomerBalanceOption.getOrderColumnCode).not.toHaveBeenCalled();
                        expect(CustomerBalance.submit).not.toHaveBeenCalled();
                    });

                    it("CustomerBalance.submit should be called when sorting", function () {
                        CustomerBalance.bindData({ TotalRows: 2, Data: [1, 2] });
                        spyOn(CustomerBalanceOption, "getOrderColumnCode").and.callFake(function (index, sortType) {
                            return 1;
                        });

                        gridOption.onSortCol(1);
                        jasmine.clock().tick(101);

                        expect(CustomerBalance.submit).toHaveBeenCalled();
                    });

                    it("CustomerBalance.submit should not be called if column code is 0", function () {
                        CustomerBalance.bindData({ TotalRows: 2, Data: [1, 2] });
                        spyOn(CustomerBalanceOption, "getOrderColumnCode").and.callFake(function (index, sortType) {
                            return 0;
                        });

                        var result = gridOption.onSortCol(1);
                        jasmine.clock().tick(101);

                        expect(CustomerBalance.submit).not.toHaveBeenCalled();
                        expect(result).toBe("stop");
                    });

                    it("grid should be sorted descending on the first time", function () {
                        var sortType = "";
                        CustomerBalance.bindData({ TotalRows: 2, Data: [1, 2] });
                        spyOn(CustomerBalanceOption, "getOrderColumnCode").and.callFake(function (index, type) {
                            sortType = type;
                            return 2;
                        });

                        gridOption.onSortCol(2);
                        jasmine.clock().tick(101);

                        expect(sortType).toBe("desc");
                    });

                    it("grid should be sorted ascending on the second time", function () {
                        var sortType = "";
                        CustomerBalance.bindData({ TotalRows: 2, Data: [1, 2] });
                        spyOn(CustomerBalanceOption, "getOrderColumnCode").and.callFake(function (index, type) {
                            sortType = type;
                            return 3;
                        });

                        gridOption.onSortCol(3);
                        jasmine.clock().tick(101);

                        expect(sortType).toBe("desc");

                        gridOption.onSortCol(3);
                        jasmine.clock().tick(101);

                        expect(sortType).toBe("asc");
                    });

                    it("grid should be sorted descending on the third time", function () {
                        var sortType = "";
                        CustomerBalance.bindData({ TotalRows: 2, Data: [1, 2] });
                        spyOn(CustomerBalanceOption, "getOrderColumnCode").and.callFake(function (index, type) {
                            sortType = type;
                            return 4;
                        });

                        gridOption.onSortCol(4);
                        jasmine.clock().tick(101);

                        expect(sortType).toBe("desc");

                        gridOption.onSortCol(4);
                        jasmine.clock().tick(101);

                        expect(sortType).toBe("asc");

                        gridOption.onSortCol(4);
                        jasmine.clock().tick(101);

                        expect(sortType).toBe("desc");
                    });
                });

                describe("gridComplete(gridOption, response)", function () {
                    beforeEach(function () {
                        spyOn(jqGridAdditional, "gridComplete");
                        spyOn(jqGridAdditional, "assignTotal");
                        spyOn(jqGridAdditional, "setGroupFooters");
                        spyOn(jqGridAdditional, "addSortableHeaders");
                        spyOn(jqGridAdditional, "removeCursorOnNonSortableHeader");
                    });

                    it("jqGridAdditional.gridComplete should be called", function () {
                        CustomerBalance.bindData({ TotalRows: 1, Data: [1] });

                        gridOption.gridComplete(gridOption, {
                            Total: {}
                        });

                        expect(jqGridAdditional.gridComplete).toHaveBeenCalled();
                    });

                    it("does nothing if grid is not rendered the first time after submitting", function () {
                        gridOption.gridComplete(gridOption, {
                            Total: {}
                        });

                        expect(jqGridAdditional.gridComplete).not.toHaveBeenCalled();
                    });

                    it("jqGridAdditional.addSortableHeaders should be called if total rows is greater than 1", function () {
                        CustomerBalance.bindData({ TotalRows: 2, Data: [1] });

                        gridOption.gridComplete(gridOption, {
                            Total: {}
                        });

                        expect(jqGridAdditional.addSortableHeaders).toHaveBeenCalled();
                    });

                    it("jqGridAdditional.removeCursorOnNonSortableHeader should be called if total rows is 1", function () {
                        CustomerBalance.bindData({ TotalRows: 1, Data: [1] });

                        gridOption.gridComplete(gridOption, {
                            Total: {}
                        });

                        expect(jqGridAdditional.removeCursorOnNonSortableHeader).toHaveBeenCalled();
                    });
                });
            });

            describe("ajaxPaging()", function () {
                beforeEach(function () {
                    spyOn(PagingHelper, "getSetting");
                    spyOn(CustomerBalance, "submit");
                });

                it("updates paging data", function () {
                    CustomerBalance.ajaxPaging();

                    expect(PagingHelper.getSetting).toHaveBeenCalled();
                });

                it("CustomerBalance.submit() should be called", function () {
                    CustomerBalance.ajaxPaging();

                    expect(CustomerBalance.submit).toHaveBeenCalled();
                });
            });
        });
    });