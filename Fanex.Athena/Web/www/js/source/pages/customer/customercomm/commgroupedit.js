define(['jquery', './commgroupdetail'],
     function ($, CommGroupDetail) {
         'use strict';

         const FORM_SELECTOR = '#customer-comm-group-edit';
         const TITLE = 'EditGroup';
         let _originalGroupName = '';

         function initialize() {
             CommGroupDetail.initialize(TITLE);

             _originalGroupName = $('#OriginalGroupName').val();
             _me.initEvent();
         }

         function initEvent() {
             $('#Validate').click(function () {
                 const $groupName = $('#GroupName');

                 if ($groupName.val() === _originalGroupName) {
                     $groupName.removeClass('invalid');
                     $groupName.addClass('valid');
                     $('label[for=GroupName]').attr('data-success', '');
                     $('#Submit').prop('disabled', false);
                     return;
                 }

                 CommGroupDetail.checkAvailableGroup($groupName.val());
             });

             $('#CustList').click(function () {
                 CommGroupDetail.goToCustomerList($('#GroupCommId').val());
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