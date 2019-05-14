define(['jquery', 'common/site', 'common/popup', './commgroup'],
    function ($, Site, Popup, CustomerCommGroup) {
        'use strict';

        const deleteGroupData = {
            groupId: 0,
            isRemovePlayerComm: false,
            isResetDefault: false
        };

        function initialize() {
            Site.initialize();
            Site.addUserGuide({
                resourceName: 'CommissionGroupList',
                title: Site.getSingleResource('CommissionGroupList')
            });

            _me.initEvent();
        }

        function initEvent() {
            $('#ExportToExcel').click(function () {
                $('#CommissionGroupForm').submit();
            });

            $('#comm-group-list').on('click', '.delete-comm-group', function (e) {
                _me.confirmDeleteCommGroup($(e.target).data('id'));
            });

            $('#comm-group-list').on('click', '.customer-list-link', function (e) {
                CustomerCommGroup.goToCustomerList($(e.target).data('id'));
            });          
        }

        function confirmDeleteCommGroup(groupId) {
            $.ajax({
                url: Site.resolveClientUrl('CustomerComGroup/GetDefaultGroup'),
                type: 'GET',
                dataType: 'JSon',
                cache: false,
                success: function (response) {
                    deleteGroupData.groupId = groupId;
                    if (response.id.toString() === groupId.toString()) {
                        deleteGroupData.isResetDefault = true;
                        _me.showConfirmDeleteDefaulCommGroupPopup();
                    }
                    else {
                        deleteGroupData.isResetDefault = false;
                        _me.showOptionDeleteCommGroupPopup();
                    }
                }
            });
        }

        function deleteCommGroup() {
            $.ajax({
                type: 'POST',
                url: Site.resolveClientUrl('CustomerComGroup/Delete'),
                data: deleteGroupData,
                success: function (result) {
                    if (result.Code > 0) {
                        _me.showResultPopup('Error', result.Message);
                    } else {
                        Site.redirect(Site.resolveClientUrl('CustomerComGroup/Index'));
                    }

                    Site.unBlockUI();
                },
                beforeSend: Site.blockUI
            });
        }

        function showConfirmDeleteDefaulCommGroupPopup() {
            const options = {
                modal: true,
                title: Site.getSingleResource('Confirm'),
                height: 'auto',
                id: 'del-default-comm-group',
                width: 380
            };

            const buttons = [
                {
                    text: Site.getSingleResource('OK'),
                    isClosedOnClick: true,
                    click: _me.showOptionDeleteCommGroupPopup,
                    classes: 'btn btn-submit'
                }, {
                    text: Site.getSingleResource('Cancel'),
                    isClosedOnClick: true,
                    classes: 'btn btn-cancel'
                }];

            Popup.openPopupWithButton('<div><p>' + Site.getSingleResource('DefaultGroupMsg') + '</p></div>', options, buttons);
        }

        function showOptionDeleteCommGroupPopup() {
            let popup = $('#option-del-comm-group');

            if (popup.length === 0) {
                popup = $('#confirm-delete-comm-group');
                popup.remove();
                popup.find('input[name="IsRemovePlayerComm"]').on('click', function () {
                    $(this).prop('checked', true);
                });
            }

            const options = {
                modal: true,
                title: Site.getSingleResource('DeleteCommissionGroup'),
                height: 'auto',
                id: 'option-del-comm-group',
                width: 380
            };

            const buttons = [
                {
                    text: Site.getSingleResource('Delete'),
                    isClosedOnClick: true,
                    click: function () {
                        deleteGroupData.isRemovePlayerComm = $('input[name="IsRemovePlayerComm"]:checked').val();
                        _me.showConfirmDeleteCommGroupPopup();
                    },
                    classes: 'btn btn-submit'
                }, {
                    text: Site.getSingleResource('Cancel'),
                    isClosedOnClick: true,
                    click: function () {
                        $('#IsRemovePlayerComm').prop('checked', true);
                    },
                    classes: 'btn btn-cancel',
                    id: 'option-del-comm-group-cancel'
                }];

            Popup.openPopupWithButton(popup, options, buttons);
        }

        function showConfirmDeleteCommGroupPopup() {
            const options = {
                modal: true,
                title: Site.getSingleResource('Confirm'),
                height: 'auto',
                id: 'confirm-del-comm-group',
                width: 380
            };

            const buttons = [
                {
                    text: Site.getSingleResource('OK'),
                    isClosedOnClick: true,
                    click: _me.deleteCommGroup,
                    classes: 'btn btn-submit'
                }, {
                    text: Site.getSingleResource('Cancel'),
                    isClosedOnClick: true,
                    click: _me.showOptionDeleteCommGroupPopup,
                    classes: 'btn btn-cancel',
                    id: 'confirm-del-comm-group-cancel'
                }];

            Popup.openPopupWithButton('<div><p>' + Site.getSingleResource('AreYouSure') + '</p></div>', options, buttons);
        }

        function showResultPopup(title, message) {
            const options = {
                modal: true,
                title: title,
                height: 'auto',
                id: 'result-del-comm-group',
                width: 380
            };

            if ($('#result-del-comm-group').length > 0)
            {
                $('#result-msg').html(message);
            }

            const buttons = [
                {
                    text: Site.getSingleResource('OK'),
                    isClosedOnClick: true,
                    classes: 'btn btn-submit',
                    id: 'result-OK'
                }];

            Popup.openPopupWithButton('<div><p id="result-msg">' + message + '</p></div>', options, buttons);
        }

        const _me = {
            initialize: initialize,
            initEvent: initEvent,
            confirmDeleteCommGroup: confirmDeleteCommGroup,
            showConfirmDeleteDefaulCommGroupPopup: showConfirmDeleteDefaulCommGroupPopup,
            showOptionDeleteCommGroupPopup: showOptionDeleteCommGroupPopup,
            showConfirmDeleteCommGroupPopup: showConfirmDeleteCommGroupPopup,
            showResultPopup: showResultPopup,
            deleteCommGroup: deleteCommGroup
        };

        return _me;
    }
);