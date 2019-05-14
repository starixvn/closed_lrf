var basePath = "pages/customer/betsetting/";
var modulePath = ["jquery", "common/site", basePath + "common/betsettingbase", basePath + "common/betsetting.status", basePath + "products/betsettingbygroup"];

define(modulePath, function ($, Site, BetSettingBase, BetSettingStatus, BetSettingByGroup) {
    var PRODUCTID_AGCASINO = 10;
    var PRODUCTID_GOLDDELUX = 11;

    var bettingLimitDefault = [
        {
            GameType: "BAC",
            Name: "Baccarat",
            Groups: [
                {
                    GroupType: "A",
                    Max: 2500,
                    Min: 5
                }
            ]
        },
        {
            GameType: "BBB",
            Name: "BBB",
            Groups: [
                {
                    GroupType: "B",
                    Max: 2500,
                    Min: 5
                }
            ]
        }];

    function initialize(productId, defaultGroup, bettingLimitJson) {
        productId = productId || PRODUCTID_AGCASINO;
        defaultGroup = defaultGroup || "";

        bettingLimitJson = bettingLimitJson || JSON.stringify(bettingLimitDefault);

        var htmlBettingLimit = '<input id="BettingLimit" value=' + bettingLimitJson + ' />';
        var htmlProductId = '<input id="ProductId" value="' + productId + '"/>';
        var htmlbetSettingGroup = '<select id="betSettingGroup" data-default="' + defaultGroup + '">'
            + '<option selected value="A">A</option><option value="B">B</option>'
            + '</select>';

        var htmlButton = '<button id="btnSubmitBetSetting">Submit</button><button id="btnReset">Reset</button><button id="btnUpdateStatus">Update Status</button>';

        setFixtures(htmlProductId + htmlBettingLimit + htmlbetSettingGroup + htmlButton);

        spyOn(Site, "initialize");
        spyOn(BetSettingBase, "initialize");
    }

    describe("BetSettingByGroup", function () {
        beforeAll(function () {
            spyOn(Site, "resolveClientUrl").and.callFake(function (url) { return url; });
            spyOn(Site, "getSingleResource").and.callFake(function (resource) { return resource; });
        });

        describe("initialize", function () {
            beforeAll(function () {
                spyOn(BetSettingByGroup, "initEvent");
            });

            it("Site.initialize() should be called", function () {
                initialize();
                BetSettingByGroup.initialize();

                expect(Site.initialize).toHaveBeenCalled();
            });

            it("BetSettingBase.initialize() should be called", function () {
                initialize();
                BetSettingByGroup.initialize();

                expect(BetSettingBase.initialize).toHaveBeenCalled();
            });

            it("BetSettingByGroup.initEvent() should be called", function () {
                initialize();
                BetSettingByGroup.initialize();

                expect(BetSettingByGroup.initEvent).toHaveBeenCalled();
            });

            it("#betSettingGroup data-default is empty - buttons should be disabled", function () {
                initialize();
                BetSettingByGroup.initialize();

                var isDisabledSubmit = $("#btnSubmitBetSetting").prop("disabled");
                var isDisabledReset = $("#btnReset").prop("disabled");

                expect(isDisabledSubmit).toBe(true);
                expect(isDisabledReset).toBe(true);
            });

            it("selectedIndex attribute of #betSettingGroup should be -1", function () {
                initialize();
                BetSettingByGroup.initialize();

                var result = $("#betSettingGroup").prop("selectedIndex");

                expect(result).toBe(-1);
            });

            it("#betSettingGroup should fired change event when it exist", function () {
                spyOn($.fn, "change");

                initialize();
                BetSettingByGroup.initialize();

                expect($.fn.change).toHaveBeenCalled();
            });

            it("selectedIndex attribute of #betSettingGroup should be 0 when default data group is not empty", function () {
                initialize(undefined, "A");
                BetSettingByGroup.initialize();

                var result = $("#betSettingGroup").prop("selectedIndex");

                expect(result).toBe(0);
            });

            it("#betSettingGroup should not fired change event when it not exist", function () {
                spyOn($.fn, "change");

                initialize();
                $('#betSettingGroup').remove();
                BetSettingByGroup.initialize();

                expect($.fn.change).not.toHaveBeenCalled();
            });
        });

        describe("initEvent()", function () {
            describe("#betSettingGroup fired change event", function () {
                function createInputForm(gameType) {
                    appendSetFixtures('<span id="min-' + gameType + '"></span><span id="max-' + gameType + '"></span>');
                }

                beforeEach(function () {
                    initialize();
                    BetSettingByGroup.initialize();
                    createInputForm(bettingLimitDefault[0].GameType);
                    createInputForm(bettingLimitDefault[1].GameType);
                });

                it("min inputs should have correct value", function () {
                    $('#betSettingGroup').val("A");
                    $('#betSettingGroup').change();

                    var minBAC = $("#min-BAC").html();
                    var minBBB = $("#min-BBB").html();

                    expect(minBAC).toBe("5");
                    //expect(minBBB).toBe("");
                });

                it("input of 'BAC' game type should have correct content", function () {
                    $('#betSettingGroup').val("A");
                    $('#betSettingGroup').change();

                    var minBAC = $("#min-BAC").html();
                    var maxBAC = $("#max-BAC").html();

                    expect(minBAC).toBe("5");
                    expect(maxBAC).toBe("2,500");
                });

                it("input of 'BBB' game type should have empty content", function () {
                    $('#betSettingGroup').val("A");
                    $('#betSettingGroup').change();

                    var minBBB = $("#min-BBB").html();
                    var maxBBB = $("#max-BBB").html();

                    expect(minBBB).toBe("");
                    expect(maxBBB).toBe("");
                });

                it("buttons should be disabled", function () {
                    var isDisabledSubmit = $("#btnSubmitBetSetting").prop("disabled");
                    var isDisabledReset = $("#btnReset").prop("disabled");

                    expect(isDisabledSubmit).toBe(true);
                    expect(isDisabledReset).toBe(true);
                });
            });

            describe("#btnSubmitBetSetting fired click event", function () {
                beforeEach(function () {
                    spyOn(BetSettingBase, "showComfirm");
                });

                it("Product is AgCasino - BetSettingBase.showComfirm should be called with correct parameter", function () {
                    initialize();
                    BetSettingByGroup.initialize();

                    spyOn(BetSettingByGroup, "isValid").and.returnValue(true);
                    $("#btnSubmitBetSetting").click();

                    expect(BetSettingBase.showComfirm).toHaveBeenCalledWith($("#btnSubmitBetSetting"), "UpdateAgCasinoBetSettings", BetSettingByGroup.updateBetSetting);
                });

                it("Product is GoldDeluxe - BetSettingBase.showComfirm should be called with correct parameter", function () {
                    initialize(PRODUCTID_GOLDDELUX);
                    BetSettingByGroup.initialize();

                    spyOn(BetSettingByGroup, "isValid").and.returnValue(true);
                    $("#btnSubmitBetSetting").click();

                    expect(BetSettingBase.showComfirm).toHaveBeenCalledWith($("#btnSubmitBetSetting"), "UpdateGoldDeluxeBetSettings", BetSettingByGroup.updateBetSetting);
                });

                it("Product is neither GoldDeluxe nor AgCasino - BetSettingBase.showComfirm should be called with correct parameter", function () {
                    initialize(1);
                    BetSettingByGroup.initialize();

                    spyOn(BetSettingByGroup, "isValid").and.returnValue(true);
                    $("#btnSubmitBetSetting").click();

                    expect(BetSettingBase.showComfirm).toHaveBeenCalledWith($("#btnSubmitBetSetting"), "", BetSettingByGroup.updateBetSetting);
                });

                it("Validation is false - BetSettingBase.showComfirm should not be called", function () {
                    initialize();
                    BetSettingByGroup.initialize();

                    spyOn(BetSettingByGroup, "isValid").and.returnValue(false);
                    $("#btnSubmitBetSetting").click();

                    expect(BetSettingBase.showComfirm).not.toHaveBeenCalled();
                });
            });

            describe("#btnReset fire click event", function () {
                beforeEach(function () {
                    spyOn($.fn, "change");
                });

                it("selectedIndex of #betSettingGroup should be -1 when data-default is empty", function () {
                    initialize();
                    BetSettingByGroup.initialize();

                    $("#btnReset").click();

                    var result = $("#betSettingGroup").prop("selectedIndex");

                    expect(result).toBe(-1);
                });

                it("selectedIndex of #betSettingGroup should be correct when data-default is not empty", function () {
                    var defaultGroup = "A";
                    initialize(PRODUCTID_AGCASINO, defaultGroup);
                    BetSettingByGroup.initialize();

                    $("#btnReset").click();

                    var result = $("#betSettingGroup").prop("selectedIndex");

                    expect(result).toBe(0);
                });

                it("#betSettingGroup should fired change event", function () {
                    initialize();
                    BetSettingByGroup.initialize();

                    $("#btnReset").click();

                    expect($.fn.change).toHaveBeenCalled();
                });
            });

            describe("#btnUpdateStatus fire click event", function () {
                it("BetSettingByGroup.updateStatus($context) should be called with correct parameter", function () {
                    initialize();
                    BetSettingByGroup.initialize();
                    spyOn(BetSettingByGroup, "updateStatus");
                    var $btnUpdateStatus = $("#btnUpdateStatus");

                    $btnUpdateStatus.click();

                    expect(BetSettingByGroup.updateStatus).toHaveBeenCalledWith($btnUpdateStatus);
                });
            });
        });

        describe("updateBetSetting(custId, userName, nickName)", function () {
            var custId = 1, userName = "username", nickName = "nickname";
            var expectedParam = {
                custid: custId,
                userName: userName,
                nickName: nickName,
                group: "A"
            };

            beforeEach(function () {
                spyOn(BetSettingBase, "updateBetSetting");
            });

            it("When Product is AGCasino - BetSettingBase.updateBetSetting should be called with correct parameter", function () {
                initialize();
                var expectedUrl = "AgCasinoBetSetting/UpdateBetSetting";

                BetSettingByGroup.updateBetSetting(custId, userName, nickName);

                expect(BetSettingBase.updateBetSetting).toHaveBeenCalledWith(expectedUrl, expectedParam);
            });

            it("When Product is GoldDeluxe - BetSettingBase.updateBetSetting should be called with correct parameter", function () {
                initialize(PRODUCTID_GOLDDELUX);
                $('#betSettingGroup').data("default", "A");
                BetSettingByGroup.initialize();
                var expectedUrl = "GoldDeluxeBetSetting/UpdateBetSetting";

                BetSettingByGroup.updateBetSetting(custId, userName, nickName);

                expect(BetSettingBase.updateBetSetting).toHaveBeenCalledWith(expectedUrl, expectedParam);
            });

            it("When Product is neither AGCasino nor GoldDeluxe - BetSettingBase.updateBetSetting should not be called", function () {
                initialize(1);
                $('#betSettingGroup').data("default", "A");
                BetSettingByGroup.initialize();

                BetSettingByGroup.updateBetSetting(custId, userName, nickName);

                expect(BetSettingBase.updateBetSetting).not.toHaveBeenCalled();
            });
        });

        describe("updateStatus($context)", function () {
            var expectedParam = {};

            beforeEach(function () {
                spyOn(BetSettingStatus, "update");
                spyOn(BetSettingStatus, "getCommonPostData").and.returnValue(expectedParam);
            });

            it("When Product is AGCasino - BetSettingStatus.update should be called with correct parameter", function () {
                initialize();
                BetSettingByGroup.initialize();
                var $context = $("#btnUpdateStatus");
                var expectedUrl = "AgCasinoBetSetting/UpdateStatus";

                BetSettingByGroup.updateStatus($context);

                expect(BetSettingStatus.update).toHaveBeenCalledWith(expectedUrl, expectedParam);
            });

            it("When Product is GoldDeluxe - BetSettingStatus.update should be called with correct parameter", function () {
                initialize(PRODUCTID_GOLDDELUX);
                $('#betSettingGroup').data("default", "A");
                BetSettingByGroup.initialize();
                var expectedUrl = "GoldDeluxeBetSetting/UpdateStatus";
                var $context = $("#btnUpdateStatus");

                BetSettingByGroup.updateStatus($context);

                expect(BetSettingStatus.update).toHaveBeenCalledWith(expectedUrl, expectedParam);
            });

            it("BetSettingStatus.getCommonPostData($context) should be called with correct parameter", function () {
                initialize();
                var $context = $("#btnUpdateStatus");

                BetSettingByGroup.updateStatus($context);

                expect(BetSettingStatus.getCommonPostData).toHaveBeenCalledWith($context);
            });

            it("When Product is neither AGCasino nor GoldDeluxe - BetSettingStatus.update should not be called", function () {
                initialize(1);
                $('#betSettingGroup').data("default", "A");
                BetSettingByGroup.initialize();
                var $context = $("#btnUpdateStatus");

                BetSettingByGroup.updateStatus($context);

                expect(BetSettingStatus.update).not.toHaveBeenCalled();
            });
        });

        describe("checkApiContainGroup(groupType)", function () {
            it("return true if bettingGroup data contain passed groupType", function () {
                initialize();
                BetSettingByGroup.initialize();
                var groupType = "A";

                var result = BetSettingByGroup.checkApiContainGroup(groupType);

                expect(result).toBe(true);
            });

            it("return false if bettingGroup data do not contain passed groupType", function () {
                initialize();
                BetSettingByGroup.initialize();
                var groupType = "C";

                var result = BetSettingByGroup.checkApiContainGroup(groupType);

                expect(result).toBe(false);
            });
        });

        describe("isValid()", function () {
            it("#betSettingGroup does not exist - return false", function () {
                var result = BetSettingByGroup.isValid();

                expect(result).toBe(false);
            });

            it("checkApiContainGroup return false - return false and window.alert should be called with correct parameter", function () {
                initialize();
                spyOn(BetSettingByGroup, "checkApiContainGroup").and.returnValue(false);
                spyOn(window, "alert");

                var result = BetSettingByGroup.isValid();

                expect(result).toBe(false);
                expect(window.alert).toHaveBeenCalledWith("AGCasinoNoGroupChosenErrMsg");
            });

            it("checkApiContainGroup return true - return true", function () {
                initialize();
                spyOn(BetSettingByGroup, "checkApiContainGroup").and.returnValue(true);

                var result = BetSettingByGroup.isValid();

                expect(result).toBe(true);
            });
        });
    });
});