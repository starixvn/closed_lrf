define(["jquery", "common/site", "common/popup", "pages/customer/customercomm/commgrouplist", "pages/customer/customercomm/commgroup"],
    function ($, Site, Popup, CustomerCommGroupList, CustomerCommGroup) {
        describe("CustomerCommGroupList", function () {
            beforeAll(function () {
                spyOn(Site, "initialize");
                spyOn(Site, "addUserGuide");
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                    return url;
                });
                spyOn(Site, "getSingleResource").and.callFake(function (str) {
                    return str;
                });
                spyOn(Site, "redirect");
            });

            describe("initialize", function () {
                it("Site is initialized", function () {
                    CustomerCommGroupList.initialize();

                    expect(Site.initialize).toHaveBeenCalled();
                    expect(Site.addUserGuide).toHaveBeenCalled();
                });

                it("initEvent should be called", function () {
                    spyOn(CustomerCommGroupList, "initEvent");

                    CustomerCommGroupList.initialize();

                    expect(CustomerCommGroupList.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent", function () {
                it("CommissionGroupForm should be submitted when #ExportToExcel is clicked", function () {
                    setFixtures('<a id="ExportToExcel"></a>');
                    spyOn($.fn, "submit");

                    CustomerCommGroupList.initEvent();
                    $("#ExportToExcel").click();

                    expect($("#CommissionGroupForm").submit).toHaveBeenCalled();
                });

                it("confirmDeleteCommGroup should be called when .delete-comm-group is clicked", function () {
                    setFixtures('<table id="comm-group-list"><tr><td><a class="delete-comm-group" data-id="1"></a><td><tr><table>');
                    spyOn(CustomerCommGroupList, "confirmDeleteCommGroup");

                    CustomerCommGroupList.initEvent();
                    $(".delete-comm-group").click();

                    expect(CustomerCommGroupList.confirmDeleteCommGroup).toHaveBeenCalledWith(1);
                });

                it("CustomerCommGroup.goToCustomerList should be called when .customer-list-link is clicked", function () {
                    setFixtures('<table id="comm-group-list"><tr><td><a class="customer-list-link" data-id="1"></a><td><tr><table>');
                    spyOn(CustomerCommGroup, "goToCustomerList");

                    CustomerCommGroupList.initEvent();
                    $(".customer-list-link").click();

                    expect(CustomerCommGroup.goToCustomerList).toHaveBeenCalledWith(1);
                });
            });

            describe("confirmDeleteCommGroup(groupId)", function () {
                it("Popup confirm for default group should be shown when default group is deleted", function () {
                    var defaultGroupId = 1;
                    spyOn($, "ajax").and.callFake(function (options) {
                        options.success({ id: defaultGroupId });
                    });
                    spyOn(CustomerCommGroupList, "showConfirmDeleteDefaulCommGroupPopup");
                    spyOn(CustomerCommGroupList, "showOptionDeleteCommGroupPopup");

                    CustomerCommGroupList.confirmDeleteCommGroup(defaultGroupId);


                    expect(CustomerCommGroupList.showConfirmDeleteDefaulCommGroupPopup).toHaveBeenCalled();
                    expect(CustomerCommGroupList.showOptionDeleteCommGroupPopup).not.toHaveBeenCalled();
                });

                it("Popup delete option should be shown when deleted group is not default", function () {
                    var defaultGroupId = 1;
                    var groupId = 2;
                    spyOn($, "ajax").and.callFake(function (options) {
                        options.success({ id: defaultGroupId });
                    });
                    spyOn(CustomerCommGroupList, "showConfirmDeleteDefaulCommGroupPopup");
                    spyOn(CustomerCommGroupList, "showOptionDeleteCommGroupPopup");

                    CustomerCommGroupList.confirmDeleteCommGroup(groupId);

                    expect(CustomerCommGroupList.showConfirmDeleteDefaulCommGroupPopup).not.toHaveBeenCalled();
                    expect(CustomerCommGroupList.showOptionDeleteCommGroupPopup).toHaveBeenCalled();
                });
            });

            describe("deleteCommGroup()", function () {
                beforeAll(function () {
                    spyOn(Site, "blockUI");
                    spyOn(Site, "unBlockUI");
                });

                beforeEach(function () {
                    jasmine.Ajax.install();
                });

                afterEach(function () {
                    jasmine.Ajax.uninstall();
                });

                it("showResultPopup should be called if group is deleted fail", function () {
                    spyOn(CustomerCommGroupList, "showResultPopup");
                    jasmine.Ajax
                            .stubRequest("CustomerComGroup/Delete")
                            .andReturn({
                                responseText: JSON.stringify({
                                    Code: 1,
                                    Message: "Error message"
                                })
                            });

                    CustomerCommGroupList.deleteCommGroup();

                    expect(CustomerCommGroupList.showResultPopup).toHaveBeenCalledWith("Error", "Error message");
                });

                it("redirect to index if group is deleted successfully", function () {
                    jasmine.Ajax
                            .stubRequest("CustomerComGroup/Delete")
                            .andReturn({
                                responseText: JSON.stringify({
                                    ErrorCode: 0,
                                    ErrorMessage: ""
                                })
                            });

                    CustomerCommGroupList.deleteCommGroup();

                    expect(Site.redirect).toHaveBeenCalledWith("CustomerComGroup/Index");
                });
            });

            describe("showConfirmDeleteDefaulCommGroupPopup()", function () {
                it("Popup.openPopupWithButton should be called with correct params", function () {
                    var options = {
                        modal: true,
                        title: "Confirm",
                        height: "auto",
                        id: "del-default-comm-group",
                        width: 380
                    };
                    var buttons = [
                    {
                        text: "OK",
                        isClosedOnClick: true,
                        click: CustomerCommGroupList.showOptionDeleteCommGroupPopup,
                        classes: "btn btn-submit"
                    }, {
                        text: "Cancel",
                        isClosedOnClick: true,
                        classes: "btn btn-cancel"
                    }];
                    spyOn(Popup, "openPopupWithButton");

                    CustomerCommGroupList.showConfirmDeleteDefaulCommGroupPopup();

                    expect(Popup.openPopupWithButton).toHaveBeenCalledWith('<div><p>DefaultGroupMsg</p></div>', options, buttons);
                });
            });

            describe("showOptionDeleteCommGroupPopup()", function () {
                it("#confirm-delete-comm-group should be removed if popup is not existing", function () {
                    var expectedPopupContent = '<div>' +
                    '<input id="IsRemovePlayerComm" type="radio" value="false">' +
                    '<input id="IsNotRemovePlayerComm" type="radio" value="true">' +
                    '</div>';
                    setFixtures('<div id="confirm-delete-comm-group">' + expectedPopupContent + '</div>');
                    spyOn(Popup, "openPopupWithButton");

                    CustomerCommGroupList.showOptionDeleteCommGroupPopup();

                    expect(Popup.openPopupWithButton).toHaveBeenCalled();
                    expect($("#confirm-delete-comm-group").length).toEqual(0);
                });

                it("Popup.openPopupWithButton should be called with correct params when popup is existing", function () {
                    var expectedPopupContent = '<div>' +
                    '<input id="IsRemovePlayerComm" type="radio" value="false">' +
                    '<input id="IsNotRemovePlayerComm" type="radio" value="true">' +
                    '</div>';
                    setFixtures('<div id="option-del-comm-group">' + expectedPopupContent + '</div>');
                    var expectedOption = {
                        modal: true,
                        title: "DeleteCommissionGroup",
                        height: "auto",
                        id: "option-del-comm-group",
                        width: 380
                    };
                    var actualElement, actualOption, actualButtons;
                    spyOn(Popup, "openPopupWithButton").and.callFake(function (element, option, buttons) {
                        actualElement = element;
                        actualOption = option;
                        actualButtons = buttons;
                    });
                    
                    CustomerCommGroupList.showOptionDeleteCommGroupPopup();

                    expect(Popup.openPopupWithButton).toHaveBeenCalled();
                    expect($(actualElement).html()).toEqual(expectedPopupContent);
                    expect(actualOption).toEqual(expectedOption);
                    expect(actualButtons.length).toEqual(2);
                });

                it("radio input should be checked if it is clicked", function () {
                    var expectedPopupContent = '<div>' +
                                               '<input type="radio" value="false" name="IsRemovePlayerComm" id="IsNotRemovePlayerComm">' +
                                               '</div><div>' +
                                               '<input type="radio" value="true" checked="checked" name="IsRemovePlayerComm" id="IsRemovePlayerComm">' +
                                               '</div>';
                    setFixtures('<div id="confirm-delete-comm-group">' + expectedPopupContent + '</div>');
                    spyOn(Popup, "openPopupWithButton").and.callFake(function (element, options, button) {
                        var $element = $(element);
                        $element.attr("id", options.id);
                        appendSetFixtures($element);
                    });

                    CustomerCommGroupList.showOptionDeleteCommGroupPopup();
                    $("#IsNotRemovePlayerComm").click();

                    expect(Popup.openPopupWithButton).toHaveBeenCalled();
                    expect($("#option-del-comm-group").length).toBeGreaterThan(0);
                    expect($('input[name="IsRemovePlayerComm"]:checked').val()).toEqual('false');
                });

                it("showConfirmDeleteCommGroupPopup should be called when Delete button is clicked", function () {
                    var expectedPopupContent = '<div>' +
                                               '<input type="radio" value="false" name="IsRemovePlayerComm" id="IsNotRemovePlayerComm">' +
                                               '</div><div>' +
                                               '<input type="radio" value="true" checked="checked" name="IsRemovePlayerComm" id="IsRemovePlayerComm">' +
                                               '</div>';
                    setFixtures('<div id="confirm-delete-comm-group">' + expectedPopupContent + '</div>');
                    var buttonDelete;
                    spyOn(Popup, "openPopupWithButton").and.callFake(function (element, options, buttons) {
                        var $element = $(element);
                        $element.attr("id", options.id);
                        $.each(buttons, function (index, button) {
                            var $button = $('<button type="button"'
                                + (button.id ? 'id="' + button.id + '"' : '')
                                + ' class="' + button.classes + '">'
                                + button.text + '</button>');

                            if (button.text === "Delete") {
                                buttonDelete = $button;
                            }

                            $element.append($button);
                            $button.on("click", button.click);
                        });

                        appendSetFixtures($element);
                    });
                    spyOn(CustomerCommGroupList, "showConfirmDeleteCommGroupPopup");

                    CustomerCommGroupList.showOptionDeleteCommGroupPopup();
                    buttonDelete.click();

                    expect(CustomerCommGroupList.showConfirmDeleteCommGroupPopup).toHaveBeenCalled();
                });

                it("IsRemovePlayerComm should be checked when Cancel button is clicked", function () {
                    var expectedPopupContent = '<div>' +
                                               '<input type="radio" value="false" checked="checked" name="IsRemovePlayerComm" id="IsNotRemovePlayerComm">' +
                                               '</div><div>' +
                                               '<input type="radio" value="true" name="IsRemovePlayerComm" id="IsRemovePlayerComm">' +
                                               '</div>';
                    setFixtures('<div id="confirm-delete-comm-group">' + expectedPopupContent + '</div>');
                    var buttonCancel;
                    spyOn(Popup, "openPopupWithButton").and.callFake(function (element, options, buttons) {
                        var $element = $(element);
                        $element.attr("id", options.id);
                        $.each(buttons, function (index, button) {
                            var $button = $('<button type="button"'
                                + (button.id ? 'id="' + button.id + '"' : '')
                                + ' class="' + button.classes + '">'
                                + button.text + '</button>');

                            if (button.text === "Cancel") {
                                buttonCancel = $button;
                            }

                            $element.append($button);
                            $button.on("click", button.click);
                        });

                        appendSetFixtures($element);
                    });

                    CustomerCommGroupList.showOptionDeleteCommGroupPopup();
                    buttonCancel.click();

                    expect($('input[name="IsRemovePlayerComm"]:checked').val()).toEqual('true');
                });
            });

            describe("showConfirmDeleteCommGroupPopup()", function () {
                it("Popup.openPopupWithButton should be called with correct params", function () {
                    var options = {
                        modal: true,
                        title: "Confirm",
                        height: "auto",
                        id: "confirm-del-comm-group",
                        width: 380
                    };
                    var buttons = [
                    {
                        text: "OK",
                        isClosedOnClick: true,
                        click: CustomerCommGroupList.deleteCommGroup,
                        classes: "btn btn-submit"
                    }, {
                        text: "Cancel",
                        isClosedOnClick: true,
                        click: CustomerCommGroupList.showOptionDeleteCommGroupPopup,
                        classes: "btn btn-cancel",
                        id: "confirm-del-comm-group-cancel"
                    }];
                    spyOn(Popup, "openPopupWithButton");

                    CustomerCommGroupList.showConfirmDeleteCommGroupPopup();

                    expect(Popup.openPopupWithButton).toHaveBeenCalledWith('<div><p>AreYouSure</p></div>', options, buttons);
                });
            });

            describe("showResultPopup()", function () {
                it("Popup.openPopupWithButton should be called with correct params when popup is not existing", function () {
                    var expectedPopupContent = "Result Message";
                    var expectedTitle = "Title Popup";
                    var options = {
                        modal: true,
                        title: expectedTitle,
                        height: "auto",
                        id: "result-del-comm-group",
                        width: 380
                    };
                    var buttons = [
                    {
                        text: "OK",
                        isClosedOnClick: true,
                        classes: "btn btn-submit",
                        id: "result-OK"
                    }];
                    spyOn(Popup, "openPopupWithButton");

                    CustomerCommGroupList.showResultPopup(expectedTitle, expectedPopupContent);

                    expect(Popup.openPopupWithButton).toHaveBeenCalledWith('<div><p id="result-msg">' + expectedPopupContent + '</p></div>', options, buttons);
                });

                it("Popup.openPopupWithButton should be called with correct params when popup is existing", function () {
                    var expectedPopupContent = "Result Message";
                    var expectedTitle = "Title Popup";
                    var options = {
                        modal: true,
                        title: expectedTitle,
                        height: "auto",
                        id: "result-del-comm-group",
                        width: 380
                    };
                    var buttons = [
                    {
                        text: "OK",
                        isClosedOnClick: true,
                        classes: "btn btn-submit",
                        id: "result-OK"
                    }];
                    setFixtures('<div id="result-del-comm-group"><p id="result-msg"></p></div>');
                    spyOn(Popup, "openPopupWithButton");

                    CustomerCommGroupList.showResultPopup(expectedTitle, expectedPopupContent);

                    expect(Popup.openPopupWithButton).toHaveBeenCalledWith('<div><p id="result-msg">' + expectedPopupContent + '</p></div>', options, buttons);
                    expect($("#result-msg").html()).toEqual(expectedPopupContent);
                });
            });
        });
    }
);