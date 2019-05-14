define(["helpers/downloader"], function (Downloader) {
    describe("downloader", function () {
        var blob = "blobObject";
        var fileName = "fileName";

        it('Using IE browser - navigator.msSaveOrOpenBlob function should be called with correct parameter', function () {
            var originalmsSave = window.navigator.msSaveOrOpenBlob;

            var msSaveMock = jasmine.createSpy('msSaveOrOpenBlob');
            window.navigator.msSaveOrOpenBlob = msSaveMock;

            Downloader.download(blob, fileName);

            expect(msSaveMock).toHaveBeenCalledWith(blob, fileName);

            window.navigator.msSaveOrOpenBlob = originalmsSave;
        })

        describe('Using browser that not IE', function () {
            var originalCreateObjectUrlFunc = window.URL.createObjectURL;
            var originalDocumentBody = document.body;
            var hrefContent = "hrefContent";

            beforeEach(function () {
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob = undefined;
                }
              
                spyOn(window.URL, "createObjectURL").and.returnValue(hrefContent);
            });

            afterEach(function () {
                window.URL.createObjectURL = originalCreateObjectUrlFunc;
                document.body = originalDocumentBody;
            });

            it('window.URL.createObjectURL should be called with correct parameter', function () {
                Downloader.download(blob, fileName);

                expect(window.URL.createObjectURL).toHaveBeenCalledWith(blob);
            })

            it('created "a" tag should has correct attributes', function () {
                var atag;
                var expectedHrefContent = location.origin + "/" + hrefContent;
                
                spyOn(document.body, "appendChild").and.callFake(function (element) {
                    atag = element;
                });

                spyOn(document.body, "removeChild");

                Downloader.download(blob, fileName);

                expect(atag.href).toBe(expectedHrefContent);
                expect(atag.download).toBe(fileName);
            })

            it('"a" tag should fire click event', function () {
                var atag;
                var clickEvent = jasmine.createSpy();

                spyOn(document.body, "appendChild").and.callFake(function (element) {
                    element.click = clickEvent;
                    atag = element;
                });
                spyOn(document.body, "removeChild");

                Downloader.download(blob, fileName);

                expect(clickEvent).toHaveBeenCalled();
            })

            it('appendChild and removeChild function of document.body should be called with correct parameter', function () {
                var atag;

                spyOn(document.body, "appendChild").and.callFake(function (element) {
                    atag = element;
                });

                spyOn(document.body, "removeChild");

                Downloader.download(blob, fileName);

                expect(document.body.appendChild).toHaveBeenCalledWith(atag);
                expect(document.body.removeChild).toHaveBeenCalledWith(atag);
            })
        })
    });
});