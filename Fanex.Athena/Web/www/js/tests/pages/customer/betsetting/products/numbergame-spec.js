var basePath = "pages/customer/betsetting/";
var modulePath = ["jquery", "common/site", basePath + "common/betsettingbase", basePath + "common/betsetting.helper", basePath + "products/numbergame"];

define(modulePath, function ($, Site, BetSettingBase, BetSettingHelper, NumberGameBetSetting) {
    describe("NumberGameBetSetting", function () {
        describe("initialize", function () {
            beforeAll(function () {
                spyOn(Site, "initialize");
                spyOn(BetSettingBase, "initialize");
                spyOn(BetSettingBase, "setEnable");
                spyOn(NumberGameBetSetting, "initEvent");
            });

            beforeEach(function () {
                setFixtures('<input id="editable" value="True" /> <input id="max-per-ball-161" disabled />');
                NumberGameBetSetting.initialize();
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
            it("NumberGameBetSetting.initEvent() should be called", function () {
                expect(NumberGameBetSetting.initEvent).toHaveBeenCalled();
            });
            it("#max-per-ball-161 should be enabled", function () {
                var result = $("#max-per-ball-161").prop("disabled");

                expect(result).toBe(false);
            });
        });

        describe("initEvent", function () {
            beforeEach(function () {
                var htmlButton = '<button id="btnSubmitBetSetting">Submit</button><button id="btnReset">Reset</button>';
                setFixtures(htmlButton);

                spyOn(BetSettingBase, "formatInputText");

                NumberGameBetSetting.initEvent();
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

                expect(BetSettingBase.showComfirm).toHaveBeenCalledWith($submit, "UpdateNumberGameBetSettings", NumberGameBetSetting.updateBetSetting);
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
                maxperball: 100
            };

            beforeAll(function () {
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) { return url; });
                spyOn(BetSettingBase, "getBetSettingParams").and.returnValue({});
                spyOn(BetSettingBase, "updateBetSetting");

                setFixtures('<input id="max-per-ball-161" value="100" />');
            });

            it("BetSettingBase.updateBetSetting should be called with correct parameter", function () {
                var expectedUrl = "NumberGameBetSetting/UpdateBetSetting";

                NumberGameBetSetting.updateBetSetting(custId, userName, nickName);

                expect(BetSettingBase.updateBetSetting).toHaveBeenCalledWith(expectedUrl, expectedParam);
            });
        });
    });
});