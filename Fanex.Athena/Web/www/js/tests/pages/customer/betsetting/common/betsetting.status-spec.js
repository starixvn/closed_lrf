var basePath = "pages/customer/betsetting/common/";
var modulePath = ["jquery", "common/site", basePath + "betsetting.helper", basePath + "betsetting.status"];

define(modulePath, function ($, Site, BetSettingHelper, BetSettingStatus) {
    describe("BetSettingStatus", function () {
        beforeAll(function () {
            spyOn(Site, "getSingleResource").and.callFake(function (resource) { return resource; });
        });

        describe("update(url, postData)", function () {
            var ajaxOption;
            var url = "localhost";
            var data = {};

            beforeEach(function () {
                spyOn($, "ajax").and.callFake(function (option) { ajaxOption = option; });

                BetSettingStatus.update(url, data);
            });

            it("ajax option should be correct", function () {
                expect(ajaxOption.type).toBe("POST");
                expect(ajaxOption.dataType).toBe("json");
                expect(ajaxOption.url).toBe(url);
                expect(ajaxOption.data).toBe(data);
            });

            it("success in ajax option is called - update success - BetSettingHelper.showDialogMesage(title, message) should be called with correct parameters", function () {
                spyOn(BetSettingHelper, "showDialogMesage");

                var response = { IsSuccessful: true, Message: "Success" };
                ajaxOption.success(response);

                expect(BetSettingHelper.showDialogMesage).toHaveBeenCalledWith("MessageSuccess", response.Message);
            });

            it("success in ajax option is called - update fail - BetSettingHelper.showDialogMesage(title, message) should be called with correct parameters", function () {
                spyOn(BetSettingHelper, "showDialogMesage");

                var response = { IsSuccessful: false, Message: "Fail" };
                ajaxOption.success(response);

                expect(BetSettingHelper.showDialogMesage).toHaveBeenCalledWith("Fail", response.Message);
            });

            it("error in ajax option is called - BetSettingHelper.showDialogMesage(title, message) should be called with correct parameters", function () {
                spyOn(BetSettingHelper, "showDialogMesage");

                ajaxOption.error("", "", "Error Text");

                expect(BetSettingHelper.showDialogMesage).toHaveBeenCalledWith("Error", "Error Text");
            });
        });

        describe("getCommonPostData($context)", function () {
            it("object is returned correctly when call function", function () {
                setFixtures('<input id="ProductId" value="1"/> <div id="context" data-nick-name="admin" data-status="1" data-cust-id="2"></div>');
                var expectedResult = {
                    productId: 1,
                    nickname: "admin",
                    status: 1,
                    custid: 2
                };

                var result = BetSettingStatus.getCommonPostData($("#context"));

                expect(result).toEqual(expectedResult);
            });
        });
    });
});