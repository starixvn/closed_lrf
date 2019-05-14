define(['jquery', 'common/site', 'common/querystring', 'components/refreshcountdown', 'pages/forecast/forecast.newforecasthdpou'],
    function ($, Site, QueryString, RefreshCountDown, NewForecastHdpOu) {
        describe("NewForecastHdpOu", function () {
            beforeAll(function () {
                spyOn(Site, "resolveClientUrl").and.callFake(function (text) {
                    return text;
                });
                spyOn(Site, "getSingleResource").and.callFake(function (text) {
                    return text;
                });
            });

            describe("initialize()", function () {
                beforeEach(function () {
                    spyOn(Site, "initialize");
                    spyOn(Site, "unBlockUI");
                    spyOn(Site, "addUserGuide");
                    spyOn(RefreshCountDown, "initialize");
                    spyOn(RefreshCountDown, "initEvent");
                    spyOn(NewForecastHdpOu, "initEvent");

                    NewForecastHdpOu.initialize();
                });

                it("Site.initialize() should be called", function () {
                    expect(Site.initialize).toHaveBeenCalled();
                });
                it("Site.unBlockUI() should be called", function () {
                    expect(Site.unBlockUI).toHaveBeenCalled();
                });
                it("Site.addUserGuide() should be called with correct parameter", function () {
                    expect(Site.addUserGuide).toHaveBeenCalledWith({ resourceName: "ForecastNewHdpOu", title: "Forecast HandicapOverUnderLive" });
                });
                it("RefreshCountDown.initialize() should be called", function () {
                    expect(RefreshCountDown.initialize).toHaveBeenCalled();
                });
                it("NewForecastHdpOu.initEvent() should be called", function () {
                    expect(NewForecastHdpOu.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                it("loadMatchList(leagueId) should be called with correct parameter when '#DdlLeagueId' fired change event", function () {
                    setFixtures('<input id="DdlLeagueId" value="1">');
                    spyOn(NewForecastHdpOu, "loadMatchList");
                    NewForecastHdpOu.initEvent();

                    $("#DdlLeagueId").change();

                    expect(NewForecastHdpOu.loadMatchList).toHaveBeenCalledWith("1");
                });

                it("openBetlist(betChoice, param, betType, handicap) should be called with correct parameters when '.bet-list-link' fire click event", function () {
                    setFixtures('<div id="reportContent"><div class="bet-list-link" data-betchoice="1" data-param="2" data-bettype="3" data-handicap="4"></div></div>');
                    spyOn(NewForecastHdpOu, "openBetlist");
                    NewForecastHdpOu.initEvent();

                    $(".bet-list-link").click();

                    expect(NewForecastHdpOu.openBetlist).toHaveBeenCalledWith(1, 2, 3, 4);
                });

                it("collapseExpand(context) should be called when '.collapsible-header' fire click event", function () {
                    setFixtures('<div id="reportContent"><div class="collapsible-header"></div></div>');
                    spyOn(NewForecastHdpOu, "collapseExpand");
                    NewForecastHdpOu.initEvent();

                    var $header = $(".collapsible-header")[0];
                    $header.click();

                    expect(NewForecastHdpOu.collapseExpand).toHaveBeenCalledWith($header);
                });

                it("submit() should be called when '#SubmitButton' fired change event", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    spyOn(NewForecastHdpOu, "submit");
                    NewForecastHdpOu.initEvent();

                    $("#SubmitButton").click();

                    expect(NewForecastHdpOu.submit).toHaveBeenCalled();
                });
            });

            describe("collapseExpand(context)", function () {
                beforeEach(function () {
                    setFixtures(
                        '<div id="context1" data-status="IsShowFt" data-content-id="1"></div>' +
                        '<div id="context3" data-status="IsShowFh" data-content-id="3"></div>' +
                        '<div id="contentType-1></div>' +
                        '<div id="contentType-3></div>' +
                        '<input id="IsShowFt" />' +
                        '<input id="IsShowFh" />'
                        );
                });

                describe("Element is expanding", function () {
                    beforeEach(function () {
                        $("#context1").addClass("active");
                        $("#context3").addClass("active");
                        spyOn($.fn, "slideUp").and.callFake(function (options) {
                            options.complete();
                        });
                    });

                    it("slideUp function of jquery should be called with correct parameters", function () {
                        var $element = $("#context1");

                        NewForecastHdpOu.collapseExpand($element);

                        expect($.fn.slideUp).toHaveBeenCalled();
                    });

                    it("Element which is passed should be not contain class '.active'", function () {
                        var $element = $("#context1");

                        NewForecastHdpOu.collapseExpand($element);

                        var result = $element.hasClass("active");
                        expect(result).toBe(false);
                    });

                    it("Value of '#IsShowFt' should be false when passed element is '#context1'", function () {
                        var $element = $("#context1");

                        NewForecastHdpOu.collapseExpand($element);

                        var result = $("#IsShowFt").val();

                        expect(result).toBe("false");
                    });

                    it("Value of '#IsShowFh' should be false when passed element is '#context3'", function () {
                        var $element = $("#context3");

                        NewForecastHdpOu.collapseExpand($element);

                        var result = $("#IsShowFh").val();

                        expect(result).toBe("false");
                    });

                });

                describe("Element is collapsing", function () {
                    beforeEach(function () {
                        spyOn($.fn, "slideDown").and.callFake(function (options) {
                            options.complete();
                        });
                    });

                    it("slideUp function of jquery should be called with correct parameters", function () {
                        var $element = $("#context1");

                        NewForecastHdpOu.collapseExpand($element);

                        expect($.fn.slideDown).toHaveBeenCalled();
                    });

                    it("Element which is passed should be contain class '.active'", function () {
                        var $element = $("#context1");

                        NewForecastHdpOu.collapseExpand($element);

                        var result = $element.hasClass("active");
                        expect(result).toBe(true);
                    });

                    it("Value of '#IsShowFt' should be false when passed element is '#context1'", function () {
                        var $element = $("#context1");

                        NewForecastHdpOu.collapseExpand($element);

                        var result = $("#IsShowFt").val();

                        expect(result).toBe("true");
                    });

                    it("Value of '#IsShowFh' should be false when passed element is '#context3'", function () {
                        var $element = $("#context3");

                        NewForecastHdpOu.collapseExpand($element);

                        var result = $("#IsShowFh").val();

                        expect(result).toBe("true");
                    });
                });
            });

            describe("loadMatchList(leagueId)", function () {
                var request;
                beforeEach(function (done) {
                    setFixtures(
                        '<select id="DdlMatchId"></select>' +
                        '<button id="SubmitButton" disabled="disabled"></button>'
                        );

                    jasmine.Ajax.install();
                    jasmine.Ajax
                        .stubRequest(/NewHandicapOverUnderForecast\/GetMatchListByLeague\?leagueid=1/i)
                        .andReturn({
                            'status': 200,
                            'contentType': 'application/json',
                            'responseText': '<option>Test</option>'
                        });

                    NewForecastHdpOu.loadMatchList(1);
                    request = jasmine.Ajax.requests.mostRecent();

                    setTimeout(done, 10);
                });

                afterEach(function () {
                    jasmine.Ajax.uninstall();
                });

                it("ajax request should be called with correct url", function () {
                    var url = "NewHandicapOverUnderForecast/GetMatchListByLeague?LeagueId=1";
                    var expectedUrl = url.replace(/[&|?][^=]*/g, function (match) {
                        return match.toLowerCase();
                    });

                    expect(request.url).toBe(expectedUrl);
                });
                it("'#DdlMatchId' should be contain correct responsed text", function () {
                    var result = $("#DdlMatchId").html();
                    expect(result).toBe("<option>Test</option>");
                });
                it("'#SubmitButton' should not be disable", function () {
                    var result = $("#SubmitButton").prop("disabled");
                    expect(result).toBe(false);
                });
            });

            describe("loadMatchList(leagueId)", function () {
                var request;
                beforeEach(function (done) {
                    setFixtures(
                        '<button id="SubmitButton" disabled="disabled"></button>'
                        );

                    jasmine.Ajax.install();
                    jasmine.Ajax
                        .stubRequest(/NewHandicapOverUnderForecast\/GetMatchListByLeague\?leagueid=1/i)
                        .andReturn({
                            'status': 200,
                            'contentType': 'application/json',
                            'responseText': '<option>Test</option>'
                        });

                    NewForecastHdpOu.loadMatchList(1);
                    request = jasmine.Ajax.requests.mostRecent();

                    setTimeout(done, 10);
                });

                afterEach(function () {
                    jasmine.Ajax.uninstall();
                });

                it("ajax request should be called with correct url", function () {
                    var url = "NewHandicapOverUnderForecast/GetMatchListByLeague?LeagueId=1";
                    var expectedUrl = url.replace(/[&|?][^=]*/g, function (match) {
                        return match.toLowerCase();
                    });

                    expect(request.url).toBe(expectedUrl);
                });

                it("'#SubmitButton' should be disable if matchId is undefined", function () {
                    var result = $("#SubmitButton").prop("disabled");
                    expect(result).toBe(true);
                });
            });

            describe("submit()", function () {
                beforeEach(function () {
                    setFixtures(
                        '<input id="DdlLeagueId" value="2">' +
                        '<input id="DdlMatchId" value="1">' +
                        '<input id="LeagueId">' +
                        '<input id="MatchId">' +
                        '<input id="IsShowFt">' +
                        '<input id="IsShowFh">' +
                        '<form id="NewForecastHdpOuForm"></form>'
                        );

                    spyOn($.fn, "submit");

                    NewForecastHdpOu.submit();
                });

                it("Values should be assign correctly", function () {
                    expect($("#LeagueId").val()).toBe("2");
                    expect($("#MatchId").val()).toBe("1");
                    expect($("#IsShowFt").val()).toBe("true");
                    expect($("#IsShowFh").val()).toBe("true");
                });

                it("submit function of jquery should be called", function () {
                    expect($.fn.submit).toHaveBeenCalled();
                });
            });

            describe("openBetlist(betChoice, param, betType, handicap)", function () {
                it("window.open should be called with correct url", function () {
                    var queryString = "betchoice=1&matchid=11&leagueid=12&currencyid=13&currencyname=14&basecurrency=15&bettype=2&handicap=3";
                    var url = "RunningMatchChoiceBetList/Index?" + queryString;

                    var param = {
                        MatchId: 11,
                        LeagueId: 12,
                        CurrencyId: 13,
                        CurrencyName: 14,
                        BaseCurrency: 15
                    };
                    spyOn(window, "open");

                    NewForecastHdpOu.openBetlist(1, param, 2, 3);

                    expect(window.open.calls.argsFor(0)[0].toLowerCase()).toBe(url.toLowerCase());
                });

                it("handicap is undefined - set to empty string - window.open should be called with correct url", function () {
                    var queryString = "betchoice=1&matchid=11&leagueid=12&currencyid=13&currencyname=14&basecurrency=15&bettype=2&handicap=";
                    var url = "RunningMatchChoiceBetList/Index?" + queryString;

                    var param = {
                        MatchId: 11,
                        LeagueId: 12,
                        CurrencyId: 13,
                        CurrencyName: 14,
                        BaseCurrency: 15
                    };
                    spyOn(window, "open");

                    NewForecastHdpOu.openBetlist(1, param, 2);

                    expect(window.open.calls.argsFor(0)[0].toLowerCase()).toBe(url.toLowerCase());
                });
            });
        });
    });