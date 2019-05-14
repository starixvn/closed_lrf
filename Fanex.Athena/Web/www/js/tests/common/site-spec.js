define(['jquery', "common/popup", 'common/site', 'components/selectlist'], function ($, Popup, Site) {
    describe("Site", function () {
        function transformQueryParamNameToLowerCase(url) {
            var paramNameRegex = /[&|?][^=]*/g;

            return url.replace(paramNameRegex, function (match) {
                return match.toLowerCase();
            });
        }

        describe("asNull(text)", function () {
            it("return null if the param 'text' is an empty string", function () {
                var result = Site.asNull("");
                expect(result).toBe(null);
            });

            it("return itself if the param 'text' is not empty", function () {
                var result = Site.asNull("test");
                expect(result).toBe("test");
            });

            it("return null if the param 'text' is null", function () {
                var result = Site.asNull(null);
                expect(result).toBe(null);
            });
        });

        describe("blockUI()", function () {
            it("div.block-body and div.loading will be display", function () {
                setFixtures('<div class="block-body" style="display:none"></div>');
                appendSetFixtures('<div class="loading" style="display:none"></div>');
                Site.blockUI();
                var result = $('div.block-body').is(':visible') && $('div.loading').is(':visible');
                expect(result).toBe(true);
            });
        });

        describe("setLicenseeOptionParam(urlOrParams)", function () {
            beforeEach(function () {
                setFixtures('<select id="CurrencyId"><option value="1" /><option value="2" /></select> <input id="BaseCurrency" value="USD" /> <input id="CurrencyName" value="AAA" />');
            });

            it("return an url with query string if 'urlOrParams' is a string", function () {
                var url = "localhost?CurrencyId=1&CurrencyName=&BaseCurrency=USD";
                var expectedUrl = transformQueryParamNameToLowerCase(url);

                var result = Site.setLicenseeOptionParam("localhost");

                expect(result).toBe(expectedUrl);
            });

            it("return an object with query string if 'urlOrParams' is an object", function () {
                var result = Site.setLicenseeOptionParam({});
                expect(result).toEqual({ CurrencyId: '1', CurrencyName: '', BaseCurrency: 'USD' });
            });

            it("url should return correct value when currency name not in option tag", function () {
                $("#CurrencyId").html("");
                var url = "localhost?CurrencyName=AAA&BaseCurrency=USD";
                var expectedUrl = transformQueryParamNameToLowerCase(url);

                var result = Site.setLicenseeOptionParam("localhost");

                expect(result).toBe(expectedUrl);
            });
        });

        describe("setLicenseeOptionOriginalParam(urlOrParams)", function () {
            it("build an url from 'data-original' attributes of html tags", function () {
                setFixtures('<select id="CurrencyId" data-original="2" /> <input id="BaseCurrency" data-original="USD" />');
                var url = "localhost?CurrencyId=2&CurrencyName=&BaseCurrency=USD";
                var expectedUrl = transformQueryParamNameToLowerCase(url);

                var result = Site.setLicenseeOptionOriginalParam("localhost");

                expect(result).toBe(expectedUrl);
            });

            it("url should return correct value when currency name not in option tag", function () {
                setFixtures('<select id="CurrencyId" data-original="2"></select>' +
                    '<input id="CurrencyName" value="AAA" /> <input id="BaseCurrency" data-original="USD" />');
                var url = "localhost?CurrencyId=2&CurrencyName=AAA&BaseCurrency=USD";
                var expectedUrl = transformQueryParamNameToLowerCase(url);

                var result = Site.setLicenseeOptionOriginalParam("localhost");

                expect(result).toBe(expectedUrl);
            });
        });

        describe("updateOriginalLicenseeOption()", function () {
            it("update values of html tags to 'data-original' attributes", function () {
                setFixtures('<input id="CurrencyId" value="1"> <input id="BaseCurrency" value="USD"> <input id="CurrencyName" value="USD">');
                Site.updateOriginalLicenseeOption();

                expect($("#CurrencyId").attr("data-original")).toBe("1");
                expect($("#BaseCurrency").attr("data-original")).toBe("USD");
                expect($("#CurrencyName").attr("data-original")).toBe("USD");
            });
        });

        describe("setProductOptionParam(url, counter, productCode, status)", function () {
            it("build an url with production options", function () {
                var url = "localhost?ProductOptions[1].Code=SB&ProductOptions[1].Name=SB&ProductOptions[1].Status=true";
                var expectedUrl = transformQueryParamNameToLowerCase(url);

                var result = Site.setProductOptionParam("localhost", 1, "SB", true);

                expect(result).toBe(expectedUrl);
            });

            it("build an url with undefined production", function () {
                var url = "localhost?ProductOptions[1].Status=true";
                var expectedUrl = transformQueryParamNameToLowerCase(url);

                var result = Site.setProductOptionParam("localhost", 1, undefined, true);

                expect(result).toBe(expectedUrl);
            });
        });

        describe("asBool()", function () {
            it("convert a string 'TRUE' to true (boolean)", function () {
                var result = Site.asBool("TRUE");
                expect(result).toBe(true);
            });

            it("convert a string '123' to false (boolean)", function () {
                var result = Site.asBool("123");
                expect(result).toBe(false);
            });

            it("convert a number 123 to true (boolean)", function () {
                var result = Site.asBool(123);
                expect(result).toBe(true);
            });

            it("convert an object to true (boolean)", function () {
                var result = Site.asBool({});
                expect(result).toBe(true);
            });

            it("convert null to false (boolean)", function () {
                var result = Site.asBool(null);
                expect(result).toBe(false);
            });
        });

        describe("getSingleResource(enghlishName)", function () {
            describe("resource is exist", function () {
                beforeEach(function () {
                    setFixtures('<input id="PageLanguage" value="en-US" />');
                    window["_language_en_US"] = { "Test": "en-Test" };
                    spyOn($.fn, "selectList");
                });

                it("get correct value from resource", function () {
                    Site.initialize();
                    var result = Site.getSingleResource("Test");
                    expect(result).toEqual("en-Test");
                });

                it("get key value when resource not contain", function () {
                    Site.initialize();
                    var result = Site.getSingleResource("NotContain");
                    expect(result).toEqual("NotContain");
                });

                it("return null when passed param is null", function () {
                    var result = Site.getSingleResource(null);
                    expect(result).toEqual(null);
                });

                it("return undefined when param is not passed", function () {
                    var result = Site.getSingleResource();
                    expect(result).toEqual(undefined);
                });

                it("get correct value from resource when value match with form that is defined", function () {
                    Site.initialize();
                    var result = Site.getSingleResource("@[Test]<br/>@[Commission]");
                    expect(result).toEqual("en-Test<br/>Commission");
                });

                it("get correct value from resource with special character @ and not match with form that is defined", function () {
                    Site.initialize();
                    var result = Site.getSingleResource("@Test<br/>@Commission]");
                    expect(result).toEqual("@Test<br/>@Commission]");
                });
            });
        });

        describe("getResources(arrayText)", function () {
            it("return correct array text", function () {
                setFixtures('<input id="PageLanguage" value="_language_en_US" />');
                window["_language_en_US"] = { "Test1": "en-Test1", "Test2": "en-Test2", "Test3": "en-Test3" };
                spyOn($.fn, "selectList");
                Site.initialize();
                var arrayText = ["Test1", "Test2", "Test3", "Test4"];
                var result = Site.getResources(arrayText);
                expect(result).toEqual(["en-Test1", "en-Test2", "en-Test3", "Test4"]);
            });

            it("return null when passed array is null", function () {
                var result = Site.getResources(null);

                expect(result).toBe(null);
            });

            it("return null when passed value is not array", function () {
                var result = Site.getResources({});

                expect(result).toBe(null);
            });
        });

        describe("isNumber(text)", function () {
            it("return true when pass text is integer", function () {
                var result = Site.isNumber(16);
                expect(result).toBe(true);
            });

            it("return true when pass text is digit string", function () {
                var result = Site.isNumber("20");
                expect(result).toBe(true);
            });

            it("return true when pass text is float", function () {
                var result = Site.isNumber(16.002);
                expect(result).toBe(true);
            });

            it("return false when pass text is not digit", function () {
                var result = Site.isNumber("ABC");
                expect(result).toBe(false);
            });

            it("return false when we don't pass text value", function () {
                var result = Site.isNumber();
                expect(result).toBe(false);
            });
        });

        describe("clone(obj)", function () {
            it("return null when passed param is null", function () {
                var result = Site.clone(null);
                expect(result).toBe(null);
            });

            it("return itself when passed param is not object type", function () {
                var result = Site.clone(1);
                expect(result).toBe(1);
            });

            it("return correct date value when passed param is Date type", function () {
                var date = new Date(2017, 0, 1);

                var result = Site.clone(date);

                expect(result).not.toBe(date);
                expect(result).toEqual(date);
            });

            it("return correct date value when passed param is Object type", function () {
                var obj = function () {
                    this["prop"] = "prop";
                };
                obj.prototype = { "prop2": "" };
                var clonedObj = new obj();
                var expectedObj = {
                    prop: "prop"
                };

                var result = Site.clone(clonedObj);

                expect(result).not.toBe(clonedObj);
                expect(result).toEqual(expectedObj);
            });
        });

        describe("currencyConstraint(userChange)", function () {
            beforeEach(function () {
                setFixtures('<select id="CurrencyId"><option value="0">All</option><option value="1" selected>USD</option><option value="2">ABC</option></select>' +
                    '<select id="BaseCurrency"><option value="">All</option><option value="usd" selected>USD</option><option value="eur" selected>EUR</option></select>' +
                    '<input id="CurrencyName" />'
                    );

                spyOn($.fn, "selectList");
            });

            it("#CurrencyName should has correct value", function () {
                Site.currencyConstraint(true);
                var result = $("#CurrencyName").val();

                expect(result).toBe("USD");
            });

            it("option 'All' in BaseCurrency should be removed", function () {
                Site.currencyConstraint(true);
                var result = $("#BaseCurrency option[value='']").length;

                expect(result).toBe(0);
            });

            it("#BaseCurrency should has correct value when userChange and currency not equal 0", function () {
                $("#BaseCurrency").val("eur");
                Site.currencyConstraint(true);
                var result = $("#BaseCurrency").val();

                expect(result).toBe("usd");
            });

            it("#BaseCurrency should has correct value when it's not userChange", function () {
                $("#BaseCurrency").val("eur");
                Site.currencyConstraint(false);
                var result = $("#BaseCurrency").val();

                expect(result).toBe("eur");
            });

            it("#BaseCurrency should has correct value when appending value which not in base currency", function () {
                $("#CurrencyId").val("2");
                $("#BaseCurrency option[value='']").remove();
                Site.currencyConstraint(true);
                var result = $("#BaseCurrency option[value='']").text();

                expect(result).toBe("ABC");
            });

            it("#BaseCurrency should has correct value when selected currency is not base currency", function () {
                $("#CurrencyId").val("2");
                Site.currencyConstraint(true);
                var result = $("#BaseCurrency option[value='']").text();

                expect(result).toBe("ABC");
            });

            it("#BaseCurrency should has correct value when selected currency in base currency dictionary", function () {
                $("#CurrencyId").append('<option value="-1"></option>');
                $("#CurrencyId").val("-1");
                Site.currencyConstraint(true);
                var result = $("#BaseCurrency").val();

                expect(result).toBe("eur");
            });

            it("#BaseCurrency should has correct value when selected currency is not in base currency dictionary", function () {
                $("#CurrencyId").append('<option value="-1"></option>');
                $("#CurrencyId").val("2");
                Site.currencyConstraint(true);
                var result = $("#BaseCurrency").val();

                expect(result).toBe("");
            });

            it("selectList function of jquery should be called", function () {
                Site.currencyConstraint(true);

                expect($.fn.selectList).toHaveBeenCalled();
            });
        });

        describe("setDateRangeOriginalParam(url)", function () {
            it("url should return correct value", function () {
                setFixtures('<input id="FromDate" data-original="1/1/2017" /> <input id="ToDate" data-original="4/13/2017" />');
                var url = "localhosttest";
                var result = "localhosttest?FromDate=1/1/2017&ToDate=4/13/2017";
                var expectedResult = transformQueryParamNameToLowerCase(result);

                var result = Site.setDateRangeOriginalParam(url);

                expect(result).toBe(expectedResult);
            });
        });

        describe("setDateRangeParam(url)", function () {
            it("url should return correct value", function () {
                setFixtures('<input id="FromDate" value="1/1/2017" /> <input id="ToDate" value="4/13/2017" />');
                var url = "localhosttest";
                var result = "localhosttest?FromDate=1/1/2017&ToDate=4/13/2017";
                var expectedResult = transformQueryParamNameToLowerCase(result);

                var result = Site.setDateRangeParam(url);

                expect(result).toBe(expectedResult);
            });
        });

        describe("setProductOptionOriginalParamList(urlOrParams)", function () {
            beforeEach(function () {
                setFixtures('<ul id="ProductList">' +
                    '<li class="childCheckbox" data-product-code="SB" data-original="true"></li><li class="childCheckbox" data-product-code=""></li>' +
                    '</ul>');
            });

            it("param is query string - url should return correct value", function () {
                var host = "localhosttest";
                var url = "localhosttest?ProductCodeList=SB";
                var expectedUrl = transformQueryParamNameToLowerCase(url);

                var result = Site.setProductOptionOriginalParamList(host);

                expect(result).toBe(expectedUrl);
            });

            it("param is object - url should return correct value", function () {
                var param = {};
                var expectedParam = {
                    ProductCodeList: "SB"
                };

                var result = Site.setProductOptionOriginalParamList(param);

                expect(result).toEqual(expectedParam);
            });
        });

        describe("setProductOptionParamList(urlOrParams)", function () {
            beforeEach(function () {
                setFixtures('<div id="ProductList">' +
                    '<input type="checkbox" checked class="childCheckbox" data-product-code="SB" /><input type="checkbox" checked class="childCheckbox" data-product-code="" />' +
                    '</div>');
            });

            it("param is query string - url should return correct value", function () {
                var host = "localhosttest";
                var url = "localhosttest?ProductOptions[0].Code=SB&ProductOptions[0].Name=SB&ProductOptions[0].Status=true";
                var expectedUrl = transformQueryParamNameToLowerCase(url);

                var result = Site.setProductOptionParamList(host);

                expect(result).toBe(expectedUrl);
            });

            it("param is object - url should return correct value", function () {
                var param = { ProductOptions: [] };
                var productOption = [{ Code: "SB", Name: "SB", Status: true }];
                var expectedParam = {
                    ProductOptions: productOption
                };

                var result = Site.setProductOptionParamList(param);

                expect(result).toEqual(expectedParam);
            });
        });

        describe("addUserGuide(options)", function () {
            beforeEach(function () {
                setFixtures('<div id="UserGuide"></div> <div id="UserGuidePopup"></div>' +
                    '<input id="RootUrl" value="/" />'
                    );
                Site.initialize();
            });

            it("url should be correct when clicking to show User Guide button", function () {
                var url, callback;
                spyOn($.fn, "load").and.callFake(function (param1, param2) { url = param1, callback = param2; });
                Site.addUserGuide({ resourceName: "AAA" });

                $("#UserGuide").click();
                var result = /\/UserGuide\/Index\?resourcename=AAA.*/g.test(url);

                expect(result).toBe(true);
            });

            it("Popup.openPopup should be called with correct parameter when clicking to show User Guide button and status is success", function () {
                var url, callback;
                var $userGuidePopup, option;
                spyOn($.fn, "load").and.callFake(function (param1, param2) { url = param1, callback = param2; });
                Site.addUserGuide({ resourceName: "AAA" });

                $("#UserGuide").click();
                spyOn(Popup, "openPopup").and.callFake(function (param1, param2) { $userGuidePopup = param1[0].outerHTML, option = param2; });
                jasmine.clock().install();
                callback("test", "success");
                jasmine.clock().tick(51);
                jasmine.clock().uninstall();

                var expectedElement = '<div style="display: none;"></div>';
                var expectedOption = {
                    buttonSelector: "#UserGuide",
                    id: "UserGuidePopup",
                    resourceName: 'AAA',
                    title: ''
                };

                expect(Popup.openPopup).toHaveBeenCalled();
                expect($userGuidePopup).toBe(expectedElement);
                expect(option).toEqual(expectedOption);
            });

            it("Popup.openPopup should be called one time when clicking to show User Guide button and status is not success", function () {
                var url, callback;
                spyOn($.fn, "load").and.callFake(function (param1, param2) { url = param1, callback = param2; });
                Site.addUserGuide({ resourceName: "AAA" });

                $("#UserGuide").click();
                $("#UserGuide").click();
                spyOn(Popup, "openPopup");
                jasmine.clock().install();
                callback("test", "success");
                jasmine.clock().tick(51);
                callback("test", "fail");
                jasmine.clock().tick(51);
                jasmine.clock().uninstall();

                expect(Popup.openPopup.calls.count()).toBe(1);
            });

            it(".flatPopup should be called with correct parameter when $popup is exist", function () {
                var url, callback;
                spyOn($.fn, "load").and.callFake(function (param1, param2) { url = param1, callback = param2; });
                Site.addUserGuide({ resourceName: "AAA" });

                $("#UserGuide").click();
                spyOn(Popup, "openPopup");
                jasmine.clock().install();
                callback("test", "success");
                jasmine.clock().tick(51);
                jasmine.clock().uninstall();

                spyOn($.fn, "flatPopup");
                $("#UserGuide").click();
                expect($.fn.flatPopup).toHaveBeenCalledWith("show");
            });
        });

        describe("getHistoryDate()", function () {
            it("return correct value", function () {
                setFixtures('<input id="HistoryDate" value="4/14/2017" />');
                var expectedResult = new Date(2017, 3, 14);
                Site.initialize();

                var result = Site.getHistoryDate();

                expect(result).toEqual(expectedResult);
            });
        });

        describe("initEvent()", function () {
            var ajaxOption;
            beforeEach(function () {
                setFixtures('<input name="__RequestVerificationToken" value="ABC" /> <input id="PageLanguage" value="en-US" />');
                window["_language_en_US"] = { "Test": "en-Test" };
                spyOn($, "ajaxSetup").and.callFake(function (option) { ajaxOption = option; });
            });

            it("#CurrencyName should has correct value", function () {
                appendSetFixtures('<select id="CurrencyId"><option value="0">All</option><option value="1" selected>USD</option><option value="2">ABC</option></select>' +
                    '<select id="BaseCurrency"><option value="">All</option><option value="usd" selected>USD</option><option value="eur" selected>EUR</option></select>' +
                    '<input id="CurrencyName" />'
                    );

                Site.initialize();
                $("#CurrencyId").change();
                var result = $("#CurrencyName").val();

                expect(result).toBe("USD");
            });

            it("ajax options should be correct", function () {
                Site.initialize();

                expect(ajaxOption.cache).toBe(false);
                expect(ajaxOption.headers).toEqual({ '__RequestVerificationToken': "ABC" });
                expect(typeof ajaxOption.statusCode).toBe("object");
            });

            describe("statusCode in ajax option", function () {
                beforeEach(function () {
                    setFixtures('<div class="block-body" style="width: 100px; height: 100px;"></div>');
                    spyOn(window, "alert");
                });

                afterEach(function () {
                    $(".block-body").remove();
                });

                it(".block-body should be hidden when calling status 0", function () {
                    ajaxOption.statusCode["0"];

                    var result = $("block-body").is(":visible");

                    expect(result).toBe(false);
                });

                it(".block-body should be hidden and window.alert should be called when calling status 403", function () {
                    ajaxOption.statusCode["403"]();

                    var result = $("block-body").is(":visible");

                    expect(result).toBe(false);
                    expect(window.alert).toHaveBeenCalledWith("HttpError_403");
                });

                it(".block-body should be hidden and window.alert should be called when calling status 500", function () {
                    ajaxOption.statusCode["500"]();

                    var result = $("block-body").is(":visible");

                    expect(result).toBe(false);
                    expect(window.alert).toHaveBeenCalledWith("ErrorProcessingMsg");
                });

                it(".block-body should be hidden and window.alert should be called when calling status 400", function () {
                    ajaxOption.statusCode["400"]();

                    var result = $("block-body").is(":visible");

                    expect(result).toBe(false);
                    expect(window.alert).toHaveBeenCalledWith("InvalidRequestMsg");
                });
            });
        });

        describe("debounce(func, wait, immediate)", function () {
            it("call function immediately", function () {
                var func = jasmine.createSpyObj("func", ["call"]);

                var result = Site.debounce(func.call, 1000, true);
                result();

                expect(func.call).toHaveBeenCalled();
            });

            it("call function with timeout", function () {
                var func = jasmine.createSpyObj("func", ["call"]);

                jasmine.clock().install();

                var result = Site.debounce(func.call, 300, false);
                result();
                jasmine.clock().tick(301);

                expect(func.call).toHaveBeenCalled();
                jasmine.clock().uninstall();
            });

            it("call function with timeout", function () {
                var func = jasmine.createSpyObj("func", ["call"]);

                jasmine.clock().install();

                var result = Site.debounce(func.call, false, false);
                result();
                jasmine.clock().tick(501);

                expect(func.call).toHaveBeenCalled();
                jasmine.clock().uninstall();
            });
        });

        describe("isFakeLicensee()", function () {
            it("returns true if $('#IsFakeLicensee').val() === '1'", function () {
                setFixtures('<input type="hidden" id="IsFakeLicensee" value="1">');

                var result = Site.isFakeLicensee();

                expect(result).toBe(true);
            });

            it("returns value form private variable", function () {
                var result = Site.isFakeLicensee();

                expect(result).toBe(true);
            });
        });
    });
});