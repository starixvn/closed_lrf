define(['jquery', 'common/site', 'pages/totalbet/totalbetsbase', 'components/refreshcountdown', 'common/popup', 'pages/totalbet/oddevendrawnodraw/oddevendrawnodraw'],
    function ($, Site, Totalbets, RefreshCountDown, Popup, OddEvenDND) {
        describe("OddEvenDND", function () {
            beforeEach(function () {
                spyOn(Site, "getSingleResource").and.callFake(function (name) { return name; });
            });

            describe("initialize()", function () {
                beforeEach(function () {
                    spyOn(Site, "initialize");
                    spyOn(Site, "addUserGuide");
                    spyOn(Totalbets, "initialize");
                    spyOn(OddEvenDND, "initEvent");
                    spyOn(RefreshCountDown, "initEvent");

                    OddEvenDND.initialize();
                });

                it("Site.initialize() should be called", function () {
                    expect(Site.initialize).toHaveBeenCalled();
                });
                it("Totalbets.initialize() should be called", function () {
                    expect(Totalbets.initialize).toHaveBeenCalled();
                });
                it("OddEvenDND.initEvent() should be called", function () {
                    expect(OddEvenDND.initEvent).toHaveBeenCalled();
                });
                it("Site.addUserGuide() should be called with correct parameters", function () {
                    expect(Site.addUserGuide).toHaveBeenCalledWith({ resourceName: "TotalBetsOddEven", title: "TotalBets - OddEvenDND" });
                });
                it("RefreshCountDown.initEvent() should be called", function () {
                    expect(RefreshCountDown.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                it("OddEvenDND.submit() should be called when '#SubmitButton' fired click event", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    OddEvenDND.initEvent();

                    spyOn(OddEvenDND, "submit");

                    $("#SubmitButton").click();

                    expect(OddEvenDND.submit).toHaveBeenCalled();
                });

                it("OddEvenDND.viewForecast1X2(matchId, betType) should be called with correct parameters when '.button-add' fired click event", function () {
                    setFixtures('<div id="reportContent"><div class="button-add" data-match-id="1" data-bet-type="2"></div></div>');
                    OddEvenDND.initEvent();

                    spyOn(OddEvenDND, "viewForecast1X2");

                    $(".button-add").click();

                    expect(OddEvenDND.viewForecast1X2).toHaveBeenCalledWith("1", "2");
                });
            });

            describe("viewForecast1X2(matchId, betType)", function () {
                it("Popup.openPopupWithIframe(url, option) should be called with correct parameters", function () {
                    spyOn(Site, "resolveClientUrl").and.callFake(function (url) { return url; });
                    setFixtures(
                        '<select id="CurrencyId" data-original="2"></select>' +
                        '<div id="BaseCurrency" data-original="3"></div>'
                        );
                    $("#CurrencyId").append('<option value="2">uus</option>');

                    var queryString = "matchid=1&bettype=2&CurrencyId=2&CurrencyName=uus&BaseCurrency=3";
                    var url = "OneXTwoForecast/Popup?" + queryString;
                    var expectedUrl = url.replace(/[&|?][^=]*/g, function (match) {
                        return match.toLowerCase();
                    });
                    window.innerHeight = 500;
                    spyOn(Popup, "openPopupWithIframe");

                    OddEvenDND.viewForecast1X2(1, 2);
                    var option = { width: 700, height: 400, title: "Forecast - OneXTwo", id: "forecast-dialog" };

                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(expectedUrl, option);
                });
            });

            describe("submit()", function () {
                it("Site.blockUI() should be called", function () {
                    spyOn(Site, "blockUI");

                    OddEvenDND.submit();

                    expect(Site.blockUI).toHaveBeenCalled();
                });

                it("submit function of jquery should be called", function () {
                    setFixtures('<div id="OddEvenDrawNoDrawForm"></div>');
                    spyOn($.fn, "submit");

                    OddEvenDND.submit();

                    expect($.fn.submit).toHaveBeenCalled();
                });
            });
        });
    });