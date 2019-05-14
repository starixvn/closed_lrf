define(['jquery', 'extensions/jquery.extension'], function ($) {
    describe("$.fn.hasVerticalScrollBar()", function () {
        beforeEach(function () {
            setFixtures('<div class="body-content"></div>');
        });

        it("value of hasVerticalScrollBar jquery function is 'true' when scrollHeight > height", function () {
            var $bodyContent = $(".body-content").width(20).height(300);
            var text = "hello world";
            for (var i = 0; i < 10; i++) {
                text += text;
            }
            $bodyContent.text(text);

            var result = $bodyContent.hasVerticalScrollBar();

            expect(result).toBe(true);
        });

        it("value is jquery function 'false' when scrollHeight < height", function () {
            var $bodyContent = $(".body-content").width(20).height(300);
            var text = "hello world";
            $bodyContent.text(text);

            var result = $bodyContent.hasVerticalScrollBar();

            expect(result).toBe(false);
        });

        it("value is jquery function 'false' when length = 0", function () {
            var $bodyContent = $(".body-content-not-exist");

            var result = $bodyContent.hasVerticalScrollBar();

            expect(result).toBe(false);
        });
    });

    describe("$.fn.hasHorizontalScrollBar()", function () {
        beforeEach(function () {
            setFixtures('<div class="body-content"></div>');
        });

        it("value of hasHorizontalScrollBar jquery function is 'true' when scrollWidth > width", function () {
            var $bodyContent = $(".body-content").width(20).height(300);
            var text = "hello world";
            for (var i = 0; i < 10; i++) {
                text += text;
            }
            $bodyContent.text(text);

            var result = $bodyContent.hasHorizontalScrollBar();

            expect(result).toBe(true);
        });

        it("value is jquery function 'false' when scrollWidth < width", function () {
            var $bodyContent = $(".body-content").width(200).height(300);
            var text = "hello world";
            $bodyContent.text(text);

            var result = $bodyContent.hasHorizontalScrollBar();

            expect(result).toBe(false);
        });

        it("value is jquery function 'false' when length = 0", function () {
            var $bodyContent = $(".body-content-not-exist");

            var result = $bodyContent.hasHorizontalScrollBar();

            expect(result).toBe(false);
        });
    });

    describe("$.fn.serializeObject()", function () {
        beforeEach(function () {
            setFixtures('<form id="form">'
                + '<input name="input1" type="text" value="1">'
                + '<input name="input2" type="hidden" value="2">'
                + '<input name="input3" type="hidden">'
                + '<input name="input3" type="text" value="4">'
                + '<input name="input3" type="text">'
                + '</form>');
        });

        it("returns correct object", function () {
            var expectedResult = { input1: '1', input2: '2', input3: ['', '4', ''] };

            var result = $("#form").serializeObject();

            expect(result).toEqual(expectedResult);
        });
    });

    describe("$.fn.showHide(isShow)", function () {
        it("hide element", function () {
            setFixtures('<div class="body-content"></div>');

            $(".body-content").showHide(false);

            expect($(".body-content").is(":hidden")).toBe(true);
        });

        it("show element", function () {
            setFixtures('<div class="body-content" style="display:none"></div>');

            $(".body-content").showHide(true);

            expect($(".body-content").is(":hidden")).toBe(false);
        });
    });

    describe("$.format", function () {
        it("$.format should return correct text", function () {
            var pattern = "This is a case which is {0} by {1}";
            var expected = "This is a case which is tested by Walter";

            var result = $.format(pattern, "tested", "Walter");

            expect(result).toBe(expected);
        });
    });

    describe("$.fn.tableRowSpan(colIndexs, effectToIndex)", function () {
        beforeEach(function () {
            setFixtures('<table id="table">'
               + '<tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>'
               + '<tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>'
               + '<tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>'
               + '</table>');
        });

        it("td tags should have correct colspan", function () {
            var $table = $("#table");
            $table.tableRowSpan([0, 2]);

            var firstRow = $table.find("tr").first();

            expect(firstRow.find("td").eq(0).attr("rowspan")).toBe("3");
            expect(firstRow.find("td").eq(2).attr("rowspan")).toBe("3");
        });

        it("td tags should have no colspan if effectToIndex is in colIndexs", function () {
            var $table = $("#table");
            $table.tableRowSpan([0, 2], 2);

            var firstRow = $table.find("tr").first();

            expect(firstRow.find("td").eq(0).attr("rowspan")).toBe(undefined);
            expect(firstRow.find("td").eq(2).attr("rowspan")).toBe(undefined);
        });

        it("td tags should have correct colspan if effectToIndex is not in colIndexs", function () {
            var $table = $("#table");
            $table.tableRowSpan([-1, 0, 2], 3);

            var firstRow = $table.find("tr").first();

            expect(firstRow.find("td").eq(0).attr("rowspan")).toBe("3");
            expect(firstRow.find("td").eq(2).attr("rowspan")).toBe("3");
            expect(firstRow.find("td").eq(3).attr("rowspan")).toBe("3");
        });
    });

    describe("$.fn.numbericTextBox(min, max)", function () {
        beforeEach(function () {
            setFixtures('<input id="input">');
        });

        it("event.preventDefault() should be called when 'input' fired keydown event with value 22", function () {
            var $input = $("#input");
            var event = $.Event("keydown");
            event.keyCode = 22;

            spyOn(event, "preventDefault");

            $input.numbericTextBox(0, 2000);
            $input.trigger(event);

            expect(event.preventDefault).toHaveBeenCalled();
        });

        it("do nothing when 'input' fired keydown event with value 46", function () {
            var $input = $("#input");
            $input.val("3000");
            var event = $.Event("keydown");
            event.keyCode = 46;

            spyOn(event, "preventDefault");

            $input.numbericTextBox(0, 2000);
            $input.trigger(event);

            expect($input.val()).toBe("3000");
        });

        it("do nothing when 'input' fired keydown event with value 65 and ctrlKey is true", function () {
            var $input = $("#input");
            $input.val("3000");
            var event = $.Event("keydown");
            event.keyCode = 65;
            event.ctrlKey = true;

            spyOn(event, "preventDefault");

            $input.numbericTextBox(0, 2000);
            $input.trigger(event);

            expect($input.val()).toBe("3000");
        });

        it("do nothing when 'input' fired keydown event with value is 48", function () {
            var $input = $("#input");
            $input.val("3000");
            var event = $.Event("keydown");
            event.keyCode = 48;

            spyOn(event, "preventDefault");

            $input.numbericTextBox(0, 2000);
            $input.trigger(event);

            expect($input.val()).toBe("3000");
        });

        it("do nothing when 'input' fired keydown event with value is 105", function () {
            var $input = $("#input");
            $input.val("3000");
            var event = $.Event("keydown");
            event.keyCode = 105;

            spyOn(event, "preventDefault");

            $input.numbericTextBox(0, 2000);
            $input.trigger(event);

            expect($input.val()).toBe("3000");
        });

        it("input value should be formated correctly", function () {
            var $input = $("#input");
            var event = $.Event("keyup");
            $input.val("11384");

            $input.numbericTextBox(0, 999999);
            $input.trigger(event);

            expect($input.val()).toBe("11,384");
        });

        it("input value should be sliced if value length is larger than max length", function () {
            var $input = $("#input");
            var event = $.Event("keyup");
            $input.val("2000");

            $input.numbericTextBox(0, 999);
            $input.trigger(event);

            expect($input.val()).toBe("200");
        });

        it("input value should be min if value is less than min value", function () {
            var $input = $("#input");
            var event = $.Event("keyup");
            $input.val("40");

            $input.numbericTextBox(50, 999);
            $input.trigger(event);

            expect($input.val()).toBe("50");
        });

        it("input value should be max if value is greater than max value", function () {
            var $input = $("#input");
            var event = $.Event("keyup");
            $input.val("800");

            $input.numbericTextBox(50, 500);
            $input.trigger(event);

            expect($input.val()).toBe("500");
        });

        it("do nothing if value is valid", function () {
            var $input = $("#input");
            var event = $.Event("keyup");
            $input.val("8000");

            $input.numbericTextBox(50, 9999);
            $input.trigger(event);

            expect($input.val()).toBe("8,000");
        });
    });

    describe("$.fn.checkboxgroup()", function () {
        function createElements() {
            for (var i = 0; i < 10; i++) {
                appendSetFixtures('<input type="checkbox">');
            }
        }

        var $allCheckboxes, $firstCheckbox, $theOtherCheckboxes
        beforeEach(function () {
            createElements();

            $allCheckboxes = $("input[type=checkbox]");
            $firstCheckbox = $allCheckboxes.first();
            $theOtherCheckboxes = $allCheckboxes.slice(1);
        });

        describe("First item is check all", function () {
            it("First item should be checked when the other were checked", function () {
                $theOtherCheckboxes.prop("checked", true);

                $allCheckboxes.checkboxgroup();

                expect($firstCheckbox.prop("checked")).toBe(true);
            });

            it("First item should be unchecked when the other have unchecked checkboxes", function () {
                $theOtherCheckboxes.prop("checked", true);
                $theOtherCheckboxes.first().prop("checked", false);

                $allCheckboxes.checkboxgroup();

                expect($firstCheckbox.prop("checked")).toBe(false);
            });
        });

        describe("events", function () {
            it("The other checkboxes should be checked when first checkbox fired change event", function () {
                $allCheckboxes.checkboxgroup();

                $firstCheckbox.prop("checked", true);
                $firstCheckbox.change();

                var lengthChecked = $theOtherCheckboxes.filter(":checked").length;

                expect(lengthChecked).toBe($theOtherCheckboxes.length);
            });

            describe("Change event of the other checkboxes", function () {
                it("First checkbox should be checked when the other were checked all", function () {
                    $allCheckboxes.checkboxgroup();
                    $theOtherCheckboxes.prop("checked", true);

                    $theOtherCheckboxes.first().change();

                    expect($firstCheckbox.prop("checked")).toBe(true);
                });

                it("First checkbox should be unchecked when one of the other were unchecked", function () {
                    $allCheckboxes.checkboxgroup();
                    $theOtherCheckboxes.prop("checked", true);
                    $theOtherCheckboxes.last().prop("checked", false);

                    $theOtherCheckboxes.last().change();

                    expect($firstCheckbox.prop("checked")).toBe(false);
                });
            });
        });
    });
});