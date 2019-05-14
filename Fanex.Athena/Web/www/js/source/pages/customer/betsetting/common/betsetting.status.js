'use strict';
define(['jquery', 'common/site', './betsetting.helper'], function ($, Site, BetSettingHelper) {
    const _me = {
        update: function (url, postData) {
            $.ajax({
                type: 'POST',
                url: url,
                cache: false,
                data: postData,
                dataType: 'json',
                success: function (result) {
                    const messageResource = result.IsSuccessful ? 'MessageSuccess' : 'Fail';
                    BetSettingHelper.showDialogMesage(Site.getSingleResource(messageResource), result.Message);
                },
                error: function (request, status, err) {
                    BetSettingHelper.showDialogMesage(Site.getSingleResource('Error'), err);
                }
            });
        },

        getCommonPostData: function ($context) {
            const productId = parseInt($('#ProductId').val(), 10);
            const nickName = $context.data('nick-name');
            // update value  (0: enable, 1: disable) is opposed with current value (1: enable, 0: disable)
            const status = $context.data('status');
            const custId = $context.data('cust-id');

            return {
                productId: productId,
                nickname: nickName,
                status: status,
                custid: custId
            };
        }
    };

    return _me;
});