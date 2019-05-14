define(['jquery', 'common/site', 'components/refreshcountdown', 'common/popup', 'pages/forecast/forecast.ah'],
    function ($, Site, RefreshCountDown, Popup, ForecastAh) {
        describe("ForecastAh", function () {
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
                it("initEvent() should be called.", function () {
                    spyOn(ForecastAh, "initEvent");
                    spyOn(ForecastAh, "resizePopup");

                    ForecastAh.initialize();

                    expect(ForecastAh.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                it("loadForecast() should be called with correct params when .forecast-link is clicked.", function () {
                    setFixtures('<div id="reportContent"><span class="forecast-link" data-bettype="123" data-current-score="456"></span></div>');
                    spyOn(ForecastAh, "loadForecast");

                    ForecastAh.initEvent();
                    $(".forecast-link").click();

                    expect(ForecastAh.loadForecast).toHaveBeenCalledWith(456, 123);
                });

                it("loadForecast() should be called with correct params when .view-forecast-link is clicked.", function () {
                    setFixtures('<div id="reportContent"><span class="view-forecast-link" data-bettype="123"></span></div>');
                    spyOn(ForecastAh, "loadForecast");

                    ForecastAh.initEvent();
                    $(".view-forecast-link").click();

                    expect(ForecastAh.loadForecast).toHaveBeenCalledWith(null, 123);
                });

                it("viewBetlist() should be called with correct params when .view-betlist is clicked.", function () {
                    setFixtures('<div id="reportContent"><span class="view-betlist" data-bettype="123"></span></div>');
                    spyOn(ForecastAh, "viewBetlist");

                    ForecastAh.initEvent();
                    $(".view-betlist").click();

                    expect(ForecastAh.viewBetlist).toHaveBeenCalledWith(123);
                });

                it("viewBetlist() should be called when #txtCurrentscore raises event keyup with keyCode = 13.", function () {
                    setFixtures('<div id="reportContent"><input id="txtCurrentscore"></input></div>');
                    appendSetFixtures('<input id="btnCurrentscore" />');

                    var spyEvent = spyOnEvent($('#btnCurrentscore'), 'click');

                    ForecastAh.initEvent();
                    var e = $.Event('keyup');
                    e.keyCode = 13;
                    $("#txtCurrentscore").trigger(e);

                    expect(spyEvent).toHaveBeenTriggered();
                });

                it("viewBetlist() should not be called when #txtCurrentscore raises event keyup with keyCode <> 13.", function () {
                    setFixtures('<div id="reportContent"><input id="txtCurrentscore"></input></div>');
                    appendSetFixtures('<input id="btnCurrentscore" />');

                    var spyEvent = spyOnEvent($('#btnCurrentscore'), 'click');

                    ForecastAh.initEvent();
                    var e = $.Event('keyup');
                    e.keyCode = 12;
                    
                    $("#txtCurrentscore").trigger(e);

                    expect(spyEvent).not.toHaveBeenTriggered();
                });

                it("setCurrentScore() should be called when #btnCurrentscore is clicked.", function () {
                    setFixtures('<div id="reportContent"><input id="btnCurrentscore"></input></div>');
                    spyOn(ForecastAh, "setCurrentScore");

                    ForecastAh.initEvent();
                    $("#btnCurrentscore").click();

                    expect(ForecastAh.setCurrentScore).toHaveBeenCalled();
                });
            });

            describe("loadForecast(selectedScore, bettype)", function () {
                var BETTYPE = 2;
                
                beforeEach(function () {
                    setFixtures('<div id="reportContent"></div>');
                    jasmine.Ajax.install();
                });

                afterEach(function () {
                    jasmine.Ajax.uninstall();
                });

                it("#reportContent should have html value returned from ajax.", function (done) {
                    var selectedScore = 1;

                    jasmine.Ajax
                        .stubRequest(/AhForecast\/Index\?matchid=undefined&bettype=2\&currentscore=1/i)
                        .andReturn({
                            'status': 200,
                            'dataType': 'html',
                            'responseText': 'Hello World'
                        });
                    ForecastAh.loadForecast(selectedScore, BETTYPE);

                    setTimeout(done, 10);

                    expect($('#reportContent').html()).toBe("Hello World");
                });

                it("url should be correct", function (done) {
                    var selectedScore = null;

                    jasmine.Ajax
                        .stubRequest(/AhForecast\/Index\?matchid=undefined&bettype=2/i);;
                    ForecastAh.loadForecast(selectedScore, BETTYPE);

                    setTimeout(done, 10);

                    expect(jasmine.Ajax.requests.mostRecent().url).toBe('AhForecast/Index?matchid=undefined&bettype=2');
                });
            });

            describe("viewBetlist(bettype)", function () {
                beforeAll(function () {
                    setFixtures('<div id="hidden-data" data-match-id="1" data-basecurrency="USD" data-currencyid="20" data-currencyname="UUS"></div>');
                    spyOn(ForecastAh, "initEvent");
                    spyOn(ForecastAh, "resizePopup");
                    ForecastAh.initialize();
                });
                it("Popup.updateCurrentPopup() should be called with correct params.", function () {
                    spyOn(Popup, "updateCurrentPopup");
                    var url = "RunningMatchBetList/Index?matchid=1&bettype=123&basecurrency=USD&currencyid=20&currencyname=UUS";
                    var expectedUrl = url.replace(/[&|?][^=]*/g, function (match) {
                        return match.toLowerCase();
                    });
                    spyOn(Math, "min").and.returnValue(200);

                    ForecastAh.viewBetlist(123);

                    expect(Popup.updateCurrentPopup).toHaveBeenCalledWith(expectedUrl,
                        { width: 960, height: 200, title: 'BetList' });
                });
            });

            describe("setCurrentScore()", function () {
                it("loadForecast() should be called with correct params.", function () {
                    setFixtures('<input id="txtCurrentscore" value="1" />');
                    appendSetFixtures('<div id="reportContent"><a class="view-betlist" data-bettype="123" /></div>');
                    spyOn(ForecastAh, "loadForecast");

                    ForecastAh.setCurrentScore();

                    expect(ForecastAh.loadForecast).toHaveBeenCalledWith('1', '123');
                });

                it("loadForecast() should not be called if data is invalid", function () {
                    appendSetFixtures('<div id="reportContent"><a class="view-betlist" data-bettype="123" /></div>');
                    spyOn(ForecastAh, "loadForecast");

                    ForecastAh.setCurrentScore();

                    expect(ForecastAh.loadForecast).not.toHaveBeenCalled();
                });
            });

            describe("resizePopup()", function () {
                it("Popup.updateCurrentPopup should be called with correct params.", function () {
                    spyOn(Popup, "updateCurrentPopup");

                    ForecastAh.resizePopup();

                    expect(Popup.updateCurrentPopup).toHaveBeenCalledWith(null, { width: 700, height: 250, title: "Forecast" });
                });
            });
        });
    });