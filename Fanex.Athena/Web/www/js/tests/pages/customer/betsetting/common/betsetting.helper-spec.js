var basePath = "pages/customer/betsetting/common/";
var modulePath = ["jquery", "common/site", "common/popup", basePath + "betsetting.helper"];

define(modulePath, function ($, Site, Popup, BetSettingHelper) {
    describe("BetSettingHelper", function () {
        beforeAll(function () {
            spyOn(Site, "getSingleResource").and.callFake(function (resource) { return resource; });
        });

        describe("showDialogMesage(title, message)", function () {
            var htmlContent, popupOption, buttonOption;
            beforeEach(function () {
                spyOn(Popup, "openPopupWithButton").and.callFake(function (template, option, button) {
                    htmlContent = template;
                    popupOption = option;
                    buttonOption = button;
                });
                setFixtures('<button id="btnSubmitBetSetting"></button><button id="btnReset"></button>');
            });

            it("Popup.openPopupWithButton() should be called with correct template", function () {
                var message = "Message";
                var expectedResult = '<div><p>' + message + '</p></div>';

                BetSettingHelper.showDialogMesage("", message);

                expect(htmlContent).toBe(expectedResult);
            });

            it("Popup.openPopupWithButton() should be called with correct buttonOption", function () {
                var message = "Message";
                var expectedResult = [
                {
                    text: "OK",
                    isClosedOnClick: true,
                    classes: "btn btn-submit"
                }];

                BetSettingHelper.showDialogMesage("", message);

                expect(buttonOption).toEqual(expectedResult);
            });

            describe("Popup.openPopupWithButton() should be called with correct popupOption", function () {
                var title = "Title", message = "Message";
                beforeEach(function () {
                    BetSettingHelper.showDialogMesage(title, message);
                    appendSetFixtures('<div id="result-update-betsetting">abc</div>');
                });

                it("Values in option should be correct", function () {
                    var expectedOption = {
                        title: title,
                        height: "auto",
                        id: "result-update-betsetting",
                        width: 450
                    };

                    expect(popupOption.title).toBe(expectedOption.title);
                    expect(popupOption.height).toBe(expectedOption.height);
                    expect(popupOption.id).toBe(expectedOption.id);
                    expect(popupOption.width).toBe(expectedOption.width);
                });

                it("popupOption.onOpen() call - '#btnSubmitBetSetting, #btnReset' should be disabled", function () {
                    popupOption.onOpen();

                    expect($("#btnSubmitBetSetting").prop("disabled")).toBe(true);
                    expect($("#btnReset").prop("disabled")).toBe(true);
                });

                it("popupOption.onClose() call - '#btnSubmitBetSetting, #btnReset' should be enabled", function () {
                    spyOn(window, "setTimeout");
                    popupOption.onClose();

                    expect($("#btnSubmitBetSetting").prop("disabled")).toBe(false);
                    expect($("#btnReset").prop("disabled")).toBe(false);
                });

                it("popupOption.onClose() call - '#result-update-betsetting' should be removed", function () {
                    spyOn(window, "setTimeout");
                    expect($("#result-update-betsetting").length).toBe(1);

                    popupOption.onClose();

                    expect($("#result-update-betsetting").length).toBe(0);
                });

                it("popupOption.onClose() call - Site.blockUI() and Site.getLocation() should be called after 500ms", function () {
                    jasmine.clock().install();
                    var reload = jasmine.createSpy('reload');
                    spyOn(Site, "getLocation").and.returnValue({ reload: reload });

                    spyOn(Site, "blockUI");

                    popupOption.onClose();

                    jasmine.clock().tick(501);
                    jasmine.clock().uninstall();

                    expect(Site.blockUI).toHaveBeenCalled();
                    expect(reload).toHaveBeenCalled();
                });
            });
        });

        describe("convertToFloat(str)", function () {
            it("Return correct value when pass float number", function () {
                var floatString = "12.345";

                var result = BetSettingHelper.convertToFloat(floatString);

                expect(result).toBe(12.345);
            });

            it("Return correct value when pass integer number", function () {
                var floatString = "12";

                var result = BetSettingHelper.convertToFloat(floatString);

                expect(result).toBe(12);
            });

            it("Return Nan when pass invalid number", function () {
                var floatString = "abc";

                var result = BetSettingHelper.convertToFloat(floatString);

                expect(isNaN(result)).toBe(true);
            });
        });

        describe("showBalloonMsg(elementSelector, strMsg)", function () {
            var showOption;
            beforeEach(function () {
                setFixtures('<input id="txtForm" />');
                spyOn($.fn, "showBalloon").and.callFake(function (option) { showOption = option; });
                spyOn($.fn, "hideBalloon");
            });

            it("showBalloon() jquery should be called with correct parameter", function () {
                var elementSelector = "#txtForm";
                var message = "Message";
                var contents = '<div onclick="hideBalloonMsg(\'' + elementSelector + '\')" style="width:140px;" class="msgerr">' + message + '</div>';
                var expectedResult = {
                    contents: contents
                };

                BetSettingHelper.showBalloonMsg(elementSelector, message);

                expect(showOption).toEqual(expectedResult);
            });

            it("hideBalloon() jquery should be called when elementSelector fire blur event", function () {
                var elementSelector = "#txtForm";
                var message = "Message";

                BetSettingHelper.showBalloonMsg(elementSelector, message);
                $(elementSelector).blur();

                expect($.fn.hideBalloon).toHaveBeenCalled();
            });
        });
    });
});