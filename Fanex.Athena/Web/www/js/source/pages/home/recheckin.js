/// <reference path='/@JSense.js' />
define(['common/site'], function (Site) {
    'use strict';
    let _handle;
    let _onUserId;

    function logout() {
        let index = window;
        while (index !== index.parent) {
            index = index.parent;
        }

        index.location = Site.resolveClientUrl('Authorization/SignOut');
    }

    function closeBrowser() {
        let index = window;
        while (index !== index.parent) {
            index = index.parent;
        }

        index.close();
    }

    function reCheckin() {
        const Success = 0;
        // const Unknown = -1;
        // const AccessDenied = 1;
        // const AccountClosed = 2;
        // const KickedOut = 3;
        // const UnderMaintenance = 4;
        const SessionOverride = 5;

        $.ajax({
            url: Site.resolveClientUrl('Authorization/ReCheckIn?onid=') + _onUserId,
            async: true,
            type: 'GET',
            cache: false,
            success: function (result) {
                if (typeof result !== 'object') {
                    return;
                }

                const errCode = result.ErrCode;
                if (errCode !== Success) {
                    clearInterval(_handle);
                    alert(result.ErrMsg, true);
                    const isInternal = $('#IsInternal').val() === '1';
                    if (isInternal || SessionOverride === errCode) {
                        const signOutUrl = Site.resolveClientUrl('Authorization/SignOut');
                        $.ajax({
                            url: signOutUrl,
                            complete: function () {
                                closeBrowser();
                            },
                            type: 'GET',
                            async: true
                        });
                    }
                    else {
                        logout();
                    }
                }
            }
        });
    }

    return {
        init: function () {
            _onUserId = $('#OnUserId').val();
            reCheckin();
            _handle = setInterval(reCheckin, 30000);
        }
    };
});