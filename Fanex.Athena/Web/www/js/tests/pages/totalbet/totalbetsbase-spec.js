define(['jquery', 'common/site', 'common/querystring', 'components/refreshcountdown', 'pages/totalbet/totalbetsbase'], function ($, Site, QueryString, RefreshCountDown, TotalBet) {
    describe("TotalBet", function () {
        function transformQueryParamNameToLowerCase(url) {
            var paramNameRegex = /[&|?][^=]*/g;

            return url.replace(paramNameRegex, function (match) {
                return match.toLowerCase();
            });
        }

        describe("resizeGrid()", function () {
            beforeEach(function () {
                setFixtures(
                    '<div class="body-content" style="width: 300px; height: 500px; position:relative;"></div>' +
                    '<div class="footer-content" style="width: 300px; height: 100px;"></div>'
                );
                window.innerHeight = 300;
                spyOn($.fn, "offset").and.returnValue({ top: 20 });
            });

            describe("body content has vertical scrollbar", function () {
                beforeAll(function () {
                    spyOn($.fn, "hasVerticalScrollBar").and.returnValue(true);
                });

                it(".body-content should have correct height value", function () {
                    TotalBet.resizeGrid();

                    var bodyHeight = $(".body-content").css("max-height");

                    expect(bodyHeight).toBe("152px");
                });

                it("table in '.body-content' should has correct width", function () {
                    $(".body-content").append("<table></table>");
                    TotalBet.resizeGrid();

                    var tableWidth = $(".body-content").find("table").width();

                    expect(tableWidth).toBe(283);
                });

                it(".body-content should not contain class 'hasScroll'", function () {
                    TotalBet.resizeGrid();

                    var containHasScrollClass = $(".body-content").hasClass("hasScroll");

                    expect(containHasScrollClass).toBe(false);
                });
            });

            describe("body content do not has vertical scrollbar", function () {
                beforeAll(function () {
                    spyOn($.fn, "hasVerticalScrollBar").and.returnValue(false);
                });

                it(".body-content should contain class 'hasScroll'", function () {
                    TotalBet.resizeGrid();

                    var containHasScrollClass = $(".body-content").hasClass("hasScroll");

                    expect(containHasScrollClass).toBe(true);
                });
            });
        });

        describe("initEvent()", function () {
            beforeEach(function () {
                setFixtures(
                    '<div id="reportContent">' + 
                    '<div class="body-content"><table><tr><td class="forcast-number" data-match-id="1" data-bet-type="2">100.00</td></tr></table></div>' +
                    '</div>'
                );

                spyOn(RefreshCountDown, "initialize");
                spyOn(TotalBet, "viewRunningBetListMatch");
                spyOn(TotalBet, "resizeGrid");
                spyOn($.fn, "off");

                TotalBet.initialize();
            });

            it("RefreshCountDown.initialize() should be called", function () {
                expect(RefreshCountDown.initialize).toHaveBeenCalled();
            });

            it("TotalBet.viewRunningBetListMatch(matchId, betType) should be called with correct parameters", function () {
                $(".forcast-number").click();

                expect(TotalBet.viewRunningBetListMatch).toHaveBeenCalledWith("1", "2");
            });

            it("TotalBet.resizeGrid() should be called when ajaxComplete event fire", function () {
                $(document).ajaxComplete();

                expect(TotalBet.resizeGrid).toHaveBeenCalled();
            });

            it("TotalBet.resizeGrid() should be called when window resizing event fire", function () {
                $(window).resize();

                expect(TotalBet.resizeGrid).toHaveBeenCalled();
            });

            it(".off() function of jquery should be called with correct parameter when window unloading event fire", function () {
                $(window).unload();

                expect($.fn.off).toHaveBeenCalledWith("resize");
            });
        });

        describe("TotalBet.viewRunningBetListMatch(matchId, betType)", function () {
            it("Site.redirect(url) should be called with correct parameter", function () {
                spyOn(Site, "redirect");
                spyOn(Site, "setLicenseeOptionOriginalParam").and.returnValue("RunningMatchBetList/Index?currencyid=1&basecurrency=all");
                var url = "RunningMatchBetList/Index?currencyid=1&basecurrency=all&matchid=1&bettype=2&isShowSumStake=true";
                var expectedUrl = transformQueryParamNameToLowerCase(url);

                TotalBet.viewRunningBetListMatch(1, 2);

                expect(Site.redirect).toHaveBeenCalledWith(expectedUrl);
            });
        });

        describe("TotalBet.viewRunningBetListMultiBettype(matchId, betType)", function () {
            it("Site.redirect(url) should be called with correct parameter", function () {
                spyOn(Site, "redirect");
                spyOn(Site, "setLicenseeOptionOriginalParam").and.returnValue("RunningBettypesOfMatchBetList/Index?currencyid=1&basecurrency=all");
                var url = "RunningBettypesOfMatchBetList/Index?currencyid=1&basecurrency=all&matchid=1&multiplebettype=2&isShowSumStake=true";
                var expectedUrl = transformQueryParamNameToLowerCase(url);

                TotalBet.viewRunningBetListMultiBettype(1, 2);

                expect(Site.redirect).toHaveBeenCalledWith(expectedUrl);
            });
        });

        describe("TotalBet.initialize()", function () {
            it("functions should be called", function () {
                spyOn(TotalBet, "initEvent");
                spyOn(TotalBet, "resizeGrid");
                spyOn(Site, "unBlockUI");

                TotalBet.initialize();

                expect(TotalBet.initEvent).toHaveBeenCalled();
                expect(TotalBet.resizeGrid).toHaveBeenCalled();
                expect(Site.unBlockUI).toHaveBeenCalled();
            });
        });
    });
});