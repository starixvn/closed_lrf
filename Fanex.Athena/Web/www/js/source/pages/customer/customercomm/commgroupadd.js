define(['jquery', './commgroupdetail'],
     function ($, CommGroupDetail) {
         'use strict';

         const FORM_SELECTOR = '#customer-comm-group-add';
         const TITLE = 'CreateNewGroup';

         function initialize() {
             CommGroupDetail.initialize(TITLE);

             _me.initEvent();
         }

         function initEvent() {
             $('#Validate').click(function () {
                 const groupName = $('#GroupName').val();
                 CommGroupDetail.checkAvailableGroup(groupName);
             });

             $('#Submit').click(function () {
                 CommGroupDetail.submit(FORM_SELECTOR);
             });
         }

         const _me = {
             initialize: initialize,
             initEvent: initEvent
         };

         return _me;
     });