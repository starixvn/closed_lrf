'use strict';
define(['jquery', 'common/site', 'common/querystring', 'lib/jqgrid/jquery.jqgrid.additional', './customerlist.filter', './customerlist.grid',
    './customerlist.service', './customerlist.service.dormant', './customerlist.commision', './customerlist.custoption'],
    function ($, Site, QueryString, jqGridAdditional, CustomerListFilter, CustomerListGrid,
        CustomerListService, CustomerListServiceDormant, CustomerComm, CustomerListViewOption) {

        $(document).ready(function () {
            Site.initialize();
            $('.tablinks').click(function () {
                const tabId = $(this).data('tab');
                const $tab = $('#' + tabId);
                $('.tabcontent').hide();
                $('.tablinks').removeClass('active');

                $tab.show();
                $(this).addClass('active');

                const isDormantTab = tabId === 'tabDormantCustomer';
                $('.page-button input[type=button]').prop('disabled', isDormantTab);
                if (isDormantTab) {
                    jqGridAdditional.updateGridHeight($tab);
                }
                else
                {
                    CustomerListService.bindDataFromCache();
                }
            });

            CustomerListService.initialize();
            CustomerListServiceDormant.initialize();
            CustomerListFilter.initialize();
            CustomerListGrid.initialize();
            CustomerListViewOption.initialize();

            const url = Site.getCurrentUrl();
            if (QueryString.getParam(url, 'userName') ||
                QueryString.getParam(url, 'groupId')) {
                CustomerListFilter.submit();
            } else {
                Site.unBlockUI();
            }

            CustomerComm.initialize();
        });
    });