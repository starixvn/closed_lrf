'use strict';
define([
    'jquery',
    'common/site',
    'common/querystring',
    './customerlist.state',
    './customerlist.service',
    './customerlist.service.dormant',
    './customerlist.bastatus',
    './customerlist.speciallevel',
    './customerlist.oddsgroup',
    './customerlist.custstatus',
    'components/paging',
    'common/popup',
    'lib/jqgrid/jquery.jqgrid.additional'],
    function (
        $,
        Site,
        QueryString,
        CustomerListState,
        CustomerListService,
        CustomerListServiceDormant,
        CustomerListBAStatus,
        CustomerListSpecialLevel,
        CustomerListOddsGroup,
        CustomerListCustStatus,
        PagingHelper,
        Popup,
        jqGridAdditional) {
        let _state;
        let _dormantState;
        function updateGroupForCheckCustomerArray(groupid) {
            const selectedCustomers = _state.selectedCustomers;
            for (let custId in selectedCustomers) {
                if (selectedCustomers.hasOwnProperty(custId)) {
                    selectedCustomers[custId] = groupid;
                }
            }
        }

        const _me = {
            initialize: function () {
                _state = CustomerListState.getState();
                _dormantState = CustomerListState.getDormantState();
                window.CustomerList = {
                    ajaxPaging: _me.ajaxPaging,
                    ajaxPagingDormant: _me.ajaxPagingDormant,
                };

                $('#SubmitButton').prop('disabled', true);

                CustomerListBAStatus.initialize();
                CustomerListSpecialLevel.initialize();
                CustomerListOddsGroup.initialize();
                CustomerListCustStatus.initialize();

                _me.initEvent();
                $('#SubmitButton').prop('disabled', false);
            },

            ajaxPaging: function () {
                _state.pagingOption = PagingHelper.getSetting('#ActiveCustomerPager');
                CustomerListService.submit();
            },

            ajaxPagingDormant: function () {
                _dormantState.pagingOption = PagingHelper.getSetting('#DormantCustomerPager');
                CustomerListServiceDormant.submit();
            },

            initEvent: function () {
                $('#ExportToExcel').click(function () {
                    $(this).closest('form').submit();
                });
                $('#ExportToExcelDormantCustomer').click(function () {
                    $(this).closest('form').submit();
                });
                _me.registerCheckboxEvent();

                $('#report-content').on('click', '.pendingFunds', function () {
                    const $this = $(this);
                    const custId = $this.data('custid');
                    const systemId = $this.data('systemid');
                    const externalId = $this.data('externalid');

                    _me.viewRunningBetlist(custId, systemId, externalId);
                });

                $(window).on('resize', function () {
                    CustomerListService.resizeGrid('#ReportGrid');
                    jqGridAdditional.updateGridHeight($('#tabDormantCustomer'));
                });

                $(window).on('unload', function () {
                    $(window).off('resize');
                });
            },

            registerCheckboxEvent: function () {
                $('#report-content').on('change', '#CheckAll', function () {
                    const isCheckedAll = this.checked;
                    const selectedCustomers = {};

                    if (isCheckedAll) {
                        _state.cachedData.Data.map(function (item) {
                            selectedCustomers[item.CustId] = item.GroupCommId;
                        });
                    }

                    _state.selectedCustomers = selectedCustomers;
                    _state.checkedAllRows = isCheckedAll;
                    CustomerListService.bindData(_state.cachedData);
                });

                $('#report-content').on('change', '.select-cust-checkbox', function () {
                    const custid = Number(this.id);
                    const group = $(this).data('group-comm-id');
                    const selectedCustomers = _state.selectedCustomers;

                    if (this.checked) {
                        selectedCustomers[custid] = group;
                    } else {
                        delete selectedCustomers[custid];
                    }

                    _state.checkedAllRows = Object.keys(selectedCustomers).length === _state.cachedData.Data.length;
                    $('#CheckAll').prop('checked', _state.checkedAllRows);
                });
            },

            viewRunningBetlist: function (custId, systemId, externalId) {
                let url = Site.resolveClientUrl('CustomerOutstandingBetList/Index');
                url = QueryString.setParam(url, 'custid', custId);
                url = QueryString.setParam(url, 'externalid', externalId);
                url = QueryString.setParam(url, 'systemid', systemId);
                url = QueryString.setParam(url, 'betlistname', 'betlistrunning');
                url = Site.setLicenseeOptionOriginalParam(url);

                const popH = Math.min(window.innerHeight - 100, 700), popW = 900;
                const popupOption = { id: 'betlist-popup', width: popW + 30, height: popH + 70, title: Site.getSingleResource('BetListRunning') };
                Popup.openPopupWithIframe(url, popupOption);
                window.logOpenBetlistEvent && window.logOpenBetlistEvent();
            },

            updateGridGroupAndComm: function (groupid, groupName, groupColor, sbCom, ngCom, csCom) {
                let count = 0;
                const length = Object.keys(_state.selectedCustomers).length;

                $.each(_state.cachedData.Data, function (index, item) {
                    if (count === length) {
                        return false;
                    }
                    if (_state.selectedCustomers[item.CustId] !== undefined) {
                        item.GroupCommId = groupid;
                        item.Group = groupName;
                        item.GroupColor = groupColor;
                        item.SBComm = sbCom;
                        item.NGComm = ngCom;
                        item.CSComm = csCom;
                        count++;
                    }
                });

                updateGroupForCheckCustomerArray(groupid);
                CustomerListService.bindData(_state.cachedData);
            },

            updateGridGroup: function (groupid, groupName, groupColor) {
                let count = 0;
                const length = Object.keys(_state.selectedCustomers).length;
                $.each(_state.cachedData.Data, function (index, item) {
                    if (count === length) {
                        return false;
                    }

                    if (_state.selectedCustomers[item.CustId] !== undefined) {
                        item.GroupCommId = groupid;
                        item.Group = groupName;
                        item.GroupColor = groupColor;
                        count++;
                    }
                });

                updateGroupForCheckCustomerArray(groupid);
                CustomerListService.bindData(_state.cachedData);
            }
        };

        return _me;
    });