'use strict';
define(['jquery', 'common/site', 'lib/jquery.multiselect'], function ($, Site) {
    const _me = {
        initProductList: function () {
            const selector = '#grid-products-multiselect';
            const data = $.parseJSON($('#productsData').val());
            const length = data.length;
            const dataUI = [];
            let checkedCount = 0;
            for (let i = 0; i < length; i++) {
                const item = data[i];
                const isChecked = item['Status'];
                if (isChecked) {
                    checkedCount++;
                }

                dataUI.push({
                    Id: item['Code'],
                    Value: item['Code'],
                    Text: Site.getSingleResource(item['Name']),
                    Checked: isChecked,
                    Enable: true
                });
            }

            const isCheckAll = checkedCount === length;
            $(selector).multiSelect({
                minWidth: 200,
                maxHeight: 400,
                shadow: true,
                showHeader: true,
                isCheckAll: isCheckAll,
                checkAllText: Site.getSingleResource('All'),
                selectedText: Site.getSingleResource('SelectedItemCount'),
                noneSelectedText: Site.getSingleResource('SelectOptions'),
                showFooter: false,
                listData: dataUI,
                onCheck: function () {
                    const checkedItems = $(selector).multiSelect('getCheckedItems');
                    $('#product-container input[type=checkbox]:checked').prop('checked', false);
                    const hasItemsChecked = checkedItems.length > 0;
                    if (hasItemsChecked) {
                        for (let i = 0; i < checkedItems.length; i++) {
                            $('#product-container #' + checkedItems[i]).prop('checked', true);
                        }
                    }
                    
                    $('#ProductList').toggleClass('invalid', !hasItemsChecked);
                    $('#SubmitButton').prop('disabled', !hasItemsChecked);
                }
            });
        }
    };

    return _me;
});