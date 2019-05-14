"use strict";
define(function () {
    var _me = {
        download: function (blob, fileName) {
            // IE 10+
            if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
                navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
                var element = window.document.createElement('a');
                element.href = window.URL.createObjectURL(blob);
                element.download = fileName;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            }
        }
    };

    return _me;
});