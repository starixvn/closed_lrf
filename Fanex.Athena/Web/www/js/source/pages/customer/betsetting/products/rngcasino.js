define(['jquery', 'common/site', 'common/popup', '../common/betsettingbase', '../common/betsetting.status', 'extensions/jquery.extension'],
    function ($, Site, Popup, BetSettingBase, BetSettingStatus) {
        'use strict';

        function initialize() {
            resizeGrid();
            Site.initialize();
            BetSettingBase.initialize();
            _me.initEvent();
            const isEnabled = $('#isenabled').val() === 'True';

            if (!isEnabled) {
                $('#btnRngCasino, #btnResetRngCasino').prop('disabled', true);
                $('.body-content input').prop('disabled', true);
            }
        }

        function resizeGrid() {
            if ($('.body-content').hasVerticalScrollBar()) {
                $('.table-content').addClass('hasScroll');
            }
        }

        function initEvent() {
            $('#btnRngCasino').on('click', function () {
                const custId = $(this).attr('data-cust-id');
                const userName = $(this).attr('data-user-name');
                _me.updateBetSetting(custId, userName);
            });

            $('#btnResetRngCasino').on('click', function () {
                _me.resetBettingLimit();
            });

            $('#btnUpdateStatus').on('click', function () {
                _me.updateStatus($(this));
            });
        }

        function resetBettingLimit() {
            $('input[type=checkbox]').each(function () {
                this.checked = $(this).data('ischeck');
            });
        }

        function updateStatus($context) {
            const url = Site.resolveClientUrl('RngCasinoBetSetting/UpdateStatus');
            const params = BetSettingStatus.getCommonPostData($context);

            BetSettingStatus.update(url, params);
        }

        function updateBetSetting(custId, userName) {
            const params = _me.getParams(custId);
            showConfirmAction(params, userName, Site.getSingleResource('UpdateRNGCasinoBetSettings'));
        }

        function getParams(custId) {
            const gameTypeChangedList = [];
            const params = {
                custId: custId
            };

            $('.casino-row').each(function () {
                const gameTypeId = $(this).attr('data-gametypeid');

                // Original stake level list
                const originalStake = $(this).attr('data-stake-original');

                // New stakelevel
                const newStakeLevelList = [];

                // Get stake level list on selecting
                $('.input-' + gameTypeId).each(function () {
                    if ($(this).is(':checked')) {
                        newStakeLevelList.push($(this).attr('data-stakeid'));
                    }
                });

                const newStake = newStakeLevelList.join(',');
                // Compare stake
                if (originalStake !== newStake) {
                    gameTypeChangedList.push(gameTypeId);
                    params['stake' + gameTypeId] = newStake;
                }
            });

            // Get params changed list
            params.gameTypeChangedList = gameTypeChangedList.join(',');

            return params;
        }

        function showConfirmAction(params, userName, message) {
            const options = {
                height: 'auto',
                id: 'bet-setting-confirm',
                title: Site.getSingleResource('Confirmation'),
                onOpen: function () {
                    $('#btnRngCasino, #btnResetRngCasino').prop('disabled', true);
                },
                onClose: function () {
                    $('#btnRngCasino, #btnResetRngCasino').removeAttr('disabled');
                    $('#bet-setting-confirm').remove();
                },
                width: 380
            };
            const buttons = [
            {
                text: Site.getSingleResource('OK'),
                click: function () {
                    if (params.gameTypeChangedList.length > 0) {
                        _me.updateStakeLevel(params, userName);
                    }
                    else {
                        const message = Site.getSingleResource('UpdateRNGCasinoBetSettingSuccessMsg').replace('{0}', userName);
                        showDialogMesage('Success', message, false);
                    }
                },
                classes: 'btn btn-submit',
                isClosedOnClick: true
            },
            {
                text: Site.getSingleResource('Cancel'),
                classes: 'btn btn-cancel',
                isClosedOnClick: true
            }];

            Popup.openPopupWithButton('<div><p>' + message + '</p></div>', options, buttons);
        }

        function updateStakeLevel(params, userName) {
            $.ajax({
                url: Site.resolveClientUrl('RngCasinoBetsetting/UpdateBetSetting'),
                type: 'POST',
                cache: false,
                data: params,
                dataType: 'json',
                success: function (result) {
                    result.Message = getResultMessage(result.Code, userName);
                    const title = result.Code.toString() === '0' ? 'Success' : 'Fail';
                    showDialogMesage(title, result.Message, true);
                }
            });
        }

        function getResultMessage(code, userName) {
            switch (code) {
                case 1:
                    return Site.getSingleResource('RNGCasinoUpdateSettingUnAvailableMsg');
                case 0:
                    return Site.getSingleResource('UpdateRNGCasinoBetSettingSuccessMsg').replace('{0}', userName);
                default:
                    return Site.getSingleResource('UpdateRNGCasinoBetSettingFailMsg').replace('{0}', userName);
            }
        }

        function showDialogMesage(title, message, reloadPage) {
            const options = {
                height: 'auto',
                id: 'bet-setting-message',
                title: title,
                onOpen: function () {
                    $('#btnRngCasino, #btnResetRngCasino').prop('disabled', true);
                },
                onClose: function () {
                    $('#btnRngCasino, #btnResetRngCasino').removeAttr('disabled');
                    $('#bet-setting-message').remove();
                    if (reloadPage) {
                        setTimeout(function () {
                            Site.blockUI();
                            Site.reload();
                        }, 500);
                    }
                },
                width: 480
            };
            const buttons = [
            {
                text: Site.getSingleResource('OK'),
                classes: 'btn btn-submit',
                isClosedOnClick: true
            }];

            Popup.openPopupWithButton('<div><p>' + message + '</p></div>', options, buttons);
        }

        const _me = {
            initialize: initialize,
            initEvent: initEvent,
            updateStakeLevel: updateStakeLevel,
            resetBettingLimit: resetBettingLimit,
            getParams: getParams,
            updateBetSetting: updateBetSetting,
            updateStatus: updateStatus
        };

        return _me;
    });