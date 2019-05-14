define(["jquery", "common/site", "helpers/excel"], function ($, Site, ExcelHelper) {
    describe("ExcelHelper", function () {
        beforeAll(function () {
            spyOn($.fn, "submit");
            spyOn($.fn, "remove");
        });
        describe("exportExcel(postData, url, method)", function () {
            var postData = {
                ProductOptions: [{ Code: 1, Status: true }],
                CurrencyId: 1
            };

            beforeEach(function () {
                setFixtures('<input id="__RequestVerificationToken" name="__RequestVerificationToken" value="123" />');
            });

            afterEach(function () {
                document.getElementById("ExportExcelForm").remove();
                document.getElementById("jasmine-fixtures").remove();
            });

            it("'#ExportExcelForm' should has correct attribute", function () {
                var url = "localhost";
                var method = "GET";

                ExcelHelper.exportExcel(postData, url, method);
                var $excelForm = $("#ExportExcelForm");

                expect($excelForm.attr("action")).toBe(url);
                expect($excelForm.attr("method")).toBe(method);
            });

            it("'#ExportExcelForm' should has correct 'method' attribute when we do not pass param 'method'", function () {
                var url = "localhost";

                ExcelHelper.exportExcel(postData, url);
                var result = $("#ExportExcelForm").attr("method");

                expect(result).toBe("post");
            });

            it("'#ExportExcelForm' should has correct html content", function () {
                var url = "localhost";
                var expectedResult = '<input type="hidden" name="ProductOptions[0].Code" value="1"><input type="hidden" name="ProductOptions[0].Status" value="true">' +
                                    '<input type="hidden" name="CurrencyId" value="1"><input type="hidden" name="IsExportExcel" value="true">' +
                                    '<input type="hidden" name="__RequestVerificationToken" value="123">';

                ExcelHelper.exportExcel(postData, url);
                var result = $("#ExportExcelForm").html();

                expect(result).toBe(expectedResult);
            });

            it("__RequestVerificationToken should has correct value when we got it in post data", function () {
                var postDataCopy = Site.clone(postData);
                postDataCopy["__RequestVerificationToken"] = "abc"
                var url = "localhost";

                ExcelHelper.exportExcel(postDataCopy, url);
                var result = $("#ExportExcelForm").find("input[name=__RequestVerificationToken]").val();

                expect(result).toBe("abc");
            });

            it("'#ExportExcelForm' should has correct html content when ProductOptions is json string", function () {
                var url = "localhost";
                var postDataCopy = Site.clone(postData);
                postDataCopy.ProductOptions = '[{"Code":2,"Status":false}]';
                var expectedResult = '<input type="hidden" name="ProductOptions[0].Code" value="2"><input type="hidden" name="ProductOptions[0].Status" value="false">' +
                                    '<input type="hidden" name="CurrencyId" value="1"><input type="hidden" name="IsExportExcel" value="true">' +
                                    '<input type="hidden" name="__RequestVerificationToken" value="123">';

                ExcelHelper.exportExcel(postDataCopy, url);
                var result = $("#ExportExcelForm").html();

                expect(result).toBe(expectedResult);
            });
        });
    });
});