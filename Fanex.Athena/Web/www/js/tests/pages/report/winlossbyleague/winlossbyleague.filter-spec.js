define(["jquery", "common/site", "components/pluginhelper/monthpicker", "components/pluginhelper/multiselect", "pages/report/winlossbyleague/winlossbyleague.filter"],
    function ($, Site, MonthPicker, MultiSelect, WinlossByLeagueFilter) {
        describe("WinlossByLeagueFilter", function () {
            beforeAll(function () {
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                    return url;
                });
                spyOn(MultiSelect, "initProductList");
                spyOn(MonthPicker, "initMonthPicker");
            });

            describe("initialize()", function () {
                beforeAll(function () {
                    spyOn(WinlossByLeagueFilter, "initEvent");

                    WinlossByLeagueFilter.initialize();
                });

                it("should be initialized controls of page", function () {
                    expect(MultiSelect.initProductList).toHaveBeenCalled();
                    expect(MonthPicker.initMonthPicker).toHaveBeenCalled();
                });

                it("initEvent should be called", function () {
                    expect(WinlossByLeagueFilter.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                it("loadMatches should be called if League is changed", function () {
                    spyOn(WinlossByLeagueFilter, "loadMatches");
                    setFixtures('<select class="select hide" id="League"></select>');

                    WinlossByLeagueFilter.initEvent();
                    $("#League").change();

                    expect(WinlossByLeagueFilter.loadMatches).toHaveBeenCalledWith(true);
                });

                it("loadLeagues should be called if Sport is changed", function () {
                    spyOn(WinlossByLeagueFilter, "loadLeagues");
                    appendSetFixtures('<select class="select hide" id="Sport"></select>');
                    appendSetFixtures('<select class="select hide" id="CurrencyId"></select>');

                    WinlossByLeagueFilter.initEvent();
                    $("#Sport").change();

                    expect(WinlossByLeagueFilter.loadLeagues).toHaveBeenCalled();
                });

                it("loadLeagues should be called if CurrencyId is changed", function () {
                    spyOn(WinlossByLeagueFilter, "loadLeagues");
                    appendSetFixtures('<select class="select hide" id="Sport"></select>');
                    appendSetFixtures('<select class="select hide" id="CurrencyId"></select>');

                    WinlossByLeagueFilter.initEvent();
                    $("#CurrencyId").change();

                    expect(WinlossByLeagueFilter.loadLeagues).toHaveBeenCalled();
                });

                it("handleOddInput should be called if inputting in Odds textbox", function () {
                    spyOn(WinlossByLeagueFilter, "handleOddInput");
                    setFixtures('<input type="text" id="Odds">');

                    WinlossByLeagueFilter.initEvent();
                    $("#Odds").keypress();

                    expect(WinlossByLeagueFilter.handleOddInput).toHaveBeenCalled();
                });

                it("SubmitButton is disable if TickerFilter is ticked but product is not valid", function () {
                    setFixtures('<div id="TickerFilter"></div>');
                    $("#TickerFilter").append('<input type="checkbox" id="All" value="All" checked="checked">').append('<input type="checkbox" value="Win">');
                    appendSetFixtures('<button id="SubmitButton"></button>');

                    WinlossByLeagueFilter.initEvent();
                    $("#All").change();

                    expect($("#SubmitButton").prop("disabled")).toEqual(true);
                });

                it("SubmitButton is disable if ProductList is ticked but ticket filter is not valid", function () {
                    setFixtures('<div id="ProductList"></div>');
                    $("#ProductList").append('<input type="checkbox" class="childCheckbox" id="SB" value="SB" checked="checked">').append('<input class="childCheckbox" type="checkbox" value="CO">');
                    appendSetFixtures('<button id="SubmitButton"></button>');

                    WinlossByLeagueFilter.initEvent();
                    $("#SB").change();

                    expect($("#SubmitButton").prop("disabled")).toEqual(true);
                });

                it("SubmitButton is enable if ProductList and ticket filter are valid", function () {
                    setFixtures('<div id="ProductList"></div>');
                    $("#ProductList").append('<input type="checkbox" class="childCheckbox" id="SB" value="SB" checked="checked">').append('<input class="childCheckbox" type="checkbox" value="CO">');
                    appendSetFixtures('<div id="TickerFilter"></div>');
                    $("#TickerFilter").append('<input type="checkbox" id="AllTicket" value="AllTicket" checked="checked">').append('<input type="checkbox" value="Win" checked="checked">');
                    appendSetFixtures('<button id="SubmitButton" disabled="disabled"></button>');

                    WinlossByLeagueFilter.initEvent();
                    $("#AllTicket").change();

                    expect($("#SubmitButton").prop("disabled")).toEqual(false);
                });
            });

            describe("handleOddInput(event)", function () {
                it("event.preventDefault should be called if key in Odds text box is not number", function () {
                    var event = jasmine.createSpyObj("event", ["preventDefault"]);
                    event.which = 97;

                    WinlossByLeagueFilter.handleOddInput(event);

                    expect(event.preventDefault).toHaveBeenCalled();
                });

                it("event.preventDefault should be called if key in Odds text box is not control keys", function () {
                    var event = jasmine.createSpyObj("event", ["preventDefault"]);
                    event.which = 58;

                    WinlossByLeagueFilter.handleOddInput(event);

                    expect(event.preventDefault).toHaveBeenCalled();
                });

                it("event.preventDefault should not be called if key in Odds text box is valid", function () {
                    var event = jasmine.createSpyObj("event", ["preventDefault"]);
                    event.which = 8;

                    WinlossByLeagueFilter.handleOddInput(event);

                    expect(event.preventDefault).not.toHaveBeenCalled();
                });
            });

            describe("loadLeagues()", function () {
                beforeEach(function () {
                    jasmine.Ajax.install();

                    spyOn(MonthPicker, "getFromDateString").and.returnValue("01/06/2017");
                    spyOn(MonthPicker, "getToDateString").and.returnValue("30/06/2017");
                    spyOn(Site, "blockUI");
                });

                afterEach(function () {
                    jasmine.Ajax.uninstall();
                });

                it("SubmitButton should be disabled", function () {
                    setFixtures('<button id="SubmitButton" disabled="disabled"></button>');
                    jasmine.Ajax.stubRequest("WinLossByLeagueReport/GetLeaguesBySport");

                    WinlossByLeagueFilter.loadLeagues();

                    expect($("#SubmitButton").prop("disabled")).toEqual(true);
                });

                it("League html should be emty", function () {
                    setFixtures('<select id="League">' +
                        '<option value="8">FRANCE LIGUE 1</option> ' +
                        '<option value="10">INTERNATIONAL FRIENDLY</option></select>');
                    jasmine.Ajax.stubRequest("WinLossByLeagueReport/GetLeaguesBySport");

                    WinlossByLeagueFilter.loadLeagues();

                    expect($("#League").html()).toEqual("");
                });

                it("loadMatches should be called when calling ajax successfully", function () {
                    spyOn(WinlossByLeagueFilter, "loadMatches");
                    spyOn($.fn, "selectList");
                    jasmine.Ajax
                            .stubRequest("WinLossByLeagueReport/GetLeaguesBySport")
                            .andReturn({
                                responseText: JSON.stringify([])
                            });

                    WinlossByLeagueFilter.loadLeagues();

                    expect(WinlossByLeagueFilter.loadMatches).toHaveBeenCalled();
                });

                it("renderHtmlOption should be called when calling ajax successfully if data is not empty", function () {
                    spyOn(WinlossByLeagueFilter, "loadMatches");
                    spyOn(WinlossByLeagueFilter, "renderHtmlOption").and.callFake(function (key, value) {
                        return key + value;
                    });
                    spyOn($.fn, "selectList");
                    setFixtures('<div id="League"></div>');
                    var data = [{ Key: "key1", Value: "value1" }, { Key: "key2", Value: "value2" }, { Key: "key3", Value: "value3" }];
                    jasmine.Ajax
                            .stubRequest("WinLossByLeagueReport/GetLeaguesBySport")
                            .andReturn({
                                responseText: JSON.stringify(data)
                            });

                    WinlossByLeagueFilter.loadLeagues();

                    expect(WinlossByLeagueFilter.renderHtmlOption).toHaveBeenCalled();
                    expect($("#League").html()).toEqual("key1value1key2value2key3value3");
                });
            });

            describe("loadMatches(isBlockUI)", function () {
                beforeEach(function () {
                    jasmine.Ajax.install();

                    spyOn(MonthPicker, "getFromDateString").and.returnValue("01/06/2017");
                    spyOn(MonthPicker, "getToDateString").and.returnValue("30/06/2017");
                    spyOn(Site, "blockUI");
                    spyOn($.fn, "selectList");
                });

                afterEach(function () {
                    jasmine.Ajax.uninstall();
                });

                it("Site.blockUI should not be called if isBlockUI is false", function () {
                    jasmine.Ajax.stubRequest("WinLossByLeagueReport/GetMatchesByLeague");

                    WinlossByLeagueFilter.loadMatches(false);

                    expect(Site.blockUI).not.toHaveBeenCalled();
                });

                it("SubmitButton should be disabled", function () {
                    setFixtures('<button id="SubmitButton" disabled="disabled"></button>');
                    jasmine.Ajax.stubRequest("WinLossByLeagueReport/GetMatchesByLeague");

                    WinlossByLeagueFilter.loadMatches(false);

                    expect($("#SubmitButton").prop("disabled")).toEqual(true);
                });

                it("Match html should be emty", function () {
                    setFixtures('<select id="Match">' +
                        '<option value="1">Soccer</option> ' +
                        '<option value="2">Basketball</option></select>');
                    jasmine.Ajax.stubRequest("WinLossByLeagueReport/GetMatchesByLeague");

                    WinlossByLeagueFilter.loadMatches(true);

                    expect($("#Match").html()).toEqual("");
                });

                it("ajax should not be called if league is not selected any item", function () {
                    setFixtures('<select id="Match">' +
                        '<option value="1">Soccer</option> ' +
                        '<option value="2">Basketball</option></select>');
                    appendSetFixtures('<select id="League"></select>');
                    $("#League").val("");
                    var data = [{ Key: "key1", Value: "value1" }, { Key: "key2", Value: "value2" }, { Key: "key3", Value: "value3" }];
                    jasmine.Ajax.stubRequest("WinLossByLeagueReport/GetMatchesByLeague").andReturn({
                        responseText: JSON.stringify(data)
                    });
                    spyOn(Site, "unBlockUI");
                    spyOn(WinlossByLeagueFilter, "renderHtmlOption");

                    WinlossByLeagueFilter.loadMatches(true);

                    expect(WinlossByLeagueFilter.renderHtmlOption).not.toHaveBeenCalled();
                });

                it("renderHtmlOption should not be called when calling ajax successfully if returned data is empty", function () {
                    setFixtures('<div id="Match"></div>');
                    appendSetFixtures('<button id="SubmitButton" disabled="disabled"></button>');
                    appendSetFixtures('<select id="League">' +
                        '<option value="8">FRANCE LIGUE 1</option> ' +
                        '<option value="10">INTERNATIONAL FRIENDLY</option></select>');
                    $("#League").val("10");
                    jasmine.Ajax.stubRequest("WinLossByLeagueReport/GetMatchesByLeague").andReturn({
                        responseText: JSON.stringify([])
                    });
                    spyOn(Site, "unBlockUI");
                    spyOn(WinlossByLeagueFilter, "renderHtmlOption");

                    WinlossByLeagueFilter.loadMatches(true);

                    expect(WinlossByLeagueFilter.renderHtmlOption).not.toHaveBeenCalled();
                    expect($("#SubmitButton").prop("disabled")).toEqual(true);
                });

                it("renderHtmlOption should be called when calling ajax successfully", function () {
                    setFixtures('<div id="Match"></div>');
                    appendSetFixtures('<button id="SubmitButton" disabled="disabled"></button>');
                    appendSetFixtures('<select id="League">' +
                        '<option value="8">FRANCE LIGUE 1</option> ' +
                        '<option value="10">INTERNATIONAL FRIENDLY</option></select>');
                    $("#League").val("10");
                    var data = [{ Key: "key1", Value: "value1" }, { Key: "key2", Value: "value2" }, { Key: "key3", Value: "value3" }];
                    jasmine.Ajax.stubRequest("WinLossByLeagueReport/GetMatchesByLeague").andReturn({
                        responseText: JSON.stringify(data)
                    });
                    spyOn(Site, "unBlockUI");
                    spyOn(WinlossByLeagueFilter, "renderHtmlOption").and.callFake(function (key, value) {
                        return key + value;
                    });

                    WinlossByLeagueFilter.loadMatches(true);

                    expect(WinlossByLeagueFilter.renderHtmlOption).toHaveBeenCalled();
                    expect($("#Match").html()).toEqual("key1value1key2value2key3value3");
                    expect($("#SubmitButton").prop("disabled")).toEqual(false);
                });
            });

            describe("renderHtmlOption(key, value)", function () {
                it("return string is formatted correctly", function () {
                    var expectedFormat = '<option value="1">Value</option>';

                    var result = WinlossByLeagueFilter.renderHtmlOption(1, "Value");

                    expect(result).toEqual(expectedFormat);
                });
            });

            describe("isValid()", function () {
                it("return false if no product item is checked", function () {
                    setFixtures('<div id="ProductList"></div>');
                    $("#ProductList").append('<input type="checkbox" class="childCheckbox" id="SB" value="SB">').append('<input class="childCheckbox" type="checkbox" value="CO">');
                    appendSetFixtures('<div id="TickerFilter"></div>');
                    $("#TickerFilter").append('<input type="checkbox" id="AllTicket" value="AllTicket">').append('<input type="checkbox" value="Win" checked="checked">');

                    var result = WinlossByLeagueFilter.isValid();

                    expect(result).toEqual(false);
                });

                it("return false if no ticket filter item is checked", function () {
                    setFixtures('<div id="ProductList"></div>');
                    $("#ProductList").append('<input type="checkbox" class="childCheckbox" id="SB" value="SB" checked="checked">').append('<input class="childCheckbox" type="checkbox" value="CO">');
                    appendSetFixtures('<div id="TickerFilter"></div>');
                    $("#TickerFilter").append('<input type="checkbox" id="AllTicket" value="AllTicket">').append('<input type="checkbox" value="Win">');

                    var result = WinlossByLeagueFilter.isValid();

                    expect(result).toEqual(false);
                });

                it("return false if product list and ticket filter have checked items", function () {
                    setFixtures('<div id="ProductList"></div>');
                    $("#ProductList").append('<input type="checkbox" class="childCheckbox" id="SB" value="SB" checked="checked">').append('<input class="childCheckbox" type="checkbox" value="CO">');
                    appendSetFixtures('<div id="TickerFilter"></div>');
                    $("#TickerFilter").append('<input type="checkbox" id="AllTicket" value="AllTicket">').append('<input type="checkbox" value="Win" checked="checked">');
                    appendSetFixtures('<input type="textbox" id="Odds" value="1">');

                    var result = WinlossByLeagueFilter.isValid();

                    expect(result).toEqual(true);
                });

                it("Odds value will be 0 if the current value is not a positive number", function () {
                    setFixtures('<div id="ProductList"></div>');
                    $("#ProductList").append('<input type="checkbox" class="childCheckbox" id="SB" value="SB" checked="checked">').append('<input class="childCheckbox" type="checkbox" value="CO">');
                    appendSetFixtures('<div id="TickerFilter"></div>');
                    $("#TickerFilter").append('<input type="checkbox" id="AllTicket" value="AllTicket">').append('<input type="checkbox" value="Win" checked="checked">');
                    appendSetFixtures('<input type="textbox" id="Odds" value="">');

                    var result = WinlossByLeagueFilter.isValid();

                    expect(result).toEqual(true);
                    expect($("#Odds").val()).toEqual("0");
                });
            });

            describe("buildProductsParams(paramObject, postData)", function () {
                beforeAll(function () {
                    spyOn(WinlossByLeagueFilter, "initEvent");
                });

                it("when call with paramObject is empty - paramObject should be correct", function () {
                    var htmlCheckBoxList = '<input type="checkbox" class="childCheckbox">';
                    setFixtures('<div id="ProductList">' + htmlCheckBoxList + '</div>');
                    WinlossByLeagueFilter.initialize();

                    var paramObject = {};
                    var postData = {
                        "ProductOptions[0].Code": 1,
                        "ProductOptions[0].Name": "SB",
                        "ProductOptions[0].Status": true
                    }

                    WinlossByLeagueFilter.buildProductsParams(paramObject, postData);

                    expect(paramObject).toEqual(postData);
                });

                it("when call with paramObject is not empty - paramObject should be correct", function () {
                    var htmlCheckBoxList = '<input type="checkbox" class="childCheckbox">';
                    setFixtures('<div id="ProductList">' + htmlCheckBoxList + '</div>');
                    WinlossByLeagueFilter.initialize();

                    var paramObject = {
                        Id: 1,
                        Name: "Test",
                        "ProductOptions[0].Code": 0,
                        "ProductOptions[0].Name": "CB",
                        "ProductOptions[0].Status": false
                    };
                    var postData = {
                        "ProductOptions[0].Code": 1,
                        "ProductOptions[0].Name": "SB",
                        "ProductOptions[0].Status": true
                    }

                    var expectedResult = {
                        Id: 1,
                        Name: "Test",
                        "ProductOptions[0].Code": 1,
                        "ProductOptions[0].Name": "SB",
                        "ProductOptions[0].Status": true
                    };

                    WinlossByLeagueFilter.buildProductsParams(paramObject, postData);

                    expect(paramObject).toEqual(expectedResult);
                });
            });

            describe("buildProductCodeList(postData)", function () {
                beforeAll(function () {
                    spyOn(WinlossByLeagueFilter, "initEvent");
                });

                it("when call - return correct value", function () {
                    var htmlCheckBoxList = '<input type="checkbox" class="childCheckbox"><input type="checkbox" class="childCheckbox"><input type="checkbox" class="childCheckbox">';
                    setFixtures('<div id="ProductList">' + htmlCheckBoxList + '</div>');
                    WinlossByLeagueFilter.initialize();

                    var postData = {
                        "ProductOptions[0].Code": "SB",
                        "ProductOptions[0].Status": "true",
                        "ProductOptions[1].Code": "RB",
                        "ProductOptions[1].Status": "true",
                        "ProductOptions[2].Code": "CO",
                        "ProductOptions[2].Status": "false"
                    }

                    var expectedResult = ["SB", "RB"];

                    var result = WinlossByLeagueFilter.buildProductCodeList(postData);

                    expect(result).toEqual(expectedResult);
                });
            });
        });
    });