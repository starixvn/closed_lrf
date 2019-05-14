/* AllBet, VoidBridge, FishingWorld */
'use strict';
define(['jquery', 'common/site', '../common/constant','../common/betsettingbase', '../common/betsetting.status'],
    function ($, Site, Constant, BetSettingBase, BetSettingStatus) {
        const Product = Constant.Product;
        const ProductCodeMap = {};
        ProductCodeMap[Product.VirtualSports] = 'VS';
        ProductCodeMap[Product.VirtualSports2] = 'VS2';
        ProductCodeMap[Product.Lottery] = 'LT';

        function getConfirmMessage(productId) {
            const productNameResource = 'Product' + ProductCodeMap[productId];
            const message = Site.getSingleResource('UpdateProductBetSettings');
            return message.replace('{0}', Site.getSingleResource(productNameResource));
        }

        const _me = {
            initialize: function () {
                Site.initialize();
                BetSettingBase.initialize();
                BetSettingBase.setEnable();
                _me.initEvent();
                _me.checkToDisableInput();
            },

            initEvent: function () {
                $('#btnUpdateStatus').click(function () {
                    _me.updateStatus($(this));
                });

                $('#btnReset').on('click', function () {
                    BetSettingBase.resetInput();
                });

                $('#btnSubmitBetSetting').on('click', function () {
                    const productId = parseInt($('#ProductId').val(), 10);
                    const messageResource = getConfirmMessage(productId);

                    BetSettingBase.showComfirm($(this), messageResource, _me.updateBetSetting);
                });

                // Formating number in text box.
                BetSettingBase.formatInputText();
            },
            checkToDisableInput: function () {
                const enabled = $('#IsEnabled').val() !== '0';

                if (!enabled) {
                    $('.table-content input[type=text]').prop('disabled', true).addClass('disabled');
                    $('#btnSubmitBetSetting, #btnReset').prop('disabled', true).addClass('disabled');
                }
            },
            updateStatus: function ($context) {
                const url = Site.resolveClientUrl('DcsBetSetting/UpdateStatus');
                const params = BetSettingStatus.getCommonPostData($context);
                BetSettingStatus.update(url, params);
            },

            updateBetSetting: function (custId, userName, nickName) {
                const productId = parseInt($('#ProductId').val(), 10);
                
                const params = BetSettingBase.getBetSettingParamsForSports();
                params.custid = custId;
                params.userName = userName;
                params.nickName = nickName;
                params.productId = productId;

                BetSettingBase.updateBetSetting(Site.resolveClientUrl('DcsBetSetting/UpdateBetSetting'), params);
            }
        };

        return _me;
    });