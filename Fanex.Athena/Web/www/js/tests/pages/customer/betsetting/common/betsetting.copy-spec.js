var basePath = "pages/customer/betsetting/common/";
var modulePath = ["jquery", basePath + "constant", basePath + "betsetting.validation", basePath + "betsetting.copy"]
define(modulePath, function ($, Constant, BetSettingValidation, BetSettingCopy) {
    describe("BetSettingCopy", function () {
        describe("checkCopyAllValues($checkbox)", function () {
            beforeEach(function () {
                setFixtures('<input type="checkbox" id="chkCheckAll" />');
            });

            it("BetSettingCopy.setCopyValueBetSetting($inputTextList, enabled) should be called three times", function () {
                var expectedCallTime = 3;
                spyOn(BetSettingCopy, "setCopyValueBetSetting");

                var $checkbox = $("#chkCheckAll");
                BetSettingCopy.checkCopyAllValues($checkbox);

                expect(BetSettingCopy.setCopyValueBetSetting.calls.count()).toBe(expectedCallTime);
            });

            it("BetSettingCopy.setCopyValueBetSetting($inputTextList, enabled) should be called with correct parameters", function () {
                appendSetFixtures('<input id="min-1" /><input id="max-bet-1" /><input id="max-per-1" />');
                spyOn(BetSettingCopy, "setCopyValueBetSetting");
                var $checkbox = $("#chkCheckAll");
                $checkbox.prop("checked", true);

                BetSettingCopy.checkCopyAllValues($checkbox);
                
                var argForFirstCall = BetSettingCopy.setCopyValueBetSetting.calls.argsFor(0);
                var argForSecondCall = BetSettingCopy.setCopyValueBetSetting.calls.argsFor(1);
                var argForThirdCall = BetSettingCopy.setCopyValueBetSetting.calls.argsFor(2);

                expect(argForFirstCall).toEqual([$("#min-1"), true]);
                expect(argForSecondCall).toEqual([$("#max-bet-1"), true]);
                expect(argForThirdCall).toEqual([$("#max-per-1"), true]);
            });
        });

        describe("setCopyValueBetSetting($inputTextList, enabled)", function () {
            it("Inputs are disabled except the first one and product is Sportsbook", function () {
                spyOn(BetSettingValidation, "checkLimitMinMaxBet").and.returnValue(true);
                appendSetFixtures('<input id="min-1" value="10" /><input id="min-2" value="20" /><input id="min-3" value="30" />');
                appendSetFixtures('<input id="ProductId" value="0" />');

                var enable = true;
                BetSettingCopy.setCopyValueBetSetting($('input[id^="min"]'), enable);
                var disabledFirstInput = $("#min-1").prop("disabled");
                var disabledSecondInput = $("#min-2").prop("disabled");
                var disabledThirdInput = $("#min-3").prop("disabled");

                expect(disabledFirstInput).toBe(false);
                expect(disabledSecondInput).toBe(true);
                expect(disabledThirdInput).toBe(true);
            });

            it("Inputs value are copied from the first input(#min-1) and product is Sportsbook", function () {
                spyOn(BetSettingValidation, "checkLimitMinMaxBet").and.returnValue(true);
                appendSetFixtures('<input id="min-1" value="10" /><input id="min-2" value="20" /><input id="min-3" value="30" />');
                appendSetFixtures('<input id="ProductId" value="0" />');

                var enable = true;
                BetSettingCopy.setCopyValueBetSetting($('input[id^="min"]'), enable);
                var valueFirstInput = $("#min-1").val();
                var valueSecondInput = $("#min-2").val();
                var valueThirdInput = $("#min-3").val();

                expect(valueFirstInput).toBe("10");
                expect(valueSecondInput).toBe("10");
                expect(valueThirdInput).toBe("10");
            });

            it("Inputs are enabled when passed param 'enable' is false", function () {
                spyOn(BetSettingValidation, "checkLimitMinMaxBet").and.returnValue(true);
                appendSetFixtures('<input id="min-1" value="10" /><input id="min-2" value="20" /><input id="min-3" value="30" />');
                appendSetFixtures('<input id="ProductId" value="0" />');

                var enable = false;
                BetSettingCopy.setCopyValueBetSetting($('input[id^="min"]'), enable);
                var disabledFirstInput = $("#min-1").prop("disabled");
                var disabledSecondInput = $("#min-2").prop("disabled");
                var disabledThirdInput = $("#min-3").prop("disabled");

                expect(disabledFirstInput).toBe(false);
                expect(disabledSecondInput).toBe(false);
                expect(disabledThirdInput).toBe(false);
            });

            it("Inputs have correct values when passed param 'enable' is false", function () {
                spyOn(BetSettingValidation, "checkLimitMinMaxBet").and.returnValue(true);
                appendSetFixtures('<input id="min-1" value="10" /><input id="min-2" value="20" /><input id="min-3" value="30" />');
                appendSetFixtures('<input id="ProductId" value="0" />');

                var enable = false;
                BetSettingCopy.setCopyValueBetSetting($('input[id^="min"]'), enable);
                var valueFirstInput = $("#min-1").val();
                var valueSecondInput = $("#min-2").val();
                var valueThirdInput = $("#min-3").val();

                expect(valueFirstInput).toBe("10");
                expect(valueSecondInput).toBe("20");
                expect(valueThirdInput).toBe("30");
            });

            it("Inputs are disabled except the first one but not copied value when Limit Min Max Bet is not valid", function () {
                spyOn(BetSettingValidation, "checkLimitMinMaxBet").and.returnValue(false);
                appendSetFixtures('<input id="min-1" value="10" /><input id="min-2" value="20" /><input id="min-3" value="30" />');
                appendSetFixtures('<input id="ProductId" value="0" />');

                var enable = true;
                BetSettingCopy.setCopyValueBetSetting($('input[id^="min"]'), enable);

                var disabledFirstInput = $("#min-1").prop("disabled");
                var disabledSecondInput = $("#min-2").prop("disabled");
                var disabledThirdInput = $("#min-3").prop("disabled");

                var valueFirstInput = $("#min-1").val();
                var valueSecondInput = $("#min-2").val();
                var valueThirdInput = $("#min-3").val();

                expect(disabledFirstInput).toBe(false);
                expect(disabledSecondInput).toBe(true);
                expect(disabledThirdInput).toBe(true);

                expect(valueFirstInput).toBe("10");
                expect(valueSecondInput).toBe("20");
                expect(valueThirdInput).toBe("30");
            });

            it("BetSettingValidation.checkLimitMinMaxBet(sportId) should be called with correct parameter", function () {
                spyOn(BetSettingValidation, "checkLimitMinMaxBet").and.returnValue(false);

                var enable = true;
                BetSettingCopy.setCopyValueBetSetting($('input[id^="min"]'), enable);

                expect(BetSettingValidation.checkLimitMinMaxBet).toHaveBeenCalledWith(1);
            });
        });
    });
});