define([
    "jquery",
    "common/querystring",
    "common/site",
    "lib/jqgrid/jquery.jqgrid.additional",
    "pages/report/customerpendingfunds/customerpendingfunds",
    "pages/report/customerpendingfunds/customerpendingfunds.option",
    "components/pluginhelper/multiselect",
    "components/paging",
    "common/popup",
    "pages/report/report"],
    function ($, QueryString, Site, jqGridAdditional, CustomerPedingFunds, CustomerPedingFundsOption, MultiSelect, PagingHelper, Popup, Report) {
        describe("CustomerPedingFunds", function () {
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
                spyOn(Site, "blockUI");
                spyOn(Site, "unBlockUI");
            });

            describe("initialize()", function () {
                it("all initial methods should be called", function () {
                    spyOn(CustomerPedingFunds, "initEvent");

                    CustomerPedingFunds.initialize();

                    expect(Site.initialize).toHaveBeenCalled();
                    expect(Site.addUserGuide).toHaveBeenCalled();
                    expect(MultiSelect.initProductList).toHaveBeenCalled();
                    expect(CustomerPedingFunds.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                beforeEach(function () {
                    $("body").off();
                });

                afterEach(function () {
                    $("body").off();
                });

                it("CustomerPedingFunds.submit() should be called if submit button is clicked", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    spyOn(CustomerPedingFunds, "submit");
                    spyOn(Report, "ValidProducts").and.returnValues(true);

                    CustomerPedingFunds.initEvent();
                    $('#SubmitButton').click();

                    expect(CustomerPedingFunds.submit).toHaveBeenCalled();
                });

                it("CustomerPedingFunds.submit() should not be called if submit button is clicked with no product selected", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    spyOn(CustomerPedingFunds, "submit");
                    spyOn(Report, "ValidProducts").and.returnValues(false);

                    CustomerPedingFunds.initEvent();
                    $('#SubmitButton').click();

                    expect(CustomerPedingFunds.submit).not.toHaveBeenCalled();
                });

                it("Main form should be submitted if ExportToExcel button is clicked.", function () {
                    setFixtures('<form id="CustomerPendingFundsForm">'
                        + '<input type="hidden" id="IsExportExcel" />'
                        + '<button id="ExportToExcel"></button>'
                        + '</form>');
                    var spyEvent = spyOnEvent($('#CustomerPendingFundsForm'), 'submit');
                    spyOn(Report, "ValidProducts").and.returnValues(true);
                    $('#CustomerPendingFundsForm').submit(function () { return false; });

                    CustomerPedingFunds.initEvent();
                    $('#ExportToExcel').click();

                    expect(spyEvent).toHaveBeenTriggered();
                });

                it("Main form should not be submitted if ExportToExcel button is clicked with no product selected", function () {
                    setFixtures('<form id="CustomerPendingFundsForm">'
                        + '<input type="hidden" id="IsExportExcel" />'
                        + '<button id="ExportToExcel"></button>'
                        + '</form>');
                    var spyEvent = spyOnEvent($('#CustomerPendingFundsForm'), 'submit');
                    spyOn(Report, "ValidProducts").and.returnValues(false);
                    $('#CustomerPendingFundsForm').submit(function () { return false; });

                    CustomerPedingFunds.initEvent();
                    $('#ExportToExcel').click();

                    expect(spyEvent).not.toHaveBeenTriggered();
                });

                it("CustomerPedingFunds.viewPendingFundsBetList() should be called if BetList link is clicked", function () {
                    setFixtures('<div class="main-content">'
                        + '<a class="bet-list-link" data-drill-down=\'{"CustId":1,"SystemId":2, "ExternalId":3}\'></a>'
                        + '</div>');
                    spyOn(CustomerPedingFunds, "viewPendingFundsBetList");

                    CustomerPedingFunds.initEvent();
                    $('.bet-list-link').click();

                    expect(CustomerPedingFunds.viewPendingFundsBetList).toHaveBeenCalledWith(1, 2, 3);
                });

                it("off() jquery function should be called with correct parameter when window fire unload event", function () {
                    spyOn($.fn, "off");
                    CustomerPedingFunds.initEvent();

                    $(window).unload();

                    expect($.fn.off).toHaveBeenCalledWith("resize");
                });

                it("resizeGrid function should be called when window fire resize event", function () {
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "updateGridWidth");

                    CustomerPedingFunds.initEvent();
                    $(window).resize();

                    expect(jqGridAdditional.updateGridHeight).toHaveBeenCalled();
                    expect(jqGridAdditional.updateGridWidth).toHaveBeenCalled();
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
                    setFixtures('<form id="CustomerPendingFundsForm"></form>');

                    spyOn(CustomerPedingFunds, "bindData");
                    spyOn(Report, "setOriginalProduct");
                    spyOn(Site, "updateOriginalLicenseeOption");
                });

                it("Report.setOriginalProduct should be called when submit method is called by clicking submit button", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    spyOn(Report, "ValidProducts").and.returnValues(true);

                    CustomerPedingFunds.initEvent();
                    $('#SubmitButton').click();

                    expect(Report.setOriginalProduct).toHaveBeenCalled();
                });

                it("Site.updateOriginalLicenseeOption should be called when submit method is called by clicking submit button", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    spyOn(Report, "ValidProducts").and.returnValues(true);

                    CustomerPedingFunds.initEvent();
                    $('#SubmitButton').click();

                    expect(Site.updateOriginalLicenseeOption).toHaveBeenCalled();
                });

                it("CustomerPedingFunds.bindData should be called after calling ajax successfully", function () {
                    CustomerPedingFunds.submit();

                    expect(CustomerPedingFunds.bindData).toHaveBeenCalled();
                });

                it("ajaxRequest.abort() should be called if ajaxRequest is not null", function () {
                    CustomerPedingFunds.submit();

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

                    spyOn(CustomerPedingFundsOption, "getGridOption").and.callFake(function () {
                        return gridOption;
                    });
                });

                beforeEach(function () {
                    spyOn($.fn, "jqGrid");
                    spyOn(PagingHelper, "render");
                });

                it("jqGridAdditional.clearGrid should be called", function () {
                    CustomerPedingFunds.bindData({ TotalRows: 0 });

                    expect(jqGridAdditional.clearGrid).toHaveBeenCalled();
                });

                it("jqGridAdditional.setNoInfo should be called if response data is empty", function () {
                    CustomerPedingFunds.bindData({ TotalRows: 0 });

                    expect(jqGridAdditional.setNoInfo).toHaveBeenCalled();
                });

                it("grid should be rendered if response data is not empty", function () {
                    CustomerPedingFunds.bindData({ TotalRows: 2000, Data: [1] });

                    expect($.fn.jqGrid).toHaveBeenCalled();
                });

                it("pager should not be rendered if total data is not greater than number rows of a page", function () {
                    CustomerPedingFunds.bindData({ TotalRows: 1, Data: [1] });

                    expect(PagingHelper.render).not.toHaveBeenCalled();
                });

                it("pager should be rendered if total data is greater than number rows of a page", function () {
                    CustomerPedingFunds.bindData({ TotalRows: 2000, Data: [1] });

                    expect(PagingHelper.render).toHaveBeenCalled();
                });

                describe("gridOption.onSortCol(index)", function () {
                    beforeEach(function () {
                        setFixtures('<input type="hidden" id="SortColumn" /><input type="hidden" id="SortDirection" />');
                        spyOn(CustomerPedingFunds, "submit");

                        jasmine.clock().install();
                    });

                    afterEach(function () {
                        jasmine.clock().uninstall();
                    });

                    it("should not be sorted if grid has only 1 row", function () {
                        CustomerPedingFunds.bindData({ TotalRows: 1, Data: [1] });

                        gridOption.onSortCol(0);
                        jasmine.clock().tick(101);

                        expect(CustomerPedingFunds.submit).not.toHaveBeenCalled();
                    });

                    it("CustomerPedingFunds.submit should be called when sorting", function () {
                        CustomerPedingFunds.bindData({ TotalRows: 2, Data: [1, 2] });

                        gridOption.onSortCol(0);
                        jasmine.clock().tick(101);

                        expect(CustomerPedingFunds.submit).toHaveBeenCalled();
                    });

                    it("grid should be sorted ascending on the first time", function () {
                        var sortType = "";
                        CustomerPedingFunds.bindData({ TotalRows: 2, Data: [1, 2] });

                        gridOption.onSortCol(1);
                        jasmine.clock().tick(101);

                        expect($("#SortDirection").val()).toBe("asc");
                    });

                    it("grid should be sorted descending on the second time", function () {
                        var sortType = "";
                        CustomerPedingFunds.bindData({ TotalRows: 2, Data: [1, 2] });

                        gridOption.onSortCol(2);
                        jasmine.clock().tick(101);

                        expect($("#SortDirection").val()).toBe("asc");

                        gridOption.onSortCol(2);
                        jasmine.clock().tick(101);

                        expect($("#SortDirection").val()).toBe("desc");
                    });

                    it("grid should be sorted ascending on the third time", function () {
                        var sortType = "";
                        CustomerPedingFunds.bindData({ TotalRows: 2, Data: [1, 2] });

                        gridOption.onSortCol(2);
                        jasmine.clock().tick(101);

                        expect($("#SortDirection").val()).toBe("asc");

                        gridOption.onSortCol(2);
                        jasmine.clock().tick(101);

                        expect($("#SortDirection").val()).toBe("desc");

                        gridOption.onSortCol(2);
                        jasmine.clock().tick(101);

                        expect($("#SortDirection").val()).toBe("asc");
                    });
                });

                describe("gridComplete(gridOption, response)", function () {
                    beforeEach(function () {
                        spyOn(jqGridAdditional, "gridComplete");
                        spyOn(jqGridAdditional, "assignTotal");
                        spyOn(jqGridAdditional, "setGroupFooters");
                        spyOn(jqGridAdditional, "addSortableHeaders");
                        spyOn(jqGridAdditional, "removeCursorOnNonSortableHeader");
                        spyOn(jqGridAdditional, "updateGridHeight");
                        spyOn(jqGridAdditional, "updateGridWidth");
                    });

                    it("jqGridAdditional.gridComplete should be called", function () {
                        CustomerPedingFunds.bindData({ TotalRows: 1, Data: [1] });

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
                        CustomerPedingFunds.bindData({ TotalRows: 2, Data: [1] });

                        gridOption.gridComplete(gridOption, {
                            Total: {}
                        });

                        expect(jqGridAdditional.addSortableHeaders).toHaveBeenCalled();
                    });

                    it("jqGridAdditional.removeCursorOnNonSortableHeader should be called if total rows is 1", function () {
                        CustomerPedingFunds.bindData({ TotalRows: 1, Data: [1] });

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
                    spyOn(CustomerPedingFunds, "submit");
                });

                it("updates paging data", function () {
                    CustomerPedingFunds.ajaxPaging();

                    expect(PagingHelper.getSetting).toHaveBeenCalled();
                });

                it("CustomerPedingFunds.submit() should be called", function () {
                    CustomerPedingFunds.ajaxPaging();

                    expect(CustomerPedingFunds.submit).toHaveBeenCalled();
                });
            });

            describe("viewPendingFundsBetList(custid, systemId, externalId)", function () {
                it("Popup.openPopupWithIframe should be called with correct params", function () {
                    spyOn(Site, "setLicenseeOptionOriginalParam").and.callFake(function (url) {
                        return url;
                    });
                    spyOn(Site, "setProductOptionOriginalParamList").and.callFake(function (url) {
                        return url;
                    });
                    spyOn(QueryString, "setParam").and.callFake(function (url, param, value) {
                        return url + "&" + param + "=" + value;
                    });
                    spyOn(Math, "min").and.callFake(function () {
                        return 650;
                    });
                    spyOn(Popup, "openPopupWithIframe");

                    CustomerPedingFunds.viewPendingFundsBetList(1, 2, 3);

                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(
                        "PendingFundsBetList/Index&custid=1&systemid=2&externalid=3",
                        { id: "betlist-popup", width: 970, height: 700, title: "BetListRunning" });
                });
            });
        });
    });