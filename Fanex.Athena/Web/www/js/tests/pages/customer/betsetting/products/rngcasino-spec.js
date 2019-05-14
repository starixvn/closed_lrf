define(["jquery",
    "common/site",
    "common/popup",
    "pages/customer/betsetting/common/betsettingbase",
    "pages/customer/betsetting/common/betsetting.status",
    "pages/customer/betsetting/products/rngcasino",
    "extensions/jquery.extension"],
    function ($, Site, Popup, BetSettingBase, BetSettingStatus, RngCasino) {
        describe("RngCasino", function () {
            var popupOption;
            var buttonOK;

            beforeAll(function () {
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                    return url;
                });
                spyOn(Site, "getSingleResource").and.callFake(function (str) {
                    if (str === "UpdateRNGCasinoBetSettingSuccessMsg" || str === "UpdateRNGCasinoBetSettingFailMsg") {
                        return str + " {0}";
                    }

                    return str;
                });
                spyOn(Popup, "openPopupWithButton").and.callFake(function (element, options, buttons) {
                    var $element = $(element);
                    $.each(buttons, function (index, button) {
                        var $button = $('<button type="button" class="' + button.classes + '">' + button.text + '</button>');

                        if (button.text === "OK") {
                            buttonOK = $button;
                        }

                        $element.append($button);
                        $button.on("click", button.click);
                    });

                    $element.attr("id", options.id)
                    appendSetFixtures($element);
                    popupOption = options;
                });
                spyOn(Site, "blockUI");
                spyOn(Site, "reload");
                spyOn(window, "setTimeout").and.callFake(function (callback, second) {
                    callback();
                });
            });

            describe("initialize()", function () {
                beforeAll(function () {
                    spyOn(Site, "initialize");
                    spyOn(BetSettingBase, "initialize");
                    spyOn(RngCasino, "initEvent");
                });

                it("initializes page", function () {
                    setFixtures('<input id="isenabled" value="True">');

                    RngCasino.initialize();

                    expect(Site.initialize).toHaveBeenCalled();
                    expect(BetSettingBase.initialize).toHaveBeenCalled();
                    expect(RngCasino.initEvent).toHaveBeenCalled();
                });

                it("disable inputs and buttons if #isenabled is not True", function () {
                    setFixtures('<input id="isenabled" value="False">'
                        + '<button id="btnRngCasino"></button>'
                        + '<button id="btnResetRngCasino"></button>'
                        + '<div class="body-content"><input type="checkbox"><input type="checkbox"><input type="checkbox"></div>');

                    RngCasino.initialize();

                    expect($("#btnRngCasino").is(":disabled")).toBe(true);
                    expect($("#btnResetRngCasino").is(":disabled")).toBe(true);
                    expect($("input:disabled").length).toBe(3);
                });

                describe("resizeGrid()", function () {
                    it("adds scroll bar for table if table is longer than body content", function () {
                        setFixtures('<table class="table-content"></table>');
                        spyOn($.fn, "hasVerticalScrollBar").and.returnValue(true);

                        RngCasino.initialize();

                        expect($(".table-content").hasClass("hasScroll")).toBe(true);
                    });
                });
            });

            describe("initEvent()", function () {
                it("updateBetSetting(custId, userName) should be called if #btnRngCasino is clicked", function () {
                    setFixtures('<button id="btnRngCasino" data-cust-id="1" data-user-name="username"></button>');
                    spyOn(RngCasino, "updateBetSetting");

                    RngCasino.initEvent();
                    $("#btnRngCasino").click();

                    expect(RngCasino.updateBetSetting).toHaveBeenCalledWith("1", "username");
                });

                it("resetBettingLimit() should be called if #btnResetRngCasino is clicked", function () {
                    setFixtures('<button id="btnResetRngCasino"></button>');
                    spyOn(RngCasino, "resetBettingLimit");

                    RngCasino.initEvent();
                    $("#btnResetRngCasino").click();

                    expect(RngCasino.resetBettingLimit).toHaveBeenCalled();
                });

                it("updateStatus($context) should be called if #btnUpdateStatus is clicked", function () {
                    setFixtures('<button id="btnUpdateStatus"></button>');
                    spyOn(RngCasino, "updateStatus");

                    RngCasino.initEvent();
                    $("#btnUpdateStatus").click();

                    expect(RngCasino.updateStatus).toHaveBeenCalled();
                });
            });

            describe("resetBettingLimit()", function () {
                it("resets all checkbox to orinial state", function () {
                    setFixtures('<input type="checkbox" data-ischeck="True"><input type="checkbox" data-ischeck="True"><input type="checkbox" data-ischeck="True">');
                    spyOn(RngCasino, "updateBetSetting");

                    RngCasino.resetBettingLimit();

                    expect($("input[type=checkbox]:checked").length).toBe(3);
                });
            });

            describe("updateStatus($context)", function () {
                it("BetSettingStatus.update(url, params) should be called", function () {
                    spyOn(BetSettingStatus, "getCommonPostData");
                    spyOn(BetSettingStatus, "update");

                    RngCasino.updateStatus();

                    expect(BetSettingStatus.update).toHaveBeenCalled();
                });
            });

            describe("updateBetSetting(custId, userName)", function () {
                it("popup confirmation should be called", function () {
                    RngCasino.updateBetSetting();

                    expect(Popup.openPopupWithButton.calls.mostRecent().args[0]).toBe('<div><p>UpdateRNGCasinoBetSettings</p></div>');
                });

                describe("showConfirmAction(params, userName, message)", function () {
                    afterEach(function () {
                        popupOption.onClose();
                    });

                    it("buttons should be hidden if popup is opening", function () {
                        setFixtures('<button id="btnRngCasino"></button>'
                        + '<button id="btnResetRngCasino"></button>');

                        RngCasino.updateBetSetting();
                        popupOption.onOpen();

                        expect($("#btnRngCasino").is(":disabled")).toBe(true);
                        expect($("#btnResetRngCasino").is(":disabled")).toBe(true);
                    });

                    it("updateStakeLevel(custId, userName) should be called if popup OK button is clicked", function () {
                        setFixtures('<table>'
                        + '<td class="casino-row" data-gametypeid="1" data-stake-original>'
                        + '<input type="checkbox" data-stakeid="1" class="input-1" checked>'
                        + '<input type="checkbox" data-stakeid="2" class="input-1">'
                        + '</td>'
                        + '<td class="casino-row" data-gametypeid="2" data-stake-original="3">'
                        + '<input type="checkbox" data-stakeid="3" class="input-2">'
                        + '<input type="checkbox" data-stakeid="4" class="input-2">'
                        + '</td>'
                        + '<td class="casino-row" data-gametypeid="3" data-stake-original="5">'
                        + '<input type="checkbox" data-stakeid="5" class="input-3" checked>'
                        + '<input type="checkbox" data-stakeid="6" class="input-3">'
                        + '</td>'
                        + '</table>');

                        spyOn(RngCasino, "updateStakeLevel");
                        var expectedparams = { custId: 1, gameTypeChangedList: "1,2", stake1: "1", stake2: "" };
                        var userName = "User Name";
                        var custId = 1;

                        RngCasino.updateBetSetting(custId, userName);
                        buttonOK.click();

                        expect(RngCasino.updateStakeLevel).toHaveBeenCalledWith(expectedparams, userName);
                    });

                    it("dialog message should be shown if popup OK button is clicked but no data change", function () {
                        spyOn(RngCasino, "updateStakeLevel");
                        var userName = "User Name";
                        var custId = 1;

                        RngCasino.updateBetSetting(custId, userName);
                        buttonOK.click();

                        expect(Popup.openPopupWithButton.calls.mostRecent().args[0]).toBe('<div><p>UpdateRNGCasinoBetSettingSuccessMsg User Name</p></div>');
                    });

                    it("buttons should be shown and popup should be removed if popup was closed", function () {
                        setFixtures('<button id="btnRngCasino" disabled></button>'
                        + '<button id="btnResetRngCasino disabled"></button>');

                        RngCasino.updateBetSetting();
                        var ishasPopup = $("#bet-setting-confirm").length > 0;
                        popupOption.onClose();

                        expect($("#btnRngCasino").is(":disabled")).toBe(false);
                        expect($("#btnResetRngCasino").is(":disabled")).toBe(false);
                        expect(ishasPopup).toBe(true);
                        expect($("#bet-setting-confirm").length).toBe(0);
                    });
                });
            });

            describe("getParams(custId)", function () {
                it("returns correct param", function () {
                    setFixtures('<table>'
                        + '<td class="casino-row" data-gametypeid="1" data-stake-original>'
                        + '<input type="checkbox" data-stakeid="1" class="input-1" checked>'
                        + '<input type="checkbox" data-stakeid="2" class="input-1">'
                        + '</td>'
                        + '<td class="casino-row" data-gametypeid="2" data-stake-original="3">'
                        + '<input type="checkbox" data-stakeid="3" class="input-2">'
                        + '<input type="checkbox" data-stakeid="4" class="input-2">'
                        + '</td>'
                        + '<td class="casino-row" data-gametypeid="3" data-stake-original="5">'
                        + '<input type="checkbox" data-stakeid="5" class="input-3" checked>'
                        + '<input type="checkbox" data-stakeid="6" class="input-3">'
                        + '</td>'
                        + '</table>');

                    var custId = 1;

                    var param = RngCasino.getParams(custId);

                    expect(param.custId).toBe(custId);
                    expect(param.gameTypeChangedList).toBe("1,2");
                    expect(param["stake1"]).toBe("1");
                    expect(param["stake2"]).toBe("");
                });
            });

            describe("updateStakeLevel(params, userName)", function () {
                it("popup result should be called to show message 'RNGCasinoUpdateSettingUnAvailableMsg' if result code is 1", function () {
                    spyOn($, "ajax").and.callFake(function (option) {
                        option.success({ Code: 1 });
                    });
                    var userName = "UserName";

                    RngCasino.updateStakeLevel({}, userName);

                    expect(Popup.openPopupWithButton.calls.mostRecent().args[0]).toBe('<div><p>RNGCasinoUpdateSettingUnAvailableMsg</p></div>');
                });

                it("popup result should be called to show message 'UpdateRNGCasinoBetSettingSuccessMsg' if result code is 0", function () {
                    spyOn($, "ajax").and.callFake(function (option) {
                        option.success({ Code: 0 });
                    });
                    var userName = "UserName";

                    RngCasino.updateStakeLevel({}, userName);

                    expect(Popup.openPopupWithButton.calls.mostRecent().args[0]).toBe('<div><p>UpdateRNGCasinoBetSettingSuccessMsg UserName</p></div>');
                });

                it("popup result should be called to show message 'UpdateRNGCasinoBetSettingFailMsg' if status updating fails", function () {
                    spyOn($, "ajax").and.callFake(function (option) {
                        option.success({ Code: -1 });
                    });
                    var userName = "UserName";

                    RngCasino.updateStakeLevel({}, userName);

                    expect(Popup.openPopupWithButton.calls.mostRecent().args[0]).toBe('<div><p>UpdateRNGCasinoBetSettingFailMsg UserName</p></div>');
                });

                describe("showDialogMesage(title, message, reloadPage)", function () {
                    beforeAll(function () {
                        spyOn($, "ajax").and.callFake(function (option) {
                            option.success({ Code: 1 });
                        });
                    });

                    it("buttons should be hidden if popup is opening", function () {
                        setFixtures('<button id="btnRngCasino"></button>'
                        + '<button id="btnResetRngCasino"></button>');

                        RngCasino.updateStakeLevel();
                        popupOption.onOpen();

                        expect($("#btnRngCasino").is(":disabled")).toBe(true);
                        expect($("#btnResetRngCasino").is(":disabled")).toBe(true);
                    });

                    it("buttons should be shown and popup should be removed if popup was closed", function () {
                        setFixtures('<button id="btnRngCasino" disabled></button>'
                        + '<button id="btnResetRngCasino disabled"></button>');

                        RngCasino.updateStakeLevel();
                        var ishasPopup = $("#bet-setting-message").length > 0;
                        popupOption.onClose();

                        expect($("#btnRngCasino").is(":disabled")).toBe(false);
                        expect($("#btnResetRngCasino").is(":disabled")).toBe(false);
                        expect(ishasPopup).toBe(true);
                        expect($("#bet-setting-message").length).toBe(0);
                    });

                    it("page should be reload if reloadPage is true when popup is closed", function () {
                        RngCasino.updateStakeLevel();
                        popupOption.onClose();

                        expect(Site.reload).toHaveBeenCalled();
                    });
                });
            });
        });
    });