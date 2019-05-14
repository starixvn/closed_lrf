'use strict';
define(['jquery', 'common/site', 'components/pluginhelper/autocomplete', '../common.option',
    'components/pluginhelper/monthpicker', '../customerlog.service'],
    function ($, Site, AutoComplete, CommonOption, MonthPicker, CustomerLogService) {
        const _me = {
            initialize: function () {
                CustomerLogService.initialize();
                _me.initEvent();

                AutoComplete.initialize({
                    url: Site.resolveClientUrl('SearchCustomerAPI/SearchCustomer'),
                    target: '#Username'
                });

                MonthPicker.initMonthPicker({ minDate: $('#MinDate').val() });

                // Set menu active
                $('#customersettinglogTab').addClass('active');
            },

            initEvent: function () {
                $('#SubmitButton').on('click', function () {
                    _me.loadGrid();
                });

                $('#Username').keyup(function (e) {
                    if (e.keyCode === 13) {
                        _me.loadGrid();
                    }
                });

                $('#showall').on('change', function () {
                    CustomerLogService.checkShowAll();
                });
            },

            loadGrid: function () {
                const gridOption = CommonOption.gridOption;
                const url = _me.getUrl();
                
                const colNames = Site.clone(CommonOption.getColNames());
                gridOption.colNames = Site.getResources(colNames);

                const hasCheckbox = true;
                CustomerLogService.loadGrid(url, gridOption, hasCheckbox);
            },

            getUrl: function () {
                const userName = $('#Username').val();
                const fromDate = new Date($('#FromDate').val());
                const toDate = new Date($('#ToDate').val());

                return Site.resolveClientUrl('api/Log/CustomerSetting?UserName=' + encodeURIComponent(userName)
                    + '&Year=' + fromDate.getFullYear() + '&Month=' + (fromDate.getMonth() + 1)
                    + '&FromDay=' + fromDate.getDate() + '&ToDay=' + toDate.getDate()
                    + '&ViewById=' + $('#ViewBy').val());
            }
        };

        return _me;
    });