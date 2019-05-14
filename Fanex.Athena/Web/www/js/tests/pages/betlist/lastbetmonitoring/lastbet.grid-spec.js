define(['jquery', 'common/site', 'pages/betlist/betlist', 'pages/betlist/lastbetmonitoring/lastbet.grid', 'lib/jquery.multiselect'],
    function ($, Site, BetList, LastBetGrid) {
        describe("LastBetGrid", function () {
            var defaultParams = {
                SportId: 0,
                LeagueId: 0,
                MatchId: 0,
                BetType: "",
                LiveStatus: "3",
                OddsType: "",
                Level: "",
                TimeZone: "8",
                Currency: "",
                BasedCurrency: "",
                PageSize: 10,
                StakeFrom: 0,
                StakeTo: "1000000000",
                TransId: "0",
                BetFrom: 0
            };

            var initialHtml = '<table id="last-bets-monitoring"><tbody></tbody></table> <input id="last-bet-monitor-base-currency" value="eur" />';

            function reserveParam() {
                var originalParam = Site.clone(defaultParams);

                for (var prop in originalParam) {
                    var type = typeof originalParam[prop];
                    LastBetGrid.updateParam(type, prop, originalParam[prop]);
                }
            }

            function initAjaxCall() {
                spyOn(LastBetGrid, "isValidParam").and.returnValue(true);
                spyOn(LastBetGrid, "clearContent");
                LastBetGrid.initialize();
                LastBetGrid.reloadData();
            }

            beforeAll(function () {
                spyOn(Site, "getSingleResource").and.callFake(function (resource) { return resource; });
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) { return url; });
            });

            describe("columns", function () {
                it("default value should be correct", function () {
                    var exspectedResult =
                        [{ Name: "Platform", IsShow: 1 },
                         { Name: "ExternalId", IsShow: 1 },
                         { Name: "SystemId", IsShow: 1 },
                         { Name: "TransTime", IsShow: 1 },
                         { Name: "Choice", IsShow: 1 },
                         { Name: "Odds", IsShow: 1 },
                         { Name: "Stake", IsShow: 1 },
                         { Name: "Status", IsShow: 1 }];
                    expect(LastBetGrid.columns).toEqual(exspectedResult);
                });
            });

            describe("initialize()", function () {
                beforeEach(function () {
                    spyOn(Site, "clone");
                    spyOn(BetList, "registerBetListGlobalFunctions");
                    setFixtures(initialHtml);

                    LastBetGrid.initialize();
                });

                it("Site.clone should be called with correct parameter", function () {
                    var params = {
                        SportId: 0,
                        LeagueId: 0,
                        MatchId: 0,
                        BetType: "",
                        LiveStatus: "3",
                        OddsType: "",
                        Level: "",
                        TimeZone: "8",
                        Currency: "",
                        BasedCurrency: "eur",
                        PageSize: 10,
                        StakeFrom: "0",
                        StakeTo: "1000000000",
                        TransId: "0",
                        BetFrom: 0
                    };

                    expect(Site.clone).toHaveBeenCalledWith(params);
                });

                it("BetList.registerBetListGlobalFunctions should be called", function () {
                    expect(BetList.registerBetListGlobalFunctions).toHaveBeenCalled();
                });

                it("when click on table row - toggleClass jquery function should be called with correct parameter", function () {
                    var $tableBody = $("#last-bets-monitoring tbody");
                    $tableBody.append('<tr></tr>');
                    spyOn($.fn, "toggleClass");
                    var toggleClass = "monitor-keep";

                    $tableBody.find("tr").click();

                    expect($.fn.toggleClass).toHaveBeenCalledWith(toggleClass);
                });
            });

            describe("getMaxStake()", function () {
                it("return correct value", function () {
                    var result = LastBetGrid.getMaxStake();
                    expect(result).toBe(999999999);
                });
            });

            describe("updateParam", function () {
                afterEach(function () {
                    reserveParam();
                });

                it("param is updated correctly", function () {
                    LastBetGrid.updateParam("number", "SportId", 1);
                    LastBetGrid.updateParam("number", "BetFrom");
                    LastBetGrid.updateParam("string", "Currency", "usd");
                    LastBetGrid.updateParam("string", "BetType");
                    var params = {
                        SportId: 1,
                        LeagueId: 0,
                        MatchId: 0,
                        BetType: "",
                        LiveStatus: "3",
                        OddsType: "",
                        Level: "",
                        TimeZone: "8",
                        Currency: "usd",
                        PageSize: 10,
                        StakeFrom: "0",
                        StakeTo: "1000000000",
                        TransId: "0",
                        BetFrom: 0
                    };
                    var ajaxOption;
                    spyOn($, "ajax").and.callFake(function (option) { ajaxOption = option; });

                    initAjaxCall();
                    LastBetGrid.reloadData();

                    var expected = JSON.stringify(params);
                    var result = ajaxOption.data;

                    expect(result).toBe(expected);
                });
            });

            describe("Submit(freezeStatus)", function () {
                beforeEach(function () {
                    spyOn(LastBetGrid, "stopMonitor");
                    spyOn(LastBetGrid, "tryUpdateStake");
                    spyOn(LastBetGrid, "startMonitor");
                });

                it("LastBetGrid.stopMonitor and LastBetGrid.tryUpdateStake should be called", function () {
                    LastBetGrid.Submit(1);

                    expect(LastBetGrid.stopMonitor).toHaveBeenCalled();
                    expect(LastBetGrid.tryUpdateStake).toHaveBeenCalled();
                });

                it("LastBetGrid.startMonitor should be called when freezeStatus=1", function () {
                    LastBetGrid.Submit(1);

                    expect(LastBetGrid.startMonitor).toHaveBeenCalled();
                });
            });

            describe("reloadData", function () {
                var ajaxOption;

                beforeEach(function () {
                    spyOn(LastBetGrid, "doMonitor");
                    spyOn($, "ajax").and.callFake(function (option) { ajaxOption = option; });
                    LastBetGrid.initialize();
                });

                afterEach(function () {
                    ajaxOption = null;
                    reserveParam();
                });

                it("nothing happen if param is invalid", function () {
                    setFixtures('<input id="stake-from" value="10" /> <input id="stake-to" value="1" />');
                    spyOn($.fn, "multiSelect").and.callFake(function () { return [1]; });
                    LastBetGrid.Submit(0);

                    LastBetGrid.reloadData();

                    expect($.ajax).not.toHaveBeenCalled();
                });

                it("_lastTransId = 0 - LastBetGrid.clearContent should be called", function () {
                    setFixtures('<input id="stake-from" value="" /> <input id="stake-to" value="" />');
                    spyOn(LastBetGrid, "clearContent");
                    spyOn($.fn, "multiSelect").and.callFake(function () { return [1]; });
                    LastBetGrid.Submit(0);

                    LastBetGrid.reloadData();

                    expect(LastBetGrid.clearContent).toHaveBeenCalled();
                });

                it("_lastTransId != 0 - LastBetGrid.clearContent is not called", function () {
                    spyOn(LastBetGrid, "isValidParam").and.returnValue(true);
                    spyOn(LastBetGrid, "clearContent");

                    var lastTranId = 1;
                    LastBetGrid.reloadData();
                    ajaxOption.success({ NewRow: true, Rows: "", LastTransId: lastTranId });
                    LastBetGrid.reloadData();

                    expect(LastBetGrid.clearContent.calls.count()).toBe(1);
                });

                it("$.ajax should be called with correct options", function () {
                    setFixtures(initialHtml);
                    var params = {
                        SportId: 0,
                        LeagueId: 0,
                        MatchId: 0,
                        BetType: "",
                        LiveStatus: "3",
                        OddsType: "",
                        Level: "",
                        TimeZone: "8",
                        Currency: "",
                        BasedCurrency: "eur",
                        PageSize: 10,
                        StakeFrom: 0,
                        StakeTo: "1000000000",
                        TransId: "0",
                        BetFrom: 0
                    };
                    initAjaxCall();

                    LastBetGrid.reloadData();

                    expect($.ajax).toHaveBeenCalled();
                    expect(ajaxOption.type).toBe("POST");
                    expect(ajaxOption.url).toBe("api/LastBetMonitoringBetList/Index");
                    expect(ajaxOption.data).toBe(JSON.stringify(params));
                    expect(ajaxOption.contentType).toBe("application/json; charset=utf-8");
                    expect(ajaxOption.timeout).toBe(10000);
                });

                it("beforeSend function call - '#monitorLoader' is visible", function () {
                    setFixtures('<div id="monitorLoader"></div>');
                    initAjaxCall();

                    LastBetGrid.reloadData();
                    ajaxOption.beforeSend();
                    var result = $("#monitorLoader").css("visibility");

                    expect(result).toBe("visible");
                });

                it("complete function call - '#monitorLoader' is hidden", function () {
                    setFixtures('<div id="monitorLoader"></div>');
                    initAjaxCall();

                    LastBetGrid.reloadData();
                    ajaxOption.complete();
                    var result = $("#monitorLoader").css("visibility");

                    expect(result).toBe("hidden");
                });

                it("complete function call - '#noInfoRow' is removed when having data", function () {
                    setFixtures('<div id="monitorLoader"></div> <p id="noInfoRow">No Infor</p>' + initialHtml);
                    initAjaxCall();

                    LastBetGrid.reloadData();

                    $("#last-bets-monitoring tbody").append('<tr></tr><tr></tr><tr></tr>');
                    ajaxOption.complete();
                    var result = $("#noInfoRow").length;

                    expect(result).toBe(0);
                });

                it("success function call - bindData and doMonitor function should be called", function () {
                    spyOn(LastBetGrid, "bindData");
                    initAjaxCall();

                    LastBetGrid.reloadData();
                    ajaxOption.success({ NewRow: false, Rows: [], LastTransId: 0 });

                    expect(LastBetGrid.bindData).toHaveBeenCalled();
                    expect(LastBetGrid.doMonitor).toHaveBeenCalled();
                });

                it("error function call - Site.reload() should be called when status is 403", function () {
                    spyOn(Site, "reload");
                    initAjaxCall();

                    LastBetGrid.reloadData();
                    ajaxOption.error({ status: 403 });

                    expect(Site.reload).toHaveBeenCalled();
                });

                it("error function call - LastBetGrid.doMonitor() should be called and '#monitorLoader' is hidden when status is not 403", function () {
                    setFixtures('<div id="monitorLoader"></div>');
                    initAjaxCall();

                    LastBetGrid.reloadData();
                    ajaxOption.error({ status: 200 });
                    var loaderVisibility = $("#monitorLoader").css("visibility");

                    expect(LastBetGrid.doMonitor).toHaveBeenCalled();
                    expect(loaderVisibility).toBe("hidden");
                });
            });

            describe("bindData()", function () {
                var ajaxOption;

                beforeEach(function () {
                    spyOn(LastBetGrid, "doMonitor");
                    spyOn($, "ajax").and.callFake(function (option) { ajaxOption = option; });
                    setFixtures(initialHtml);
                    initAjaxCall();
                    LastBetGrid.reloadData();
                });

                afterEach(function () {
                    ajaxOption = null;
                });

                describe("There are no new rows", function () {
                    beforeEach(function () {
                        spyOn(LastBetGrid, "bindNoInfoRow");
                    });

                    it("Result have Message - LastBetGrid.bindNoInfoRow should be called with correct parameter", function () {
                        var expectedMessage = "No New Rows";
                        ajaxOption.success({ NewRow: false, Rows: [], LastTransId: 0, Message: expectedMessage });

                        expect(LastBetGrid.bindNoInfoRow).toHaveBeenCalledWith(expectedMessage);
                    });

                    it("Result don't have message and table is empty - LastBetGrid.bindNoInfoRow should be called without parameter", function () {
                        ajaxOption.success({ NewRow: false, Rows: [], LastTransId: 0 });

                        expect(LastBetGrid.bindNoInfoRow).toHaveBeenCalledWith();
                    });

                    it("Result don't have message and table is having data - nothing happen", function () {
                        var $tableBody = $("#last-bets-monitoring tbody");
                        $tableBody.append('<tr class="content-row"><td>Data</td></tr>');

                        ajaxOption.success({ NewRow: false, Rows: [], LastTransId: 0 });

                        expect(LastBetGrid.bindNoInfoRow).not.toHaveBeenCalled();
                    });
                });

                describe("There are new rows", function () {
                    var hiddenColumns;

                    beforeEach(function () {
                        hiddenColumns = Site.clone(LastBetGrid.columns);
                    });

                    afterEach(function () {
                        LastBetGrid.columns = hiddenColumns;
                    });

                    it("All columns are visible - <tbody> should contain correct html", function () {
                        var expectedTableHtml = '<tr class="content-row"><td>Data</td></tr>';
                        ajaxOption.success({ NewRow: true, Rows: expectedTableHtml, LastTransId: 0 });

                        var result = $("#last-bets-monitoring tbody").html();

                        expect(result).toBe(expectedTableHtml);
                    });

                    it("Column 'Platform' is hidden - <tbody> should contain correct html", function () {
                        var htmlRow = '<tr class="content-row"><td data-name="Platform">Data</td><td>Visible</td></tr>';
                        var expectedTableHtml = '<tr class="content-row"><td data-name="Platform" style="display:none;">Data</td><td>Visible</td></tr>';
                        LastBetGrid.columns[0].IsShow = 0;

                        ajaxOption.success({ NewRow: true, Rows: htmlRow, LastTransId: 0 });
                        var result = $("#last-bets-monitoring tbody").html();

                        expect(result).toBe(expectedTableHtml);
                    });

                    it("Paging - <tbody> should contain correct html", function () {
                        spyOn(LastBetGrid, "stopMonitor");
                        spyOn(LastBetGrid, "tryUpdateStake");
                        LastBetGrid.updateParam("number", "PageSize", 1);
                        LastBetGrid.Submit(0);

                        var htmlRow = [0, 1].map(function () { return '<tr class="content-row"><td data-name="Platform">Data</td><td>Visible</td></tr>'; }).join("");
                        var expectedTableHtml = '<tr class="content-row"><td data-name="Platform">Data</td><td>Visible</td></tr>';
                        ajaxOption.success({ NewRow: true, Rows: htmlRow, LastTransId: 0 });
                        var result = $("#last-bets-monitoring tbody").html();

                        expect(result).toBe(expectedTableHtml);
                    });
                });

                it("LastBetGrid.unHighlight should be called with setTimeout", function () {
                    spyOn(LastBetGrid, "unHighlight");
                    var expectedLastTranId = 1;
                    jasmine.clock().install();
                    ajaxOption.success({ NewRow: true, Rows: "", LastTransId: expectedLastTranId });

                    jasmine.clock().tick(6001);

                    expect(LastBetGrid.unHighlight).toHaveBeenCalledWith(expectedLastTranId);
                    jasmine.clock().uninstall();
                });
            });

            describe("bindNoInfoRow", function () {
                beforeEach(function () {
                    setFixtures('<div id="betlist_content"></div>' + initialHtml);
                });

                it("<tbody> of table should be empty", function () {
                    LastBetGrid.bindNoInfoRow();

                    var result = $("#last-bets-monitoring tbody").html();

                    expect(result).toBe("");
                });

                it("'#betlist_content' should has correct html", function () {
                    var message = "Message";
                    var expectedHtml = '<p id="noInfoRow" class="no-info-row">' + message + '</p>';
                    LastBetGrid.bindNoInfoRow(message);

                    var result = $("#betlist_content").html();

                    expect(result).toBe(expectedHtml);
                });

                it("There is no '#noInfoRow' - append jquery function should be called", function () {
                    var expectedHtml = '<p id="noInfoRow" class="no-info-row">NoInfo</p>';
                    spyOn($.fn, "append");

                    LastBetGrid.bindNoInfoRow();

                    expect($.fn.append).toHaveBeenCalledWith(expectedHtml);
                });

                it("There is '#noInfoRow' - append jquery function is not called and '#betlist_content' should has correct html", function () {
                    var expectedHtml = '<p id="noInfoRow" class="no-info-row">NoInfo</p>';
                    LastBetGrid.bindNoInfoRow();
                    spyOn($.fn, "append");

                    LastBetGrid.bindNoInfoRow();

                    expect($.fn.append).not.toHaveBeenCalled();
                });
            });

            describe("unHighlight", function () {
                it("'tr.content-row' should have correct html content", function () {
                    var lastTransId = 1;
                    setFixtures(initialHtml);
                    LastBetGrid.initialize();
                    var $tableBody = $("#last-bets-monitoring tbody");
                    var rows = [1, 2].map(function (item) { return '<tr class="content-row monitor-hightlight" data-transid="' + item + '"></tr>'; }).join("");
                    $tableBody.append(rows);

                    var expectedHtmlContent = '<tr class="content-row" data-transid="1"></tr>' +
                                                '<tr class="content-row monitor-hightlight" data-transid="2"></tr>';

                    LastBetGrid.unHighlight(lastTransId);
                    var result = $tableBody.html();

                    expect(result).toBe(expectedHtmlContent);
                });
            });

            describe("clearContent", function () {
                it("LastBetGrid.bindNoInfoRow should be called", function () {
                    spyOn(LastBetGrid, "bindNoInfoRow");

                    LastBetGrid.clearContent();

                    expect(LastBetGrid.bindNoInfoRow).toHaveBeenCalled();
                });
            });

            describe("startMonitor", function () {
                it("LastBetGrid.stopMonitor and LastBetGrid.doMonitor should be called", function () {
                    spyOn(LastBetGrid, "stopMonitor");
                    spyOn(LastBetGrid, "doMonitor");

                    LastBetGrid.startMonitor();

                    expect(LastBetGrid.stopMonitor).toHaveBeenCalled();
                    expect(LastBetGrid.doMonitor).toHaveBeenCalled();
                });
            });

            describe("stopMonitor", function () {
                it("_intervalId is not greater than 0 - window.clearTimeout is not called", function () {
                    spyOn(window, "clearTimeout");

                    LastBetGrid.stopMonitor();

                    expect(window.clearTimeout).not.toHaveBeenCalled();
                });

                it("_intervalId is greater than 0 - window.clearTimeout should be called", function () {
                    var intervalId = 1;
                    spyOn(window, "setTimeout").and.returnValues(intervalId);
                    LastBetGrid.doMonitor();
                    spyOn(window, "clearTimeout");
                    LastBetGrid.stopMonitor();

                    expect(window.clearTimeout).toHaveBeenCalledWith(intervalId);
                });
            });

            describe("doMonitor", function () {
                it("intervalId = 0 - clearTimeout is not called", function () {
                    spyOn(window, "clearTimeout");
                    spyOn(window, "setTimeout");
                    LastBetGrid.initialize();

                    LastBetGrid.doMonitor();

                    expect(window.clearTimeout).not.toHaveBeenCalled();
                });

                it("intervalId > 0 - clearTimeout should be called", function () {
                    spyOn(window, "clearTimeout");
                    spyOn(LastBetGrid, "reloadData");
                    LastBetGrid.initialize();
                    LastBetGrid.doMonitor();

                    LastBetGrid.doMonitor();

                    expect(window.clearTimeout).toHaveBeenCalled();
                });

                it("setTimeout should be called with correct parameter", function () {
                    var intervalMiliseconds = 3000;
                    spyOn(window, "setTimeout");
                    spyOn(LastBetGrid, "reloadData");
                    LastBetGrid.initialize();

                    LastBetGrid.doMonitor();

                    expect(window.setTimeout).toHaveBeenCalledWith(LastBetGrid.reloadData, intervalMiliseconds);
                });

                it("intervalMiliseconds updated - setTimeout should be called with correct _intervalMiliseconds", function () {
                    var ajaxOption;
                    spyOn($, "ajax").and.callFake(function (option) { ajaxOption = option; });
                    initAjaxCall();
                    LastBetGrid.reloadData();

                    jasmine.clock().uninstall();
                    jasmine.clock().install();
                    jasmine.clock().mockDate();
                    jasmine.clock().tick(3001);
                    ajaxOption.success({ NewRow: true, Rows: "", LastTransId: 1 });
                    jasmine.clock().uninstall();

                    spyOn(window, "setTimeout");
                    spyOn(LastBetGrid, "reloadData");
                    var expectedIntervalMiliseconds = 4000;
                    LastBetGrid.doMonitor();

                    var result = window.setTimeout.calls.argsFor(0)[1];

                    expect(result).toBe(expectedIntervalMiliseconds);
                });
            });
        });
    });