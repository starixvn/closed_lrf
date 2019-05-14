define(['jquery', 'common/site', "components/pluginhelper/multiselect",
    "pages/betlist/lastbetmonitoring/lastbet.grid", "pages/betlist/lastbetmonitoring/lastbet.filter", "lib/jquery.multiselect", 'extensions/jquery.extension'],
    function ($, Site, MultiSelect, LastBetGrid, LastBetFilter) {
        describe("LastBetFilter", function () {
            beforeAll(function () {
                spyOn(Site, "getSingleResource").and.callFake(function (resource) { return resource; });
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) { return url; });
            });

            describe("initialize", function () {
                beforeAll(function () {
                    spyOn(Site, "initialize");
                    spyOn(Site, "addUserGuide");

                    spyOn(LastBetFilter, "initSports");
                    spyOn(LastBetFilter, "initLeague");
                    spyOn(LastBetFilter, "initMatch");
                    spyOn(LastBetFilter, "initBetType");
                    spyOn(LastBetFilter, "initLiveStatus");
                    spyOn(LastBetFilter, "initOddsType");
                    spyOn(LastBetFilter, "initSpecialLevel");
                    spyOn(LastBetFilter, "initCurrency");
                    spyOn(LastBetFilter, "initTimeZone");
                    spyOn(LastBetFilter, "initBasedCurrency");
                    spyOn(LastBetFilter, "initStake");
                    spyOn(LastBetFilter, "initPageSizeControl");
                    spyOn(LastBetFilter, "initFreezeButton");
                    spyOn(LastBetFilter, "initSubmit");
                    spyOn(LastBetFilter, "initPlatForm");
                    spyOn(LastBetFilter, "initColumns");

                    spyOn($.fn, "selectList");

                    LastBetFilter.initialize();
                });

                it("Site.initialize() should be called", function () {
                    expect(Site.initialize).toHaveBeenCalled();
                });

                it("Site.addUserGuide() should be called with correct parameter", function () {
                    expect(Site.addUserGuide).toHaveBeenCalledWith({
                        resourceName: "LastBetsMonitoring",
                        title: "LastBetsMonitoring"
                    });
                });

                it("LastBetFilter.initSports() should be called", function () {
                    expect(LastBetFilter.initSports).toHaveBeenCalled();
                });

                it("LastBetFilter.initLeague() should be called", function () {
                    expect(LastBetFilter.initLeague).toHaveBeenCalled();
                });

                it("LastBetFilter.initMatch() should be called", function () {
                    expect(LastBetFilter.initMatch).toHaveBeenCalled();
                });

                it("LastBetFilter.initBetType() should be called", function () {
                    expect(LastBetFilter.initBetType).toHaveBeenCalled();
                });

                it("LastBetFilter.initLiveStatus() should be called", function () {
                    expect(LastBetFilter.initLiveStatus).toHaveBeenCalled();
                });

                it("LastBetFilter.initOddsType() should be called", function () {
                    expect(LastBetFilter.initOddsType).toHaveBeenCalled();
                });

                it("LastBetFilter.initSpecialLevel() should be called", function () {
                    expect(LastBetFilter.initSpecialLevel).toHaveBeenCalled();
                });

                it("LastBetFilter.initCurrency() should be called", function () {
                    expect(LastBetFilter.initCurrency).toHaveBeenCalled();
                });

                it("LastBetFilter.initTimeZone() should be called", function () {
                    expect(LastBetFilter.initTimeZone).toHaveBeenCalled();
                });

                it("LastBetFilter.initBasedCurrency() should be called", function () {
                    expect(LastBetFilter.initBasedCurrency).toHaveBeenCalled();
                });

                it("LastBetFilter.initStake() should be called", function () {
                    expect(LastBetFilter.initStake).toHaveBeenCalled();
                });

                it("LastBetFilter.initPageSizeControl() should be called", function () {
                    expect(LastBetFilter.initPageSizeControl).toHaveBeenCalled();
                });

                it("LastBetFilter.initFreezeButton() should be called", function () {
                    expect(LastBetFilter.initFreezeButton).toHaveBeenCalled();
                });

                it("LastBetFilter.initSubmit() should be called", function () {
                    expect(LastBetFilter.initSubmit).toHaveBeenCalled();
                });

                it("LastBetFilter.initPlatForm() should be called", function () {
                    expect(LastBetFilter.initPlatForm).toHaveBeenCalled();
                });

                it("LastBetFilter.initColumns() should be called", function () {
                    expect(LastBetFilter.initColumns).toHaveBeenCalled();
                });

                it("selectList jquery function should be called with correct parameter", function () {
                    expect($.fn.selectList).toHaveBeenCalledWith("disabled", true);
                });

                it("selectList jquery function should be called twice", function () {
                    expect($.fn.selectList.calls.count()).toBe(2);
                });
            });

            describe("initSports()", function () {
                var ajaxOption;
                beforeEach(function () {
                    setFixtures('<input id="sports" value="0" /> <input id="match" /><input id="league" />');
                    spyOn($, "ajax").and.callFake(function (option) { ajaxOption = option; });
                    spyOn(LastBetFilter, "changeFilterParam");
                    spyOn(LastBetGrid, "updateParam");
                    spyOn($.fn, "selectList");
                    LastBetFilter.initSports();
                });

                describe("SportId value is 0 (All) or 999 (mixParlaySportId)", function () {
                    beforeEach(function () {
                        $("#sports").change();
                    });

                    it("LastBetFilter.changeFilterParam should be called with correct parameter when $('#sports') fired change event", function () {
                        expect(LastBetFilter.changeFilterParam).toHaveBeenCalledWith("number", "SportId", 0);
                    });

                    it("$.ajax should not be called when $('#sports') fired change event with sportId is 0 or 999", function () {
                        expect($.ajax).not.toHaveBeenCalled();
                    });

                    it("LastBetGrid.updateParam should be called twice when $('#sports') fired change event", function () {
                        expect(LastBetGrid.updateParam.calls.count()).toBe(2);
                    });

                    it("LastBetGrid.updateParam should be called with correct parameter when $('#sports') fired change event", function () {
                        var argForLeague = ["number", "LeagueId", ""];
                        var argForMatch = ["number", "MatchId", ""];

                        expect(LastBetGrid.updateParam.calls.argsFor(0)).toEqual(argForLeague);
                        expect(LastBetGrid.updateParam.calls.argsFor(1)).toEqual(argForMatch);
                    });

                    it("selectList jquery function should be called three times", function () {
                        expect($.fn.selectList.calls.count()).toBe(3);
                    });

                    it("selectList jquery function should be called by $leagueDropdown with correct parameter", function () {
                        expect($.fn.selectList).toHaveBeenCalledWith("disabled", true);
                    });

                    it("selectList jquery function should be called by $leagueDropdown and $matchDropdown with correct parameter", function () {
                        var argForUpdatedLeague = ["update", { isDisabled: true }];
                        var argForUpdatedMatch = ["update", { isDisabled: true }];

                        expect($.fn.selectList.calls.argsFor(1)).toEqual(argForUpdatedLeague);
                        expect($.fn.selectList.calls.argsFor(2)).toEqual(argForUpdatedMatch);
                    });

                    it("LastBetGrid.updateParam should be called twice with correct parameter", function () {
                        var argForUpdatedLeague = ["number", "LeagueId", ""];
                        var argForUpdatedMatch = ["number", "MatchId", ""];

                        expect(LastBetGrid.updateParam.calls.argsFor(0)).toEqual(argForUpdatedLeague);
                        expect(LastBetGrid.updateParam.calls.argsFor(1)).toEqual(argForUpdatedMatch);
                    });
                });

                describe("SportId value is not 0 (All) or 999 (mixParlaySportId)", function () {
                    beforeEach(function () {
                        $("#sports").val(1);
                        $("#sports").change();
                    });

                    afterEach(function () {
                        ajaxOption = null;
                    });

                    it("ajax function should be called with correct parameter", function () {
                        expect(ajaxOption.url).toBe("api/LastBetMonitoringBetList/GetRunningMatchList");
                        expect(ajaxOption.data).toBe("sportid=1");
                        expect(ajaxOption.dataType).toBe("json");
                        expect(ajaxOption.type).toBe("GET");
                        expect(ajaxOption.contentType).toBe("application/json; charset=utf-8");
                    });

                    it("call beforeSend function - Site.blockUI() is called", function () {
                        spyOn(Site, "blockUI");
                        ajaxOption.beforeSend();

                        expect(Site.blockUI).toHaveBeenCalled();
                    });

                    it("call complete function - Site.unBlockUI() is called", function () {
                        spyOn(Site, "unBlockUI");
                        ajaxOption.complete();

                        expect(Site.unBlockUI).toHaveBeenCalled();
                    });

                    it("call success function - append jquery function should be called with correct parameter", function () {
                        spyOn($.fn, "append");
                        var response = {
                            LeagueList: [{LeagueId: 1, LeagueName: "Soccer"}]
                        };

                        ajaxOption.success(response);
                        var expectedParam = '<option value="1">Soccer</option>';

                        expect($.fn.append).toHaveBeenCalledWith(expectedParam);
                    });
                });
            });

            describe("initLeague()", function () {
                var ajaxOption;
                beforeEach(function () {
                    setFixtures('<input id="league" value="0" /> <select id="match"></select>');
                    spyOn(LastBetFilter, "changeFilterParam");                    
                    spyOn(LastBetGrid, "updateParam");
                    spyOn($.fn, "selectList");
                    LastBetFilter.initLeague();
                });

                describe("LeagueId value is 0 (All)", function () {
                    beforeEach(function () {
                        $("#league").change();
                    });

                    it("LastBetFilter.changeFilterParam should be called with correct parameter when $('#sports') fired change event", function () {
                        expect(LastBetFilter.changeFilterParam).toHaveBeenCalledWith("number", "LeagueId", 0);
                    });

                    it("#match should has correct html content", function () {
                        var expectedResult = '<option value="0">All</option>';

                        var result = $("#match").html();

                        expect(result).toBe(expectedResult);
                    });

                    it("selectList jquery should be called with disabled function by $matchDropdown with correct parameter", function () {
                        expect($.fn.selectList).toHaveBeenCalledWith("disabled", true);
                    });

                    it("selectList jquery should be called with update by $matchDropdown with correct parameter", function () {
                        var argForUpdatedMatch = ["update", { isDisabled: true }];

                        expect($.fn.selectList.calls.argsFor(1)).toEqual(argForUpdatedMatch);
                    });

                    it("LastBetGrid.updateParam should be called twice with correct parameter", function () {
                        expect(LastBetGrid.updateParam).toHaveBeenCalledWith("number", "MatchId", "0");
                    });
                });

                describe("LeagueId value is not 0 (All)", function () {
                    var ajaxOption;
                    beforeEach(function () {
                        appendSetFixtures('<input id="sports" value="1" />');
                        LastBetFilter.initSports();
                        spyOn($, "ajax").and.callFake(function (option) { ajaxOption = option; });
                        $("#sports").change();
                        
                        $("#league").val(1);
                    });

                    it("$matchDropdown should has correct html when it can be showed", function () {
                        var response = {
                            LeagueList: [{ LeagueId: 1, LeagueName: "Soccer", IsOutRight: false }],
                            MatchList: [{ LeagueId: 1, MatchId: 1, MatchName: "MU-Arsenal" }]
                        };

                        ajaxOption.success(response);
                        $("#league").change();
                        var expectedResult = '<option value="0">All</option><option value="1">MU-Arsenal</option>';
                        var result = $("#match").html();

                        expect(result).toEqual(expectedResult);
                    });

                    it("$matchDropdown should has correct html when it can not be showed", function () {
                        var response = {
                            LeagueList: [{ LeagueId: 2, LeagueName: "Soccer", IsOutRight: true }],
                            MatchList: [{ LeagueId: 1, MatchId: 1, MatchName: "MU-Arsenal" }]
                        };

                        ajaxOption.success(response);
                        $("#league").change();
                        var expectedResult = '<option value="0">All</option>';
                        var result = $("#match").html();

                        expect(result).toEqual(expectedResult);
                    });
                });
            });

            describe("initMatch()", function () {
                it("LastBetFilter.changeFilterParam function should be called with correct parameter when '#match' fired change event", function () {
                    setFixtures('<input id="match" value="1" />');
                    spyOn(LastBetFilter, "changeFilterParam");
                    LastBetFilter.initMatch();

                    $("#match").change();

                    expect(LastBetFilter.changeFilterParam).toHaveBeenCalledWith("number", "MatchId", "1");
                });
            });

            describe("initBetType()", function () {
                it("LastBetFilter.changeFilterParam function should be called with correct parameter when '#bet-type' fired change event", function () {
                    setFixtures('<input id="bet-type" value="1" />');
                    spyOn(LastBetFilter, "changeFilterParam");
                    LastBetFilter.initBetType();

                    $("#bet-type").change();

                    expect(LastBetFilter.changeFilterParam).toHaveBeenCalledWith("string", "BetType", "1");
                });
            });

            describe("initLiveStatus()", function () {
                it("LastBetFilter.changeFilterParam function should be called with correct parameter when '#live-status' fired change event", function () {
                    setFixtures('<input id="live-status" value="1" />');
                    spyOn(LastBetFilter, "changeFilterParam");
                    LastBetFilter.initLiveStatus();

                    $("#live-status").change();

                    expect(LastBetFilter.changeFilterParam).toHaveBeenCalledWith("string", "LiveStatus", "1");
                });
            });

            describe("initOddsType()", function () {
                it("LastBetFilter.changeFilterParam function should be called with correct parameter when '#odds-type' fired change event", function () {
                    setFixtures('<input id="odds-type" value="1" />');
                    spyOn(LastBetFilter, "changeFilterParam");
                    LastBetFilter.initOddsType();

                    $("#odds-type").change();

                    expect(LastBetFilter.changeFilterParam).toHaveBeenCalledWith("string", "OddsType", "1");
                });
            });

            describe("initSpecialLevel()", function () {
                var multiselectOption, method;
                var checkedItems = [1];
                var specialList = [];
                beforeEach(function () {
                    setFixtures('<div id="special-level"></div>');
                    spyOn($.fn, "multiSelect").and.callFake(function (option) {
                        if (typeof option === "string") {
                            method = option;
                            return checkedItems;
                        }
                        else {
                            multiselectOption = option;
                        }
                    });
                    LastBetFilter.initSpecialLevel();

                    for (var i = 0; i <= 10; i++) {
                        specialList.push({
                            Id: "special-option-" + i,
                            Value: i.toString(),
                            Text: i === 0 ? "None" : i.toString(),
                            Checked: true,
                            Enable: true,
                            Css: "",
                            CssClass: ""
                        });
                    }
                });

                it("multiselect jquery should be called with correct parameter", function () {
                    expect(multiselectOption.minWidth).toBe(130);
                    expect(multiselectOption.maxHeight).toBe(400);
                    expect(multiselectOption.shadow).toBe(true);
                    expect(multiselectOption.showHeader).toBe(true);
                    expect(multiselectOption.isCheckAll).toBe(true);
                    expect(multiselectOption.showFooter).toBe(false);
                    expect(multiselectOption.checkAllText).toBe("All");
                    expect(multiselectOption.noneSelectedText).toBe("NoneLevel");
                    expect(multiselectOption.selectedText).toBe("SelectedItemCount");
                    expect(multiselectOption.listData).toEqual(specialList);
                });

                it("call onCheck function - LastBetFilter.changeFilterParam should be called with correct parameter", function () {
                    spyOn(LastBetFilter, "changeFilterParam");

                    multiselectOption.onCheck();

                    expect(method).toBe("getCheckedItems");
                    expect(LastBetFilter.changeFilterParam).toHaveBeenCalledWith("string", "Level", "1");
                });

                it("call onCheck function and select all level - LastBetFilter.changeFilterParam should be called with correct parameter", function () {
                    spyOn(LastBetFilter, "changeFilterParam");
                    checkedItems.length = 11;

                    multiselectOption.onCheck();

                    expect(method).toBe("getCheckedItems");
                    expect(LastBetFilter.changeFilterParam).toHaveBeenCalledWith("string", "Level", "");
                });
            });

            describe("initCurrency()", function () {
                var selectedCurrencyText = "USD";
                var checkedItemsByText = [selectedCurrencyText];
                var checkedItems = [1];
                var currencyList = [
                    {
                        Id: "currency-0",
                        Value: "1",
                        Text: selectedCurrencyText,
                        Checked: true,
                        Enable: true,
                        Css: "",
                        CssClass: ""
                    }
                ];

                var multiselectOption;

                beforeEach(function () {
                    setFixtures('<select id="currency"><option value="1">USD</option></select>');
                    spyOn($.fn, "multiSelect").and.callFake(function (option) {
                        if (option === "getCheckedItems") {
                            return checkedItems;
                        }
                        else if (option === "getCheckedItemsByText") {
                            return checkedItemsByText;
                        }
                        else {
                            multiselectOption = option;
                        }
                    });

                    LastBetFilter.initCurrency();
                });

                afterEach(function () {
                    checkedItems = [1];
                });

                it("multiselect jquery should be called with correct parameter", function () {
                    expect(multiselectOption.minWidth).toBe(100);
                    expect(multiselectOption.maxHeight).toBe(400);
                    expect(multiselectOption.shadow).toBe(true);
                    expect(multiselectOption.showHeader).toBe(true);
                    expect(multiselectOption.isCheckAll).toBe(true);
                    expect(multiselectOption.showFooter).toBe(false);
                    expect(multiselectOption.checkAllText).toBe("All");
                    expect(multiselectOption.noneSelectedText).toBe("NoneCurrency");
                    expect(multiselectOption.selectedText).toBe("SelectedItemCount");
                    expect(multiselectOption.listData).toEqual(currencyList);
                });

                describe("call onCheck function", function () {
                    beforeEach(function () {
                        appendSetFixtures('<select id="BaseCurrency"><option value="eur">EUR</option><option value="usd">USD</option></select>');
                        spyOn(LastBetFilter, "changeFilterParam");
                        spyOn(LastBetGrid, "updateParam");
                        spyOn($.fn, "selectList");
                    });

                    it("LastBetFilter.changeFilterParam should be called with correct parameter", function () {
                        spyOn(Site, "isBaseCurrency").and.returnValues(false);

                        multiselectOption.onCheck();

                        expect(LastBetFilter.changeFilterParam).toHaveBeenCalledWith("string", "Currency", "");
                    });

                    it("LastBetFilter.changeFilterParam should be called with select multiple currencies", function () {
                        spyOn(Site, "isBaseCurrency").and.returnValues(false);

                        checkedItems = [1, 2];
                        multiselectOption.onCheck();

                        expect(LastBetFilter.changeFilterParam).toHaveBeenCalledWith("string", "Currency", "1,2");
                    });

                    it("selectList jquery function should be called with correct parameter", function () {
                        spyOn(Site, "isBaseCurrency").and.returnValues(false);

                        multiselectOption.onCheck();

                        expect($.fn.selectList).toHaveBeenCalledWith("update");
                    });

                    it("LastBetGrid.updateParam should be called with correct parameter", function () {
                        spyOn(Site, "isBaseCurrency").and.returnValues(true);

                        multiselectOption.onCheck();

                        expect(LastBetGrid.updateParam).toHaveBeenCalledWith("string", "BasedCurrency", "usd");
                    });

                    it("LastBetGrid.updateParam should be called with correct parameter when select multiple currency", function () {
                        spyOn(Site, "isBaseCurrency").and.returnValues(false);

                        checkedItemsByText = [selectedCurrencyText, "EUR"];
                        multiselectOption.onCheck();

                        expect(LastBetGrid.updateParam).toHaveBeenCalledWith("string", "BasedCurrency", "eur");
                    });

                    it("LastBetGrid.updateParam should be called with correct parameter when selected currency is not based", function () {
                        spyOn(Site, "isBaseCurrency").and.returnValues(false);

                        checkedItemsByText = ["UUS"];
                        multiselectOption.onCheck();

                        expect(LastBetGrid.updateParam).toHaveBeenCalledWith("string", "BasedCurrency", "");
                    });

                    it("LastBetGrid.updateParam should be called with correct parameter when selected currency is not based and empty value is existing", function () {
                        spyOn(Site, "isBaseCurrency").and.returnValues(false);

                        spyOn($.fn, "text").and.callThrough();
                        checkedItemsByText = ["AUD"];
                        $("#BaseCurrency").append("<option value=''></option>");
                        multiselectOption.onCheck();

                        expect($.fn.text).toHaveBeenCalledWith("AUD");
                        expect(LastBetGrid.updateParam).toHaveBeenCalledWith("string", "BasedCurrency", "");
                    });

                    it("Nothing happen and LastBetGrid.updateParam should be called with correct parameter when not selecting any currency", function () {
                        checkedItemsByText = [];
                        spyOn($.fn, "remove").and.callThrough();
                        spyOn($.fn, "appendTo").and.callThrough();
                        spyOn($.fn, "text").and.callThrough();

                        multiselectOption.onCheck();

                        expect($.fn.remove).not.toHaveBeenCalled();
                        expect($.fn.appendTo).not.toHaveBeenCalled();
                        expect($.fn.text).not.toHaveBeenCalled();
                        expect(LastBetGrid.updateParam).toHaveBeenCalledWith("string", "BasedCurrency", "eur");
                    });
                });
            });

            describe("initTimeZone()", function () {
                it("LastBetFilter.changeFilterParam function should be called with correct parameter when '#time-zone' fired change event", function () {
                    setFixtures('<input id="time-zone" value="1" />');
                    spyOn(LastBetFilter, "changeFilterParam");
                    LastBetFilter.initTimeZone();

                    $("#time-zone").change();

                    expect(LastBetFilter.changeFilterParam).toHaveBeenCalledWith("number", "TimeZone", "1");
                });
            });

            describe("initBasedCurrency()", function () {
                it("LastBetFilter.changeFilterParam function should be called with correct parameter when '#BaseCurrency' fired change event", function () {
                    setFixtures('<input id="BaseCurrency" value="1" />');
                    spyOn(LastBetFilter, "changeFilterParam");
                    LastBetFilter.initBasedCurrency();

                    $("#BaseCurrency").change();

                    expect(LastBetFilter.changeFilterParam).toHaveBeenCalledWith("string", "BasedCurrency", "1");
                });
            });

            describe("initStake()", function () {
                beforeEach(function () {
                    setFixtures('<input id="stake-from" /><input id="stake-to" />');
                    spyOn(LastBetFilter, "setHighlightSubmit");
                    spyOn(LastBetFilter, "changeFilterParam");

                    LastBetFilter.initStake();
                });

                it("LastBetFilter.setHighlightSubmit() should be called when $('#stake-from') fired keyup event", function () {
                    $("#stake-from").keyup();
                    expect(LastBetFilter.setHighlightSubmit).toHaveBeenCalled();
                });

                it("LastBetFilter.setHighlightSubmit() should be called when $('#stake-to') fired keyup event", function () {
                    $("#stake-to").keyup();
                    expect(LastBetFilter.setHighlightSubmit).toHaveBeenCalled();
                });

                it("LastBetGrid.changeFilterParam(type, name, value) should be called with correct parameters when $('#stake-from') fired change event", function () {
                    $("#stake-from").val(1);
                    $("#stake-from").change();
                    expect(LastBetFilter.changeFilterParam).toHaveBeenCalledWith("number", "StakeFrom", 1);
                });

                it("LastBetGrid.changeFilterParam(type, name, value) should be called with correct parameters and default value when $('#stake-from') fired change event", function () {
                    $("#stake-from").val("");
                    $("#stake-from").change();
                    expect(LastBetFilter.changeFilterParam).toHaveBeenCalledWith("number", "StakeFrom", 0);
                });

                it("LastBetGrid.changeFilterParam(type, name, value) should be called with correct parameters when $('#stake-to') fired change event", function () {
                    $("#stake-to").val(2);
                    $("#stake-to").change();
                    expect(LastBetFilter.changeFilterParam).toHaveBeenCalledWith("number", "StakeTo", 2);
                });
            });

            describe("initPageSizeControl()", function () {
                beforeEach(function () {
                    setFixtures('<div id="pagesize"><a class="label">10</a></div>');
                    spyOn(LastBetFilter, "changeFilterParam");
                    spyOn($.fn, "removeClass");

                    LastBetFilter.initPageSizeControl();
                });

                it("LastBetFilter.changeFilterParam() should be called with correct parameter when $('#pagesize a.label') fired click event", function () {
                    $("#pagesize a.label").click();

                    expect(LastBetFilter.changeFilterParam).toHaveBeenCalledWith("number", "PageSize", "10");
                });

                it("removeClass jquery function should be called with correct parameter", function () {
                    $("#pagesize a.label").click();

                    expect($.fn.removeClass).toHaveBeenCalledWith("active");
                });

                it("First item of 'a.label' should has class 'active'", function () {
                    $("#pagesize a.label").click();

                    var result = $("a.label").eq(0).hasClass("active");

                    expect(result).toBe(true);
                });

                it("If 'a.label' clicked and had class 'active', then nothing happen", function () {
                    $("a.label").addClass("active");
                    $("#pagesize a.label").click();

                    expect($.fn.removeClass).not.toHaveBeenCalled();
                    expect(LastBetFilter.changeFilterParam).not.toHaveBeenCalled();
                });
            });

            describe("initFreezeButton()", function () {
                describe("currentStatus is 1", function () {
                    beforeEach(function () {
                        setFixtures('<button id="FreezeButton" data-status="1">ABC</button>');
                        spyOn(LastBetGrid, "stopMonitor");

                        LastBetFilter.initFreezeButton();
                        $("#FreezeButton").click();
                    });

                    it("'#FreezeButton' should has correct text", function () {
                        var result = $("#FreezeButton").text();

                        expect(result).toBe("Unfreeze");
                    });

                    it("LastBetGrid.stopMonitor() should be callled when $('#FreezeButton') fired click event", function () {
                        expect(LastBetGrid.stopMonitor).toHaveBeenCalled();
                    });
                });

                describe("currentStatus not equal 1", function () {
                    beforeEach(function () {
                        setFixtures('<button id="FreezeButton" data-status="0">ABC</button>');

                        spyOn(LastBetGrid, "startMonitor");

                        LastBetFilter.initFreezeButton();
                        $("#FreezeButton").click();
                    });

                    it("'#FreezeButton' should has correct text", function () {
                        var result = $("#FreezeButton").text();

                        expect(result).toBe("Freeze");
                    });

                    it("LastBetGrid.startMonitor() should be callled when $('#freeze-button') fired click event", function () {
                        expect(LastBetGrid.startMonitor).toHaveBeenCalled();
                    });
                });
            });

            describe("setHighlightSubmit()", function () {
                beforeEach(function () {
                    jasmine.clock().install();
                    setFixtures('<button id="SubmitButton"></button>');

                    LastBetFilter.setHighlightSubmit();
                });
                afterEach(function () {
                    jasmine.clock().uninstall();
                });
                
                it("$('#SubmitButton') should not have class 'btn-alert'", function () {
                    var result = $("#SubmitButton").hasClass("btn-alert");

                    expect(result).toBe(false);
                });

                it("$('#SubmitButton') should have class 'btn-alert' after 1 second", function () {
                    jasmine.clock().tick(1000);
                    var result = $("#SubmitButton").hasClass("btn-alert");

                    expect(result).toBe(true);
                });

                it("class 'btn-alert should be added to '#SubmitButton' after 1 second and removed after 1.5 second", function () {
                    jasmine.clock().tick(1001);
                    var resultAfterOneSecond = $("#SubmitButton").hasClass("btn-alert");
                    jasmine.clock().tick(500);
                    var resultAfterOneDotFiveSecond = $("#SubmitButton").hasClass("btn-alert");

                    expect(resultAfterOneSecond).toBe(true);
                    expect(resultAfterOneDotFiveSecond).toBe(false);
                });
            });

            describe("initSubmit()", function () {
                beforeEach(function () {
                    setFixtures('<button id="SubmitButton">Submit</button><button id="FreezeButton" data-status="1"></button>');

                    spyOn(LastBetGrid, "Submit");
                    LastBetFilter.initSubmit();
                    $("#SubmitButton").click();
                });

                it("LastBetGrid.Submit should be called with correct parameters", function () {
                    expect(LastBetGrid.Submit).toHaveBeenCalledWith(1);
                });
            });

            describe("initPlatForm()", function () {
                beforeEach(function () {
                    setFixtures('<input id="bet-from" value="1" />');
                    spyOn(LastBetFilter, "changeFilterParam");

                    LastBetFilter.initPlatForm();
                    $('#bet-from').change();
                });

                it("LastBetFilter.changeFilterParam() should be called with correct parameter", function () {
                    expect(LastBetFilter.changeFilterParam).toHaveBeenCalledWith("number", "BetFrom", "1");
                });
            });

            describe("changeFilterParam", function () {
                beforeEach(function () {
                    spyOn(LastBetFilter, "setHighlightSubmit");
                    spyOn(LastBetGrid, "updateParam");

                    LastBetFilter.changeFilterParam("string", "Param", "Value");
                });

                it("LastBetFilter.setHighlightSubmit() should be called", function () {
                    expect(LastBetFilter.setHighlightSubmit).toHaveBeenCalled();
                });

                it("LastBetGrid.updateParam() should be called with correct parameter", function () {
                    expect(LastBetGrid.updateParam).toHaveBeenCalledWith("string", "Param", "Value");
                });
            });

            describe("initColumns()", function () {
                var multiselectOption;
                var originalColumns;
                var initialHtml = '<table id="last-bets-monitoring"><tbody><tr><td data-name="Col1">Col1</td><td data-name="Col2">Col2</td></tr></tbody></table>';
                var columns = [
                    {
                        Id: "column-0",
                        Value: "Col1",
                        Text: "Col1",
                        Checked: true,
                        Enable: true,
                        Css: "",
                        CssClass: ""
                    },
                    {
                        Id: "column-1",
                        Value: "Col2",
                        Text: "Col2",
                        Checked: false,
                        Enable: true,
                        Css: "",
                        CssClass: ""
                    }
                ];

                beforeEach(function () {
                    originalColumns = LastBetGrid.columns;
                    setFixtures(initialHtml + '<select id="se-column"></select>');

                    var checkedItems = ["Col2"];
                    spyOn($.fn, "multiSelect").and.callFake(function (option) {
                        if (typeof option === "string") {
                            return checkedItems;
                        }
                        else {
                            multiselectOption = option;
                        }
                    });

                    LastBetGrid.columns = [
                        { Name: "Col1", IsShow: 1 },
                        { Name: "Col2", IsShow: 0 }
                    ];
                    LastBetFilter.initColumns();
                });

                afterEach(function () {
                    LastBetGrid.columns = originalColumns;
                });

                it("tbody of table should has correct html content", function () {
                    var expctedResult = '<tr><td data-name="Col1">Col1</td><td data-name="Col2" style="display: none;">Col2</td></tr>';

                    var result = $("#last-bets-monitoring tbody").html();

                    expect(result).toBe(expctedResult);
                });

                it("'#se-column' should has correct html content", function () {
                    var expectedResult = '<option value="Col1">Col1 </option><option value="Col2">Col2 </option>';

                    var result = $("#se-column").html();

                    expect(result).toBe(expectedResult);
                });

                it("multiselect jquery should be called with correct parameter", function () {
                    expect(multiselectOption.minWidth).toBe(200);
                    expect(multiselectOption.maxHeight).toBe(400);
                    expect(multiselectOption.shadow).toBe(true);
                    expect(multiselectOption.showHeader).toBe(true);
                    expect(multiselectOption.isCheckAll).toBe(true);
                    expect(multiselectOption.showFooter).toBe(false);
                    expect(multiselectOption.checkAllText).toBe("All");
                    expect(multiselectOption.noneSelectedText).toBe("None");
                    expect(multiselectOption.selectedText).toBe("SelectedItemCount");
                    expect(multiselectOption.listData).toEqual(columns);
                });

                it("onCheck - tbody of table should has correct html content", function () {
                    multiselectOption.onCheck();
                    var expctedResult = '<tr><td data-name="Col1" style="display: none;">Col1</td><td data-name="Col2" style="display: table-cell;">Col2</td></tr>';

                    var result = $("#last-bets-monitoring tbody").html();

                    expect(result).toBe(expctedResult);
                });
            });
        });
    });