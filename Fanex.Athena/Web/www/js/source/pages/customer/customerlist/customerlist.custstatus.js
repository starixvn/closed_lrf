/* This column only view in licensee HAIFA */
'use strict';
define(['jquery', 'common/site'], function ($, Site) {
    const _me = {
        initialize: function () {
            _me.initEvent();
        },

        initEvent: function () {
            $('#report-content').on('click', '.custStatusOption', function () {
                _me.showUpdatePopUp($(this));
                return false;
            });

            $('#custStatusUpdate').on('click', function () {
                _me.updateCustStatus();
            });

            $('#custStatusCancel').on('click', function () {
                _me.closeUpdatePopUp();
            });

            $('#UpdateCustStatus').on('change', '.chkCustStatus', function () {
                _me.checkStatusChange();
            });

            $('html').click(function (e) {
                if ($(e.target).closest('#UpdateCustStatus').length === 0) {
                    $('#UpdateCustStatus').fadeOut();
                }
            });
        },

        showUpdatePopUp: function ($context) {
            const custId = $context.data('custid');
            const $statusLink = $('#edit-cust-status-' + custId);
            const $popup = $('#UpdateCustStatus');

            const position = $context.offset();
            const isOverFlow = position.top + $popup.outerHeight() > window.innerHeight - 15;

            const popupTop = isOverFlow ? position.top - $popup.outerHeight() - 1 :
                                        position.top + $context.outerHeight() + 1;

            $popup.css({
                top: popupTop,
                left: position.left,
                width: 'auto'
            });

            if ($popup.data('custid') === custId) {
                _me.checkStatusChange();
                $popup.fadeToggle();
            }
            else {
                const isClosed = $statusLink.data('isclosed');
                const isSuspended = $statusLink.data('issuspended');
                const externalId = $statusLink.data('externalid');

                $('#custStatus-externalId').text(externalId);
                $('#custStatus-suspended').prop('checked', isSuspended);
                $('#custStatus-closed').prop('checked', isClosed);

                $popup.data('custid', custId);
                $popup.data('closed', isClosed);
                $popup.data('suspended', isSuspended);

                $('#custStatusUpdate').prop('disabled', true);
                $popup.fadeIn();
            }
        },

        closeUpdatePopUp: function () {
            const $popup = $('#UpdateCustStatus');
            if ($popup.is(':visible')) {
                $popup.fadeOut();
            }
        },

        updateCustStatus: function () {
            if (!window.confirm(Site.getSingleResource('ChangeStatusOfThisCustomerMsg'))) {
                _me.closeUpdatePopUp();
                return;
            }

            const $popup = $('#UpdateCustStatus');
            const custId = $popup.data('custid');
            const $statusLink = $('#edit-cust-status-' + custId);

            const isSuspended = $('#custStatus-suspended').prop('checked');
            const isClosed = $('#custStatus-closed').prop('checked');
            const url = Site.resolveClientUrl('CustomerAPI/UpdateCustStatus');
            const params = {
                custId: custId,
                isSuspended: isSuspended,
                isClosed: isClosed
            };

            $.ajax({
                type: 'POST',
                data: params,
                url: url,
                dataType: 'json',
                beforeSend: function () {
                    Site.blockUI();
                },
                complete: function () {
                    Site.unBlockUI();
                    _me.closeUpdatePopUp(custId);
                },
                success: function (result) {
                    const isSuccess = Number(result.Code) === 0;
                    if (isSuccess) {
                        const statusText = isClosed === true ? Site.getSingleResource('Closed') :
                                    isSuspended === true ? Site.getSingleResource('Suspended') : Site.getSingleResource('Open');

                        $statusLink.text(statusText);
                        $statusLink.data('isclosed', isClosed);
                        $statusLink.data('issuspended', isSuspended);

                        $popup.data('closed', isClosed);
                        $popup.data('suspended', isSuspended);
                    }
                    else {
                        alert(result.Message);
                    }
                }
            });
        },

        checkStatusChange: function () {
            const $popup = $('#UpdateCustStatus');
            const isSuspended = $('#custStatus-suspended').prop('checked');
            const isClosed = $('#custStatus-closed').prop('checked');

            const changed = $popup.data('closed') !== isClosed || $popup.data('suspended') !== isSuspended;
            $('#custStatusUpdate').prop('disabled', !changed);
        }
    };

    return _me;
});