'use strict';
define(['jquery'], function ($) {
    const defaultOption = {
        text: 'Data is being downloaded',
        position: 'top right',
        itemStyle: 'default',
        timeout: 6000
    };

    function generatePagePortal(position) {
        const positionClassName = generateClassByPosition(position);

        return '<div class="page-portal">' +
        '<div class="toast-container' + positionClassName + '">' +
                '<div class="toast-align">' +
                '</div>' +
            '</div>' +
        '</div>';
    }

    function generateClassByPosition(position) {
        const positions = position.trim().split(' ');
        if (positions.length < 2) {
            return '';
        }

        return positions.map(function (item) {
            return ' toast-container-' + item;
        });
    }

    function generateToastItem(styleName, text) {
        return '<div class="toast-item toast-item-' + styleName + '">' +
                    '<p class="toast-message">' + text + '</p>' +
                    generateButtonGroup() +
                '</div>';
    }

    function generateButtonGroup() {
        return '<div class="toast-button-group">' +
                '<button type="button" class="icon icon-close toast-item-close"></button>' +
            '</div>';
    }

    const _me = {
        show: function (options) {
            const toastOption = $.extend({}, defaultOption, options || {});

            const existed = $('body').find('.page-portal .toast-container .toast-align').length > 0;
            const $pagePortal = existed ? $('.page-portal') : $(generatePagePortal(toastOption.position));

            const $toastAlign = $pagePortal.find('.toast-align');
            const $toastItem = $(generateToastItem(toastOption.itemStyle, toastOption.text));

            $toastItem.on('click', '.toast-item-close', function () {
                $toastItem.remove();
            });

            $toastAlign.append($toastItem);

            if (!existed) {
                $('body').append($pagePortal);
            }

            setTimeout(function () {
                $toastItem.fadeOut('fast');
            }, toastOption.timeout);
        }
    };

    return _me;
});