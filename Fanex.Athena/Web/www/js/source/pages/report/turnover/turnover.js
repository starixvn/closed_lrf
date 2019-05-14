define(
    ['jquery', 'common/site', './turnover.option',
        'lib/jqgrid/jquery.jqgrid.additional', 'moment', 'components/pluginhelper/monthpicker', 'components/pluginhelper/multiselect',
        'components/pluginhelper/autocomplete', 'lib/jqgrid/jquery.jqGrid.en', 'lib/jqgrid/jquery.jqGrid.min', 'extensions/jquery.extension'],
    function ($, Site, TurnoverOption, jqGridAdditional, moment, MonthPicker, MultiSelect, AutoComplete) {
        'use strict';
    let ajaxRequest = null;
    let _fromDate, _toDate, _currencyId;

    const _me = {
        defaultUserName: '',
        initialize: function () {
            Site.initialize();
            _me.initEvent();
            AutoComplete.initialize({
                url: Site.resolveClientUrl('SearchCustomerAPI/SearchCustomer'),
                target: '#Username'
            });
            MonthPicker.initMonthPicker();

            TurnoverOption.hasCustomerComm = Site.asBool($('#IsAllowedCustomerCommission').val());
            TurnoverOption.hasCasinoTransfer = Site.asBool($('#IsAllowedCasinoTransfer').val());
            TurnoverOption.isAllowBa = Site.asBool($('#IsAllowBa').val());
            MultiSelect.initProductList();
            Site.addUserGuide({
                resourceName: 'Turnover',
                title: Site.getSingleResource('Turnover')
            });
        },
        
        initEvent: function () {
            $('#TurnoverForm input').keypress(function (e) {
                if (e.keyCode === 13) {
                    $('#IsExportExcel').val(false);
                    _me.submit();
                }
            });

            $('#SubmitButton').click(function () {
                $('#IsExportExcel').val(false);
                _me.submit();
            });

            $('#ExportToExcel').click(function () {
                $('#IsExportExcel').val(true);
                const mainForm = $('#TurnoverForm');
                const url = Site.resolveClientUrl(TurnoverOption.urlExcelData);
                mainForm.attr('action', url);
                mainForm.submit();
                $('#IsExportExcel').val(false);
                return false;
            });

            $(window).on('resize', function () {
                _me.resizeGrid();
            });

            $(window).on('unload', function () {
                $(window).off('resize');
            });
        },

        setReportTitle: function () {
            let titlePattern = Site.getSingleResource('Turnover');
            let title = null;
            const username = $('#Username').val().trim();
            const currencyTextList =
                {
                    '-3': 'gbp',
                    '-2': 'usd',
                    '-1': 'eur',
                    '0': Site.getSingleResource('AllCurrencies')
                };

            let currencyName = currencyTextList[_currencyId] ? currencyTextList[_currencyId]
                                                            : $('#CurrencyId option[value="' + _currencyId + '"]').text().trim();
            const dateString = _fromDate.format('MM/DD/YYYY') + ' → ' + _toDate.format('MM/DD/YYYY');
            currencyName = currencyName.toUpperCase();
            if (username === _me.defaultUserName) {
                titlePattern += ', {0} - {1}';
                const currencyStr = Site.getSingleResource('Viewin').replace('{0}', currencyName);
                title = $.format(titlePattern, dateString, currencyStr);
            } else {
                titlePattern += ', {0} - {1} {2} ({3})';
                title = $.format(titlePattern, dateString, Site.getSingleResource('Customer'), username, currencyName);
            }

            $('.report-title').html(title);
            $('.panel-heading').removeClass('hide');
        },
        ajaxComplete: function (response) {
            if (response !== null) {
                _me.setReportTitle();
                _me.bindData(response);
            }
        },

        setDateParam: function(){
            _fromDate = moment($('#FromDate').val(), 'MM/DD/YYYY');
            _toDate = moment($('#ToDate').val(), 'MM/DD/YYYY');

            $('#FromDay').val(_fromDate.date());
            $('#ToDay').val(_toDate.date());
            $('#Month').val(_fromDate.month() + 1);
            $('#Year').val(_fromDate.year());
        },

        submit: function () {
            if ($('#ProductList .childCheckbox:checked').length === 0) {
                return;
            }

            _me.setDateParam();
            _currencyId = $('#CurrencyId').val();

            const mainForm = $('#TurnoverForm');
            const postdata = mainForm.serializeObject();
            if (postdata.Username === _me.defaultUserName) {
                postdata.Username = undefined;
            }

            postdata.BaseCurrency = postdata.BaseCurrency.toUpperCase();
           
            const option =
            {
                type: 'POST',
                data: postdata,
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                cache: false,
                url: Site.resolveClientUrl(TurnoverOption.urlData),
                success: function (response) {
                    _me.ajaxComplete(response);
                },
                beforeSend: function () {
                    Site.blockUI();
                },
                complete: function () {
                    Site.unBlockUI();
                }
            };
            if (ajaxRequest !== null) {
                ajaxRequest.abort();
            }
            ajaxRequest = $.ajax(option);

            return true;
        },

        bindData: function (response) {
            jqGridAdditional.clearGrid('ReportGrid');
            const numOfRow = response.Data.length;
            if (!response || numOfRow === 0) {
                jqGridAdditional.setNoInfo();
                return;
            }
            
            const reportGrid = $('#ReportGrid');
            const gridOption = TurnoverOption.getGridOption();
            gridOption.data = response.Data;
            gridOption.gridComplete = function () {
                jqGridAdditional.gridComplete();
                _me.bindTotal(response.TotalData);

                const groupHeaders = [{
                    startColumnName: 'TurnoverBA',
                    numberOfColumns: 3,
                    titleText: Site.getSingleResource('BA')
                }];

                if (TurnoverOption.hasCustomerComm) {
                    groupHeaders.push({
                        startColumnName: 'WinLoss',
                        numberOfColumns: 3,
                        titleText: Site.getSingleResource('CustomerW_L')
                    });
                }

                reportGrid.jqGrid('setGroupHeaders',
                {
                    useColSpanStyle: true,
                    groupHeaders: groupHeaders
                });

                _me.resizeGrid();
                Site.unBlockUI();
            };

            // Show the grid
            reportGrid.jqGrid(gridOption);
        },

        bindTotal: function (totalData) {
            const columnModel = TurnoverOption.getColModel();
            const colspan = 2;
            jqGridAdditional.assignTotal(totalData, columnModel);
            jqGridAdditional.setGroupFooters(colspan, 0, 0);
            const $tr = $('.ui-jqgrid-sdiv table tr');
            $tr.find('td[aria-describedby=ReportGrid_OpeningBalance], td[aria-describedby=ReportGrid_ClosingBalance]').css('text-align', 'center').html('-');
        },

        resizeGrid: function () {
            const reportGrid = $('#ReportGrid');
            jqGridAdditional.updateGridHeight();
            jqGridAdditional.updateGridWidth(reportGrid);
        }
    };

    return _me;
});