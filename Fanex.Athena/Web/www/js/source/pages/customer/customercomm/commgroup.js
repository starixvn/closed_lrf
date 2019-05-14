define(['jquery', 'common/site'], function ($, Site) {
    'use strict';

    function goToCustomerList(groupCommId) {
        if (isParentSameOrigin()) {
            // Deactive Commission Group menu (55) and active Customer list menu (43)
            $('li>#MenuItem55', window.parent.document).parent().removeClass('active');
            $('li>#MenuItem43', window.parent.document).parent().addClass('active');
            _me.setPageTitle(Site.getSingleResource('CustomerList'));
        }
        Site.redirect(Site.resolveClientUrl('Customer/CustomerList?groupId=' + groupCommId));
    }

    function setPageTitle(title) {
        if (isParentSameOrigin()) {
            $('#page-title', window.parent.document).text(title);
        }
    }

    function isParentSameOrigin() {
        let sameOrigin;
        try {
            sameOrigin = window.parent.location.host === window.location.host;
        }
        catch (e) {
            sameOrigin = false;
        }
        return sameOrigin;
    }

    const _me = {
        goToCustomerList: goToCustomerList,
        setPageTitle: setPageTitle
    };

    return _me;
});