var basePath = "pages/customer/betsetting/common/";
var modulePath = ["jquery", "common/site", basePath + "betsetting.helper", basePath + "betsetting.validation"];

define(modulePath, function ($, Site, BetSettingHelper, BetSettingValidation) {
    function createInputElements(dataSetting) {
        var setting = {
            sportId: 1,
            minbet: "", limitMinBet: "",
            maxbet: "", limitMaxBet: "",
            maxPerMatch: "", limitMinOfMaxPerMatch: "", limitMaxOfMaxPerMatch: ""
        };
        $.extend(setting, dataSetting);

        var minbetInput = '<input id="min-bet-' + setting.sportId + '" value="' + setting.minbet + '" data-min-value="' + setting.limitMinBet + '"/>';
        var maxbetInput = '<input id="max-bet-' + setting.sportId + '" value="' + setting.maxbet + '" data-max-value="' + setting.limitMaxBet + '"/>';
        var maxPerMatchInput = '<input id="max-per-match-' + setting.sportId + '" value="' + setting.maxPerMatch +
            '" data-min-value="' + setting.limitMinOfMaxPerMatch + '" data-max-value="' + setting.limitMaxOfMaxPerMatch + '"/>';

        setFixtures(minbetInput + maxbetInput + maxPerMatchInput);
    }

    describe("BetSettingValidation", function () {
        beforeAll(function () {
            spyOn(Site, "getSingleResource").and.callFake(function (resource) { return resource; });
        });

        describe("checkValidationNumberGame()", function () {
            beforeEach(function () {
                setFixtures('<input id="max-per-ball-161" value="" data-max-value=""/>');
            });

            it("BetSettingValidation.checkLimitMinMaxBet is invalid - return false", function () {
                spyOn(BetSettingValidation, "checkLimitMinMaxBet").and.returnValue(false);

                var result = BetSettingValidation.checkValidationNumberGame();

                expect(result).toBe(false);
            });

            it("maxPerBall value is invalid - return false and BetSettingHelper.showBalloonMsg should be called with correct parameter", function () {
                spyOn(BetSettingValidation, "checkLimitMinMaxBet").and.returnValue(true);
                spyOn(BetSettingHelper, "showBalloonMsg");
                var expectedSelector = "#max-per-ball-161";
                var expectedMessage = "IncorrectMaxPerBall";

                var result = BetSettingValidation.checkValidationNumberGame();

                expect(result).toBe(false);
                expect(BetSettingHelper.showBalloonMsg).toHaveBeenCalledWith(expectedSelector, expectedMessage);
            });

            it("maxPerBall value is not in range - return false and BetSettingHelper.showBalloonMsg should be called with correct parameter", function () {
                spyOn(BetSettingValidation, "checkLimitMinMaxBet").and.returnValue(true);
                spyOn(BetSettingHelper, "showBalloonMsg");
                var expectedSelector = "#max-per-ball-161";
                var expectedMessage = "MaxPerBallLessThanOrEqual 10";

                $(expectedSelector).val(15);
                $(expectedSelector).attr("data-max-value", 10);

                var result = BetSettingValidation.checkValidationNumberGame();

                expect(result).toBe(false);
                expect(BetSettingHelper.showBalloonMsg).toHaveBeenCalledWith(expectedSelector, expectedMessage);
            });

            it("return true when values are valid", function () {
                spyOn(BetSettingValidation, "checkLimitMinMaxBet").and.returnValue(true);
                spyOn(BetSettingHelper, "showBalloonMsg");
                var $input = $("#max-per-ball-161");

                $input.val(5);
                $input.attr("data-max-value", 10);

                var result = BetSettingValidation.checkValidationNumberGame();

                expect(result).toBe(true);
                expect(BetSettingHelper.showBalloonMsg).not.toHaveBeenCalled();
            });
        });

        describe("checkLimitMinMaxBet(sportId)", function () {
            it("return true when have no input forms", function () {
                var result = BetSettingValidation.checkLimitMinMaxBet(1);

                expect(result).toBe(true);
            });

            it("minbet value is not a number - return false and BetSettingHelper.showBalloonMsg(selector, message) should be called with correct parameters", function () {
                var sportId = 1;
                createInputElements();

                spyOn(BetSettingHelper, "showBalloonMsg");
                var expectedSelector = "#min-bet-1";
                var expectedMessage = "IncorrectMinBet";

                var result = BetSettingValidation.checkLimitMinMaxBet(sportId);

                expect(result).toBe(false);
                expect(BetSettingHelper.showBalloonMsg).toHaveBeenCalledWith(expectedSelector, expectedMessage);
            });

            it("maxBet value is not a number - return false and BetSettingHelper.showBalloonMsg(selector, message) should be called with correct parameters", function () {
                var sportId = 1;
                var setting = { minbet: 1 };
                createInputElements(setting);

                spyOn(BetSettingHelper, "showBalloonMsg");
                var expectedSelector = "#max-bet-1";
                var expectedMessage = "IncorrectMaxBet";

                var result = BetSettingValidation.checkLimitMinMaxBet(sportId);

                expect(result).toBe(false);
                expect(BetSettingHelper.showBalloonMsg).toHaveBeenCalledWith(expectedSelector, expectedMessage);
            });

            it("maxPerMatcth value is not a number - return false and BetSettingHelper.showBalloonMsg(selector, message) should be called with correct parameters", function () {
                var sportId = 1;
                var setting = { minbet: 1, maxbet: 10 };
                createInputElements(setting);

                spyOn(BetSettingHelper, "showBalloonMsg");
                var expectedSelector = "#max-per-match-1";
                var expectedMessage = "IncorrectMaxPerMatch";

                var result = BetSettingValidation.checkLimitMinMaxBet(sportId);

                expect(result).toBe(false);
                expect(BetSettingHelper.showBalloonMsg).toHaveBeenCalledWith(expectedSelector, expectedMessage);
            });

            it("minBet, maxBet, maxPerMatcth equal 0 - return true", function () {
                var sportId = 1;
                var setting = { minbet: 0, maxbet: 0, maxPerMatch: 0 };
                createInputElements(setting);

                var result = BetSettingValidation.checkLimitMinMaxBet(sportId);

                expect(result).toBe(true);
            });

            it("minbet < limitMinBet - return false and BetSettingHelper.showBalloonMsg(selector, message) should be called with correct parameters", function () {
                var sportId = 1;
                var setting = { minbet: 1, maxbet: 10, maxPerMatch: 100, limitMinBet: 5 };
                createInputElements(setting);

                spyOn(BetSettingHelper, "showBalloonMsg");
                var expectedSelector = "#min-bet-1";
                var expectedMessage = "MinBetGreaterThanOrEqual 5";

                var result = BetSettingValidation.checkLimitMinMaxBet(sportId);

                expect(result).toBe(false);
                expect(BetSettingHelper.showBalloonMsg).toHaveBeenCalledWith(expectedSelector, expectedMessage);
            });

            it("maxbet > limitMaxBet - return false and BetSettingHelper.showBalloonMsg(selector, message) should be called with correct parameters", function () {
                var sportId = 1;
                var setting = { minbet: 5, maxbet: 15, maxPerMatch: 100, limitMinBet: 5, limitMaxBet: 10 };
                createInputElements(setting);

                spyOn(BetSettingHelper, "showBalloonMsg");
                var expectedSelector = "#max-bet-1";
                var expectedMessage = "MaxBetLessThanOrEqual 10";

                var result = BetSettingValidation.checkLimitMinMaxBet(sportId);

                expect(result).toBe(false);
                expect(BetSettingHelper.showBalloonMsg).toHaveBeenCalledWith(expectedSelector, expectedMessage);
            });

            it("maxPerMatcth < limitMaxPerMatchMin - return false and BetSettingHelper.showBalloonMsg(selector, message) should be called with correct parameters", function () {
                var sportId = 1;
                var setting = { minbet: 5, maxbet: 10, maxPerMatch: 100, limitMinBet: 5, limitMaxBet: 10, limitMinOfMaxPerMatch: 110 };
                createInputElements(setting);

                spyOn(BetSettingHelper, "showBalloonMsg");
                var expectedSelector = "#max-per-match-1";
                var expectedMessage = "MaxBetMatchMoreThanOrEqual 110";

                var result = BetSettingValidation.checkLimitMinMaxBet(sportId);

                expect(result).toBe(false);
                expect(BetSettingHelper.showBalloonMsg).toHaveBeenCalledWith(expectedSelector, expectedMessage);
            });

            it("maxPerMatcth < limitMaxPerMatchMin - return false and BetSettingHelper.showBalloonMsg(selector, message) should be called with correct parameters", function () {
                var sportId = 1;
                var setting = { minbet: 5, maxbet: 10, maxPerMatch: 210, limitMinBet: 5, limitMaxBet: 10, limitMinOfMaxPerMatch: 110, limitMaxOfMaxPerMatch: 200 };
                createInputElements(setting);

                spyOn(BetSettingHelper, "showBalloonMsg");
                var expectedSelector = "#max-per-match-1";
                var expectedMessage = "MaxBetMatchLessThanOrEqual 200";

                var result = BetSettingValidation.checkLimitMinMaxBet(sportId);

                expect(result).toBe(false);
                expect(BetSettingHelper.showBalloonMsg).toHaveBeenCalledWith(expectedSelector, expectedMessage);
            });

            it("minBet > maxBet - return false and BetSettingHelper.showBalloonMsg(selector, message) should be called with correct parameters", function () {
                var sportId = 1;
                var setting = { minbet: 11, maxbet: 10, maxPerMatch: 200, limitMinBet: 5, limitMaxBet: 10, limitMinOfMaxPerMatch: 110, limitMaxOfMaxPerMatch: 200 };
                createInputElements(setting);

                spyOn(BetSettingHelper, "showBalloonMsg");
                var expectedSelector = "#min-bet-1";
                var expectedMessage = "MinBetCanNotGreaterThanMaxBet";

                var result = BetSettingValidation.checkLimitMinMaxBet(sportId);

                expect(result).toBe(false);
                expect(BetSettingHelper.showBalloonMsg).toHaveBeenCalledWith(expectedSelector, expectedMessage);
            });

            it("minBet > maxBet - return false and BetSettingHelper.showBalloonMsg(selector, message) should be called with correct parameters", function () {
                var sportId = 1;
                var setting = { minbet: 11, maxbet: 210, maxPerMatch: 200, limitMinBet: 5, limitMaxBet: 210, limitMinOfMaxPerMatch: 110, limitMaxOfMaxPerMatch: 200 };
                createInputElements(setting);

                spyOn(BetSettingHelper, "showBalloonMsg");
                var expectedSelector = "#max-bet-1";
                var expectedMessage = "MaxBetCanNotGreaterThanMaxPerMatch";

                var result = BetSettingValidation.checkLimitMinMaxBet(sportId);

                expect(result).toBe(false);
                expect(BetSettingHelper.showBalloonMsg).toHaveBeenCalledWith(expectedSelector, expectedMessage);
            });

            it("All inputs are valid - return true", function () {
                var sportId = 1;
                var setting = { minbet: 5, maxbet: 10, maxPerMatch: 200, limitMinBet: 5, limitMaxBet: 10, limitMinOfMaxPerMatch: 110, limitMaxOfMaxPerMatch: 200 };
                createInputElements(setting);

                var result = BetSettingValidation.checkLimitMinMaxBet(sportId);

                expect(result).toBe(true);
            });
        });

        describe("checkLimitMinMaxBets(sportIds)", function () {
            var sportIds = [1];

            it("data invalid - return false", function () {
                spyOn(BetSettingValidation, "checkLimitMinMaxBet").and.returnValue(false);

                var result = BetSettingValidation.checkLimitMinMaxBets(sportIds);

                expect(result).toBe(false);
            });

            it("data valid - return true", function () {
                spyOn(BetSettingValidation, "checkLimitMinMaxBet").and.returnValue(true);

                var result = BetSettingValidation.checkLimitMinMaxBets(sportIds);

                expect(result).toBe(true);
            });
        });
    });
});