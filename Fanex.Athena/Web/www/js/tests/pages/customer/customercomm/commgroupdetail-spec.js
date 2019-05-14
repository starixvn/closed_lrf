define(["jquery", "common/site", "common/popup", "pages/customer/customercomm/commgroupdetail", "pages/customer/customercomm/commgroup", "lib/jquery.colorpicker"],
    function ($, Site, Popup, CustomerCommGroupDetail, CustomerCommGroup) {
        describe("CustomerCommGroupDetail", function () {
            beforeAll(function () {
                spyOn(Site, "initialize");
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                    return url;
                });
                spyOn(Site, "getSingleResource").and.callFake(function (str) {
                    return str;
                });
            });

            describe("initialize(titleResource)", function () {
                it("Site is initialized", function () {
                    spyOn(CustomerCommGroup, "setPageTitle");
                    spyOn($.fn, "colorPicker");

                    CustomerCommGroupDetail.initialize("title");

                    expect(Site.initialize).toHaveBeenCalled();
                    expect(CustomerCommGroup.setPageTitle).toHaveBeenCalledWith("title");
                    expect($("#GroupColor").colorPicker).toHaveBeenCalled();
                });

                it("initEvent should be called", function () {                  
                    spyOn(CustomerCommGroupDetail, "initEvent");

                    CustomerCommGroupDetail.initialize();

                    expect(CustomerCommGroupDetail.initEvent).toHaveBeenCalled();                  
                });
            });

            describe("initEvent()", function () {
                it("remove validation class on #GroupName when inputting data in it", function () {
                    setFixtures('<input type="text" id="GroupName" class="invalid valid">' + '<button id="Submit" disabled="disabled"></button>');

                    CustomerCommGroupDetail.initEvent();
                    $("#GroupName").keyup();

                    expect($("#GroupName").hasClass("invalid")).toEqual(false);
                    expect($("#GroupName").hasClass("valid")).toEqual(false);
                    expect($("#Submit").is("disabled")).toEqual(false);
                });

                it("redirect to Index if Cancel button is clicked", function () {
                    setFixtures('<button id="Cancel"></button>');
                    spyOn(CustomerCommGroup, "setPageTitle");
                    spyOn(Site, "redirect");

                    CustomerCommGroupDetail.initEvent();
                    $("#Cancel").click();

                    expect(CustomerCommGroup.setPageTitle).toHaveBeenCalledWith("CommissionGroupList");
                    expect(Site.redirect).toHaveBeenCalledWith("CustomerComGroup/Index");
                });

                describe("commissionOnChange(value, idName)", function () {
                    var actualMethod, actualOptions;

                    beforeAll(function () {
                        spyOn($.fn, "selectList").and.callFake(function (methodName, options) {
                            actualMethod = methodName;
                            actualOptions = options;
                        });
                    });

                    it("set SBComm2 and SBComm3 to Zero and disable SBComm2 and SBComm3 selection when SBcomm1 value is changed to 15", function () {
                        setFixtures('<select id="SBComm1"><option value="15" selected="selected"></option></select>');
                        appendSetFixtures('<select id="SBComm2"><option value="0"></option><option value="1" selected="selected"></option><option value="15"></option></select>');
                        appendSetFixtures('<select id="SBComm3"><option value="0"></option><option value="1" selected="selected"></option><option value="15"></option></select>');

                        CustomerCommGroupDetail.initEvent();
                        $("#SBComm1").change();

                        expect($("#SBComm2").val()).toEqual('0');
                        expect($("#SBComm3").val()).toEqual('0');
                        expect(actualMethod).toEqual("update");
                        expect(actualOptions.isDisabled).toEqual(true);
                    });

                    it("enable SBComm2 and SBComm3 selection when SBcomm1 value is not changed to 15", function () {
                        setFixtures('<select id="SBComm1"><option value="1" selected="selected"></option></select>');
                        appendSetFixtures('<select id="SBComm2"><option value="0"></option><option value="1" selected="selected"></option><option value="15"></option></select>');
                        appendSetFixtures('<select id="SBComm3"><option value="0"></option><option value="1" selected="selected"></option><option value="15"></option></select>');

                        CustomerCommGroupDetail.initEvent();
                        $("#SBComm1").change();

                        expect($("#SBComm2").val()).toEqual('1');
                        expect($("#SBComm3").val()).toEqual('1');
                        expect(actualMethod).toEqual("disabled");
                        expect(actualOptions).toEqual(false);
                    });

                    it("set ParlayComm2 and ParlayComm3 to Zero and disable ParlayComm2 and ParlayComm3 selection when ParlayComm1 value is changed to 15", function () {
                        setFixtures('<select id="ParlayComm1"><option value="15" selected="selected"></option></select>');
                        appendSetFixtures('<select id="ParlayComm2"><option value="0"></option><option value="1" selected="selected"></option><option value="15"></option></select>');
                        appendSetFixtures('<select id="ParlayComm3"><option value="0"></option><option value="1" selected="selected"></option><option value="15"></option></select>');

                        CustomerCommGroupDetail.initEvent();
                        $("#ParlayComm1").change();

                        expect($("#ParlayComm2").val()).toEqual('0');
                        expect($("#ParlayComm3").val()).toEqual('0');
                        expect(actualMethod).toEqual("update");
                        expect(actualOptions.isDisabled).toEqual(true);
                    });

                    it("enable ParlayComm2 and ParlayComm3 selection when ParlayComm1 value is not changed to 15", function () {
                        setFixtures('<select id="ParlayComm1"><option value="1" selected="selected"></option></select>');
                        appendSetFixtures('<select id="ParlayComm2"><option value="0"></option><option value="1" selected="selected"></option><option value="15"></option></select>');
                        appendSetFixtures('<select id="ParlayComm3"><option value="0"></option><option value="1" selected="selected"></option><option value="15"></option></select>');

                        CustomerCommGroupDetail.initEvent();
                        $("#ParlayComm1").change();

                        expect($("#ParlayComm2").val()).toEqual('1');
                        expect($("#ParlayComm3").val()).toEqual('1');
                        expect(actualMethod).toEqual("disabled");
                        expect(actualOptions).toEqual(false);
                    });

                    it("set NGComm2 and NGComm3 to Zero and disable NGComm2 and NGComm3 selection when NGComm1 value is changed to 15", function () {
                        setFixtures('<select id="NGComm1"><option value="15" selected="selected"></option></select>');
                        appendSetFixtures('<select id="NGComm2"><option value="0"></option><option value="1" selected="selected"></option><option value="15"></option></select>');
                        appendSetFixtures('<select id="NGComm3"><option value="0"></option><option value="1" selected="selected"></option><option value="15"></option></select>');

                        CustomerCommGroupDetail.initEvent();
                        $("#NGComm1").change();

                        expect($("#NGComm2").val()).toEqual('0');
                        expect($("#NGComm3").val()).toEqual('0');
                        expect(actualMethod).toEqual("update");
                        expect(actualOptions.isDisabled).toEqual(true);
                    });

                    it("enable NGComm2 and NGComm3 selection when NGComm1 value is not changed to 15", function () {
                        setFixtures('<select id="NGComm1"><option value="1" selected="selected"></option></select>');
                        appendSetFixtures('<select id="NGComm2"><option value="0"></option><option value="1" selected="selected"></option><option value="15"></option></select>');
                        appendSetFixtures('<select id="NGComm3"><option value="0"></option><option value="1" selected="selected"></option><option value="15"></option></select>');

                        CustomerCommGroupDetail.initEvent();
                        $("#NGComm1").change();

                        expect($("#NGComm2").val()).toEqual('1');
                        expect($("#NGComm3").val()).toEqual('1');
                        expect(actualMethod).toEqual("disabled");
                        expect(actualOptions).toEqual(false);
                    });

                    it("set CSComm2 and CSComm3 to Zero and disable CSComm2 and CSComm3 selection when CSComm1 value is changed to 15", function () {
                        setFixtures('<select id="CSComm1"><option value="15" selected="selected"></option></select>');
                        appendSetFixtures('<select id="CSComm2"><option value="0"></option><option value="1" selected="selected"></option><option value="15"></option></select>');
                        appendSetFixtures('<select id="CSComm3"><option value="0"></option><option value="1" selected="selected"></option><option value="15"></option></select>');

                        CustomerCommGroupDetail.initEvent();
                        $("#CSComm1").change();

                        expect($("#CSComm2").val()).toEqual('0');
                        expect($("#CSComm3").val()).toEqual('0');
                        expect(actualMethod).toEqual("update");
                        expect(actualOptions.isDisabled).toEqual(true);
                    });

                    it("enable CSComm2 and CSComm3 selection when CSComm1 value is not changed to 15", function () {
                        setFixtures('<select id="CSComm1"><option value="1" selected="selected"></option></select>');
                        appendSetFixtures('<select id="CSComm2"><option value="0"></option><option value="1" selected="selected"></option><option value="15"></option></select>');
                        appendSetFixtures('<select id="CSComm3"><option value="0"></option><option value="1" selected="selected"></option><option value="15"></option></select>');

                        CustomerCommGroupDetail.initEvent();
                        $("#CSComm1").change();

                        expect($("#CSComm2").val()).toEqual('1');
                        expect($("#CSComm3").val()).toEqual('1');
                        expect(actualMethod).toEqual("disabled");
                        expect(actualOptions).toEqual(false);
                    });

                });
            });

            describe("checkAvailableGroup(groupName)", function () {
                beforeEach(function () {
                    setFixtures('<input type="text" id="GroupName">');
                    appendSetFixtures('<label for="GroupName"></label>');
                    appendSetFixtures('<button id="Submit"></button>');
                });

                it("display GroupNameNotEmptyMsg if group name is empty", function () {
                    CustomerCommGroupDetail.checkAvailableGroup("");

                    expect($('label[for="GroupName"]').attr("data-error")).toEqual("GroupNameNotEmptyMsg");
                    expect($("#GroupName").hasClass("invalid")).toEqual(true);
                    expect($("#Submit").is(":disabled")).toEqual(true);
                });

                it("display GroupNameNotEmptyMsg if group name lengh greater than 100", function () {
                    var groupName = "";
                    for (var i = 0; i < 100; i++) {
                        groupName += i;
                    }

                    CustomerCommGroupDetail.checkAvailableGroup(groupName);

                    expect($('label[for="GroupName"]').attr("data-error")).toEqual("GroupNameNotExceed100CharactersMsg");
                    expect($("#GroupName").hasClass("invalid")).toEqual(true);
                    expect($("#Submit").is(":disabled")).toEqual(true);
                });

                it("display ChooseGroupNameMsg if group name is 'none'", function () {
                    CustomerCommGroupDetail.checkAvailableGroup("none");

                    expect($('label[for="GroupName"]').attr("data-error")).toEqual("ChooseGroupNameMsg");
                    expect($("#GroupName").hasClass("invalid")).toEqual(true);
                    expect($("#Submit").is(":disabled")).toEqual(true);
                });

                it("display GroupNameOnlyContainCharactersAndNumberMsg if group name has special characters", function () {
                    CustomerCommGroupDetail.checkAvailableGroup("group name ?");

                    expect($('label[for="GroupName"]').attr("data-error")).toEqual("GroupNameOnlyContainCharactersAndNumberMsg");
                    expect($("#GroupName").hasClass("invalid")).toEqual(true);
                    expect($("#Submit").is(":disabled")).toEqual(true);
                });

                it("display GroupNameExistedMsg if group name is existing", function () {
                    spyOn(Site, "blockUI");
                    spyOn(Site, "unBlockUI");
                    var result = "NO";
                    spyOn($, "ajax").and.callFake(function (option) {
                        option.beforeSend();
                        option.success(result);
                    })

                    CustomerCommGroupDetail.checkAvailableGroup("group name");

                    expect($('label[for="GroupName"]').attr("data-error")).toEqual("GroupNameExistedMsg");
                    expect($("#GroupName").hasClass("invalid")).toEqual(true);
                    expect($("#Submit").is(":disabled")).toEqual(true);
                    expect(Site.blockUI).toHaveBeenCalled();
                });

                it("remove error message if group name is not existing", function () {
                    spyOn(Site, "blockUI");
                    spyOn(Site, "unBlockUI");
                    var result = "OK";
                    spyOn($, "ajax").and.callFake(function (option) {
                        option.success(result);
                    })

                    CustomerCommGroupDetail.checkAvailableGroup("group name");

                    expect($("#GroupName").hasClass("valid")).toEqual(true);
                    expect($("#GroupName").hasClass("invalid")).toEqual(false);
                    expect($("#Submit").is(":disabled")).toEqual(false);
                });
            });

            describe("submit(formId)", function () {
                function setFixturesForCommGroup(id, comm1, comm2, comm3) {
                    appendSetFixtures('<input type="hidden" value="0" id="' + id + '">');
                    appendSetFixtures('<select id="' + id + '1"><option value="' + comm1 + '" selected="selected"></option></select>');
                    appendSetFixtures('<select id="' + id + '2"><option value="' + comm2 + '" selected="selected"></option></select>');
                    appendSetFixtures('<select id="' + id + '3"><option value="' + comm3 + '" selected="selected"></option></select>');
                }

                beforeEach(function () {
                    spyOn($.fn, "submit");
                });

                it("commission value is set correctly", function () {
                    setFixturesForCommGroup("SBComm", 1, 1, 0);
                    setFixturesForCommGroup("ParlayComm", 2, 2, 5);
                    setFixturesForCommGroup("NGComm", 4, 4, 5);
                    setFixturesForCommGroup("CSComm", 6, 6, 5);

                    CustomerCommGroupDetail.submit("#formId");

                    expect($("#SBComm").val()).toEqual("0.0110");
                    expect($("#ParlayComm").val()).toEqual("0.0225");
                    expect($("#NGComm").val()).toEqual("0.0445");
                    expect($("#CSComm").val()).toEqual("0.0665");
                });

                it("update #IsResetDefault to fasle if #IsDefaultGroup is checked when updated group is default", function () {
                    setFixtures('<form id="formId"></form>');
                    $("#formId").append('<input type="checkbox" id="IsDefaultGroup" checked="checked">');
                    $("#formId").append('<input type="hidden" id="DefaultGroupId" value="1">');
                    $("#formId").append('<input type="hidden" id="GroupCommId" value="1">');
                    $("#formId").append('<input type="hidden" id="IsResetDefault" value="false">');

                    CustomerCommGroupDetail.submit("#formId");

                    expect($("#formId").submit).toHaveBeenCalled();
                    expect($("#IsDefaultGroup").val()).toEqual('true');
                    expect($("#IsResetDefault").val()).toEqual('false');
                });

                it("show showConfirmAction if #IsDefaultGroup is checked when updated group is not default", function () {
                    setFixtures('<form id="formId"></form>');
                    $("#formId").append('<input type="checkbox" id="IsDefaultGroup" checked="checked">');
                    $("#formId").append('<input type="hidden" id="DefaultGroupId" value="1">');
                    $("#formId").append('<input type="hidden" id="GroupCommId" value="2">');
                    $("#formId").append('<input type="hidden" id="IsResetDefault" value="false">');
                    spyOn(Popup, "openPopupWithButton");

                    CustomerCommGroupDetail.submit("#formId");

                    expect(Popup.openPopupWithButton).toHaveBeenCalled();
                    expect($("#formId").submit).not.toHaveBeenCalled();
                    expect($("#IsDefaultGroup").val()).toEqual('true');
                    expect($("#IsResetDefault").val()).toEqual('false');
                });

                it("update #IsResetDefault to true if OK button on Confirm Action popup is clicked", function () {
                    setFixtures('<form id="formId"></form>');
                    $("#formId").append('<input type="checkbox" id="IsDefaultGroup" checked="checked">');
                    $("#formId").append('<input type="hidden" id="DefaultGroupId" value="1">');
                    $("#formId").append('<input type="hidden" id="GroupCommId" value="2">');
                    $("#formId").append('<input type="hidden" id="IsResetDefault" value="false">');
                    var buttonOk;
                    spyOn(Popup, "openPopupWithButton").and.callFake(function (element, options, buttons) {
                        var $element = $(element);
                        $element.attr("id", options.id);
                        $.each(buttons, function (index, button) {
                            var $button = $('<button type="button"'
                                + (button.id ? 'id="' + button.id + '"' : '')
                                + ' class="' + button.classes + '">'
                                + button.text + '</button>');

                            if (button.text === "OK") {
                                buttonOk = $button;
                            }

                            $element.append($button);
                            $button.on("click", button.click);
                        });
                    });

                    CustomerCommGroupDetail.submit("#formId");
                    buttonOk.click();

                    expect(Popup.openPopupWithButton).toHaveBeenCalled();
                    expect($("#formId").submit).toHaveBeenCalled();
                    expect($("#IsDefaultGroup").val()).toEqual('true');
                    expect($("#IsResetDefault").val()).toEqual('true');
                });
            });

            describe("goToCustomerList(groupCommId)", function () {
                it("CustomerCommGroup.goToCustomerList should be called with correct param", function () {
                    spyOn(CustomerCommGroup, "goToCustomerList");
                    var groupId = 1;

                    CustomerCommGroupDetail.goToCustomerList(groupId);

                    expect(CustomerCommGroup.goToCustomerList).toHaveBeenCalledWith(groupId);
                });
            });
        });
    });