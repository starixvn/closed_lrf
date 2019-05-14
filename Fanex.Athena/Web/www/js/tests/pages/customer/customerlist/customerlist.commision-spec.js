define(["jquery",
    "common/site",
    "lib/jqgrid/jquery.jqgrid.additional",
    "common/popup",
    "pages/customer/customerlist/customerlist.state",
    "pages/customer/customerlist/customerlist.grid",
    "pages/customer/customerlist/customerlist.commision"],
    function ($, Site, jqGridAdditional, Popup, CustomerListState, CustomerListGrid, CustomerListCommision) {
        describe("CustomerListCommision", function () {
            function mockAjax(url, response) {
                jasmine.Ajax
                        .stubRequest(url)
                        .andReturn({
                            responseText: JSON.stringify(response)
                        });
            }

            beforeAll(function () {
                spyOn(Site, "getSingleResource").and.callFake(function (str) {
                    return str;
                });
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                    return url;
                });
            });

            describe("initialize()", function () {
                beforeAll(function () {
                    spyOn(CustomerListState, "getState");
                });

                it("get customer list stage", function () {
                    CustomerListCommision.initialize();

                    expect(CustomerListState.getState).toHaveBeenCalled();
                });

                it("showMoveCustomerToGroup() should be called when #MoveToGroup is clicked", function () {
                    setFixtures('<button id="MoveToGroup"></button>');
                    spyOn(CustomerListCommision, "showMoveCustomerToGroup");

                    CustomerListCommision.initialize();
                    $("#MoveToGroup").click();

                    expect(CustomerListCommision.showMoveCustomerToGroup).toHaveBeenCalled();
                });

                it("showUpdateCustComm() should be called when #UpdateComm is clicked", function () {
                    setFixtures('<button id="UpdateComm" data-group-id="1"></button>');
                    spyOn(CustomerListCommision, "showUpdateCustComm");

                    CustomerListCommision.initialize();
                    $("#UpdateComm").click();

                    expect(CustomerListCommision.showUpdateCustComm).toHaveBeenCalledWith(1);
                });

                it("showRemoveFromGroup() should be called when #RemoveFromGroup is clicked", function () {
                    setFixtures('<button id="RemoveFromGroup"></button>');
                    spyOn(CustomerListCommision, "showRemoveFromGroup");

                    CustomerListCommision.initialize();
                    $("#RemoveFromGroup").click();

                    expect(CustomerListCommision.showRemoveFromGroup).toHaveBeenCalled();
                });

                it("newGroupChanged() should be called when #GroupListSelect is change", function () {
                    setFixtures('<select id="GroupListSelect"></select>');
                    spyOn(CustomerListCommision, "newGroupChanged");

                    CustomerListCommision.initialize();
                    $("#GroupListSelect").change();

                    expect(CustomerListCommision.newGroupChanged).toHaveBeenCalled();
                });

                it("commissionOnChange() should be called when #CustSBComm1 is change", function () {
                    setFixtures('<select id="CustSBComm1"><option value="1" selected>1<option></select>');
                    spyOn(CustomerListCommision, "commissionOnChange");

                    CustomerListCommision.initialize();
                    $("#CustSBComm1").change();

                    expect(CustomerListCommision.commissionOnChange).toHaveBeenCalledWith("1", "CustSBComm");
                });

                it("commissionOnChange() should be called when #CustParlayComm1 is change", function () {
                    setFixtures('<select id="CustParlayComm1"><option value="1" selected>1<option></select>');
                    spyOn(CustomerListCommision, "commissionOnChange");

                    CustomerListCommision.initialize();
                    $("#CustParlayComm1").change();

                    expect(CustomerListCommision.commissionOnChange).toHaveBeenCalledWith("1", "CustParlayComm");
                });

                it("commissionOnChange() should be called when #CustNGComm1 is change", function () {
                    setFixtures('<select id="CustNGComm1"><option value="1" selected>1<option></select>');
                    spyOn(CustomerListCommision, "commissionOnChange");

                    CustomerListCommision.initialize();
                    $("#CustNGComm1").change();

                    expect(CustomerListCommision.commissionOnChange).toHaveBeenCalledWith("1", "CustNGComm");
                });

                it("commissionOnChange() should be called when #CustLCComm1 is change", function () {
                    setFixtures('<select id="CustLCComm1"><option value="1" selected>1<option></select>');
                    spyOn(CustomerListCommision, "commissionOnChange");

                    CustomerListCommision.initialize();
                    $("#CustLCComm1").change();

                    expect(CustomerListCommision.commissionOnChange).toHaveBeenCalledWith("1", "CustLCComm");
                });

                it("commissionOnChange() should be called when #CustCSComm1 is change", function () {
                    setFixtures('<select id="CustCSComm1"><option value="1" selected>1<option></select>');
                    spyOn(CustomerListCommision, "commissionOnChange");

                    CustomerListCommision.initialize();
                    $("#CustCSComm1").change();

                    expect(CustomerListCommision.commissionOnChange).toHaveBeenCalledWith("1", "CustCSComm");
                });
            });

            describe("commissionOnChange(value, idName)", function () {
                function setFixturesForCommGroup(id, comm1) {
                    setFixtures('<select id="' + id + '1"><option value="' + comm1 + '" selected="selected"></option></select>');
                    appendSetFixtures('<select id="' + id + '2"><option value="0"></option><option value="1" selected="selected"></option><option value="5"></option></select>');
                    appendSetFixtures('<select id="' + id + '3"><option value="0"></option><option value="1" selected="selected"></option><option value="5"></option></select>');
                }

                var actualMethod, actualOptions;

                beforeAll(function () {
                    spyOn($.fn, "selectList").and.callFake(function (methodName, options) {
                        actualMethod = methodName;
                        actualOptions = options;
                    });
                });

                it("set CustSBComm2 and CustSBComm3 to Zero and disable CustSBComm2 and CustSBComm3 selection when CustSBComm1 value is changed to 15", function () {
                    setFixturesForCommGroup("CustSBComm", 15);

                    CustomerListCommision.commissionOnChange("15", "CustSBComm");

                    expect($("#CustSBComm2").val()).toEqual('0');
                    expect($("#CustSBComm3").val()).toEqual('0');
                    expect(actualMethod).toEqual("update");
                    expect(actualOptions.isDisabled).toEqual(true);
                });

                it("enable CustSBComm2 and CustSBComm3 selection when CustSBComm1 value is not changed to 15", function () {
                    setFixturesForCommGroup("CustSBComm", 1);

                    CustomerListCommision.commissionOnChange("1", "CustSBComm");

                    expect($("#CustSBComm2").val()).toEqual('1');
                    expect($("#CustSBComm3").val()).toEqual('1');
                    expect(actualMethod).toEqual("disabled");
                    expect(actualOptions).toEqual(false);
                });

                it("set CustParlayComm2 and CustParlayComm3 to Zero and disable CustParlayComm2 and CustParlayComm3 selection when CustParlayComm1 value is changed to 15", function () {
                    setFixturesForCommGroup("CustParlayComm", 15);

                    CustomerListCommision.commissionOnChange("15", "CustParlayComm");

                    expect($("#CustParlayComm2").val()).toEqual('0');
                    expect($("#CustParlayComm3").val()).toEqual('0');
                    expect(actualMethod).toEqual("update");
                    expect(actualOptions.isDisabled).toEqual(true);
                });

                it("enable CustParlayComm2 and CustParlayComm3 selection when CustParlayComm1 value is not changed to 15", function () {
                    setFixturesForCommGroup("CustParlayComm", 1);

                    CustomerListCommision.commissionOnChange("1", "CustParlayComm");

                    expect($("#CustParlayComm2").val()).toEqual('1');
                    expect($("#CustParlayComm3").val()).toEqual('1');
                    expect(actualMethod).toEqual("disabled");
                    expect(actualOptions).toEqual(false);
                });

                it("set CustNGComm2 and CustNGComm3 to Zero and disable CustNGComm2 and CustNGComm3 selection when CustNGComm1 value is changed to 15", function () {
                    setFixturesForCommGroup("CustNGComm", 15);

                    CustomerListCommision.commissionOnChange("15", "CustNGComm");

                    expect($("#CustNGComm2").val()).toEqual('0');
                    expect($("#CustNGComm3").val()).toEqual('0');
                    expect(actualMethod).toEqual("update");
                    expect(actualOptions.isDisabled).toEqual(true);
                });

                it("enable CustNGComm2 and CustNGComm3 selection when CustNGComm1 value is not changed to 15", function () {
                    setFixturesForCommGroup("CustNGComm", 1);

                    CustomerListCommision.commissionOnChange("1", "CustNGComm");

                    expect($("#CustNGComm2").val()).toEqual('1');
                    expect($("#CustNGComm3").val()).toEqual('1');
                    expect(actualMethod).toEqual("disabled");
                    expect(actualOptions).toEqual(false);
                });

                it("set CustLCComm2 and CustLCComm3 to Zero and disable CustLCComm2 and CustLCComm3 selection when CustLCComm1 value is changed to 15", function () {
                    setFixturesForCommGroup("CustLCComm", 15);

                    CustomerListCommision.commissionOnChange("15", "CustLCComm");

                    expect($("#CustLCComm2").val()).toEqual('0');
                    expect($("#CustLCComm3").val()).toEqual('0');
                    expect(actualMethod).toEqual("update");
                    expect(actualOptions.isDisabled).toEqual(true);
                });

                it("enable CustLCComm2 and CustLCComm3 selection when CustLCComm1 value is not changed to 15", function () {
                    setFixturesForCommGroup("CustLCComm", 1);

                    CustomerListCommision.commissionOnChange("1", "CustLCComm");

                    expect($("#CustLCComm2").val()).toEqual('1');
                    expect($("#CustLCComm3").val()).toEqual('1');
                    expect(actualMethod).toEqual("disabled");
                    expect(actualOptions).toEqual(false);
                });

                it("set CustCSComm2 and CustCSComm3 to Zero and disable CustCSComm2 and CustCSComm3 selection when CustCSComm1 value is changed to 15", function () {
                    setFixturesForCommGroup("CustCSComm", 15);

                    CustomerListCommision.commissionOnChange("15", "CustCSComm");

                    expect($("#CustCSComm2").val()).toEqual('0');
                    expect($("#CustCSComm3").val()).toEqual('0');
                    expect(actualMethod).toEqual("update");
                    expect(actualOptions.isDisabled).toEqual(true);
                });

                it("enable CustCSComm2 and CustCSComm3 selection when CustCSComm1 value is not changed to 15", function () {
                    setFixturesForCommGroup("CustCSComm", 1);

                    CustomerListCommision.commissionOnChange("1", "CustCSComm");

                    expect($("#CustCSComm2").val()).toEqual('1');
                    expect($("#CustCSComm3").val()).toEqual('1');
                    expect(actualMethod).toEqual("disabled");
                    expect(actualOptions).toEqual(false);
                });
            });

            describe("processGroupCommItem(status)", function () {
                beforeEach(function () {
                    setFixtures('<table>'
                    + '<tr id="row1"><td><input type="checkbox" id="1" class="check-child"></td></tr>'
                    + '<tr id="row2"><td><input type="checkbox" id="2" class="check-child" checked></td></tr>'
                    + '<tr id="row3"><td><input type="checkbox" id="3" class="check-child"></td></tr>'
                    + '<tr id="row4"><td><input type="checkbox" id="4" class="check-child" checked></td></tr>'
                    + '<table>');
                });

                it("remove checked items if status is true", function () {
                    CustomerListCommision.processGroupCommItem(true);

                    expect($("table tr").length).toEqual(2);
                });

                it("do not remove checked items if status is false", function () {
                    CustomerListCommision.processGroupCommItem(false);

                    expect($("table tr").length).toEqual(4);
                });
            });

            describe("showMoveCustomerToGroup()", function () {
                it("clear Notification and show popup", function () {
                    spyOn(CustomerListCommision, "clearNotification");
                    spyOn(Popup, "openPopupWithButton");

                    CustomerListCommision.showMoveCustomerToGroup();

                    expect(CustomerListCommision.clearNotification).toHaveBeenCalled();
                    expect(Popup.openPopupWithButton).toHaveBeenCalled();
                });

                it("moveCustomerToGroup() should be called if popup's OK button is clicked", function () {
                    var buttonOK;
                    spyOn(Popup, "openPopupWithButton").and.callFake(function (element, options, buttons) {
                        var $element = $(element);
                        $.each(buttons, function (index, button) {
                            var $button = $('<button type="button" class="' + button.classes + '">' + button.text + '</button>');

                            if (button.text === "OK") {
                                buttonOK = $button;
                            }

                            $element.append($button);
                            $button.on("click", button.click);
                        });

                        appendSetFixtures($element);
                    });
                    spyOn(CustomerListCommision, "clearNotification");
                    spyOn(CustomerListCommision, "moveCustomerToGroup");

                    CustomerListCommision.showMoveCustomerToGroup();
                    buttonOK.click();

                    expect(CustomerListCommision.moveCustomerToGroup).toHaveBeenCalled();
                });
            });

            describe("moveCustomerToGroup()", function () {
                beforeAll(function () {
                    spyOn(CustomerListCommision, "ajaxStart");
                    spyOn(CustomerListCommision, "ajaxStop");
                    spyOn(CustomerListCommision, "showMsg");
                });

                it("shows message 'ChooseGroupMsg' if no group is choosen", function () {
                    setFixtures('<select id="GroupListSelect"><option value="-1" selected></option></select>');
                    $("#GroupListSelect").val("-1");

                    CustomerListCommision.moveCustomerToGroup();

                    expect(CustomerListCommision.showMsg).toHaveBeenCalledWith("ChooseGroupMsg", false);
                });

                it("shows message 'YouNotChooseAnyCustomerMsg' if no customer is choosen", function () {
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: {}
                    });
                    setFixtures('<select id="GroupListSelect"><option value="1" selected></option></select>');

                    CustomerListCommision.initialize();
                    CustomerListCommision.moveCustomerToGroup();

                    expect(CustomerListCommision.showMsg).toHaveBeenCalledWith("YouNotChooseAnyCustomerMsg", false);
                });

                it("shows message 'CustomersExistedinGroupMsg' if selected groups are the group wish to move", function () {
                    var getSelectedCustomer = function () {
                        this.cus1 = 1;
                    };
                    getSelectedCustomer.prototype = { "test": "" };
                    var selectedCustomers = new getSelectedCustomer();

                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: selectedCustomers
                    });
                    setFixtures('<select id="GroupListSelect"><option value="1" selected></option></select>');

                    CustomerListCommision.initialize();
                    CustomerListCommision.moveCustomerToGroup();

                    expect(CustomerListCommision.showMsg).toHaveBeenCalledWith("CustomersExistedinGroupMsg", false);
                });

                it("shows error message if API calling fails", function () {
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: { "cust1": "group2" }
                    });
                    setFixtures('<select id="GroupListSelect"><option value="group1" selected></option></select>');

                    jasmine.Ajax.install();
                    mockAjax("CustomerAPI/MoveToGroupCom", {
                        Success: false,
                        ErrorMessage: "Error"
                    });

                    CustomerListCommision.initialize();
                    CustomerListCommision.moveCustomerToGroup();

                    expect(CustomerListCommision.showMsg).toHaveBeenCalledWith("Error", false);
                    jasmine.Ajax.uninstall();
                });

                it("CustomerListGrid.updateGridGroupAndComm should be called if API calling succeeds", function () {
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: { "cust1": "group2" }
                    });
                    setFixtures('<select id="GroupListSelect"><option value="group1" selected></option></select>');
                    spyOn(CustomerListGrid, "updateGridGroupAndComm");

                    jasmine.Ajax.install();
                    mockAjax("CustomerAPI/MoveToGroupCom", {
                        Success: true,
                        ExtendedData: {
                            GroupName: "GroupName"
                        }
                    });

                    CustomerListCommision.initialize();
                    CustomerListCommision.moveCustomerToGroup();

                    expect(CustomerListGrid.updateGridGroupAndComm).toHaveBeenCalled();
                    jasmine.Ajax.uninstall();
                });

                it("CustomerListGrid.updateGridGroupAndComm should be called if API calling succeeds with correct params", function () {
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: { "cust1": "2" }
                    });
                    setFixtures('<select id="GroupListSelect"><option value="1" selected></option></select>');
                    spyOn(CustomerListGrid, "updateGridGroupAndComm");

                    jasmine.Ajax.install();
                    var extendedData = {
                        GroupName: "This name is more than 17 characters",
                        GroupColor: "GroupColor",
                        SBComm: "SBComm",
                        NGComm: "NGComm",
                        RNGComm: "RNGComm"
                    };
                    mockAjax("CustomerAPI/MoveToGroupCom", {
                        Success: true,
                        ExtendedData: extendedData
                    });

                    CustomerListCommision.initialize();
                    CustomerListCommision.moveCustomerToGroup();

                    expect(CustomerListGrid.updateGridGroupAndComm).toHaveBeenCalledWith(
                        1,
                        '<span title="This name is more than 17 characters">This name is m...</span>',
                        extendedData.GroupColor,
                        extendedData.SBComm,
                        extendedData.NGComm,
                        extendedData.RNGComm);
                    jasmine.Ajax.uninstall();
                });
            });

            describe("showUpdateCustComm(groupCommId)", function () {
                it("clear Notification and shown popup", function () {
                    spyOn(CustomerListCommision, "clearNotification");
                    spyOn(Popup, "openPopupWithButton");
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: { "cust1": 0 }
                    });

                    CustomerListCommision.initialize();
                    CustomerListCommision.showUpdateCustComm();

                    expect(CustomerListCommision.clearNotification).toHaveBeenCalled();
                    expect(Popup.openPopupWithButton).toHaveBeenCalled();
                });

                it("InfoMsg should be shown if a customer is being in a group ", function () {
                    spyOn(CustomerListCommision, "clearNotification");
                    spyOn(Popup, "openPopupWithButton");
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: { "cust1": "group1" }
                    });
                    setFixtures('<div id="InfoMsg" style="display:none"></div>');

                    CustomerListCommision.initialize();
                    CustomerListCommision.showUpdateCustComm();

                    expect(CustomerListCommision.clearNotification).toHaveBeenCalled();
                    expect(Popup.openPopupWithButton).toHaveBeenCalled();
                    expect($("#Infor").is(":hidden")).toBe(false);
                });

                it("updateCustomerComm() should be called if popup's Save button is clicked", function () {
                    var buttonSave;
                    spyOn(Popup, "openPopupWithButton").and.callFake(function (element, options, buttons) {
                        var $element = $(element);
                        $.each(buttons, function (index, button) {
                            var $button = $('<button type="button" class="' + button.classes + '">' + button.text + '</button>');

                            if (button.text === "Save") {
                                buttonSave = $button;
                            }

                            $element.append($button);
                            $button.on("click", button.click);
                        });

                        appendSetFixtures($element);
                    });
                    spyOn(CustomerListCommision, "clearNotification");
                    spyOn(CustomerListCommision, "updateCustomerComm");
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: {}
                    });

                    CustomerListCommision.showUpdateCustComm();
                    buttonSave.click();

                    expect(CustomerListCommision.updateCustomerComm).toHaveBeenCalled();
                });

                it("commission select should be reset if popup is opened", function () {
                    setFixtures('<select class="commission-selection" id="id"></select>')
                    var option, selectFunction, selectOption;
                    spyOn(Popup, "openPopupWithButton").and.callFake(function (element, options, buttons) {
                        option = options;
                    });
                    spyOn(CustomerListCommision, "clearNotification");
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: {}
                    });
                    spyOn($.fn, "selectList").and.callFake(function (func, option) {
                        selectFunction = func;
                        selectOption = option
                    });

                    CustomerListCommision.showUpdateCustComm();
                    option.onOpen();

                    expect($.fn.selectList).toHaveBeenCalled();
                    expect(selectFunction).toBe("update");
                    expect(selectOption.labelText).toBe("0");
                });
            });

            describe("initCommissionParam(id)", function () {
                it("return correct value", function () {
                    setFixtures('<select id="CustSBComm1"><option value="2" selected="selected"></option></select>');
                    appendSetFixtures('<select id="CustSBComm2"><option value="0"></option><option value="1" selected="selected"></option><option value="5"></option></select>');
                    appendSetFixtures('<select id="CustSBComm3"><option value="0"></option><option value="1" selected="selected"></option><option value="5"></option></select>');
                    var expectedValue = "0.0211";

                    var value = CustomerListCommision.initCommissionParam("#CustSBComm");

                    expect(value).toEqual(expectedValue);
                });
            });

            describe("updateCustomerComm(groupCommId)", function () {
                beforeAll(function () {
                    spyOn(CustomerListCommision, "ajaxStart");
                    spyOn(CustomerListCommision, "ajaxStop");
                    spyOn(CustomerListCommision, "showMsg");
                });

                it("shows message 'YouNotChooseAnyCustomerMsg' if no customer is choosen", function () {
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: {}
                    });

                    CustomerListCommision.initialize();
                    CustomerListCommision.updateCustomerComm();

                    expect(CustomerListCommision.showMsg).toHaveBeenCalledWith("YouNotChooseAnyCustomerMsg", false);
                });

                it("shows error message if API calling fails", function () {
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: { "cust1": "group2" }
                    });
                    setFixtures('<select id="GroupListSelect"><option value="group1" selected></option></select>');

                    jasmine.Ajax.install();
                    mockAjax("CustomerAPI/UpdateCustomerCom", {
                        Success: false,
                        ErrorMessage: "Error"
                    });

                    CustomerListCommision.initialize();
                    CustomerListCommision.updateCustomerComm();

                    expect(CustomerListCommision.showMsg).toHaveBeenCalledWith("Error", false);
                    jasmine.Ajax.uninstall();
                });

                it("CustomerListGrid.updateGridGroupAndComm should be called if API calling succeeds", function () {
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: { "cust1": "group2" }
                    });
                    setFixtures('<select id="GroupListSelect"><option value="group1" selected></option></select>');
                    spyOn(CustomerListCommision, "initCommissionParam").and.returnValue(0.0001);
                    spyOn(CustomerListGrid, "updateGridGroupAndComm");

                    jasmine.Ajax.install();
                    mockAjax("CustomerAPI/UpdateCustomerCom", {
                        Success: true,
                        ExtendedData: {
                            GroupName: "GroupName"
                        }
                    });

                    CustomerListCommision.initialize();
                    CustomerListCommision.updateCustomerComm(1);

                    expect(CustomerListCommision.showMsg).toHaveBeenCalledWith("UpdateCommSucessfulMsg", true);
                    expect(CustomerListGrid.updateGridGroupAndComm).toHaveBeenCalled();
                    jasmine.Ajax.uninstall();
                });

                it("CustomerListGrid.updateGridGroupAndComm should be called if API calling succeeds with correct params", function () {
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: { "cust1": "group2" }
                    });
                    setFixtures('<select id="GroupListSelect"><option value="group1" selected></option></select>');
                    spyOn(CustomerListCommision, "initCommissionParam").and.returnValue(0.0001);
                    spyOn(CustomerListGrid, "updateGridGroupAndComm");
                    jasmine.Ajax.install();

                    var extendedData = {
                        GroupName: "GroupName",
                        GroupColor: "GroupColor",
                        SBComm: "SBComm",
                        NGComm: "NGComm",
                        RNGComm: "RNGComm"
                    };
                    mockAjax("CustomerAPI/UpdateCustomerCom", {
                        Success: true,
                        ExtendedData: extendedData
                    });

                    CustomerListCommision.initialize();
                    CustomerListCommision.updateCustomerComm(1);

                    expect(CustomerListGrid.updateGridGroupAndComm).toHaveBeenCalledWith(
                        0,
                        extendedData.GroupName,
                        extendedData.GroupColor,
                        extendedData.SBComm,
                        extendedData.NGComm,
                        extendedData.RNGComm);
                    jasmine.Ajax.uninstall();
                });
            });

            describe("showRemoveFromGroup()", function () {
                it("clear Notification and show popup", function () {
                    spyOn(CustomerListCommision, "clearNotification");
                    spyOn(Popup, "openPopupWithButton");
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: {}
                    });

                    CustomerListCommision.initialize();
                    CustomerListCommision.showRemoveFromGroup();

                    expect(CustomerListCommision.clearNotification).toHaveBeenCalled();
                    expect(Popup.openPopupWithButton).toHaveBeenCalled();
                });

                it("RemoveConfirmMsg should be shown message 'RemoveTheseCustomersFromGroupMsg' if customers are selected", function () {
                    spyOn(CustomerListCommision, "clearNotification");
                    spyOn(Popup, "openPopupWithButton");
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: { "cust1": "group1", "cust2": "group2" }
                    });
                    setFixtures('<div id="RemoveConfirmMsg"></div>');

                    CustomerListCommision.initialize();
                    CustomerListCommision.showRemoveFromGroup();

                    expect($("#RemoveConfirmMsg").html()).toEqual("RemoveTheseCustomersFromGroupMsg");
                });

                it("removeFromGroupComm() should be called if popup's OK button is clicked", function () {
                    var buttonOK;
                    spyOn(Popup, "openPopupWithButton").and.callFake(function (element, options, buttons) {
                        var $element = $(element);
                        $.each(buttons, function (index, button) {
                            var $button = $('<button type="button" class="' + button.classes + '">' + button.text + '</button>');

                            if (button.text === "OK") {
                                buttonOK = $button;
                            }

                            $element.append($button);
                            $button.on("click", button.click);
                        });

                        appendSetFixtures($element);
                    });
                    spyOn(CustomerListCommision, "clearNotification");
                    spyOn(CustomerListCommision, "removeFromGroupComm");
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: {}
                    });

                    CustomerListCommision.initialize();
                    CustomerListCommision.showRemoveFromGroup();
                    buttonOK.click();

                    expect(CustomerListCommision.removeFromGroupComm).toHaveBeenCalled();
                });

                it("the second radio button is checked if popup's Cancel button is clicked", function () {
                    var buttonCancel;
                    spyOn(Popup, "openPopupWithButton").and.callFake(function (element, options, buttons) {
                        var $element = $(element);
                        $.each(buttons, function (index, button) {
                            var $button = $('<button type="button" class="' + button.classes + '">' + button.text + '</button>');

                            if (button.text === "Cancel") {
                                buttonCancel = $button;
                            }

                            $element.append($button);
                            $button.on("click", button.click);
                        });

                        appendSetFixtures($element);
                    });
                    spyOn(CustomerListCommision, "clearNotification");
                    spyOn(CustomerListCommision, "removeFromGroupComm");
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: {}
                    });
                    spyOn($.fn, "prop");

                    CustomerListCommision.initialize();
                    CustomerListCommision.showRemoveFromGroup();
                    buttonCancel.click();

                    expect($('input[name="RadioComm"]:eq(1)').prop).toHaveBeenCalledWith("checked", true);
                });
            });

            describe("removeFromGroupComm()", function () {
                beforeAll(function () {
                    spyOn(CustomerListCommision, "ajaxStart");
                    spyOn(CustomerListCommision, "ajaxStop");
                    spyOn(CustomerListCommision, "showMsg");
                });

                it("shows message 'YouNotChooseAnyCustomerMsg' if no customer is choosen", function () {
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: {}
                    });
                    setFixtures('<select id="GroupListSelect"><option value="1" selected></option></select>');

                    CustomerListCommision.initialize();
                    CustomerListCommision.removeFromGroupComm();

                    expect(CustomerListCommision.showMsg).toHaveBeenCalledWith("YouNotChooseAnyCustomerMsg", false);
                });

                it("shows message 'CustomerNotBelongAnyGroupMsg' if all customers are not in any group", function () {
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: { "cust1": 0 }
                    });
                    setFixtures('<select id="GroupListSelect"><option value="group1" selected></option></select>');

                    CustomerListCommision.initialize();
                    CustomerListCommision.removeFromGroupComm();

                    expect(CustomerListCommision.showMsg).toHaveBeenCalledWith("CustomerNotBelongAnyGroupMsg", false);
                });

                it("shows error message if API calling fails", function () {
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: { "cust1": 1 }
                    });
                    setFixtures('<select id="GroupListSelect"><option value="group1" selected></option></select>');

                    jasmine.Ajax.install();
                    mockAjax("CustomerAPI/RemoveFromGroupCom", {
                        Success: false,
                        ErrorMessage: "Error"
                    });

                    CustomerListCommision.initialize();
                    CustomerListCommision.removeFromGroupComm();

                    expect(CustomerListCommision.showMsg).toHaveBeenCalledWith("Error", false);
                    jasmine.Ajax.uninstall();
                });

                it("CustomerListGrid.updateGridGroup should be called if API calling succeeds and does not remove player comm", function () {
                    setFixtures('<input type="radio" id="KeepComm" checked="checked">');
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: { "cust1": 1 }
                    });
                    spyOn(CustomerListGrid, "updateGridGroup");

                    jasmine.Ajax.install();
                    mockAjax("CustomerAPI/RemoveFromGroupCom", {
                        Success: true,
                        ExtendedData: {
                            GroupName: "GroupName"
                        }
                    });

                    CustomerListCommision.initialize();
                    CustomerListCommision.removeFromGroupComm();

                    expect(CustomerListGrid.updateGridGroup).toHaveBeenCalled();
                    jasmine.Ajax.uninstall();
                });

                it("CustomerListGrid.updateGridGroupAndComm should be called if API calling succeeds and remove player comm", function () {
                    setFixtures('<input type="radio" id="KeepComm">');
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: { "cust1": 1 }
                    });
                    spyOn(CustomerListGrid, "updateGridGroupAndComm");

                    jasmine.Ajax.install();
                    mockAjax("CustomerAPI/RemoveFromGroupCom", {
                        Success: true,
                        ExtendedData: {
                            GroupName: "GroupName"
                        }
                    });

                    CustomerListCommision.initialize();
                    CustomerListCommision.removeFromGroupComm();

                    expect(CustomerListGrid.updateGridGroupAndComm).toHaveBeenCalled();
                    jasmine.Ajax.uninstall();
                });

                it("shows success message 'CustomersBelongGroupsBeRemovedMsg' if the selected customers have customers who are not belong any group", function () {
                    setFixtures('<input type="radio" id="KeepComm" checked="checked">');
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: { "cust1": 1, "cust2": 0 }
                    });
                    spyOn(CustomerListGrid, "updateGridGroup");

                    jasmine.Ajax.install();
                    mockAjax("CustomerAPI/RemoveFromGroupCom", {
                        Success: true,
                        Message: "Success"
                    });

                    CustomerListCommision.initialize();
                    CustomerListCommision.removeFromGroupComm();

                    expect(CustomerListCommision.showMsg).toHaveBeenCalledWith("Success! </br> CustomersBelongGroupsBeRemovedMsg", true);
                    jasmine.Ajax.uninstall();
                });

                it("does not show message 'CustomersBelongGroupsBeRemovedMsg' if all selected customers are in group", function () {
                    setFixtures('<input type="radio" id="KeepComm" checked="checked">');
                    spyOn(CustomerListState, "getState").and.returnValue({
                        selectedCustomers: { "cust1": 1 }
                    });
                    spyOn(CustomerListGrid, "updateGridGroup");

                    jasmine.Ajax.install();
                    mockAjax("CustomerAPI/RemoveFromGroupCom", {
                        Success: true,
                        Message: "Success"
                    });

                    CustomerListCommision.initialize();
                    CustomerListCommision.removeFromGroupComm();

                    expect(CustomerListCommision.showMsg).toHaveBeenCalledWith("Success", true);
                    jasmine.Ajax.uninstall();
                });
            });

            describe("showMsg(msg, isSuccess)", function () {
                beforeEach(function () {
                    setFixtures('<div class="success-message"></div><div class="error-message"></div>');
                });

                it("success-message should be shown if isSuccess is true", function () {
                    CustomerListCommision.showMsg("Success", true);

                    expect($(".success-message").is(":hidden")).toBe(false);
                    expect($(".success-message").html()).toEqual("Success");
                    expect($(".error-message").is(":hidden")).toBe(true);
                });

                it("error-message should be shown if isSuccess is false", function () {
                    CustomerListCommision.showMsg("Error", false);

                    expect($(".error-message").is(":hidden")).toBe(false);
                    expect($(".error-message").html()).toEqual("Error");
                    expect($(".success-message").is(":hidden")).toBe(true);
                });
            });

            describe("ajaxStart()", function () {
                it("controls should be hidden and shown ajax-loading", function () {
                    setFixtures('<div class="success-message"></div>'
                        + '<div class="error-message"></div>'
                        + '<div class="ajax-loading" style="display:none"></div>'
                        + '<div class="popup-button"><button>Button</button></div>'
                        + '<a class="popup-close"></a>');

                    CustomerListCommision.ajaxStart();

                    expect($(".error-message").is(":hidden")).toBe(true);
                    expect($(".success-message").is(":hidden")).toBe(true);
                    expect($(".ajax-loading").is(":hidden")).toBe(false);
                    expect($("button").is(":disabled")).toBe(true);
                    expect($(".popup-close").hasClass("disabled")).toBe(true);
                });
            });

            describe("ajaxStop()", function () {
                it("controls should be shown and hidden ajax-loading", function () {
                    setFixtures('<div class="ajax-loading"></div>'
                        + '<div class="popup-button"><button disabled></button></div>'
                        + '<a class="popup-close disabled"></a>');

                    CustomerListCommision.ajaxStop();

                    expect($(".ajax-loading").is(":hidden")).toBe(true);
                    expect($("button").is(":disabled")).toBe(false);
                    expect($(".popup-close").hasClass("disabled")).toBe(false);
                });
            });

            describe("clearNotification()", function () {
                it("messages and ajax-loading should be hidden", function () {
                    setFixtures('<div class="success-message"></div>'
                        + '<div class="error-message"></div>'
                        + '<div class="ajax-loading"></div>');

                    CustomerListCommision.clearNotification();

                    expect($(".ajax-loading").is(":hidden")).toBe(true);
                    expect($("button").is(":disabled")).toBe(false);
                    expect($(".popup-close").hasClass("disabled")).toBe(false);
                });
            });

            describe("newGroupChanged(obj)", function () {
                it("changes comm information to selected group comm", function () {
                    setFixtures('<select id="GroupListSelect" selectedIndex="0"><option value="1" selected>1<option></select>');
                    appendSetFixtures('<div id="NewSbComm"></div>'
                        + '<div id="NewParlayComm"></div>'
                        + '<div id="NewNgComm"></div>'
                        + '<div id="NewCsComm"></div>'
                        + '<input id="SBComm1" value="SBComm1">'
                        + '<input id="ParlayComm1" value="ParlayComm1">'
                        + '<input id="NGComm1" value="NGComm1">'
                        + '<input id="CSComm1" value="CSComm1">');

                    CustomerListCommision.newGroupChanged({
                        selectedIndex: 0,
                        options: {
                            0: {
                                value: 1
                            }
                        }
                    });

                    expect($("#NewSbComm").text()).toEqual("SBComm1");
                    expect($("#NewParlayComm").text()).toEqual("ParlayComm1");
                    expect($("#NewNgComm").text()).toEqual("NGComm1");
                    expect($("#NewCsComm").text()).toEqual("CSComm1");
                });
            });
        });
    });