define(['jquery', 'common/site', 'pages/totalbet/totalbetsbase', 'components/refreshcountdown', 'common/popup', 'pages/totalbet/handicapoverunder/handicapoverunder'],
    function ($, Site, Totalbets, RefreshCountDown, Popup, HandicapOU) {
        describe("HandicapOU", function () {
            beforeEach(function () {
                spyOn(Site, "getSingleResource").and.callFake(function (name) { return name; });
            });

            describe("initialize()", function () {
                beforeEach(function () {
                    spyOn(Site, "initialize");
                    spyOn(Site, "addUserGuide");
                    spyOn(Totalbets, "initialize");
                    spyOn(HandicapOU, "initEvent");
                    spyOn(RefreshCountDown, "initEvent");

                    HandicapOU.initialize();
                });

                it("Site.initialize() should be called", function () {
                    expect(Site.initialize).toHaveBeenCalled();
                });
                it("Totalbets.initialize() should be called", function () {
                    expect(Totalbets.initialize).toHaveBeenCalled();
                });
                it("HandicapOU.initEvent() should be called", function () {
                    expect(HandicapOU.initEvent).toHaveBeenCalled();
                });
                it("Site.addUserGuide() should be called with correct parameters", function () {
                    expect(Site.addUserGuide).toHaveBeenCalledWith({ resourceName: "TotalBetsHdpOu", title: "TotalBets - HandicapOverUnderLive" });
                });
                it("RefreshCountDown.initEvent() should be called", function () {
                    expect(RefreshCountDown.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                it("HandicapOU.submit() should be called when '#SubmitButton' fired click event", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    HandicapOU.initEvent();

                    spyOn(HandicapOU, "submit");

                    $("#SubmitButton").click();

                    expect(HandicapOU.submit).toHaveBeenCalled();
                });

                it("HandicapOU.viewForecast(matchId, betType) should be called with correct parameters when '.button-add' fired click event", function () {
                    setFixtures('<div id="reportContent"><div class="button-add" data-match-id="1" data-bet-type="2"></div></div>');
                    var $buttonAdd = $(".button-add");
                    HandicapOU.initEvent();

                    spyOn(HandicapOU, "viewForecast");

                    $buttonAdd.click();

                    expect(HandicapOU.viewForecast).toHaveBeenCalledWith("1", "2");
                });
            });

            describe("viewNewForecast(leagueId, matchId, currencyId, baseCurrency)", function () {
                it("Site.redirect(url) should be called with correct parameter", function () {
                    spyOn(Site, "resolveClientUrl").and.callFake(function (url) { return url; });
                    var expectedUrlPattern = /NewHandicapOverUnderForecast\/Index\?leagueid=1\&matchid=2\&currencyid=3\&basecurrency=eur/i;
                    spyOn(Site, "redirect");

                    HandicapOU.viewNewForecast(1, 2, 3, "eur");

                    expect(Site.redirect).toHaveBeenCalledWith(jasmine.stringMatching(expectedUrlPattern));
                });
            });

            describe("viewForecast(matchId, betType)", function () {
                it("Popup.openPopupWithIframe(url, option) should be called with correct parameters", function () {
                    spyOn(Site, "resolveClientUrl").and.callFake(function (url) { return url; });
                    setFixtures(
                        '<select id="CurrencyId" data-original="2"></select>' +
                        '<div id="BaseCurrency" data-original="3"></div>'
                        );
                    $("#CurrencyId").append('<option value="2">uus</option>');

                    var queryString = "matchid=1&bettype=2&CurrencyId=2&CurrencyName=uus&BaseCurrency=3";
                    var url = "AhForecast/Index?" + queryString;
                    var expectedUrl = url.replace(/[&|?][^=]*/g, function (match) {
                        return match.toLowerCase();
                    });
                    spyOn(Popup, "openPopupWithIframe");

                    HandicapOU.viewForecast(1, 2);
                    var option = { width: 700, height: 250, title: "Forecast", id: "forecast-dialog" };

                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(expectedUrl, option);
                });
            });

            describe("submit()", function () {
                it("Site.blockUI() should be called", function () {
                    spyOn(Site, "blockUI");

                    HandicapOU.submit();

                    expect(Site.blockUI).toHaveBeenCalled();
                });

                it("submit function of jquery should be called", function () {
                    setFixtures('<div id="HandicapOUForm"></div>');
                    spyOn($.fn, "submit");

                    HandicapOU.submit();

                    expect($.fn.submit).toHaveBeenCalled();
                });
            });
        });
    });