"use strict";
define(["jquery", "common/site", "common/popup"], function ($, Site, Popup) {
    var _me = {
        setConstraintMonthRange: function (monthRange, url) {
            var errorMessage = Site.getSingleResource("DateRangeExceedMsg").replace("{0}", monthRange);

            if (url && typeof url === "string") {
                $(document).ajaxSend(function (event, jqxhr, settings) {
                    if (settings.url.search(new RegExp(url, "i")) > -1 && _me.isValidRange(monthRange) === false) {
                        _me.showMessageBox(errorMessage);
                        jqxhr.abort();
                    }
                });
            }

            $("form").on("submit", function () {
                if (_me.isValidRange(monthRange) === false) {
                    _me.showMessageBox(errorMessage);
                    return false;
                }

                return true;
            });
        },

        isValidRange: function (monthRange) {
            var fromDate = new Date($("#FromDate").val());
            var toDate = new Date($("#ToDate").val());

            return _me.getDifferenceMonth(fromDate, toDate) <= monthRange;
        },

        getDifferenceMonth: function (fromDate, toDate) {
            return toDate.getMonth() - fromDate.getMonth() + (12 * (toDate.getFullYear() - fromDate.getFullYear())) + 1;
        },

        showMessageBox: function (message) {
            var title = Site.getSingleResource("LrfNotification");
            var dialogForm = '<div title="' + title + '"><p class="notification">' + message + '!</p></div>';

            Popup.openPopup(dialogForm, { width: 350, height: 120, title: title, className: "popup-notification", id: "time-range-invalid" });
        }
    };

    return _me;
});