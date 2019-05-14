"use strict";
define(["jquery", "common/site"], function ($, Site) {
    var _me = {
        exportExcel: function (postData, url, method) {
            var data = Site.clone(postData);
            data.IsExportExcel = true;
            var $form = $('<form id="ExportExcelForm">').attr({ action: url, method: method || 'post' })
                .appendTo('body');
            for (var property in data) {
                if (data.hasOwnProperty(property)) {
                    var value = data[property];
                    if (property === "ProductOptions") {
                        var products = typeof (value) === "object" ? value : JSON.parse(value);
                        for (var i = 0; i < products.length; i++) {
                            var product = products[i];
                            $('<input type="hidden">').attr({ name: 'ProductOptions[' + i + '].Code', value: product.Code }).appendTo($form);
                            $('<input type="hidden">').attr({ name: 'ProductOptions[' + i + '].Status', value: product.Status }).appendTo($form);
                        }
                    } else {
                        $('<input type="hidden">').attr({ name: property, value: value }).appendTo($form);
                    }
                }
            }
            if (!data["__RequestVerificationToken"]) {
                $('<input type="hidden">')
                    .attr({ name: '__RequestVerificationToken', value: $("input[name=__RequestVerificationToken]").val() })
                    .appendTo($form);
            }

            $form.submit();
            $form.remove();
        }
    };

    return _me;
});