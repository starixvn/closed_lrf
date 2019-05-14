'use strict';
define(['jquery', 'common/site', 'common/querystring', 'pages/report/report', './customer.dailystatement', '../betlist',
            'components/pluginhelper/daterangepicker', 'components/pluginhelper/multiselect'],
    function ($, Site, QueryString, Report, DailyStatement, BetList, DatePicker, MultiSelect) {
        let _viewName;
        let _viewOption;

        function getViewOption() {
            return {
                'betlistrunning': {
                        title: Site.getSingleResource('BetListRunning'),
                        hiddenColumn: 'externalid,systemid,winloss,licenseewl',
                        submit: _me.submitRunningBetList
                    },
                'betlist': {
                        title: Site.getSingleResource('BetList'),
                        hiddenColumn: 'externalid,systemid',
                        submit: _me.submitCompletedBetList
                    },
                'dailystatement': {
                        title: Site.getSingleResource('DailyStatement'),
                        hiddenColumn: 'externalid,systemid',
                        submit: _me.submitDailyStatementBetList
                    }
            };
        }

        function setProductOptionParamList(params) {
            const productCodeList = $('#grid-products-multiselect').multiSelect('getCheckedItems');
            params.ProductCodeList = productCodeList.toString();
            return params;
        }

        const _me = {
            initialize: function () {
                Site.initialize();
                DatePicker.initDateRangePicker();
                MultiSelect.initProductList();

                _viewName = $('#ViewOption').val();
                _viewOption = getViewOption();
                _me.updatePopupTitle();

                //show or hide products dropdown list by ViewOption
                _me.showHideProductsList();

                //Set columns need hide
                _me.setHiddenColumns();

                _me.initEvent();

                const params = _me.getParamsSubmit();
                if (params.ProductCodeList) {
                    _me.submit(params);
                }
                else {
                    $('#ProductList').addClass('invalid');
                    $('#SubmitButton').prop('disabled', true);
                }
            },
            initEvent: function () {
                $('#ViewOption').change(function () {
                    Site.blockUI();
                    const betlistName = $(this).val();
                    let url = Site.getCurrentUrl();
                    url = QueryString.setParam(url, 'betlistname', betlistName);
                    url = Site.setProductOptionOriginalParamList(url);

                    Site.redirect(url);
                });

                $('#SubmitButton').click(function () {
                    Report.setOriginalProduct();
                    const params = _me.getParamsSubmit();
                    _me.submit(params);
                });

                $('#report-container').on('click', '.betlistDrilldown', function () {
                    const param = $(this).data('param');
                    _me.viewDailyStatementBetList(param);
                });
            },

            updatePopupTitle: function () {
                const title = _viewOption[_viewName].title;
                const $frame = parent.$('#popupFrame');
                const $popUp = $frame.closest('.flat-popup');
                $popUp.find('.txt-title').text(title);
            },

            setHiddenColumns: function () {
                //Set string columns need to hide
                const columsHidden = _viewOption[_viewName].hiddenColumn;
                $('#HiddenColumnList').val(columsHidden);
            },

            showHideProductsList: function () {
                const $productsListContainer = $('#ProductList');
                const isHideProductList = _viewName === 'dailystatement';

                $productsListContainer.parent().toggleClass('hide', isHideProductList);
            },

            getParamsSubmit: function () {
                const params = $.parseJSON($('#BetListMetaModel').val());
                const url = Site.getCurrentUrl();
                params.CustId = QueryString.getParam(url, 'custid');
                params.ExternalId = QueryString.getParam(url, 'externalid');
                params.SystemId = QueryString.getParam(url, 'systemid');
                params.FromDate = $('#FromDate').val();
                params.ToDate = $('#ToDate').val();

                return setProductOptionParamList(params);
            },

            submitCompletedBetList: function (params) {
                window.serverPaging = true;
                const url = Site.resolveClientUrl('api/OutstandingCompletedBetList/Index');
                BetList.loadDataPaging(url, params);
            },

            submitRunningBetList: function (params) {
                window.serverPaging = false;
                const url = Site.resolveClientUrl('api/OutstandingRunningBetList/Index');
                BetList.loadData(params, url);
            },

            submitDailyStatementBetList: function (params) {
                const url = Site.resolveClientUrl('api/OutstandingDailyStatementBetList/Index');
                DailyStatement.loadData(params, url);
            },

            submit: function (params) {
                BetList.ValidProducts();
                BetList.registerBetListGlobalFunctions();

                _viewOption[_viewName].submit(params);
            },

            viewDailyStatementBetList: function (param) {
                BetList.registerBetListGlobalFunctions();

                const url = Site.resolveClientUrl('api/DailyStatementBetList/Index');
                const postData = $.parseJSON($('#BetListMetaModel').val());

                postData.CustId = param.CustId;
                postData.FromDate = param.Date;
                postData.TransType = param.TransType;
                postData.ExternalId = param.ExternalId;
                postData.SystemId = param.SystemId;

                $('.page-form').remove();
                BetList.loadData(postData, url);
            }
        };

        return _me;
    });