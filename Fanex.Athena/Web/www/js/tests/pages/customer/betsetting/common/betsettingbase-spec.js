var basePath = "pages/customer/betsetting/common/";
var modulePath = ["jquery", "common/site", "common/popup", basePath + "betsetting.helper", basePath + "betsetting.validation", basePath + "betsettingbase"];

define(modulePath, function ($, Site, Popup, BetSettingHelper, BetSettingValidation, BetSettingBase) {
    function createInputElements(dataSetting) {
        var setting = {
            sportId: 1,
            minbet: "", limitMinBet: "",
            maxbet: "", limitMaxBet: "",
            maxPerMatch: "", limitMinOfMaxPerMatch: "", limitMaxOfMaxPerMatch: "",
            bettype: ""
        };
        $.extend(setting, dataSetting);

        var minbetInput = '<input type="text" id="min-bet-' + setting.sportId + '" value="' + setting.minbet + '" data-min-value="' + setting.limitMinBet + '" data-original="10"/>';
        var maxbetInput = '<input type="text" id="max-bet-' + setting.sportId + '" value="' + setting.maxbet + '" data-max-value="' + setting.limitMaxBet + '" data-original="100"/>';
        var maxPerMatchInput = '<input type="text" id="max-per-match-' + setting.sportId + '" value="' + setting.maxPerMatch +
            '" data-min-value="' + setting.limitMinOfMaxPerMatch + '" data-max-value="' + setting.limitMaxOfMaxPerMatch + '" data-original="1000"/>';
        var bettypeInput = '<input type="text" id="bet-type-' + setting.sportId + '" value="' + setting.bettype + '"/>';

        setFixtures(minbetInput + maxbetInput + maxPerMatchInput + bettypeInput);
    }

    describe("BetSettingBase", function () {
        beforeAll(function () {
            spyOn(Site, "getSingleResource").and.callFake(function (resource) { return resource; });
        });

        describe("initialize", function () {
            beforeEach(function () {
                setFixtures('<select id="product-dropdown">'
                + '<option value="1" data-href="localhost1">Sportsbook</option>'
                + '<option value="2" data-href="localhost2">Racing</option>'
                + '</select>');

                spyOn(Site, "blockUI");
                spyOn(Site, "redirect");

                BetSettingBase.initialize();
            });

            it("Site.blockUI() should be called when '#product-dropdown' fired change event", function () {
                $("#product-dropdown").change();

                expect(Site.blockUI).toHaveBeenCalled();
            });

            it("Site.blockUI() should be called when '#product-dropdown' fired change event", function () {
                $("#product-dropdown").val(2);
                $("#product-dropdown").change();

                expect(Site.redirect).toHaveBeenCalledWith("localhost2");
            });
        });

        describe("getSportIds()", function () {
            it("return correct sport id string when we have #IDList", function () {
                setFixtures('<input id="IDList" value="1,2,3" />');
                var expectedResult = ['1', '2', '3'];

                var result = BetSettingBase.getSportIds();

                expect(result).toEqual(expectedResult);
            });

            it("return empty array when we do not have #IDList", function () {
                var expectedResult = [];

                var result = BetSettingBase.getSportIds();

                expect(result).toEqual(expectedResult);
            });
        });

        describe("setEnable", function () {
            beforeEach(function () {
                createInputElements();
                appendSetFixtures('<input id="editable" value="True" />');

                spyOn(BetSettingBase, "getSportIds").and.returnValue([1]);
            });

            it("inputs are enabled when #editable is true", function () {
                BetSettingBase.setEnable();

                expect($("#min-bet-1").prop("disabled")).toBe(false);
                expect($("#max-bet-1").prop("disabled")).toBe(false);
                expect($("#max-per-match-1").prop("disabled")).toBe(false);
            });

            it("inputs are enabled when #editable is not exist", function () {
                $("#editable").remove();
                BetSettingBase.setEnable();

                expect($("#min-bet-1").prop("disabled")).toBe(false);
                expect($("#max-bet-1").prop("disabled")).toBe(false);
                expect($("#max-per-match-1").prop("disabled")).toBe(false);
            });

            it("inputs are disabled when #editable is false", function () {
                $("#editable").val("False");
                BetSettingBase.setEnable();

                expect($("#min-bet-1").prop("disabled")).toBe(true);
                expect($("#max-bet-1").prop("disabled")).toBe(true);
                expect($("#max-per-match-1").prop("disabled")).toBe(true);
            });
        });

        describe("formatInputText()", function () {
            it("inputs should have correct format when fired blur event with current values have not formatted", function () {
                var setting = { minbet: 5000, maxbet: 10000.05, maxPerMatch: 2000000.00 };
                createInputElements(setting);

                BetSettingBase.formatInputText();

                var $minbet = $("#min-bet-1");
                var $maxbet = $("#max-bet-1");
                var $maxPerMatch = $("#max-per-match-1");

                $minbet.blur();
                expect($minbet.val()).toBe("5,000");

                $maxbet.blur();
                expect($maxbet.val()).toBe("10,000.05");

                $maxPerMatch.blur();
                expect($maxPerMatch.val()).toBe("2,000,000");
            });

            it("inputs should have correct format when fired blur event with current values have formatted", function () {
                var setting = { minbet: "5,00", maxbet: "10,0.05", maxPerMatch: "20,00" };
                createInputElements(setting);

                BetSettingBase.formatInputText();

                var $minbet = $("#min-bet-1");
                var $maxbet = $("#max-bet-1");
                var $maxPerMatch = $("#max-per-match-1");

                $minbet.blur();
                expect($minbet.val()).toBe("500");

                $maxbet.blur();
                expect($maxbet.val()).toBe("100.05");

                $maxPerMatch.blur();
                expect($maxPerMatch.val()).toBe("2,000");
            });
        });

        describe("resetInput()", function () {
            it("#chkCopyAll should be unchecked", function () {
                setFixtures('<input type="checkbox" id="chkCopyAll" checked />');

                BetSettingBase.resetInput();

                expect($("#chkCopyAll").prop("checked")).toBe(false);
            });

            it("inputs value should be set to original", function () {
                var setting = { minbet: 5000, maxbet: 10000.05, maxPerMatch: 2000000.00 };
                createInputElements(setting);

                BetSettingBase.resetInput();

                var $minbet = $("#min-bet-1");
                var $maxbet = $("#max-bet-1");
                var $maxPerMatch = $("#max-per-match-1");

                expect($minbet.val()).toBe($minbet.attr("data-original"));
                expect($maxbet.val()).toBe($maxbet.attr("data-original"));
                expect($maxPerMatch.val()).toBe($maxPerMatch.attr("data-original"));
            });

            it("inputs value should be enabled", function () {
                var setting = { minbet: 5000, maxbet: 10000.05, maxPerMatch: 2000000.00 };
                createInputElements(setting);

                var $minbet = $("#min-bet-1");
                var $maxbet = $("#max-bet-1");
                var $maxPerMatch = $("#max-per-match-1");

                $minbet.prop("disabled", true);
                $maxbet.prop("disabled", true);
                $maxPerMatch.prop("disabled", true);

                expect($minbet.prop("disabled")).toBe(true);
                expect($maxbet.prop("disabled")).toBe(true);
                expect($maxPerMatch.prop("disabled")).toBe(true);

                BetSettingBase.resetInput();

                expect($minbet.prop("disabled")).toBe(false);
                expect($maxbet.prop("disabled")).toBe(false);
                expect($maxPerMatch.prop("disabled")).toBe(false);
            });
        });

        describe("showComfirm", function () {
            beforeEach(function () {
                setFixtures('<input id="ProductId" value="1" /> <div id="current" data-cust-id="1" data-user-name="username" data-nick-name="nickname"></div>');
                spyOn(BetSettingBase, "showConfirmAction");
            });

            it("Nothing happen when validation is false", function () {
                spyOn(BetSettingValidation, "checkLimitMinMaxBets").and.returnValue(false);
                var $target = $("#current");
                var resourceMessage = "Message";
                var callback = function () { };

                BetSettingBase.showComfirm($target, resourceMessage, callback);

                expect(BetSettingBase.showConfirmAction).not.toHaveBeenCalled();
            });

            it("BetSettingBase.showConfirmAction should be called with correct parameter when validation is valid", function () {
                spyOn(BetSettingValidation, "checkLimitMinMaxBets").and.returnValue(true);
                var $target = $("#current");
                var resourceMessage = "Message";
                var callback = function () { };
                var custId = "1", userName = "username", nickName = "nickname";

                BetSettingBase.showComfirm($target, resourceMessage, callback);

                expect(BetSettingBase.showConfirmAction).toHaveBeenCalledWith(resourceMessage, custId, userName, nickName, callback);
            });

            it("When Product is NumberGame - validation return true - BetSettingValidation.checkValidationNumberGame() should be called", function () {
                spyOn(BetSettingValidation, "checkValidationNumberGame").and.returnValue(false);
                var numberGameProduct = 2;
                $("#ProductId").val(numberGameProduct);

                var $target = $("#current");
                var resourceMessage = "Message";
                var callback = function () { };

                BetSettingBase.showComfirm($target, resourceMessage, callback);

                expect(BetSettingValidation.checkValidationNumberGame).toHaveBeenCalled();
            });
        });

        describe("showConfirmAction", function () {
            var htmlContent, popupOption, buttonOption;
            var message = "Message", custId = "1", userName = "username", nickName = "nickname";
            var callback = jasmine.createSpy('callback');
            beforeEach(function () {
                spyOn(Popup, "openPopupWithButton").and.callFake(function (template, option, button) {
                    htmlContent = template;
                    popupOption = option;
                    buttonOption = button;
                });
                setFixtures('<button id="btnSubmitBetSetting"></button><button id="btnReset"></button>');
            });

            it("Popup.openPopupWithButton() should be called with correct template", function () {
                var expectedResult = '<div><p>' + message + '</p></div>';

                BetSettingBase.showConfirmAction(message, custId, userName, nickName, callback);

                expect(htmlContent).toBe(expectedResult);
            });

            it("Popup.openPopupWithButton() should be called with correct buttonOption", function () {
                var expectedResult = [
                {
                    text: "OK",
                    isClosedOnClick: true,
                    classes: "btn btn-submit"
                }, {
                    text: "Cancel",
                    isClosedOnClick: true,
                    classes: "btn btn-cancel"
                }];

                BetSettingBase.showConfirmAction(message, custId, userName, nickName, callback);

                expect(buttonOption[0].text).toEqual(expectedResult[0].text);
                expect(buttonOption[0].isClosedOnClick).toEqual(expectedResult[0].isClosedOnClick);
                expect(buttonOption[0].classes).toEqual(expectedResult[0].classes);
                expect(buttonOption[1]).toEqual(expectedResult[1]);
            });

            it("Button OK fired click event - callback should be called with correct parameters", function () {
                BetSettingBase.showConfirmAction(message, custId, userName, nickName, callback);
                buttonOption[0].click();

                expect(callback).toHaveBeenCalledWith(custId, userName, nickName);
            });

            describe("Popup.openPopupWithButton() should be called with correct popupOption", function () {
                beforeEach(function () {
                    BetSettingBase.showConfirmAction(message, custId, userName, nickName, callback);
                    appendSetFixtures('<div id="confirm-update-betsetting">abc</div>');
                });

                it("Values in option should be correct", function () {
                    var expectedOption = {
                        title: "Confirmation",
                        height: "auto",
                        id: "confirm-update-betsetting",
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
                    popupOption.onClose();

                    expect($("#btnSubmitBetSetting").prop("disabled")).toBe(false);
                    expect($("#btnReset").prop("disabled")).toBe(false);
                });

                it("popupOption.onClose() call - '#result-update-betsetting' should be removed", function () {
                    expect($("#confirm-update-betsetting").length).toBe(1);

                    popupOption.onClose();

                    expect($("#confirm-update-betsetting").length).toBe(0);
                });
            });
        });

        describe("getBetSettingParamsForSports", function () {
            it("param should be returned correctly", function () {
                spyOn(BetSettingBase, "getSportIds").and.returnValue([1, 2]);
                spyOn(BetSettingBase, "getBetSettingParams").and.returnValues({ param1: 1 }, { param2: 2 });

                var expectedResult = {
                    param1: 1,
                    param2: 2
                }

                var result = BetSettingBase.getBetSettingParamsForSports();

                expect(result).toEqual(expectedResult);
            });
        });

        describe("getBetSettingParams", function () {
            it("function return empty string when have no input element", function () {
                var sportId = 1;

                var result = BetSettingBase.getBetSettingParams(sportId);

                expect(result).toBe("");
            });

            it("function return correct value when have no update occur", function () {
                var sportId = 1;
                var setting = { minbet: 10, maxbet: 100, maxPerMatch: 1000, bettype: 1 };
                createInputElements(setting);

                var expectedResult = {
                    minbet1: setting.minbet,
                    maxbet1: setting.maxbet,
                    maxpermatch1: setting.maxPerMatch,
                    bettype1: setting.bettype.toString(),
                    update1: false
                }

                var result = BetSettingBase.getBetSettingParams(sportId);

                expect(result).toEqual(expectedResult);
            });

            it("function return correct value when update occur", function () {
                var sportId = 1;
                var setting = { minbet: 100, maxbet: 1000, maxPerMatch: 10000, bettype: 1 };
                createInputElements(setting);

                var expectedResult = {
                    minbet1: setting.minbet,
                    maxbet1: setting.maxbet,
                    maxpermatch1: setting.maxPerMatch,
                    bettype1: setting.bettype.toString(),
                    update1: true
                }

                var result = BetSettingBase.getBetSettingParams(sportId);

                expect(result).toEqual(expectedResult);
            });
        });

        describe("updateBetSetting", function () {
            var url = "localhost";
            var params = {};
            var ajaxOption;

            beforeAll(function () {
                spyOn($, "ajax").and.callFake(function (option) { ajaxOption = option; });
            });

            it("ajax option should be correct", function () {
                BetSettingBase.updateBetSetting(url, params);

                expect(ajaxOption.type).toBe("POST");
                expect(ajaxOption.cache).toBe(false);
                expect(ajaxOption.url).toBe(url);
                expect(ajaxOption.data).toBe(params);
                expect(ajaxOption.dataType).toBe("json");
            });

            it("call success in ajax option - Code in response is 0 (success) - BetSettingHelper.showDialogMesage should be called with correct parameter", function () {
                spyOn(BetSettingHelper, "showDialogMesage");
                var message = "Success";
                var response = { Code: 0, Message: message };

                BetSettingBase.updateBetSetting(url, params);
                ajaxOption.success(response);

                expect(BetSettingHelper.showDialogMesage).toHaveBeenCalledWith("MessageSuccess", message);
            });

            it("call success in ajax option - Code in response is not equal 0 (fail) - BetSettingHelper.showDialogMesage should be called with correct parameter", function () {
                spyOn(BetSettingHelper, "showDialogMesage");
                var message = "Fail";
                var response = { Code: 1, Message: message };

                BetSettingBase.updateBetSetting(url, params);
                ajaxOption.success(response);

                expect(BetSettingHelper.showDialogMesage).toHaveBeenCalledWith("Fail", message);
            });
        });
    });
});