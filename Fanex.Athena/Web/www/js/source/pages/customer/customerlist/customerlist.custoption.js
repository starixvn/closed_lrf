define(['jquery', 'common/site', 'common/querystring', 'common/popup', './customerlist.service'],
    function ($, Site, QueryString, Popup, CustomerListService) {
        'use strict';

        const OPTIONLIST_SELECTOR = '#ViewOptionList';

        function getCustomerInfo() {
            const $optionList = $(OPTIONLIST_SELECTOR);
            return {
                CustId: $optionList.data('custid'),
                SystemId: $optionList.data('systemid'),
                ExternalId: $optionList.data('externalid')
            };
        }

        const _me = {
            initialize: function () {
                $('#report-content').on('click', '.custoptionlink', function () {
                    CustomerListService.showGridDropdownById('ViewOptionList', $(this));
                });

                $('#report-content').on('blur', '.custoptionlink', function () {
                    setTimeout(function () {
                        $('#ViewOptionList').hide();
                    }, 300);
                });

                $('#bet-setting-link').on('click', _me.viewBetSetting);
                $('#bet-list-link').on('click', _me.viewBetList);
                $('#statement-link').on('click', _me.viewStatement);
                $('#login-info-link').on('click', _me.viewLogInfo);
            },

            closeCustOption: function () {
                $(OPTIONLIST_SELECTOR).hide();
            },

            viewBetSetting: function () {
                const customer = getCustomerInfo();

                _me.closeCustOption();

                const url = Site.resolveClientUrl('SportsbookBetSetting/Index?custid=' +
                    customer.CustId + '&username=' + customer.SystemId + '&nickname=' + customer.ExternalId);

                const popupOption = { id: 'viewOptionBetSettingFrame', width: 905, height: 600, title: Site.getSingleResource('BetSetting') };
                Popup.openPopupWithIframe(url, popupOption);
            },

            viewLogInfo: function () {
                _me.closeCustOption();

                const customer = getCustomerInfo();
                let url = Site.resolveClientUrl('Customer/LogInfo');
                url = QueryString.setParams(url, customer);

                const popupOption = { width: 360, height: 280, title: Site.getSingleResource('LogInfo'), id: 'CustomerLogInfo' };

                let $popup = $('#' + popupOption.id);
                if ($popup.length > 0) {
                    $popup = $popup.find('.wrapContent');
                }
                else {
                    $popup = $('<div style="display: none" class="customer-logInfo"></div>');
                }

                $popup.load(url, function (response, status) {
                    if (status === 'success') {
                        Popup.openPopup($(this), popupOption);
                    }
                });

                return false;
            },

            viewBetList: function () {
                _me.closeCustOption();
                const customer = getCustomerInfo();

                let url = Site.resolveClientUrl('CustomerOutstandingBetList/Index');
                url = QueryString.setParams(url, customer);
                url = QueryString.setParam(url, 'betlistname', 'betlist');
                url = Site.setLicenseeOptionOriginalParam(url);

                const popH = Math.min(window.innerHeight - 100, 600), popW = 900;
                const popupOption = { id: 'viewOptionFrame', width: popW + 30, height: popH + 70 };

                Popup.openPopupWithIframe(url, popupOption);
                window.logOpenBetlistEvent && window.logOpenBetlistEvent();
            },

            viewStatement: function () {
                const customer = getCustomerInfo();
                _me.closeCustOption();

                let url = Site.resolveClientUrl('CustomerOutstandingBetList/Index');
                url = QueryString.setParams(url, customer);
                url = QueryString.setParam(url, 'betlistname', 'dailystatement');
                url = Site.setLicenseeOptionOriginalParam(url);

                const popH = Math.min(window.innerHeight - 100, 600), popW = 900;
                const popupOption = { id: 'viewOptionFrame', width: popW + 30, height: popH + 70 };

                Popup.openPopupWithIframe(url, popupOption);
                window.logOpenBetlistEvent && window.logOpenBetlistEvent();
            }
        };

        return _me;
    });