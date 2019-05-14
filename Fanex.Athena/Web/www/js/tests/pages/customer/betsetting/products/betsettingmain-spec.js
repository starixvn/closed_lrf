var basePath = "pages/customer/betsetting/";
var modulePath = ["jquery", "common/site", basePath + "common/betsettingbase", basePath + "common/betsetting.copy", basePath + "products/betsettingmain"];

define(modulePath, function ($, Site, BetSettingBase, BetSettingCopy, BetSettingMain) {
    describe("BetSettingMain", function () {
        describe("initialize()", function () {
            beforeAll(function () {
                spyOn(Site, "initialize");
                spyOn(BetSettingBase, "initialize");
                spyOn(BetSettingBase, "setEnable");
                spyOn(BetSettingMain, "initEvent");
            });

            beforeEach(function () {
                BetSettingMain.initialize();
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
            it("BetSettingMain.initEvent() should be called", function () {
                expect(BetSettingMain.initEvent).toHaveBeenCalled();
            });
        });

        describe("initEvent()", function () {
            beforeEach(function () {
                var htmlButton = '<button id="btnSubmitBetSetting">Submit</button><button id="btnReset">Reset</button>';
                setFixtures('<input type="checkbox" id="chkCopyAll"/>' + htmlButton);

                spyOn(BetSettingBase, "formatInputText");

                BetSettingMain.initEvent();
            });

            it("#chkCopyAll fire click event - BetSettingCopy.checkCopyAllValues() should be called with correct parameter", function () {
                spyOn(BetSettingCopy, "checkCopyAllValues");
                var $checkbox = $("#chkCopyAll");

                $checkbox.click();

                expect(BetSettingCopy.checkCopyAllValues).toHaveBeenCalledWith($checkbox);
            });

            it("#btnReset fire click event - BetSettingBase.resetInput() should be called", function () {
                spyOn(BetSettingBase, "resetInput");

                $("#btnReset").click();

                expect(BetSettingBase.resetInput).toHaveBeenCalled();
            });

            it("#btnSubmitBetSetting fire click event with product Sportsbook - BetSettingBase.showComfirm() should be called with correct parameter", function () {
                appendSetFixtures('<input id="ProductId" value="0" />');
                spyOn(BetSettingBase, "showComfirm");
                var $submit = $("#btnSubmitBetSetting");

                $submit.click();

                expect(BetSettingBase.showComfirm).toHaveBeenCalledWith($submit, "UpdateSportsbookBetSettings", BetSettingMain.updateBetSetting);
            });

            it("#btnSubmitBetSetting fire click event with product which is not supported  - BetSettingBase.showComfirm() should be called with correct parameter", function () {
                appendSetFixtures('<input id="ProductId" value="10" />');
                spyOn(BetSettingBase, "showComfirm");
                var $submit = $("#btnSubmitBetSetting");

                $submit.click();

                expect(BetSettingBase.showComfirm).toHaveBeenCalledWith($submit, "", BetSettingMain.updateBetSetting);
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
                nickName: nickName
            };

            beforeAll(function () {
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) { return url; });
            });

            beforeEach(function () {
                spyOn(BetSettingBase, "updateBetSetting");
            });

            it("When Product is Sportsbook - BetSettingBase.updateBetSetting should be called with correct parameter", function () {
                appendSetFixtures('<input id="ProductId" value="0" />');
                var expectedUrl = "SportsbookBetSetting/UpdateBetSetting";

                BetSettingMain.updateBetSetting(custId, userName, nickName);

                expect(BetSettingBase.updateBetSetting).toHaveBeenCalledWith(expectedUrl, expectedParam);
            });

            it("When Product which is not supported should not be called", function () {
                appendSetFixtures('<input id="ProductId" value="10" />');

                BetSettingMain.updateBetSetting(custId, userName, nickName);

                expect(BetSettingBase.updateBetSetting).not.toHaveBeenCalled();
            });
        });
    });
});