define(['jquery', 'common/site', 'components/refreshcountdown', 'common/popup', 'pages/forecast/forecast.handicapoverunder'],
    function ($, Site, RefreshCountDown, Popup, ForecastHDPOU) {
        describe("ForecastHDPOU", function () {
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
                    spyOn(ForecastHDPOU, "initEvent");
                    spyOn(Site, "addUserGuide");

                    ForecastHDPOU.initialize();

                    expect(ForecastHDPOU.initEvent).toHaveBeenCalled();
                    expect(Site.addUserGuide).toHaveBeenCalledWith({
                        resourceName: "ForecastHdpOu",
                        title: "Forecast - HandicapOverUnderLive"
                    });
                    expect(RefreshCountDown.initialize).toHaveBeenCalled();
                    expect(RefreshCountDown.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                it("loadSelectedLeague() should be called with correct params when .league-list raises event change.", function () {
                    setFixtures('<input type="text" class="league-list" value="999" />');
                    spyOn(ForecastHDPOU, "loadSelectedLeague");

                    ForecastHDPOU.initEvent();
                    $(".league-list").change();

                    expect(ForecastHDPOU.loadSelectedLeague).toHaveBeenCalled();
                });

                it("openForecast() should be called with correct params when .button-add is clicked.", function () {
                    setFixtures('<div id="reportContent"><span class="button-add" data-match-id="123" data-bettype="456"></span></div>');
                    spyOn(ForecastHDPOU, "openForecast");

                    ForecastHDPOU.initEvent();
                    $(".button-add").click();

                    expect(ForecastHDPOU.openForecast).toHaveBeenCalledWith('123', 456);
                });

                it("submit() should be called when #SubmitButton is clicked.", function () {
                    setFixtures('<input id="SubmitButton" type="button" />');
                    spyOn(ForecastHDPOU, "submit");

                    ForecastHDPOU.initEvent();
                    $("#SubmitButton").click();

                    expect(ForecastHDPOU.submit).toHaveBeenCalled();
                });
            });

            describe("openForecast(matchId, betType)", function () {
                it("Popup.openPopupWithIframe() should be called with correct params.", function () {
                    spyOn(Popup, "openPopupWithIframe");
                    var url = "AhForecast/Index?matchid=123&bettype=456&CurrencyName=";
                    var expectedUrl = url.replace(/[&|?][^=]*/g, function (match) {
                        return match.toLowerCase();
                    });

                    ForecastHDPOU.initialize();

                    ForecastHDPOU.openForecast(123, 456);

                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(expectedUrl,
                        { width: 700, height: 250, title: 'Forecast', id: 'forecast-dialog' });
                });
            });

            describe("loadData(url, data)", function () {
                beforeEach(function (done) {
                    jasmine.Ajax.install();
                    jasmine.Ajax
                        .stubRequest(Site.resolveClientUrl("HandicapOverUnderForecast/Index"))
                        .andReturn({
                            'status': 200,
                            'contentType': 'text/html; charset=utf-8',
                            'responseText': 'WTF'
                        });

                    setTimeout(done, 10);
                });

                afterEach(function () {
                    jasmine.Ajax.uninstall();
                });

                it("#reportContent should be assigned data returned from ajax request.", function () {
                    setFixtures('<div id="reportContent"></div');

                    ForecastHDPOU.loadData(null, {});

                    expect($("#reportContent").html(), "WTF");
                });
            });

            describe("loadSelectedLeague(leagueid)", function () {
                it("loadData() should be called with correct params.", function () {
                    spyOn(ForecastHDPOU, "loadData");

                    ForecastHDPOU.loadSelectedLeague(999);
                    var urlPattern = /HandicapOverUnderForecast\/Index\?currencyname=\&leagueid=999/i;
                    expect(ForecastHDPOU.loadData).toHaveBeenCalledWith(jasmine.stringMatching(urlPattern));
                });
            });

            describe("submit(leagueid)", function () {
                it("loadData() should be called with correct params.", function () {
                    setFixtures('<form id="ForecastHandicapOverUnderForm"></form');
                    spyOn(Site, "updateOriginalLicenseeOption");
                    spyOn(ForecastHDPOU, "loadData");

                    ForecastHDPOU.loadSelectedLeague(999);
                    var urlPattern = /HandicapOverUnderForecast\/Index\?currencyname=\&leagueid=999/i;
                    expect(ForecastHDPOU.loadData).toHaveBeenCalledWith(jasmine.stringMatching(urlPattern));
                });
            });

            describe("resizeGrid", function () {
                beforeEach(function () {
                    setFixtures('<div class="body-content" style="height: 400px"></div>');
                    window.innerHeight = 500;
                    var $grid = $(".body-content");
                    spyOn($.fn, "offset").and.returnValue({ top: 10 });
                });

                it("$grid should has correct height value", function () {
                    var expectedHeight = "400px";

                    ForecastHDPOU.resizeGrid();
                    var result = $(".body-content").css("height");

                    expect(result).toBe(expectedHeight);
                });

                it("$grid should contain class 'hasScroll' when have no vertical scrollbar", function () {
                    spyOn($.fn, "hasVerticalScrollBar").and.returnValue(false);

                    ForecastHDPOU.resizeGrid();
                    var result = $(".body-content").hasClass("hasScroll");

                    expect(result).toBe(true);
                });

                it("$grid should contain class 'hasScroll' when have no vertical scrollbar", function () {
                    spyOn($.fn, "hasVerticalScrollBar").and.returnValue(true);
                    var $grid = $(".body-content");
                    $grid.width(200);
                    $grid.append('<table id="table"></table>');

                    var expectedWidth = 183;

                    ForecastHDPOU.resizeGrid();
                    var result = $("#table").width();

                    expect(result).toBe(expectedWidth);
                });
            });

            describe("submit", function () {
                var data = { Id: 1, Name: "Test" };
                beforeAll(function () {
                    spyOn(Site, "blockUI");
                    spyOn($.fn, "serializeObject").and.returnValue(data);
                    spyOn(Site, "updateOriginalLicenseeOption");
                    spyOn(ForecastHDPOU, "loadData");
                });

                beforeEach(function () {
                    ForecastHDPOU.submit();
                });

                it("Site.blockUI() should be called", function () {
                    expect(Site.blockUI).toHaveBeenCalled();
                });

                it("Site.updateOriginalLicenseeOption() should be called", function () {
                    expect(Site.updateOriginalLicenseeOption).toHaveBeenCalled();
                });

                it("ForecastHDPOU.loadData() should be called with correct parameter", function () {
                    expect(ForecastHDPOU.loadData).toHaveBeenCalledWith(null, data);
                });
            });
        });
    });