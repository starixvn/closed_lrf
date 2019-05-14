var basePath = "pages/customer/betsetting/";
var modulePath = ["jquery", "common/site", basePath + "common/betsettingbase", basePath + "products/keno"];

define(modulePath, function ($, Site, BetSettingBase, KenoBetSetting) {
    describe("KenoBetSetting", function () {
        describe("initialize", function () {
            beforeAll(function () {
                spyOn(Site, "initialize");
                spyOn(BetSettingBase, "initialize");
                spyOn(BetSettingBase, "setEnable");
                spyOn(KenoBetSetting, "initEvent");
            });

            beforeEach(function () {
                KenoBetSetting.initialize();
            });

            it("Site.initialize() should be called", function () {
                expect(Site.initialize).toHaveBeenCalled();
            });
            it("BetSettingBase.initialize() should be called", function () {
                expect(BetSettingBase.initialize).toHaveBeenCalled();
            });
            it("BetSettingBase.setEnable() should be called", function () {
                expect(BetSettingBase.setEnable).toHaveBeenCalled();
            });
            it("KenoBetSetting.initEvent() should be called", function () {
                expect(KenoBetSetting.initEvent).toHaveBeenCalled();
            });
        });

        describe("initEvent", function () {
            beforeEach(function () {
                var htmlButton = '<button id="btnSubmitBetSetting">Submit</button><button id="btnReset">Reset</button>';
                setFixtures(htmlButton);

                spyOn(BetSettingBase, "formatInputText");

                KenoBetSetting.initEvent();
            });

            it("#btnReset fire click event - BetSettingBase.resetInput() should be called", function () {
                spyOn(BetSettingBase, "resetInput");

                $("#btnReset").click();

                expect(BetSettingBase.resetInput).toHaveBeenCalled();
            });

            it("#btnSubmitBetSetting fire click event - BetSettingBase.showComfirm() should be called with correct parameter", function () {
                spyOn(BetSettingBase, "showComfirm");
                var $submit = $("#btnSubmitBetSetting");

                $submit.click();

                expect(BetSettingBase.showComfirm).toHaveBeenCalledWith($submit, "UpdateKenoBetSettings", KenoBetSetting.updateBetSetting);
            });

            it("BetSettingBase.formatInputText() should be called", function () {
                expect(BetSettingBase.formatInputText).toHaveBeenCalled();
            });
        });

        describe("updateBetSetting(custId, userName, nickName)", function () {
            var custId = 1, userName = "username", nickName = "nickname";
            var expectedParam = {
                custid: custId,
                userName: userName,
                nickName: nickName,
                id: "0,1,2"
            };

            beforeAll(function () {
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) { return url; });
                spyOn(BetSettingBase, "getBetSettingParamsForSports").and.returnValue({});
                spyOn(BetSettingBase, "updateBetSetting");
            });

            it("BetSettingBase.updateBetSetting should be called with correct parameter", function () {
                appendSetFixtures('<input id="IDList" value="0,1,2" />');
                var expectedUrl = "KenoBetSetting/UpdateBetSetting";

                KenoBetSetting.updateBetSetting(custId, userName, nickName);

                expect(BetSettingBase.updateBetSetting).toHaveBeenCalledWith(expectedUrl, expectedParam);
            });
        });
    });
});