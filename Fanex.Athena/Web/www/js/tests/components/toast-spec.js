define(["jquery", "components/toast"], function ($, Toast) {
    describe("Toast", function () {
        var htmlContainer = '<div class="page-portal">' +
                                '<div class="toast-container toast-container-top toast-container-right">' +
                                    '<div class="toast-align">' +
                                    '</div>' +
                                '</div>' +
                            '</div>';

        function generateToastItem(styleName, text) {
            return '<div class="toast-item toast-item-' + styleName + '">' +
                        '<p class="toast-message">' + text + '</p>' +
                        '<div class="toast-button-group">' +
                            '<button type="button" class="icon icon-close toast-item-close"></button>' +
                        '</div>' +
                    '</div>';
        }

        beforeEach(function () {
            jasmine.clock().install();
            setFixtures(htmlContainer);
        });

        afterEach(function () {
            jasmine.clock().uninstall();
        });

        it("show - should add toast item to toast container", function () {
            var expectedToastItemCount = 2;

            Toast.show();
            Toast.show();

            var result = $(".toast-container").find(".toast-item").length;

            expect(result).toBe(expectedToastItemCount);
        });

        it("show - should add toast item with default option", function () {
            var expectedHtmlContentOfItem = generateToastItem("default", "Data is being downloaded");

            Toast.show();

            var $toastItem = $(".toast-container").find(".toast-item")[0];

            var result = $toastItem.outerHTML;

            expect(result).toBe(expectedHtmlContentOfItem);
        });

        it("show - text message of toast item should be correct", function () {
            var expectedMessage = "This is a message";

            var option = { text: expectedMessage };
            Toast.show(option);

            var $toastItem = $(".toast-container").find(".toast-item");
            var result = $toastItem.find(".toast-message").text();

            expect(result).toBe(expectedMessage);
        });

        it("show - position is incorrect format - position class is empty", function () {
            var $pagePortal = $(".page-portal");
            $pagePortal.remove();

            var option = { position: "right" };

            Toast.show(option);
            $pagePortal = $(".page-portal");

            var expectedResult = '<div class="toast-container">' +
                                    '<div class="toast-align">' +
                                        generateToastItem("default", "Data is being downloaded") +
                                    '</div>' +
                                '</div>'

            var result = $pagePortal.html();

            expect(result).toBe(expectedResult);

            $pagePortal.remove();
        });

        it("show - container is not exist - generate default container into body", function () {
            var $pagePortal = $(".page-portal");

            expect($pagePortal.length).toBe(1);

            $pagePortal.remove();

            Toast.show();

            var result = $("body > .page-portal").length;

            expect(result).toBe(1);
        });

        it("show - click close icon on toast item - remove function of jquery should be called", function () {
            Toast.show();

            spyOn($.fn, "remove");
            var $toastItem = $(".toast-container").find(".toast-item");
            var $closeIcon = $toastItem.find(".toast-item-close");

            $closeIcon.click();

            expect($.fn.remove).toHaveBeenCalled();
        });

        it("show - after 6000 ms - fadeOut function of jquery should be called with correct parameter", function () {
            Toast.show();

            spyOn($.fn, "fadeOut");

            jasmine.clock().tick(4000);
            expect($.fn.fadeOut).not.toHaveBeenCalled();

            jasmine.clock().tick(2001);
            expect($.fn.fadeOut).toHaveBeenCalled();
        });
    });
});