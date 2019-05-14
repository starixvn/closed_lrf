define(['jquery', 'common/site', 'lib/jqgrid/jquery.jqgrid.additional', 'common/popup', './customerlist.state', './customerlist.grid'],
    function ($, Site, jqGridAdditional, Popup, CustomerListState, CustomerListGrid) {
        'use strict';

        let _state;

        const _me = {
            initialize: function () {
                _state = CustomerListState.getState();

                $('#MoveToGroup').click(function () {
                    _me.showMoveCustomerToGroup();
                });

                $('#UpdateComm').click(function () {
                    const groupCommId = $('#UpdateComm').data('group-id');
                    _me.showUpdateCustComm(groupCommId);
                });

                $('#RemoveFromGroup').click(_me.showRemoveFromGroup);

                $('#GroupListSelect').change(function () {
                    _me.newGroupChanged(this);
                });

                $('#CustSBComm1').on('change', function () {
                    _me.commissionOnChange($(this).val(), 'CustSBComm');
                });

                $('#CustParlayComm1').on('change', function () {
                    _me.commissionOnChange($(this).val(), 'CustParlayComm');
                });

                $('#CustNGComm1').on('change', function () {
                    _me.commissionOnChange($(this).val(), 'CustNGComm');
                });

                $('#CustLCComm1').on('change', function () {
                    _me.commissionOnChange($(this).val(), 'CustLCComm');
                });

                $('#CustCSComm1').on('change', function () {
                    _me.commissionOnChange($(this).val(), 'CustCSComm');
                });
            },

            commissionOnChange: function (value, idName) {
                const comm2 = '#' + idName + '2', comm3 = '#' + idName + '3';

                if (Number(value) === 15) {
                    $(comm2).val(0);
                    $(comm2).selectList('update', {
                        isDisabled: true,
                        selectionId: 'select-list-' + idName + '2',
                        labelText: '0'
                    });
                    $(comm3).val(0);
                    $(comm3).selectList('update', {
                        isDisabled: true,
                        selectionId: 'select-list-' + idName + '3',
                        labelText: '0'
                    });
                } else {
                    $(comm2).selectList('disabled', false);
                    $(comm3).selectList('disabled', false);
                }
            },

            // This function used to remove data row after updated/remove or move group commission.
            processGroupCommItem: function (status) {
                const selectList = [];
                const list = $('input:checkbox.check-child:checked');
                for (let i = 0; i < list.length; i++) {
                    selectList.push(list[i].id);
                }

                if (status) {
                    for (let j = 0; j < selectList.length; j++) {
                        $('#row' + selectList[j]).remove();
                    }
                }
            },

            /* move customer to group*/
            showMoveCustomerToGroup: function () {
                $('#lblMoveToGroupMsg').html('');
                _me.clearNotification();

                Popup.openPopupWithButton($('#MoveToGroupPopUp'),
                    {
                        title: Site.getSingleResource('MoveToGroup'),
                        id: 'MoveToGroupPopUp',
                        height: 'auto',
                        width: 350
                    },
                    [
                        {
                            text: Site.getSingleResource('OK'),
                            click: function () {
                                _me.moveCustomerToGroup();
                            },
                            classes: 'btn btn-submit'
                        },
                        {
                            text: Site.getSingleResource('Cancel'),
                            isClosedOnClick: true,
                            classes: 'btn btn-cancel'
                        }
                    ]
                );
            },

            moveCustomerToGroup: function () {
                const groupid = Number($('#GroupListSelect').val());

                if (groupid === -1) {
                    _me.showMsg(Site.getSingleResource('ChooseGroupMsg'), false);
                    return;
                }

                const selectedCustomers = _state.selectedCustomers;

                if (Object.keys(selectedCustomers).length === 0) {
                    _me.showMsg(Site.getSingleResource('YouNotChooseAnyCustomerMsg'), false);
                    return;
                }

                const custList = [];

                for (let custId in selectedCustomers) {
                    if (selectedCustomers.hasOwnProperty(custId)) {
                        const currentGroupId = selectedCustomers[custId];
                        if (currentGroupId === 0 || currentGroupId !== groupid) {
                            custList.push(custId);
                        }
                    }
                }

                if (custList.length === 0) {
                    _me.showMsg(Site.getSingleResource('CustomersExistedinGroupMsg'), false);
                    return;
                }
                const param =
                {
                    CustomerIds: custList.toString(),
                    GroupComId: groupid
                };
                $.ajax({
                    type: 'POST',
                    data: param,
                    url: Site.resolveClientUrl('CustomerAPI/MoveToGroupCom'),
                    dataType: 'json',
                    beforeSend: function () {
                        _me.ajaxStart();
                    },
                    complete: function () {
                        _me.ajaxStop();
                    },
                    success: function (result) {
                        if (result.Success) {
                            _me.showMsg(Site.getSingleResource('MoveSuccessfullyMsg'), result.Success);

                            let groupName = result.ExtendedData.GroupName;
                            if (groupName.length > 17) {
                                groupName = groupName.substring(0, 14);
                                groupName += '...';
                            }
                            const groupNameText = '<span title="' + result.ExtendedData.GroupName + '">' + groupName + '</span>';

                            CustomerListGrid.updateGridGroupAndComm(groupid, groupNameText, result.ExtendedData.GroupColor,
                                                 result.ExtendedData.SBComm, result.ExtendedData.NGComm,
                                                result.ExtendedData.RNGComm);
                        }
                        else {
                            _me.showMsg(result.ErrorMessage, result.Success);
                        }
                    }
                });
            },
            /* End- move customer to group*/

            /* update customer*/
            showUpdateCustComm: function (groupCommId) {
                let isShowInfo = false;
                const selectedCustomers = _state.selectedCustomers;

                for (let custId in selectedCustomers) {
                    if (selectedCustomers.hasOwnProperty(custId) && selectedCustomers[custId] !== 0) {
                        isShowInfo = true;
                        break;
                    }
                }

                $('#InfoMsg').toggle(isShowInfo);
                _me.clearNotification();

                Popup.openPopupWithButton($('#UpdateCustCommPopUp'),
                    {
                        title: Site.getSingleResource('UpdateCustomerCommission'),
                        id: 'UpdateCustCommPopUp',
                        height: 'auto',
                        width: 500,
                        onOpen: function () {
                            $('.commission-selection').each(function (index, value) {
                                const $this = $(this);
                                $this.val(0);
                                $this.selectList('update', {
                                    isDisabled: false,
                                    selectionId: 'select-list-' + value.id,
                                    labelText: '0'
                                });
                            });
                        }
                    },
                    [
                        {
                            text: Site.getSingleResource('Save'),
                            click: function () {
                                _me.updateCustomerComm(groupCommId);
                            },
                            classes: 'btn btn-submit'
                        },
                        {
                            text: Site.getSingleResource('Cancel'),
                            isClosedOnClick: true,
                            classes: 'btn btn-cancel'
                        }
                    ]
                );
            },
            initCommissionParam: function (id) {
                const comm1 = parseInt($(id + 1).val(), 10);
                const comm2 = parseInt($(id + 2).val(), 10);
                const comm3 = parseInt($(id + 3).val(), 10);
                const comm = parseFloat((comm1 + comm2 / 10 + comm3 / 100) / 100).toFixed(4);
                return comm;
            },
            updateCustomerComm: function (groupCommId) {
                const custList = Object.keys(_state.selectedCustomers);

                if (custList.length === 0) {
                    _me.showMsg(Site.getSingleResource('YouNotChooseAnyCustomerMsg'), false);
                    return;
                }

                const sbcom = _me.initCommissionParam('#CustSBComm');
                const parlayCom = _me.initCommissionParam('#CustParlayComm');
                const ngcom = _me.initCommissionParam('#CustNGComm');
                const lccom = _me.initCommissionParam('#CustLCComm');
                const cscom = _me.initCommissionParam('#CustCSComm');
                const param =
                {
                    GroupId: groupCommId,
                    CustomerIds: custList.toString(),
                    SBComm: sbcom,
                    ParlayComm: parlayCom,
                    NGComm: ngcom,
                    LCComm: lccom,
                    CSComm: cscom
                };

                $.ajax({
                    type: 'POST',
                    data: param,
                    url: Site.resolveClientUrl('CustomerAPI/UpdateCustomerCom'),
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    dataType: 'json',
                    beforeSend: function () {
                        _me.ajaxStart();
                    },
                    complete: function () {
                        _me.ajaxStop();
                    },
                    success: function (result) {
                        if (result.Success) {
                            _me.showMsg(Site.getSingleResource('UpdateCommSucessfulMsg'), result.Success);

                            CustomerListGrid.updateGridGroupAndComm(0, result.ExtendedData.GroupName, result.ExtendedData.GroupColor,
                                                 result.ExtendedData.SBComm, result.ExtendedData.NGComm,
                                                result.ExtendedData.RNGComm);
                        }
                        else {
                            _me.showMsg(result.ErrorMessage, result.Success);
                        }
                    }
                });
            },
            /* end-update custom*/

            /* remove from group*/
            showRemoveFromGroup: function () {
                const msg = Object.keys(_state.selectedCustomers).length > 1
                    ? Site.getSingleResource('RemoveTheseCustomersFromGroupMsg')
                    : Site.getSingleResource('RemoveThisCustomerFromGroupMsg');

                $('#RemoveConfirmMsg').html(msg);

                _me.clearNotification();

                Popup.openPopupWithButton($('#ConfirmRemoveFromGroupPopUp'),
                    {
                        title: Site.getSingleResource('RemoveFromGroup'),
                        id: 'ConfirmRemoveFromGroupPopUp',
                        height: 'auto',
                        width: 400
                    },
                    [
                        {
                            text: Site.getSingleResource('OK'),
                            click: function () {
                                _me.removeFromGroupComm();
                            },
                            classes: 'btn btn-submit'
                        },
                        {
                            text: Site.getSingleResource('Cancel'),
                            isClosedOnClick: true,
                            click: function () {
                                $('input[name="RadioComm"]:eq(1)').prop('checked', true);
                            },
                            classes: 'btn btn-cancel'
                        }
                    ]
                );
            },

            removeFromGroupComm: function () {
                const checkedCustomers = _state.selectedCustomers;
                const numberOfCheckedCustomers = Object.keys(checkedCustomers).length;
                const groupList = [];

                for (let customerId in checkedCustomers) {
                    if (checkedCustomers.hasOwnProperty(customerId) && checkedCustomers[customerId] > 0) {
                        groupList.push(checkedCustomers[customerId]);
                    }
                }

                if (numberOfCheckedCustomers === 0) {
                    _me.showMsg(Site.getSingleResource('YouNotChooseAnyCustomerMsg'), false);
                    return;
                }

                if (groupList.length === 0) {
                    _me.showMsg(Site.getSingleResource('CustomerNotBelongAnyGroupMsg'), false);
                    return;
                }

                const iskeepcom = $('#KeepComm').is(':checked');
                const param =
                {
                    CustomerIds: Object.keys(checkedCustomers).toString(),
                    isRemovePlayercomm: !iskeepcom
                };

                $.ajax({
                    type: 'POST',
                    data: param,
                    url: Site.resolveClientUrl('CustomerAPI/RemoveFromGroupCom'),
                    dataType: 'json',
                    beforeSend: _me.ajaxStart,
                    complete: _me.ajaxStop,
                    success: function (result) {
                        if (result.Success) {
                            if (numberOfCheckedCustomers > 0 && groupList.length > 0 && groupList.length < numberOfCheckedCustomers) {
                                _me.showMsg(result.Message + '! </br> ' + Site.getSingleResource('CustomersBelongGroupsBeRemovedMsg'), true);
                            }
                            else {
                                _me.showMsg(result.Message, result.Success);
                            }
                            if (param.isRemovePlayercomm) {
                                CustomerListGrid.updateGridGroupAndComm(0, result.ExtendedData.GroupName, '',
                                                 result.ExtendedData.SBComm, result.ExtendedData.NGComm,
                                                result.ExtendedData.RNGComm);
                            }
                            else {
                                CustomerListGrid.updateGridGroup(0, result.ExtendedData.GroupName, result.ExtendedData.GroupColor);
                            }
                        }
                        else {
                            _me.showMsg(result.ErrorMessage, result.Success);
                        }
                    }
                });
            },

            showMsg: function (msg, isSuccess) {
                if (isSuccess) {
                    $('.success-message').html(msg).show();
                    $('.error-message').hide();
                }
                else {
                    $('.error-message').html(msg).show();
                    $('.success-message').hide();
                }
            },

            ajaxStart: function () {
                $('.error-message').hide();
                $('.success-message').hide();
                $('.ajax-loading').show();
                $('button', '.popup-button').attr('disabled', true);
                $('.popup-close').addClass('disabled');
            },

            ajaxStop: function () {
                $('.ajax-loading').hide();
                $('button', '.popup-button').attr('disabled', false);
                $('.popup-close').removeClass('disabled');
            },

            clearNotification: function () {
                $('.ajax-loading').hide();
                $('.error-message').hide();
                $('.success-message').hide();
            },

            newGroupChanged: function (obj) {
                const groupId = obj.options[obj.selectedIndex].value;
                $('#NewSbComm').text($('#SBComm' + groupId).val());
                $('#NewParlayComm').text($('#ParlayComm' + groupId).val());
                $('#NewNgComm').text($('#NGComm' + groupId).val());
                $('#NewLcComm').text($('#LCComm' + groupId).val());
                $('#NewCsComm').text($('#CSComm' + groupId).val());
            }
        };

        return _me;
    });