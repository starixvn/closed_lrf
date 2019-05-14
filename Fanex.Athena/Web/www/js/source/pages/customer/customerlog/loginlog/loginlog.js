'use strict';
define(['jquery', 'common/site', 'components/pluginhelper/autocomplete', './loginlog.option', '../customerlog.service'],
    function ($, Site, AutoComplete, LoginLogOption, CustomerLog) {
        const _me = {
            initialize: function () {
                CustomerLog.initialize();
                _me.initEvent();
                AutoComplete.initialize({
                    url: Site.resolveClientUrl('SearchCustomerAPI/SearchCustomer'),
                    target: '#Username'
                });

                // Set menu active
                $('#loginlogTab').addClass('active');
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
            },

            loadGrid: function () {
                const gridOption = LoginLogOption.gridOption;
                const colNames = Site.clone(LoginLogOption.getColNames());
                gridOption.colNames = Site.getResources(colNames);
                const url = _me.getUrl();

                CustomerLog.loadGrid(url, gridOption);
            },

            getUrl: function () {
                const userName = $('#Username').val();
                return Site.resolveClientUrl('api/Log/LoginLog?UserName=' + encodeURIComponent(userName));
            }
        };

        return _me;
    });