define(['jquery', 'common/site', 'common/popup'], function ($, Site, Popup) {
    'use strict';
    const REPORT_BY_MONTHLY = 2;
    const LICENSEE_12BET = 1;
    function lastDateOfMonth(year, month) {
        return new Date(year, month + 1, 0);
    }

    const _me = {
        GetDrilldownDateRange: function (reportBy, fromDate, toDate, drilldownDate) {
            let fdate = typeof drilldownDate === 'string' ? new Date(drilldownDate) : drilldownDate;
            let tdate = fdate;
            if (Number(reportBy) === REPORT_BY_MONTHLY) {
                let fday = 1;
                const month = fdate.getMonth();
                const year = fdate.getFullYear();
                const orignalFDate = new Date(fromDate);
                if (month === orignalFDate.getMonth()) {
                    fday = orignalFDate.getDate();
                }
                fdate = new Date(year, month, fday, 0, 0, 0, 0);
                const originalTDate = new Date(toDate);

                if (month === originalTDate.getMonth()) {
                    const tday = originalTDate.getDate();
                    tdate = new Date(year, month, tday, 0, 0, 0, 0);
                }
                else {
                    tdate = lastDateOfMonth(year, month);
                }
            }

            return {
                FromDate: fdate,
                ToDate: tdate
            };
        },
        ValidProducts: function () {
            let temp = true;
            if ($('.childCheckbox:checked').length === 0) {
                temp = false;
                const title = Site.getSingleResource('LrfNotification');
                const message = Site.getSingleResource('AlertChooseProductMsg');
                const $dialog = $('<div title="' + title + '"><p class="notification">' + message + '</p></div>');

                Popup.openPopup($dialog, {
                    width: 380,
                    height: 150,
                    title: title,
                    id: 'product-invalid',
                    className: 'popup-notification',
                    onOpen: function () {
                        $('#SubmitButton').prop('disabled', true);
                    },
                    onClose: function () {
                        $('#SubmitButton').removeAttr('disabled');
                    }
                });
            }

            return temp;
        },

        setOriginalProduct: function () {
            $('.childCheckbox[type="checkbox"]', '#ProductList').each(function (index, element) {
                const isCheck = $(this).is(':checked');
                $(element).attr({ 'data-original': isCheck });
            });
        },

        bindSummaryTotal: function (columnModel, summaryTotal) {
            if (!summaryTotal || summaryTotal.length === 0) {
                return;
            }

            const mainFooter = $('.ui-jqgrid-ftable tr:last-child');
            let rowCount = 0;
            const currencyList = [];

            function processColumnModel(dataItem, currency) {
                const row = mainFooter.clone();
                const cellList = $('td', row);

                $(columnModel).each(function (cellIndex, modelElement) {
                    const isCustomFormater = typeof modelElement.formatter === 'function';
                    const rawValue = dataItem[modelElement.name];
                    const value = isCustomFormater ? modelElement.formatter(rawValue, modelElement.formatoptions, row) :
                                $.fn.fmatter(modelElement.formatter, rawValue, modelElement.formatoptions);

                    const $cell = $(cellList.get(cellIndex));
                    if (cellIndex === 0) {
                        const content = 'Total in ' + currency;
                        $cell.html(content)
                            .addClass('group-' + currency)
                            .attr('title', content);
                    }
                    else {
                        let title = value;
                        if ($.isNumeric(rawValue) && rawValue < 0) {
                            const wrapper = document.createElement('div');
                            wrapper.innerHTML = value;
                            title = wrapper.innerText;
                        }
                        $cell.html(value).attr('title', title);
                    }
                });

                row.insertAfter(mainFooter);
                rowCount++;
            }

            for (let currency in summaryTotal) {
                if (summaryTotal.hasOwnProperty(currency)) {
                    currencyList.push(currency);
                    const summaryData = summaryTotal[currency];
                    if (Array.isArray(summaryData)) {
                        summaryData.forEach(function (item) {
                            processColumnModel(item, currency);
                        });
                    }
                    else {
                        processColumnModel(summaryData, currency);
                    }
                }
            }

            $('.ui-jqgrid-ftable').attr('data-total-currency-list', currencyList.join());
            mainFooter.remove();

            return rowCount;
        },

        getCurrencyNameForReportTitle: function (currencyId) {
            const viewinKey = Site.getSingleResource('Viewin');
            const currencyTextList = {
                '-3': viewinKey.replace('{0}', 'GBP'),
                '-2': viewinKey.replace('{0}', 'USD'),
                '-1': viewinKey.replace('{0}', 'EUR'),
                '0': Site.getSingleResource('AllCurrencies')
            };

            return currencyTextList[currencyId] === undefined
                ? viewinKey.replace('{0}', $('#CurrencyId option[value="' + currencyId + '"]').text())
                : currencyTextList[currencyId];
        },

        renderBreadCrumb: function (level, licenseeId) {
            const levelNumber = Number(level);
            if (levelNumber === 0) {
                $('.breadCrumbHolder').hide();
            }
            else {
                $('.breadCrumbHolder').show();
                $('#level-link-container .level0').show();

                const isLevel2 = levelNumber === 2;
                $('#level-link-container .level2').toggle(isLevel2).toggleClass('active', isLevel2);

                const allowShowLevel1 = licenseeId ? licenseeId === LICENSEE_12BET : true;
                $('#level-link-container .level1').toggle(allowShowLevel1);
                $('#level-link-container .level1').toggleClass('active', allowShowLevel1 && !isLevel2);
            }
        }
    };

    return _me;
});