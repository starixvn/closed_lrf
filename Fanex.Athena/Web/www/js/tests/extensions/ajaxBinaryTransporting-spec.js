define(["jquery"], function ($) {
    describe("ajaxBinaryTransporting", function () {
        var url = "api/Test";
        var buffer = new ArrayBuffer(1);
        var blob = new Blob([buffer], {
            type: "application/octet-stream"
        });

        describe("call ajax successfully", function () {
            beforeEach(function () {
                jasmine.Ajax.install();

                jasmine.Ajax
                .stubRequest(url)
                .andReturn({
                    'status': 200,
                    'response': blob
                });
            });

            afterEach(function () {
                jasmine.Ajax.uninstall();
            });

            it("call ajax with responseType is blob - spy function should be called when success", function (done) {
                var spyFunction = jasmine.createSpy();

                var option = {
                    type: "POST",
                    data: {},
                    dataType: "binary",
                    responseType: "blob",
                    cache: false,
                    url: url,
                    success: function (response) {
                        spyFunction(response);
                    }
                };

                $.ajax(option);
                setTimeout(done, 10);

                expect(spyFunction).toHaveBeenCalledWith(blob);
            });

            it("call ajax with dataType is binary - default responseType is blob - spy function should be called when success", function (done) {
                var spyFunction = jasmine.createSpy();

                var option = {
                    type: "POST",
                    dataType: "binary",
                    url: url,
                    success: function (response) {
                        spyFunction(response);
                    }
                };

                $.ajax(option);
                setTimeout(done, 10);

                expect(spyFunction).toHaveBeenCalledWith(blob);
            });
        });

        describe("call ajax error", function () {
            beforeEach(function () {
                jasmine.Ajax.install();

                jasmine.Ajax
                .stubRequest(url)
                .andReturn({
                    'status': 500
                });
            });

            afterEach(function () {
                jasmine.Ajax.uninstall();
            });

            it("abort - spy function should be called when error", function (done) {
                var spyFunction = jasmine.createSpy();

                var option = {
                    type: "POST",
                    data: null,
                    dataType: "binary",
                    async: null,
                    url: "",
                    error: function (jqXHR, textStatus, errorThrown) {
                        spyFunction(jqXHR.status, textStatus);
                    }
                };

                var ajaxRequest = $.ajax(option);
                ajaxRequest.abort();
                setTimeout(done, 10);

                expect(spyFunction).toHaveBeenCalledWith(0, "abort");
            });
        });
    });
});