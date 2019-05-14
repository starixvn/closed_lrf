define(['jquery', 'common/site', 'pages/report/livereport/livereport', 'pages/report/livereport/helper', 'moment', "components/pluginhelper/daterangepicker", "components/pluginhelper/monthpicker"],
    function ($, Site, LiveReport, Helper, moment, DatePicker, MonthPicker) {

    describe("livereport.js", function () {
        beforeAll(function () {            
            spyOn(Site, "getSingleResource").and.callFake(function (text) {
                return text;
            });
            spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                return url;
            });
            spyOn(Site, "initialize");
            spyOn(Site, "addUserGuide");

            spyOn(DatePicker, "initDateRangePicker");
            spyOn(MonthPicker, "initMonthPicker");

            setFixtures('<input id="HistoryDate" value="1/1/2016" />');
        });

        describe("initialize()", function () {
            beforeEach(function () {
                LiveReport.initialize();
            });

            it("Site.initialize() should be called", function () {
                expect(Site.initialize).toHaveBeenCalled();
            });

            it("DatePicker.initDateRangePicker() should be called", function () {
                expect(DatePicker.initDateRangePicker).toHaveBeenCalled();
            });

            it("MonthPicker.initMonthPicker() should be called", function () {
                expect(MonthPicker.initMonthPicker).toHaveBeenCalled();
            });

            it("Site.addUserGuide(option) should be called", function () {
                expect(Site.addUserGuide).toHaveBeenCalledWith({ resourceName: "LiveReport", title: "LiveReport"});
            });
        });

        describe("when clicking on #switchreport", function () {
            it("Site.redirect() is called with correct url when view on normal mode", function () {
                spyOn(Site, "redirect");
                setFixtures('<a id="switchreport"></a>');
              
                LiveReport.initialize();
                $('#switchreport').click();
                expect(Site.redirect).toHaveBeenCalledWith('LiveReport?isViewedHistory=False');
            });

            it("Site.redirect() is called with correct url when view on history mode", function () {
                spyOn(Site, "redirect");
                setFixtures('<a id="switchreport" data-history-mode="False"></a>');

                LiveReport.initialize();
                $('#switchreport').click();
                expect(Site.redirect).toHaveBeenCalledWith('LiveReport?isViewedHistory=True');
            });
        });

        describe("Export excel", function () {
            var spyEvent;
            beforeEach(function () {
                setFixtures('<a id="exporttoexcel"></a> <input id="IsExportExcel" /> <form id="livereport"></form>');
                spyEvent = spyOnEvent($("#livereport"), 'submit');
                $("#livereport").submit(function () { return false; });
                spyOn($.fn, "val");

                LiveReport.initialize();
                $('#exporttoexcel').click();
            });

            it("'#IsExportExcel' input should be set correct value", function () {
                expect($.fn.val.calls.argsFor(0)).toEqual([true]);
                expect($.fn.val.calls.argsFor(1)).toEqual([false]);
            });

            it("'#livereport' form trigger submit", function () {
                expect(spyEvent).toHaveBeenTriggered();
            });
        });

        describe("submit", function () {
            var spyEvent;
            beforeEach(function () {
                setFixtures('<a id="btnSubmit"></a> <form id="livereport"></form>');
                spyEvent = spyOnEvent($("#livereport"), 'submit');
                $("#livereport").submit(function () { return false; });
                spyOn(Site, "blockUI");

                LiveReport.initialize();
                $('#btnSubmit').click();
            });

            it("Site.blockUI() should be called", function () {
                expect(Site.blockUI).toHaveBeenCalled();
            });

            it("'#livereport' form trigger submit", function () {
                expect(spyEvent).toHaveBeenTriggered();
            });
        });

        describe("viewProductDetail", function () {
            beforeEach(function () {
                jasmine.Ajax.install();
                jasmine.Ajax
                    .stubRequest('LiveReport/Detail')
                    .andReturn({
                        'status': 200,
                        'contentType': 'application/json',
                        'responseText': 'success'
                    });
            });

            afterEach(function () {
                jasmine.Ajax.uninstall();
            });

            it("ajax should be called with correct url and parameters when '.product-detail-link' is clicked", function (done) {
                setFixtures("<div class='product-detail-link'></div>");
                appendSetFixtures("<div id='FromDate' data-original-from='1/1/2016'></div>");
                appendSetFixtures("<div id='ToDate' data-original-to='2/2/2016'></div>");
                LiveReport.initialize();
                
                $('.product-detail-link').click();
                request = jasmine.Ajax.requests.mostRecent();

                setTimeout(done, 10);
                expect(request.url).toBe('LiveReport/Detail');
                expect(request.params).toBe('FromDate=1%2F1%2F2016&ToDate=2%2F2%2F2016&CurrencyName=');
            });

            it("call complete - #ProductCode should has correct value", function () {
                var ajaxOption;
                spyOn($, "ajax").and.callFake(function (option) { ajaxOption = option; });

                setFixtures('<div class="product-detail-link" data-product-code="SB"></div> <input id="ProductCode" />');
                LiveReport.initialize();

                $('.product-detail-link').click();

                ajaxOption.complete({ readyState: 4 });
                var result = $("#ProductCode").val();

                expect(result).toBe("SB");
            });

            it("call complete - #detail-content should has correct html content", function () {
                var ajaxOption;
                spyOn($, "ajax").and.callFake(function (option) { ajaxOption = option; });
                var expectedResult = "html content";

                setFixtures('<div class="product-detail-link" data-product-code="SB"></div> <input id="ProductCode" /> <div id="detail-content"></div>');
                LiveReport.initialize();

                $('.product-detail-link').click();

                ajaxOption.complete({ readyState: 4, responseText: expectedResult });
                var result = $("#detail-content").html();

                expect(result).toBe(expectedResult);
            });

            it("call complete - jqXHR.readyState is not equal 4 - #ProductCode and #detail-content should not be updated", function () {
                var ajaxOption;
                spyOn($, "ajax").and.callFake(function (option) { ajaxOption = option; });
                var expectedProductCode = "AB";
                var expectedHtmlContent = "ABC";

                setFixtures('<div class="product-detail-link" data-product-code="SB"></div> <input id="ProductCode" value="AB" /> <div id="detail-content">ABC</div>');
                LiveReport.initialize();

                $('.product-detail-link').click();

                ajaxOption.complete({ readyState: 5, responseText: "html content" });
                var productCode = $("#ProductCode").val();
                var detailContent = $("#detail-content").html();

                expect(productCode).toBe(expectedProductCode);
                expect(detailContent).toBe(expectedHtmlContent);
            });
        });

        describe("view sport detail", function () {
            beforeEach(function () {
                setFixtures('<input id="ProductCode" value="AG"/>');
                spyOn(Helper, "getMatchListProductOption").and.returnValue(["AG"]);
                spyOn(Site, "setProductOptionParam").and.callThrough();
            });

            it("Site.redirect() is called with correct url when clicking on sportid = 1", function () {
                spyOn(Site, "redirect");
                appendSetFixtures("<a class='sport-detailt-link' data-drill-down='{\"SportId\":1}'></a>");
                LiveReport.initialize();
                $('.sport-detailt-link').click();
                var urlPattern = /LiveReport\/MatchList\?currencyname=\&sportid=1\&productcode=AG\&productcodelist=AG/i;

                expect(Site.redirect).toHaveBeenCalledWith(jasmine.stringMatching(urlPattern));
            });

            it("Site.redirect() is called with correct url when clicking on sportid = 161", function () {
                spyOn(Site, "redirect");
                spyOn(Helper, "setSumParams").and.callFake(function (url) {
                    return url;
                });
                appendSetFixtures("<a class='sport-detailt-link' data-drill-down='{\"SportId\":161}'></a>");
                LiveReport.initialize();
                $('.sport-detailt-link').click();
                var urlPattern = /LiveReportBetList\/NumberGame\?sporttype=161\&currencyname=\&productcodelist=AG/i;

                expect(Site.redirect).toHaveBeenCalledWith(jasmine.stringMatching(urlPattern));
            });
        });
    });
});