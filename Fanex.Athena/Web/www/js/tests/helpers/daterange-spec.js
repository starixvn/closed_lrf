define(["jquery", "common/site", "common/popup", "helpers/daterange"], function ($, Site, Popup, DateRangeHelper) {
    describe("Helper - DateRange", function () {
        beforeAll(function () {
            spyOn(Site, "getSingleResource").and.callFake(function (message) {
                if (message === "DateRangeExceedMsg") {
                    return message + " {0}";
                }
                return message;
            });
        });

        describe("showMessageBox(message)", function () {
            it("Popup.openPopup function should be called with correct parameter", function () {
                setFixtures('<input id="PageLanguage" value="en-US" />');

                spyOn(Popup, "openPopup");
                var message = "Test";
                var expectedParam1 = '<div title="LrfNotification"><p class="notification">' + message + '!</p></div>';
                var expectedParam2 = { width: 350, height: 120, title: "LrfNotification", className: "popup-notification", id: "time-range-invalid"};

                DateRangeHelper.showMessageBox(message);

                expect(Popup.openPopup).toHaveBeenCalledWith(expectedParam1, expectedParam2);
            });
        });

        describe("setConstraintMonthRange(monthRange, url)", function () {
            beforeEach(function () {
                setFixtures('<input id="FromDate" value="4/1/2017" /> <input id="ToDate" value="7/1/2017" />' +
                    '<form id="form"></form>');
                spyOn(Popup, "openPopup");
            });

            afterEach(function () {
                $("form").off();
            })

            it("Popup.openPopup function should be called with correct parameter when exceed range", function () {
                DateRangeHelper.setConstraintMonthRange(2, "about:blank");

                $("form").submit();

                var expectedParam1 = '<div title="LrfNotification"><p class="notification">DateRangeExceedMsg 2!</p></div>';
                var expectedParam2 = { width: 350, height: 120, title: "LrfNotification", className: "popup-notification", id: "time-range-invalid"};

                expect(Popup.openPopup).toHaveBeenCalledWith(expectedParam1, expectedParam2);
            });

            it("Popup.openPopup function should not be called when range is valid", function () {
                var callback;
                spyOn($.fn, "on").and.callFake(function (eventName, func) { callback = func; });
                DateRangeHelper.setConstraintMonthRange(4, "about:blank");

                var result = callback();

                expect(Popup.openPopup).not.toHaveBeenCalled();
                expect(result).toBe(true);
            });

            it("$(document).ajaxSend is not called when url is null", function () {
                spyOn($.fn, "ajaxSend");
                DateRangeHelper.setConstraintMonthRange(4, null);

                expect($.fn.ajaxSend).not.toHaveBeenCalled();
            });

            it("Call $(document).ajaxSend with invalid range - DateRangeHelper.showMessageBox(message) should be called with correct parameter", function () {
                var expectedMessage = "DateRangeExceedMsg 4";
                var callback;
                spyOn($.fn, "ajaxSend").and.callFake(function (func) { callback = func; });
                spyOn(DateRangeHelper, "isValidRange").and.returnValue(false);
                spyOn(DateRangeHelper, "showMessageBox");

                var jqxhr = jasmine.createSpyObj('tape', ['abort']);
                var settings = { url: "localhost" };

                DateRangeHelper.setConstraintMonthRange(4, "localhost");
                callback(null, jqxhr, settings);

                expect(DateRangeHelper.showMessageBox).toHaveBeenCalledWith(expectedMessage);
                expect(jqxhr.abort).toHaveBeenCalled();
            });

            it("Call $(document).ajaxSend with valid range - DateRangeHelper.showMessageBox(message) should not be called", function () {
                var callback;
                spyOn($.fn, "ajaxSend").and.callFake(function (func) { callback = func; });
                spyOn(DateRangeHelper, "isValidRange").and.returnValue(true);
                spyOn(DateRangeHelper, "showMessageBox");

                var settings = { url: "localhost" };

                DateRangeHelper.setConstraintMonthRange(4, "localhost");
                callback(null, null, settings);

                expect(DateRangeHelper.showMessageBox).not.toHaveBeenCalled();
            });
        });
    });
});