define([
    'jquery',
    'common/querystring',
    'common/site',
    '../report',
    './platformwinloss.option',
    'lib/jqgrid/jquery.jqgrid.additional',
    'components/pluginhelper/monthpicker',
    'components/pluginhelper/multiselect',
    'common/popup',
    'helpers/excel',
    'helpers/datahelper',
    'lib/jqgrid/jquery.jqGrid.en',
    'lib/jqgrid/jquery.jqGrid.min',
    'extensions/jquery.extension',
    'lib/linq'],
    function ($, QueryString, Site, Report, PlatformWinLossOption, jqGridAdditional, MonthPicker, MultiSelect, Popup, ExcelHelper, DataHelper) {
        'use strict';

        const BETLIST_IGNORED_PRODUCTS = ['AB','PP'];
        let _platformNameMap = {};

        const _cacheData = {};
        const _filterData = {};

        const gridControl = {
            level: 0,
            pageSize: 50,
            sortColumnName: null,
            sortOrder: 'desc'
        };

        function initialize() {
            Site.initialize();
            Site.addUserGuide({
                resourceName: 'PlatformWinLoss',
                title: Site.getSingleResource('PlatformWinLoss')
            });

            _platformNameMap = {
                '0': Site.getSingleResource('All'),
                '1': Site.getSingleResource('Asia'),
                '2': Site.getSingleResource('China'),
                '3': Site.getSingleResource('Euro'),
                '4': Site.getSingleResource('Wap'),
                '5': Site.getSingleResource('Mobile'),
                '6': Site.getSingleResource('Tablet'),
                '7': Site.getSingleResource('NewAsia'),
                '8': Site.getSingleResource('MobileApp'),
                '9': Site.getSingleResource('MobileLiteVersion')
            };

            _me.initEvent();
            _me.initSetting();

            MultiSelect.initProductList();
            MonthPicker.initMonthPicker({
                minDate: Site.getHistoryDate(),
                maxDate: $('#MaxDate').val()
            });

            $(window).on('resize', function () {
                resizeGrid();
            });

            $(window).on('unload', function () {
                $(window).off('resize');
            });
        }

        function initEvent() {
            $('#SubmitButton').click(function () {
                _me.submit();
            });

            $('.main-content').on('click', '.drilldown', function () {
                const dataDrillDown = $(this).data('drill-down');
                _me.drillDown(1, dataDrillDown);
            });

            $('.main-content').on('click', '.bet-list-link', function () {
                const dataDrillDown = $(this).data('drill-down');
                _me.openBetlistPopUp(gridControl.level, dataDrillDown);
            });

            $('#level-link-container').on('click', '.level-link', function () {
                const level = Number($(this).attr('data-level'));
                gridControl.level = level;
                if (level < 1) {
                    Report.renderBreadCrumb(level);
                    gridControl.level = level;
                    _me.setReportTitle(_filterData[level]);
                    _me.bindData(level, _cacheData[level], _filterData[level].ProductOptions);
                }
            });

            $('#ExportToExcel').click(function () {
                _me.exportToExcel(gridControl.level, gridControl.sortColumnName, gridControl.sortOrder);
            });
        }

        function initSetting() {
            gridControl.pageSize = PlatformWinLossOption.pageSize;
            PlatformWinLossOption.hasCustomerComm = Site.asBool($('#IsAllowedCustomerCommission').val());

            PlatformWinLossOption.gridOption.onSortCol = function (index) {
                Site.blockUI();
                gridControl.pageSize = Number($('#ReportGrid').getGridParam('rowNum'));
                window.setTimeout(function () {
                    if (gridControl.sortColumnName === index) {
                        gridControl.sortOrder = gridControl.sortOrder === 'asc' ? 'desc' : 'asc';
                    } else {
                        gridControl.sortOrder = 'asc';
                        gridControl.sortColumnName = index;
                    }

                    _me.bindData(gridControl.level, _cacheData[gridControl.level], _filterData[gridControl.level].ProductOptions);

                    Site.unBlockUI();
                }, 100);
                return 'stop';
            };
        }

        function getSubmitData(){
            const data = $('#platformwinloss').serializeObject();
            data.Level = 0;
            addDateParam(data);
            return data;
        }

        function submit() {
            const validProduct = Report.ValidProducts();
            if (!validProduct) {
                return false;
            }

            gridControl.level = 0;
            const data = getSubmitData();

            getData(data, Site.resolveClientUrl(PlatformWinLossOption.urlData), function (response) {
                const submitData = {
                    FromDay: data.FromDay,
                    ToDay: data.ToDay,
                    Month: data.Month,
                    Year: data.Year,
                    ProductOptions: $.parseJSON(response.ProductOptions),
                    DrawFilter: data.DrawFilter,
                    PlatformType: data.PlatformType,
                    CurrencyId: data.CurrencyId,
                    FromDate: data.FromDate,
                    ToDate: data.ToDate,
                    CurrencyName: data.CurrencyName,
                    IsExcludedTestData: data.IsExcludedTestData,
                    BaseCurrency: data.BaseCurrency
                };
                _filterData[gridControl.level] = submitData;
                _cacheData[gridControl.level] = response;
                _me.setReportTitle(submitData);
                Report.renderBreadCrumb(gridControl.level);
                _me.bindData(gridControl.level, response, submitData.ProductOptions);
            });

            return true;
        }

        function exportToExcel(level, sortBy, sortOrder) {
            const data = _filterData[level] ? Site.clone(_filterData[level]) : getSubmitData();

            data.IsExportExcel = true;
            data.Level = level;
            if (level === 1 && sortBy) {
                data.SortBy = sortBy;
                data.SortOrder = sortOrder;
            }
            ExcelHelper.exportExcel(data, Site.resolveClientUrl(PlatformWinLossOption.urlExcelData));
            return false;
        }

        function bindData(level, response, productOptions) {
            jqGridAdditional.clearGrid('ReportGrid');

            const numOfRow = response.Data.length;
            if (numOfRow === 0) {
                jqGridAdditional.setNoInfo();
                return;
            }

            const reportGrid = $('#ReportGrid');
            let onPaging = false;
            const data = level === 1 ? sortData(response.Data) : response.Data;

            const gridOption = PlatformWinLossOption.getGridOption(level, productOptions);
            gridOption.datastr = data;
            gridOption.rowNum = level === 0 ? numOfRow : gridControl.pageSize;
            gridOption.treeGrid = level === 0;
            gridOption.onPaging = function (pgButton) {
                gridControl.pageSize = Number($('#ReportGrid').getGridParam('rowNum'));

                if (numOfRow > PlatformWinLossOption.pageSize) {
                    onPaging = true;
                    if ($('#' + pgButton).hasClass('ui-state-disabled') === false) {
                        Site.blockUI();
                    }
                }
                else {
                    return 'stop';
                }
            };
            gridOption.gridComplete = function () {
                jqGridAdditional.gridComplete();

                const showPaging = level === 1 && numOfRow > PlatformWinLossOption.pageSize;
                $('#pg_ppdata').toggle(showPaging);

                if (onPaging) {
                    $('.ui-jqgrid-ftable').html($('#footer').html());
                }
                else {
                    _me.bindTotal(level, response.Total, response.SummaryTotal);
                    $('#footer').html($('.ui-jqgrid-ftable').html());
                }

                onPaging = false;
                resizeGrid();

                if (level === 0) {
                    $('th[role="columnheader"]').find('div').removeClass('ui-jqgrid-sortable');
                }

                Site.unBlockUI();
            };

            reportGrid.jqGrid(gridOption);

            /*group header*/
            if (PlatformWinLossOption.hasCustomerComm) {
                jqGridAdditional.setGroupCustomerWLColumns(reportGrid);
            }

            if (level === 1 && gridControl.sortColumnName) {
                jqGridAdditional.addSortableHeader(reportGrid, gridControl.sortColumnName, gridControl.sortOrder);
            }
        }

        function bindTotal(level, totalData, summaryTotal) {
            const columnModel = PlatformWinLossOption.getColModel(level, _filterData[level].ProductOptions);

            if (level === 0) {
                jqGridAdditional.assignTotal(totalData, columnModel);
                jqGridAdditional.setGroupFooters(1);
            }
            else {
                const colspan = PlatformWinLossOption.totalColspan[level];

                const summaryColspan = colspan + 1;
                jqGridAdditional.assignTotal(totalData, columnModel);

                const summaryRowCount = Report.bindSummaryTotal(columnModel, summaryTotal);
                jqGridAdditional.setGroupFooters(colspan, summaryColspan, summaryRowCount);
            }
        }

        function setReportTitle(data) {
            const titlePattern = Site.getSingleResource('PlatformWinLoss')
                + ', {0} → {1} - {2} - {3} - '
                + Site.getSingleResource('Platform') + ': {4}{5}';

            const selectedCurrency = $('#CurrencyId option[value="' + data.CurrencyId + '"]').text();
            const currencyText = data.CurrencyId === '0' ?
                Site.getSingleResource('AllCurrencies') :
                Site.getSingleResource('Currency') + ' ' + selectedCurrency;

            const viewinKey = Site.getSingleResource('Viewin');
            const baseCurrency = {
                'gbp': viewinKey.replace('{0}', 'GBP'),
                'usd': viewinKey.replace('{0}', 'USD'),
                'eur': viewinKey.replace('{0}', 'EUR')
            };
            const baseCurrencyKey = $('#BaseCurrency').val();
            const baseCurrencyText = baseCurrency[baseCurrencyKey] ?
                baseCurrency[baseCurrencyKey]
                : viewinKey.replace('{0}', selectedCurrency);

            const platformName = _platformNameMap[data.PlatformType];

            let productText = Site.getSingleResource('Product') + ': ';
            productText = data.ProductOptions && data.ProductOptions.length === 1 ?
                productText + data.ProductOptions[0].Code :
                getProductText(data.ProductOptions);

            const title = $.format(titlePattern, data.FromDate, data.ToDate,
                        currencyText, baseCurrencyText, platformName, ', ' + productText);

            $('.report-title').html(title);
            $('.panel-heading').removeClass('hide');
        }

        function drillDown(level, data) {
            gridControl.level = level;
            gridControl.pageSize = PlatformWinLossOption.pageSize;
            gridControl.sortColumnName = null;
            gridControl.sortOrder = 'desc';

            const submitData = _filterData[level - 1];
            let productOptions;
            if (data.ProductCode) {
                productOptions = [{ Code: data.ProductCode, Status: true }];
            }
            else {
                productOptions = submitData.ProductOptions;
            }

            const drilldownData = Site.clone(submitData);
            drilldownData.Level = level;
            drilldownData.PlatformType = data.PlatformType;
            drilldownData.ProductOptions = productOptions;

            getData(drilldownData, Site.resolveClientUrl(PlatformWinLossOption.urlData), function (response) {
                _cacheData[level] = response;
                _filterData[level] = drilldownData;
                _me.setReportTitle(drilldownData);
                Report.renderBreadCrumb(level);
                _me.bindData(level, response, productOptions);
            });
        }

        function getData(data, url, callback) {
            $.ajax({
                type: 'POST',
                data: data,
                dataType: 'json',
                cache: false,
                url: url,
                success: function (response) {
                    callback(response);
                },
                beforeSend: Site.blockUI,
                complete: Site.unBlockUI
            });
        }

        function openBetlistPopUp(onlevel, dataDrillDown) {
            let url = Site.resolveClientUrl('PlatformWinLossBetList/Index');
            const onLevelData = _filterData[onlevel];

            const param = {
                FromDate: onLevelData.FromDate,
                ToDate: onLevelData.ToDate,
                PlatformType: onLevelData.PlatformType,
                ExcludeTest: onLevelData.IsExcludedTestData,
                CurrencyId: dataDrillDown.DrillDownCurrencyId,
                CurrencyName: dataDrillDown.DrillDownCurrencyName,
                DrawFilter: onLevelData.DrawFilter,
                CustId: dataDrillDown.CustomerId,
                SystemId: dataDrillDown.SystemId,
                ExternalId: dataDrillDown.ExternalId,
                BaseCurrency: onLevelData.BaseCurrency
            };

            url = QueryString.setParams(url, param);

            const productCodeList = [];
            for (let i = 0; i < onLevelData.ProductOptions.length; i++) {
                const product = onLevelData.ProductOptions[i];
                if (product.Status && $.inArray(product.Code, BETLIST_IGNORED_PRODUCTS) < 0 ) {
                    productCodeList.push(product.Code);
                }
            }
            url = Site.setProductCodeListParam(url, productCodeList);

            const popH = Math.min($(window).height() - 100, 650), popW = 920;
            const popupOption = { id: 'betlist-popup', width: popW + 50, height: popH + 50, title: Site.getSingleResource('CustomerBetList') };
            Popup.openPopupWithIframe(url, popupOption);
            window.logOpenBetlistEvent && window.logOpenBetlistEvent();
        }

        function addDateParam(data) {
            const fromDate = new Date($('#FromDate').val());
            const toDate = new Date($('#ToDate').val());
            data.FromDay = fromDate.getDate();
            data.ToDay = toDate.getDate();
            data.Month = fromDate.getMonth() + 1;
            data.Year = fromDate.getFullYear();
        }

        function sortData(arrayData) {
            const totalData = arrayData.length;

            if (!gridControl.sortColumnName || totalData <= 1) {
                return arrayData;
            }

            const sortThenBy = arrayData[0].Id ? 'Id' : 'Index';

            const data = DataHelper.sort(
                arrayData,
                function (x) { return x[gridControl.sortColumnName]; },
                gridControl.sortOrder,
                function (x) { return x[sortThenBy]; },
                'asc');

            if (sortThenBy === 'Id') {
                for (let i = 0; i < totalData; i++) {
                    data[i].Index = i + 1;
                }
            }
            else {
                for (let j = 0; j < totalData; j++) {
                    arrayData[j].Id = j + 1;
                    data[j].Index = j + 1;
                }
            }

            return data;
        }

        function getProductText(productOptions) {
            const productSeleted = Enumerable.From(productOptions)
                .Where(function (x) { return x.Status; })
                .Select(function (x) { return x.Code; })
                .ToArray();

            const productName = productSeleted.length === productOptions.length
                ? Site.getSingleResource('All')
                : productSeleted.join(', ');

            return Site.getSingleResource('Product') + ': ' + productName;
        }

        function resizeGrid() {
            const reportGrid = $('#ReportGrid');
            jqGridAdditional.updateGridHeight();
            jqGridAdditional.updateGridWidth(reportGrid);
        }

        const _me = {
            initialize: initialize,
            initSetting: initSetting,
            initEvent: initEvent,
            submit: submit,
            bindData: bindData,
            bindTotal: bindTotal,
            setReportTitle: setReportTitle,
            drillDown: drillDown,
            openBetlistPopUp: openBetlistPopUp,
            exportToExcel: exportToExcel
        };

        return _me;
    });