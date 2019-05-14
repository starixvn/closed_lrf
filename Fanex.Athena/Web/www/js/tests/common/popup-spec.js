define(['jquery', 'common/popup'], function ($, PopUp) {
    describe("PopUp", function () {
        describe("openPopup(element, option)", function () {
            it("flatpopup jquery plugin should be called with correct parameters", function () {
                spyOn($.fn, "flatPopup");

                var $element = setFixtures('<div id="popup"></div>');
                var option = {
                    width: 200, height: 300, title: "title"
                };

                PopUp.openPopup($element, option);

                expect($.fn.flatPopup).toHaveBeenCalledWith(option);
            });
        });

        describe("closePopup(id)", function () {
            it("hides popup and unblock body", function () {
                spyOn($.fn, "fadeOut");

                var popupId = "popup";
                setFixtures('<div id="' + popupId + '"></div>'
                    + '<div class="popup-block-body"></div>');

                PopUp.closePopup(popupId);

                expect($.fn.fadeOut).toHaveBeenCalledWith(300);
                expect($(".popup-block-body").is(":hidden")).toBe(true);
            });
        });

        describe("openPopupWithIframe(url, option)", function () {
            it("Bet List popup should be called with correct url", function () {
                spyOn($.fn, "flatPopup");

                var url = "/Test/Index?transid=1234&custId=5678";
                var option = { width: 500, height: 600, title: "Bet List", id: "BetListPopUp" };

                PopUp.openPopupWithIframe(url, option);

                expect($.fn.flatPopup).toHaveBeenCalledWith(option);
            });

            it("Popup was existed - append function of jquery should be called", function () {
                setFixtures('<div id="ExistedBetListPopUp"></div>');
                spyOn($.fn, "flatPopup");
                spyOn($.fn, "append");

                var url = "about:blank";
                var option = { width: 500, height: 600, title: "Bet List", id: "ExistedBetListPopUp" };

                PopUp.openPopupWithIframe(url, option);
                var expectedParam = '<iframe id="popupFrame" src="about:blank" ></iframe>';

                expect($.fn.append).toHaveBeenCalledWith(expectedParam);
            });
        });

        describe("updateCurrentPopup(url, option)", function () {
            beforeEach(function () {
                parent.$ = $;
                spyOn($.fn, "flatPopup");
                setFixtures('<div id="current" class="popup-frame"><div id="popupFrame"></div></div>');
            });

            it("flatPopup should be called with correct parameter", function () {
                var url = "localhost/Test";
                var option = { id: "current", title: "title" };

                PopUp.updateCurrentPopup(url, option);

                expect($.fn.flatPopup).toHaveBeenCalledWith(option);
            });

            it("#popupFrame should has correct src attribute", function () {
                var url = "localhost/Test";
                var option = { id: "current", title: "title" };

                PopUp.updateCurrentPopup(url, option);
                var result = $("#popupFrame").attr("src");

                expect(result).toBe("localhost/Test");
            });

            it(".txt-title should has correct text", function () {
                var url = "localhost/Test";
                var option = { id: "current", title: "title" };
                $("#current").prepend('<div class="txt-title"></div>');

                PopUp.updateCurrentPopup(url, option);
                var result = $(".txt-title").html();

                expect(result).toBe(option.title);
            });

            it("id in option is not match - Get popup current id", function () {
                var option = { id: "newPopup" };

                PopUp.updateCurrentPopup(null, option);
                var result = $(".popup-frame").attr("id");

                expect(result).toBe("current");
            });

            it("id in option is undefine - flatPopup should be called with id of option is popup current id", function () {
                var option = {};

                PopUp.updateCurrentPopup(null, option);
                var result = $(".popup-frame").attr("id");

                expect(option.id).toBe("current");
                expect($.fn.flatPopup).toHaveBeenCalledWith(option);
            });

            it("flatPopup function is not called when popup element is not exist", function () {
                $("#current").remove();
                var option = {};

                PopUp.updateCurrentPopup(null, option);

                expect($.fn.flatPopup).not.toHaveBeenCalled();
            });

            it(".txt-title should keep current text when title in option is empty", function () {
                var url = "localhost/Test";
                var option = { id: "current", title: "" };
                $("#current").prepend('<div class="txt-title">Current Title</div>');

                PopUp.updateCurrentPopup(url, option);
                var result = $(".txt-title").html();

                expect(result).toBe("Current Title");
            });
        });

        describe("show($popup, isModal)", function () {
            it("flatPopup function should be called to show popup", function () {
                spyOn($.fn, "flatPopup");
                setFixtures('<div id="PopUp"></div>');
                var isModal = true;

                PopUp.show($("#PopUp"), isModal);

                expect($.fn.flatPopup).toHaveBeenCalledWith("show", isModal);
            });
        });

        describe("openPopupWithButton(element, option, buttons)", function () {
            beforeAll(function () {
                spyOn($.fn, "flatPopup").and.callFake(function () {
                    var $element = $(this);
                    appendSetFixtures($element);
                    $element.append('<a class="popup-close"></a>');
                    $(".popup-close").on("click", function () {
                        $element.hide();
                    });
                });
            });

            it("buttons should not be appended to popup is popup is existing", function () {
                var element = '<div id="PopUp" class="flat-popup"></div>';
                var option = {
                    id: "PopUp"
                };
                setFixtures(element);

                PopUp.openPopupWithButton(element, option, {});

                expect($.fn.flatPopup).toHaveBeenCalledWith({ id: "PopUp", padding: 15 });
            });

            it("buttons should be appended to new popup", function () {
                var element = '<div></div>';
                var option = {
                    id: "PopUp"
                };
                var button = [
                 {
                     text: "OK",
                     isClosedOnClick: true
                 }];

                PopUp.openPopupWithButton(element, option, button);

                expect($(".popup-button").length).toBeGreaterThan(0);
            });

            it("first button should be autofocused", function () {
                var element = '<div></div>';
                var option = null;
                var button = [
                 {
                     id: "btnOK",
                     text: "OK",
                     isClosedOnClick: true,
                     click: function () { },
                     classes: "btn"
                 }, {
                     text: "Cancel",
                     isClosedOnClick: true,
                     classes: "btn"
                 }];

                PopUp.openPopupWithButton(element, option, button);

                expect($(".popup-button button").first().attr("autofocus")).toBe("autofocus");
                expect($(".popup-button button").last().attr("autofocus")).toBe(undefined);
            });

            it("button function should be called if button is clicked", function () {
                var callback = jasmine.createSpyObj("callback", ["call"]);
                var element = '<div></div>';
                var option = null;
                var button = [
                 {
                     id: "btnOK",
                     text: "OK",
                     click: callback.call,
                     classes: "btn"
                 }];

                PopUp.openPopupWithButton(element, option, button);
                $("#btnOK").click();

                expect(callback.call).toHaveBeenCalled();
            });

            it("popup should be closed if button is clicked with isClosedOnClick is true", function () {
                var element = '<div id="popup"></div>';
                var option = null;
                var button = [
                 {
                     id: "btnOK",
                     text: "OK",
                     isClosedOnClick: true,
                     classes: "btn"
                 }];

                PopUp.openPopupWithButton(element, option, button);
                $("#btnOK").click();

                expect($("#popup").is(":hidden")).toBe(true);
            });

            it("popup should be closed and button function should be called if button is clicked with isClosedOnClick is true", function () {
                var callback = jasmine.createSpyObj("callback", ["call"]);
                var element = '<div id="popup"></div>';
                var option = null;
                var button = [
                 {
                     id: "btnOK",
                     text: "OK",
                     isClosedOnClick: true,
                     click: callback.call,
                     classes: "btn"
                 }];

                PopUp.openPopupWithButton(element, option, button);
                $("#btnOK").click();

                expect(callback.call).toHaveBeenCalled();
                expect($("#popup").is(":hidden")).toBe(true);
            });
        });
    });
});