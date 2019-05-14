'use strict';
define(['jquery', 'common/site', '../common/betsettingbase', '../common/betsetting.helper'], function ($, Site, BetSettingBase, BetSettingHelper) {
    const SPORT_ID = 161;

    const _me = {
        initialize: function () {
            Site.initialize();
            BetSettingBase.initialize();
            _me.initEvent();

            BetSettingBase.setEnable();
            const enable = $('#editable').val() === 'True';
            $('#max-per-ball-161').prop('disabled', !enable);
        },

        initEvent: function () {
            $('#btnReset').on('click', function () {
                BetSettingBase.resetInput();
            });

            $('#btnSubmitBetSetting').on('click', function () {
                BetSettingBase.showComfirm($(this), 'UpdateNumberGameBetSettings', _me.updateBetSetting);
            });

            // Formating number in text box.
            BetSettingBase.formatInputText();
        },

        updateBetSetting: function (custId, userName, nickName) {
            const url = Site.resolveClientUrl('NumberGameBetSetting/UpdateBetSetting');

            const maxperball = BetSettingHelper.convertToFloat($('#max-per-ball-161').val());
            const params = BetSettingBase.getBetSettingParams(SPORT_ID);
            params.maxperball = maxperball;
            params.custid = custId;
            params.userName = userName;
            params.nickName = nickName;

            BetSettingBase.updateBetSetting(url, params);
        }
    };

    return _me;
});