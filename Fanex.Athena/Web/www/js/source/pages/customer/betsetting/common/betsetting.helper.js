'use strict';
define(['jquery', 'common/site', 'common/popup', 'lib/jquery.balloon'], function ($, Site, Popup) {
    
    function isInteger(text) {
        return /^\+?\d+$/.test(text);
    }

    const _me = {
        showDialogMesage: function (title, message) {
            const options = {
                title: title,
                height: 'auto',
                id: 'result-update-betsetting',
                onOpen: function () {
                    $('#btnSubmitBetSetting, #btnReset').prop('disabled', true);
                },
                onClose: function () {
                    $('#result-update-betsetting').remove();
                    $('#btnSubmitBetSetting, #btnReset').removeAttr('disabled');
                    setTimeout(function () {
                        Site.blockUI();
                        Site.getLocation().reload();
                    }, 500);
                },
                width: 450
            };

            const buttons = [
                {
                    text: Site.getSingleResource('OK'),
                    isClosedOnClick: true,
                    classes: 'btn btn-submit'
                }];

            Popup.openPopupWithButton('<div><p>' + message + '</p></div>', options, buttons);
        },

        convertToFloat: function (str) {
            const temp = str.replace(/,/g, '');
            const temp2 = temp.replace('.', '');

            if (isInteger(temp2)) {
                return parseFloat(temp);
            }
            else {
                return NaN;
            }
        },

        showBalloonMsg: function (elementSelector, strMsg) {
            const contents = '<div onclick="hideBalloonMsg(\'' + elementSelector + '\')" style="width:140px;" class="msgerr">' + strMsg + '</div>';

            $(elementSelector).blur(function () { _me.hideBalloonMsg(elementSelector); })
                              .focus()
                              .showBalloon({
                                  contents: contents
                              });
        },
        hideBalloonMsg: function (elementSelector) {
            $(elementSelector).hideBalloon();
        }
    };

    return _me;
});