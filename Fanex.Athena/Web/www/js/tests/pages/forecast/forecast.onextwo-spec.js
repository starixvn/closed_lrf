define(['jquery', 'common/site', 'components/refreshcountdown', 'common/popup', 'pages/forecast/forecast.onextwo'],
    function ($, Site, RefreshCountDown, Popup, ForecastOneXTwo) {
        describe("ForecastOneXTwo", function () {
            function transformQueryParamNameToLowerCase(url) {
                var paramNameRegex = /[&|?][^=]*/g;

                return url.replace(paramNameRegex, function (match) {
                    return match.toLowerCase();
                });
            }

            beforeAll(function () {
                spyOn(Site, "initialize");
                spyOn(RefreshCountDown, "initialize");
                spyOn(RefreshCountDown, "initEvent");
                spyOn(Site, "resolveClientUrl").and.callFake(function (text) {
                    return text;
                });
                spyOn(Site, "getSingleResource").and.callFake(function (text) {
                    return text;
                });
            });

            describe("initialize()", function () {
                it("Relevant methods should be called.", function () {
                    spyOn(ForecastOneXTwo, "resizePopup");
                    spyOn(ForecastOneXTwo, "initEvent");
                    spyOn(Site, "addUserGuide");

                    ForecastOneXTwo.initialize();

                    expect(ForecastOneXTwo.initEvent).toHaveBeenCalled();
                    expect(Site.addUserGuide).toHaveBeenCalledWith({
                        resourceName: "Forecast1x2",
                        title: "Forecast - OneXTwo"
                    });
                    expect(RefreshCountDown.initialize).toHaveBeenCalled();
                    expect(RefreshCountDown.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                it("submit() should be called with correct params when .league-list raises event change.", function () {
                    setFixtures('<input type="text" class="league-list" value="999" />');
                    spyOn(ForecastOneXTwo, "submit");

                    ForecastOneXTwo.initEvent();
                    $(".league-list").change();

                    expect(ForecastOneXTwo.submit).toHaveBeenCalled();
                });

                it("openForecast() should be called with correct params when .button-add is clicked.", function () {
                    setFixtures('<div id="reportContent"><span class="button-add" data-match-id="123" data-bettype="456"></span></div>');
                    spyOn(ForecastOneXTwo, "openForecast");

                    ForecastOneXTwo.initEvent();
                    $(".button-add").click();

                    expect(ForecastOneXTwo.openForecast).toHaveBeenCalledWith('123', 456);
                });

                it("submit() should be called when #SubmitButton is clicked.", function () {
                    setFixtures('<input id="SubmitButton" type="button" />');
                    spyOn(ForecastOneXTwo, "submit");

                    ForecastOneXTwo.initEvent();
                    $("#SubmitButton").click();

                    expect(ForecastOneXTwo.submit).toHaveBeenCalled();
                });
            });

            describe("openForecast(matchId, betType)", function () {
                it("Popup.updateCurrentPopup() should be called with correct params if it is a popup.", function () {
                    setFixtures('<input type="text" id="IsPopUp" value="true" />');
                    spyOn(Popup, "updateCurrentPopup");
                    var url = "RunningMatchBetList/Index?matchid=123&bettype=456";
                    var expectedUrl = transformQueryParamNameToLowerCase(url);
                    spyOn(Math, "min").and.returnValue(200);

                    ForecastOneXTwo.initialize();

                    ForecastOneXTwo.openForecast(123, 456);

                    expect(Popup.updateCurrentPopup).toHaveBeenCalledWith(expectedUrl,
                        { width: 900, height: 200, title: 'BetList' });
                });

                it("Site.redirect() should be called with correct params if it is not a popup.", function () {
                    spyOn(Site, "redirect");
                    var url = "RunningMatchBetList/Index?CurrencyName=&matchid=123&bettype=456";
                    var expectedUrl = transformQueryParamNameToLowerCase(url);

                    ForecastOneXTwo.initialize();

                    ForecastOneXTwo.openForecast(123, 456);

                    expect(Site.redirect).toHaveBeenCalledWith(expectedUrl);
                });
            });

            describe("getBetListUrl(url, matchId, betType)", function () {
                it("Popup.updateCurrentPopup() should be called with correct params if it is a popup.", function () {
                    setFixtures('<input type="text" id="CurrencyId-Hidden" value="2" /> <input type="text" id="BaseCurrency-Hidden" value="3" />');
                    var url = ForecastOneXTwo.getBetListUrl("localhost", 123, 456);
                    var originUrl = "localhost?CurrencyId=2&BaseCurrency=3&matchid=123&bettype=456";
                    var expectedUrl = transformQueryParamNameToLowerCase(originUrl);

                    expect(url).toBe(expectedUrl);
                });
            });

            describe("submit()", function () {
                it("Form #ForecastOneXTwoForm should be summitted.", function () {
                    setFixtures('<form id="ForecastOneXTwoForm"></form>');
                    $('#ForecastOneXTwoForm').submit(function () { return false; });
                    var spyEvent = spyOnEvent($('#ForecastOneXTwoForm'), 'submit');

                    ForecastOneXTwo.submit();

                    expect(spyEvent).toHaveBeenTriggered();
                });
            });

            describe("resizePopup", function () {
                it("Popup.updateCurrentPopup should be called with correct parameter", function () {
                    spyOn(Popup, "updateCurrentPopup");
                    parent.innerHeight = 500;
                    var title = "Forecast - OneXTwo";

                    ForecastOneXTwo.resizePopup();

                    expect(Popup.updateCurrentPopup).toHaveBeenCalledWith(null, { width: 700, height: 400, title: title });
                });
            });

            describe("resizeGrid", function () {
                beforeEach(function () {
                    setFixtures('<div class="body-content"></div>');
                    window.innerHeight = 500;
                    var $grid = $(".body-content");
                    spyOn($.fn, "offset").and.returnValue({ top: 10 });
                });

                it("$grid should has correct max-height value", function () {
                    var expectedHeight = "462px";

                    ForecastOneXTwo.resizeGrid();
                    var result = $(".body-content").css("max-height");

                    expect(result).toBe(expectedHeight);
                });

                it("$grid should contain class 'hasScroll' when have no vertical scrollbar", function () {
                    spyOn($.fn, "hasVerticalScrollBar").and.returnValue(false);

                    ForecastOneXTwo.resizeGrid();
                    var result = $(".body-content").hasClass("hasScroll");

                    expect(result).toBe(true);
                });

                it("$grid should contain class 'hasScroll' when have no vertical scrollbar", function () {
                    spyOn($.fn, "hasVerticalScrollBar").and.returnValue(true);
                    var $grid = $(".body-content");
                    $grid.width(200);
                    $grid.append('<table id="table"></table>');

                    var expectedWidth = 183;

                    ForecastOneXTwo.resizeGrid();
                    var result = $("#table").width();

                    expect(result).toBe(expectedWidth);
                });
            });
        });
    });