'use strict';
define(['jquery', './betsetting.validation'], function ($, BetSettingValidation) {
    
    const _me = {
        checkCopyAllValues: function ($checkbox) {
            const enabled = $checkbox.prop('checked');

            _me.setCopyValueBetSetting($('input[id^="min"]'), enabled);
            _me.setCopyValueBetSetting($('input[id^="max-bet"]'), enabled);
            _me.setCopyValueBetSetting($('input[id^="max-per"]'), enabled);
        },

        setCopyValueBetSetting: function ($inputTextList, enabled) {
            const copyValue = $inputTextList.first().val();

            // Enable or disable textbox, except the first one
            $inputTextList.not(':eq(0)').each(function () {
                $(this).prop('disabled', enabled);
            });

            const firstSportsbookSportId = 1;
            if (!BetSettingValidation.checkLimitMinMaxBet(firstSportsbookSportId)) {
                return false;
            }

            if (enabled) {
                // Copy value to textboxes
                $inputTextList.not(':eq(0)').each(function () {
                    $(this).val(copyValue);
                });
            }
        }
    };

    return _me;
});