'use strict';
define([], function () {
    const _pagingOption = {
        pageindex: 1,
        pagesize: 1000,
        pagelist: [1000, 2000, 3000, 4000],
        totalrow: 1,
        elementcontainer: '#ActiveCustomerPager',
        method: 'AJAX',
        ajaxfunction: 'CustomerList.ajaxPaging()',
        alwayshow: true
    };

    const _dormantPagingOption = {
        pageindex: 1,
        pagesize: 1000,
        pagelist: [1000, 2000, 3000, 4000],
        totalrow: 1,
        elementcontainer: '#DormantCustomerPager',
        method: 'AJAX',
        ajaxfunction: 'CustomerList.ajaxPagingDormant()',
        alwayshow: true
    };

    const state = {
        cachedData: {},
        selectedCustomers: {},
        checkedAllRows: false,
        pagingOption: _pagingOption
    };

    const dormantState = {
        pagingOption: _dormantPagingOption
    };

    return {
        getState: function () {
            return state;
        },
        getDormantState: function () {
            return dormantState;
        }
    };
});