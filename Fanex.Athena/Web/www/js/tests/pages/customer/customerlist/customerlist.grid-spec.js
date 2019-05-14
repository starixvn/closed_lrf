define(["jquery",
    "common/site",
    "common/querystring",
    "pages/customer/customerlist/customerlist.state",
    "pages/customer/customerlist/customerlist.service",
    "pages/customer/customerlist/customerlist.bastatus",
    "pages/customer/customerlist/customerlist.speciallevel",
    "pages/customer/customerlist/customerlist.oddsgroup",
    "pages/customer/customerlist/customerlist.custstatus",
    "pages/customer/customerlist/customerlist.grid",
    "components/paging",
    "common/popup",
    "lib/jqgrid/jquery.jqgrid.additional"],
    function (
        $,
        Site,
        QueryString,
        CustomerListState,
        CustomerListService,
        CustomerListBAStatus,
        CustomerListSpecialLevel,
        CustomerListOddsGroup,
        CustomerListCustStatus,
        CustomerListGrid,
        PagingHelper,
        Popup,
        jqGridAdditional) {
        describe("CustomerListGrid", function () {          
            var selectedCustomers = function (object) {
                for (var custId in object) {
                    this[custId] = object[custId];
                }
            }
            selectedCustomers.prototype = { "NoOwnProperty": "" };

            var _state = {
                selectedCustomers: new selectedCustomers(),
                checkedAllRows: false
            };

            beforeAll(function () {
                spyOn(CustomerListState, "getState").and.returnValue(_state);
                spyOn(CustomerListService, "resizeGrid");
                spyOn(jqGridAdditional, "updateGridHeight");
                spyOn(jqGridAdditional, "updateGridWidth");
                spyOn(Site, "getSingleResource").and.callFake(function (str) {
                    return str;
                });
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                    return url;
                });
            });

            describe("initialize()", function () {
                beforeAll(function () {
                    spyOn(CustomerListGrid, "ajaxPaging");
                    spyOn(CustomerListBAStatus, "initialize");
                    spyOn(CustomerListSpecialLevel, "initialize");
                    spyOn(CustomerListOddsGroup, "initialize");
                    spyOn(CustomerListCustStatus, "initialize");
                    spyOn(CustomerListGrid, "initEvent");
                });

                it("initializes Customer List modules", function () {
                    CustomerListGrid.initialize();

                    expect(CustomerListState.getState).toHaveBeenCalled();
                    expect(CustomerListBAStatus.initialize).toHaveBeenCalled();
                    expect(CustomerListSpecialLevel.initialize).toHaveBeenCalled();
                    expect(CustomerListOddsGroup.initialize).toHaveBeenCalled();
                    expect(CustomerListCustStatus.initialize).toHaveBeenCalled();
                    expect(CustomerListGrid.initEvent).toHaveBeenCalled();
                });
            });

            describe("ajaxPaging()", function () {
                it("CustomerListService.submit() should be called", function () {
                    spyOn(PagingHelper, "getSetting");
                    spyOn(CustomerListService, "submit");

                    CustomerListGrid.ajaxPaging();

                    expect(CustomerListService.submit).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                it("registerCheckboxEvent() should be called", function () {
                    spyOn(CustomerListGrid, "registerCheckboxEvent");

                    CustomerListGrid.initEvent();

                    expect(CustomerListGrid.registerCheckboxEvent).toHaveBeenCalled();
                });

                it("form should be submitted if ExportToExcel is clicked", function () {
                    setFixtures('<button id="ExportToExcel"><button>')
                    var form = jasmine.createSpyObj("form", ["submit"]);
                    spyOn($.fn, "closest").and.returnValue(form);

                    CustomerListGrid.initEvent();
                    $("#ExportToExcel").click();

                    expect(form.submit).toHaveBeenCalled();
                });

                it("viewRunningBetlist(custId, systemId, externalId) should be called if .pendingFunds is clicked", function () {
                    setFixtures('<div id="report-content"><a class="pendingFunds" data-custid="custid" data-systemid="systemid" data-externalid="externalid"><a><div>');
                    spyOn(CustomerListGrid, "viewRunningBetlist");

                    CustomerListGrid.initEvent();
                    $(".pendingFunds").click();

                    expect(CustomerListGrid.viewRunningBetlist).toHaveBeenCalledWith("custid", "systemid", "externalid");
                });

                it("off() jquery function should be called with correct parameter when window fire unload event", function () {
                    spyOn($.fn, "off");

                    CustomerListGrid.initEvent();
                    $(window).unload();

                    expect($.fn.off).toHaveBeenCalledWith("resize");
                });
            });

            describe("registerCheckboxEvent()", function () {
                beforeAll(function () {
                    _state.cachedData = { Data: [{ "CustId": 0, "GroupCommId": 0 }, { "CustId": 1, "GroupCommId": 1 }, { "CustId": 2, "GroupCommId": 2 }] };
                });

                afterEach(function () {
                    _state.selectedCustomers = new selectedCustomers({});
                });

                it("CustomerListService.bindData should be called when CheckAll is changed", function () {
                    setFixtures('<div id="report-content"><input type="checkbox" id="CheckAll"><div>');
                    spyOn(CustomerListService, "bindData");

                    CustomerListGrid.registerCheckboxEvent();
                    $("#CheckAll").change();

                    expect(CustomerListService.bindData).toHaveBeenCalled();
                });

                it("updates _state.selectedCustomers with all customers if CheckAll is checked", function () {
                    setFixtures('<div id="report-content"><input type="checkbox" id="CheckAll" checked><div>');
                    spyOn(CustomerListService, "bindData");

                    CustomerListGrid.registerCheckboxEvent();
                    $("#CheckAll").change();

                    expect(CustomerListService.bindData).toHaveBeenCalled();
                    expect(_state.selectedCustomers).toEqual({ "0": 0, "1": 1, "2": 2 });
                    expect(_state.checkedAllRows).toBe(true);
                });

                it("adds selected customer to _state.selectedCustomers if a .select-cust-checkbox is checked", function () {
                    setFixtures('<div id="report-content">'
                        + '<input type="checkbox" id="CheckAll" checked>'
                        + '<input class="select-cust-checkbox" data-group-comm-id="3" id="3" checked>'
                        + '<div>');

                    CustomerListGrid.registerCheckboxEvent();
                    $(".select-cust-checkbox").change();

                    expect(_state.selectedCustomers).toEqual({ "3": 3 });
                    expect(_state.checkedAllRows).toBe(false);
                });

                it("removes selected customer to _state.selectedCustomers if a .select-cust-checkbox is unchecked", function () {
                    setFixtures('<div id="report-content">'
                        + '<input type="checkbox" id="CheckAll" checked>'
                        + '<input class="select-cust-checkbox" data-group-comm-id="1" id="1">'
                        + '<div>');
                    _state.selectedCustomers = new selectedCustomers({ "0": 0, "1": 1, "2": 2 });

                    CustomerListGrid.registerCheckboxEvent();
                    $(".select-cust-checkbox").change();

                    expect(_state.selectedCustomers["1"]).toBe(undefined);
                    expect(_state.checkedAllRows).toBe(false);
                });
            });

            describe("viewRunningBetlist(custId, systemId, externalId)", function () {
                it("Popup.openPopupWithIframe should be called with correct params", function () {
                    spyOn(QueryString, "setParam").and.callFake(function (url, paramName, value) {
                        return (url.indexOf("?") > -1 ? url + "&" : url + "?") + paramName + "=" + value;
                    });
                    spyOn(Site, "setLicenseeOptionOriginalParam").and.callFake(function (url, paramName, value) {
                        return url;
                    });
                    spyOn(Math, "min").and.returnValue(0);
                    spyOn(Popup, "openPopupWithIframe");

                    var custId = "custId", systemId = "systemId", externalId = "externalId";
                    var expectedUrl = "CustomerOutstandingBetList/Index?custid=custId&externalid=externalId&systemid=systemId&betlistname=betlistrunning";
                    CustomerListGrid.viewRunningBetlist(custId, systemId, externalId);

                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(expectedUrl, { id: "betlist-popup", width: 930, height: 70, title: "BetListRunning" });
                });
            });

            describe("updateGridGroupAndComm(groupid, groupName, groupColor, sbCom, ngCom, csCom)", function () {
                it("CustomerListService.bindData should be called with correct params", function () {
                    spyOn(CustomerListService, "bindData");

                    _state.cachedData = { Data: [{ "CustId": 0, "GroupCommId": 0 }, { "CustId": 1, "GroupCommId": 1 }, { "CustId": 3, "GroupCommId": 3 }] };
                    _state.selectedCustomers = new selectedCustomers({ "1": 1 });

                    var groupid = 3, groupName = "name", groupColor = "#fff", sbCom = "SB", ngCom = "NG", csCom = "CS";
                    CustomerListGrid.updateGridGroupAndComm(groupid, groupName, groupColor, sbCom, ngCom, csCom);

                    expect(CustomerListService.bindData).toHaveBeenCalledWith({
                        Data: [
                            { "CustId": 0, "GroupCommId": 0 },
                            { "CustId": 1, "GroupCommId": 3, "Group": "name", "GroupColor": "#fff", "SBComm": "SB", "NGComm": "NG", "CSComm": "CS" },
                            { "CustId": 3, "GroupCommId": 3 }]
                    });
                    expect(_state.selectedCustomers).toEqual({ "1": 3 });
                });
            });

            describe("updateGridGroup(groupid, groupName, groupColor)", function () {
                it("CustomerListService.bindData should be called with correct params", function () {
                    spyOn(CustomerListService, "bindData");

                    _state.cachedData = { Data: [{ "CustId": 0, "GroupCommId": 0 }, { "CustId": 1, "GroupCommId": 1 }, { "CustId": 3, "GroupCommId": 3 }] };
                    _state.selectedCustomers = new selectedCustomers({ "1": 1 });

                    var groupid = 3, groupName = "name", groupColor = "#fff";
                    CustomerListGrid.updateGridGroup(groupid, groupName, groupColor);

                    expect(CustomerListService.bindData).toHaveBeenCalledWith({
                        Data: [
                            { "CustId": 0, "GroupCommId": 0 },
                            { "CustId": 1, "GroupCommId": 3, "Group": "name", "GroupColor": "#fff"},
                            { "CustId": 3, "GroupCommId": 3 }]
                    });
                    expect(_state.selectedCustomers).toEqual({ "1": 3 });
                });
            });
        });
    });