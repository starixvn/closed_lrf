var basePath = "pages/customer/betsetting/";
var modulePath = ["jquery", "common/site", basePath + "common/betsetting.helper", basePath + "products/dcsbetsetting", basePath + "products/exchange"];

define(modulePath, function ($, Site, BetSettingHelper, DcsBetSetting, ExchangeBetSetting) {
    describe("ExchangeBetSetting", function () {
        describe("initialize", function () {
            beforeAll(function () {
                spyOn(DcsBetSetting, "initialize");
                spyOn(BetSettingHelper, "showDialogMesage");
                spyOn(ExchangeBetSetting, "initEvent");
            });

            beforeEach(function () {
                setFixtures('<input id="editable" value="True" /> <input id="max-per-ball-161" disabled />');
                ExchangeBetSetting.initialize();
            });

            it("DcsBetSetting.initialize() should be called", function () {
                expect(DcsBetSetting.initialize).toHaveBeenCalled();
            });
            it("ExchangeBetSetting.initEvent() should be called", function () {
                expect(ExchangeBetSetting.initEvent).toHaveBeenCalled();
            });
        });

        describe("initEvent", function () {
            it("#btnSubmit fire click event - updateComm() should be called", function () {
                var htmlButton = '<button id="btnSubmit" data-cust-id="1234"></button>' +
                    '<select id="ddlCommission" data-original-value="123"><option value="234"></option></select>';
                setFixtures(htmlButton);
                spyOn(ExchangeBetSetting, "updateComm");

                ExchangeBetSetting.initEvent();
                $("#btnSubmit").click();

                expect(ExchangeBetSetting.updateComm).toHaveBeenCalledWith("1234", 123, "234");
            });

            it("#btnReset fire click event - reset Commission dropdown to original value", function () {
                var htmlButton = '<button id="btnReset"></button>' +
                    '<select id="ddlCommission" data-original-value="123"><option value="123"><option value="234" selected="selected"></option></select>';
                setFixtures(htmlButton);
                spyOn($.fn, "change");

                ExchangeBetSetting.initEvent();
                $("#btnReset").click();

                expect($("#ddlCommission").val()).toBe("123");
                expect($.fn.change).toHaveBeenCalled();
            });
        });

        describe("updateComm(custId, oldCommission, newCommission)", function () {
            var custId = "1234";
            var oldCommission = "2.5";
            var newCommission = "4.5"
            var url = "localhost/ExchangeDcsBetSetting/UpdateComm";
            var ajaxOption;

            beforeAll(function () {
                spyOn(Site, "getSingleResource").and.callFake(function (key) { return key; });
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) { return "localhost/" + url; });
                spyOn($, "ajax").and.callFake(function (option) { ajaxOption = option; });
            });

            it("ajax option should be correct", function () {
                ExchangeBetSetting.updateComm(custId, oldCommission, newCommission);

                expect(ajaxOption.type).toBe("POST");
                expect(ajaxOption.cache).toBe(false);
                expect(ajaxOption.url).toBe(url);
                expect(ajaxOption.data).toEqual({ custid: custId, oldCommission: oldCommission, newCommission: newCommission });
                expect(ajaxOption.dataType).toBe("json");
            });

            it("call success in ajax option - Code in response is 0 (success) - BetSettingHelper.showDialogMesage should be called with correct parameter", function () {
                spyOn(BetSettingHelper, "showDialogMesage");
                var message = "Success";
                var response = { Code: 0, Message: message };

                ExchangeBetSetting.updateComm(custId, oldCommission, newCommission);
                ajaxOption.success(response);

                expect(BetSettingHelper.showDialogMesage).toHaveBeenCalledWith("MessageSuccess", message);
            });
        });
    });
});