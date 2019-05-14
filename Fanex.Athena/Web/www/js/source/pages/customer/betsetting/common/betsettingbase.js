'use strict';
define(['jquery', 'common/site', 'common/popup', './constant', 'lib/numberformat', './betsetting.helper', './betsetting.validation'],
    function ($, Site, Popup, Constant, NumberFormatter, BetSettingHelper, BetSettingValidation) {
        const Product = Constant.Product;

        const _me = {
            initialize: function () {
                $('#product-dropdown').on('change', function () {
                    const url = $(this).find('option:selected').data('href');
                    Site.blockUI();
                    Site.redirect(url);
                });
            },

            getSportIds: function () {
                const $idList = $('#IDList');
                return $idList.length ? $idList.val().split(',') : [];
            },

            setEnable: function () {
                const editable = $('#editable').val();
                const isEnable = !editable || editable === 'True';

                if (!isEnable) {
                    const sportIds = _me.getSportIds();

                    for (let i = 0; i < sportIds.length; i++) {
                        const sportId = sportIds[i];
                        const selector = '#min-bet-' + sportId + ',' + '#max-bet-' + sportId + ',' + '#max-per-match-' + sportId;
                        $(selector).prop('disabled', true);
                    }
                }
            },

            formatInputText: function () {
                const formatter = new NumberFormatter();

                $('input[type=text]').blur(function () {
                    const inputValue = $(this).val().replace(/,/g, '');
                    const formattedValue = formatter.formatNumber(inputValue, { format: '#,###,##0.##' });
                    $(this).val(formattedValue);
                });
            },

            resetInput: function () {
                $('#chkCopyAll').removeAttr('checked');
                $('input[id^="min"], input[id^="max-bet"], input[id^="max-per"]').each(function () {
                    $(this).val($(this).attr('data-original')).prop('disabled', false);
                });
            },

            showComfirm: function ($target, resourceMessage, callback) {
                const productId = parseInt($('#ProductId').val(), 10);
                const isValid = productId === Product.LiveCasino ? true :
                             productId === Product.NumberGame ? BetSettingValidation.checkValidationNumberGame() :
                                                                BetSettingValidation.checkLimitMinMaxBets(_me.getSportIds());
                if (!isValid) {
                    return;
                }

                const custId = $target.attr('data-cust-id');
                const userName = $target.attr('data-user-name');
                const nickName = $target.attr('data-nick-name');

                _me.showConfirmAction(Site.getSingleResource(resourceMessage), custId, userName, nickName, callback);
            },

            showConfirmAction: function (message, custId, userName, nickName, callback) {
                const options = {
                    title: Site.getSingleResource('Confirmation'),
                    height: 'auto',
                    id: 'confirm-update-betsetting',
                    onOpen: function () {
                        $('#btnSubmitBetSetting, #btnReset').prop('disabled', true);
                    },
                    onClose: function () {
                        $('#btnSubmitBetSetting, #btnReset').removeAttr('disabled');
                        $('#confirm-update-betsetting').remove();
                    },
                    width: 450
                };

                const buttons = [
                    {
                        text: Site.getSingleResource('OK'),
                        isClosedOnClick: true,
                        click: function () {
                            callback(custId, userName, nickName);
                        },
                        classes: 'btn btn-submit'
                    }, {
                        text: Site.getSingleResource('Cancel'),
                        isClosedOnClick: true,
                        classes: 'btn btn-cancel'
                    }];

                Popup.openPopupWithButton('<div><p>' + message + '</p></div>', options, buttons);
            },

            getBetSettingParamsForSports: function () {
                const params = {};
                const sportIds = _me.getSportIds();
                for (let i = 0; i < sportIds.length; i++) {
                    $.extend(params, _me.getBetSettingParams(sportIds[i]));
                }

                return params;
            },

            getBetSettingParams: function (sportId) {
                const $minbet = $('#min-bet-' + sportId);
                const $maxbet = $('#max-bet-' + sportId);
                const $maxPerMatch = $('#max-per-match-' + sportId);

                if ($minbet.length === 0 ||
                    $maxbet.length === 0 ||
                    $maxPerMatch.length === 0) {
                    return '';
                }

                let isUpdate = true;
                const originalMinBet = $('#min-bet-' + sportId).attr('data-original');
                const originalMaxBet = $('#max-bet-' + sportId).attr('data-original');
                const originalMaxPerMatch = $('#max-per-match-' + sportId).attr('data-original');

                // Check if data is changed
                if ($minbet.val() === originalMinBet
                    && $maxbet.val() === originalMaxBet
                    && $maxPerMatch.val() === originalMaxPerMatch) {
                    isUpdate = false;
                }

                // Data is changed, update it
                const minBet = BetSettingHelper.convertToFloat($minbet.val());
                const maxBet = BetSettingHelper.convertToFloat($maxbet.val());
                const maxPerMatcth = BetSettingHelper.convertToFloat($maxPerMatch.val());
                const betType = $('#bet-type-' + sportId).val();

                const result = {};
                result['minbet' + sportId] = minBet;
                result['maxbet' + sportId] = maxBet;
                result['maxpermatch' + sportId] = maxPerMatcth;
                result['update' + sportId] = isUpdate;
                result['bettype' + sportId] = betType;

                return result;
            },

            updateBetSetting: function (url, params) {
                $.ajax({
                    type: 'POST',
                    cache: false,
                    url: url,
                    data: params,
                    dataType: 'json',
                    success: function (result) {
                        const messageResource = Number(result.Code) === 0 ? 'MessageSuccess' : 'Fail';
                        BetSettingHelper.showDialogMesage(Site.getSingleResource(messageResource), result.Message);
                    }
                });
            }
        };

        return _me;
    });