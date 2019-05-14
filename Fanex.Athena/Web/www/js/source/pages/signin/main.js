define(['./signin'], function (SignIn) {
    'use strict';
    $(window).on('load', function () {
        SignIn.InitLogin();
    });
});