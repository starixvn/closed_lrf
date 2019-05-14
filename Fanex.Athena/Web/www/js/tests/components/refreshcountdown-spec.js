define(['jquery', 'common/site', 'common/querystring', 'components/refreshcountdown', 'lib/jquery.cookie'],
    function ($, Site, QueryString, RefreshCountDown) {
    describe("RefreshCountDown", function () {
        beforeEach(function () {
            setFixtures('<div id="count-down-of" name="test" data-default-value="100"></div>');
        });

        describe("initialize()", function () {
            it("RefreshCountDown.setCountDown(countDown, isSetToCookie) should be called with correct parameters when '.menu-item' fire click event", function () {
                setFixtures('<div class="menu-item" data-count-down="15"></div>');
                spyOn(RefreshCountDown, "setCountDown");

                RefreshCountDown.initialize();
                $('.menu-item').click();

                expect(RefreshCountDown.setCountDown).toHaveBeenCalledWith(15, true);
            });

            it("RefreshCountDown.refresh() should be called with correct parameters when '.button-refresh' fire click event", function () {
                setFixtures('<div class="button-refresh"></div>');
                spyOn(RefreshCountDown, "refresh");

                RefreshCountDown.initialize();
                $('.button-refresh').click();

                expect(RefreshCountDown.refresh).toHaveBeenCalled();
            });
        });

        describe("initEvent()", function () {
            it("RefreshCountDown.setCountDown(countDown, isSetToCookie) should be called with correct parameters when cookie has value", function () {
                spyOn($, "cookie").and.returnValue(30);
                spyOn(RefreshCountDown, "setCountDown");

                RefreshCountDown.initEvent();

                expect(RefreshCountDown.setCountDown).toHaveBeenCalledWith(30, false);
            });

            it("RefreshCountDown.setCountDown(countDown, isSetToCookie) should be called with correct parameters when cookie has no value", function () {
                spyOn($, "cookie").and.returnValue(null);
                spyOn(RefreshCountDown, "setCountDown");

                RefreshCountDown.initialize();
                RefreshCountDown.initEvent();

                expect(RefreshCountDown.setCountDown).toHaveBeenCalledWith(100, true);
            });
        });

        describe("setCountDown(countDown, isSetToCookie)", function () {
            beforeEach(function () {
                spyOn($, "cookie");
                spyOn(RefreshCountDown, "setMenuStatus");
                spyOn(RefreshCountDown, "tick");
            });

            it("cookie function of jquery should be called when parameter isSetToCookie equal true", function () {
                RefreshCountDown.setCountDown(60, true);

                expect($.cookie).toHaveBeenCalledWith("RefeshCountDowntest", 60);
            });

            it("RefreshCountDown.setMenuStatus() should be called", function () {
                RefreshCountDown.setCountDown(60, false);

                expect(RefreshCountDown.setMenuStatus).toHaveBeenCalled();
            });

            it("RefreshCountDown.tick() should be called", function () {
                RefreshCountDown.setCountDown(60, false);

                expect(RefreshCountDown.tick).toHaveBeenCalled();
            });
        });

        describe("setMenuStatus()", function () {
            beforeEach(function () {
                setFixtures('<ul id="countdown-menu"><li id="option-15" class="menu-item menu-selected"></li><li id="option-45" class="menu-item"></li></ul>');
                spyOn(RefreshCountDown, "tick");
            });

            it("'menu-selected' class should be removed in '#option-15'", function () {
                RefreshCountDown.setCountDown(45, false);
                var result = $("#option-15").hasClass("menu-selected");

                expect(result).toBe(false);
            });

            it("'menu-selected' class should be added in '#option-45'", function () {
                RefreshCountDown.setCountDown(45, false);
                var result = $("#option-45").hasClass("menu-selected");

                expect(result).toBe(true);
            });
        });

        describe("tick()", function () {
            beforeEach(function () {
                setFixtures('<span id="count"></span>');
                spyOn(RefreshCountDown, "tick").and.callThrough();
                jasmine.clock().install();
            });

            afterEach(function () {
                jasmine.clock().uninstall();
            });

            it("RefreshCountDown.tick() should be called after every 1 second", function (done) {
                RefreshCountDown.setCountDown(5, false);
                jasmine.clock().tick(1001);
                jasmine.clock().tick(1001);

                expect(RefreshCountDown.tick.calls.count()).toBe(3);
                done();
            });

            it("RefreshCountDown.refresh() should be called when countdown less than 0", function (done) {
                spyOn(RefreshCountDown, "refresh");
                RefreshCountDown.setCountDown(0, false);
                jasmine.clock().tick(1001);

                expect(RefreshCountDown.refresh).toHaveBeenCalled();
                done();
            });
        });

        describe("refresh()", function () {
            beforeEach(function (done) {
                setFixtures(
                    '<span id="count"></span>' +
                    '<div id="reportContent"><div class="body-content"></div></div>');

                spyOn($.fn, "scrollTop").and.returnValue(20);
                spyOn(RefreshCountDown, "calculateUrl").and.returnValue("localhost-test");
                spyOn(RefreshCountDown, "initEvent");
                spyOn(Site, "currencyConstraint");
                spyOn($.fn, "resize");

                jasmine.Ajax.install();

                jasmine.Ajax
                    .stubRequest('localhost-test')
                    .andReturn({
                        'status': 200,
                        'contentType': 'text/html',
                        'responseText': 'Hello World'
                    });

                RefreshCountDown.refresh();
                request = jasmine.Ajax.requests.mostRecent();

                setTimeout(done, 10);
            });

            afterEach(function () {
                jasmine.Ajax.uninstall();
            });

            it("request url should be correct", function () {
                expect(request.url).toBe('localhost-test');
            });

            it("RefreshCountDown.initEvent() should be called", function () {
                expect(RefreshCountDown.initEvent).toHaveBeenCalled();
            });

            it("Site.currencyConstraint() should be called", function () {
                expect(Site.currencyConstraint).toHaveBeenCalled();
            });

            it("resize function should be called", function () {
                expect($.fn.resize).toHaveBeenCalled();
            });

            it("scrollTop value of '.body-content' should be 20", function () {
                var result = $(".body-content").scrollTop();
                expect(result).toBe(20);
            });
        });

        describe("calculateUrl()", function () {
            it("url returned should be correct", function () {
                setFixtures(
                    '<input id="LeagueId" value="1" /><input id="MatchId" value="2" /><input id="BetType" value="3" />' +
                    '<input id="CurrentScore" value="4" /><input id="IsShowFt" value="true" /><input id="IsShowFh" value="true" />' +
                    '<input id="HomeTeamId" value="10" /><input id="AwayTeamId" value="11" />');

                spyOn(Site, "getCurrentUrl");
                spyOn(Site, "setLicenseeOptionOriginalParam").and.returnValue("localhost-test?currencyid=7&currencyname=eur&basecurrency=eur");
                var url = "localhost-test?currencyid=7&currencyname=eur&basecurrency=eur&LeagueId=1&MatchId=2&BetType=3&CurrentScore=4&" +
                    "IsShowFt=true&IsShowFh=true&HomeTeamId=10&AwayTeamId=11";
                var expectedUrl = url.replace(/[&|?][^=]*/g, function (match) {
                    return match.toLowerCase();
                });

                var result = RefreshCountDown.calculateUrl();

                expect(result).toBe(expectedUrl);
            });
        });
    });
});