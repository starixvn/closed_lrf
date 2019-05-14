'use strict';
define(['jquery', 'common/site', '../common/constant', '../common/betsettingbase', '../common/betsetting.status'],
    function ($, Site, Constant, BetSettingBase, BetSettingStatus) {
        const Product = Constant.Product;
        const CHECKBOX_SELECTOR = '#enable-product';
        const PRODUCT_CONTAIN_CHECKBOX = [Product.BetTrade, Product.Cashout];

        const ProductUpdateStatusUrlMap = {};
        ProductUpdateStatusUrlMap[Product.Macau] = 'ThirdPartyBetSetting/UpdateMacauStatus';
        ProductUpdateStatusUrlMap[Product.Colossusbets] = 'ThirdPartyBetSetting/UpdateColossusBetsStatus';
        ProductUpdateStatusUrlMap[Product.BetTrade] = 'ThirdPartyBetSetting/UpdateBetTradeStatus';
        ProductUpdateStatusUrlMap[Product.Cashout] = 'ThirdPartyBetSetting/UpdateCashOutStatus';
        ProductUpdateStatusUrlMap[Product.GoldDeluxe] = 'ThirdPartyBetSetting/UpdateGoldDeluxeStatus';

        const _me = {
            initialize: function () {
                Site.initialize();
                BetSettingBase.initialize();
                _me.initEvent();
            },

            initEvent: function () {
                $('#btnUpdateStatus').click(function () {
                    _me.updateStatus($(this));
                });

                $('#btnReset').on('click', _me.reset);
            },

            reset: function () {
                const $checkbox = $(CHECKBOX_SELECTOR);
                $checkbox.prop('checked', $checkbox.data('original') === 1);
            },

            updateStatus: function ($context) {
                const productId = parseInt($('#ProductId').val(), 10);
                const url = ProductUpdateStatusUrlMap[productId];
                if (!url) {
                    throw 'Invalid product id: ' + productId;
                }
                
                const params = BetSettingStatus.getCommonPostData($context);

                if (PRODUCT_CONTAIN_CHECKBOX.indexOf(productId) > -1) {
                    params.status = _me.getStatus();
                }

                BetSettingStatus.update(Site.resolveClientUrl(url), params);
            },

            getStatus: function () {
                return $(CHECKBOX_SELECTOR).is(':checked') ? 1 : 0;
            }
        };

        return _me;
    });