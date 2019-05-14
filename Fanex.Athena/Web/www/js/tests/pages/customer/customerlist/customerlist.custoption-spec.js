define(["jquery", "common/site", "common/querystring", "common/popup", "pages/customer/customerlist/customerlist.service", "pages/customer/customerlist/customerlist.custoption"],
    function ($, Site, QueryString, Popup, CustomerListService, CustomerListCustOption) {
        describe("CustomerListCustOption", function () {
            beforeAll(function () {
                spyOn(Site, "getSingleResource").and.callFake(function (str) {
                    return str;
                });
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                    return url;
                });
                spyOn(QueryString, "setParams").and.callFake(function (url, obj) {
                    return url;
                });
                spyOn(QueryString, "setParam").and.callFake(function (url, name, value) {
                    return url;
                });
                spyOn(Site, "setLicenseeOptionOriginalParam").and.callFake(function (url) {
                    return url;
                });
            });

            describe("initialize()", function () {
                it("CustomerListService.showGridDropdownById should be called if custoptionlink is clicked", function () {
                    setFixtures('<div id="report-content"><a class="custoptionlink"><a></div>');
                    spyOn(CustomerListService, "showGridDropdownById");

                    CustomerListCustOption.initialize();
                    $(".custoptionlink").click();

                    expect(CustomerListService.showGridDropdownById).toHaveBeenCalled();
                });

                it("#ViewOptionList should be hidden if .custoptionlink is loss focus", function () {
                    setFixtures('<div id="report-content"><a class="custoptionlink"></a><div id="ViewOptionList"></div></div>');
                    spyOn(CustomerListService, "showGridDropdownById");
                    jasmine.clock().install();

                    CustomerListCustOption.initialize();
                    $(".custoptionlink").blur();
                    jasmine.clock().tick(301);

                    expect($("#ViewOptionList").is(":hidden")).toBe(true);
                    jasmine.clock().uninstall();
                });

                it("viewBetSetting() should be called if bet-setting-link is clicked", function () {
                    setFixtures('<a id="bet-setting-link"><a>');
                    spyOn(CustomerListCustOption, "viewBetSetting");

                    CustomerListCustOption.initialize();
                    $("#bet-setting-link").click();

                    expect(CustomerListCustOption.viewBetSetting).toHaveBeenCalled();
                });

                it("viewBetList() should be called if bet-list-link is clicked", function () {
                    setFixtures('<a id="bet-list-link"><a>');
                    spyOn(CustomerListCustOption, "viewBetList");

                    CustomerListCustOption.initialize();
                    $("#bet-list-link").click();

                    expect(CustomerListCustOption.viewBetList).toHaveBeenCalled();
                });

                it("viewStatement() should be called if statement-link is clicked", function () {
                    setFixtures('<a id="statement-link"><a>');
                    spyOn(CustomerListCustOption, "viewStatement");

                    CustomerListCustOption.initialize();
                    $("#statement-link").click();

                    expect(CustomerListCustOption.viewStatement).toHaveBeenCalled();
                });

                it("viewLogInfo() should be called if login-info-link is clicked", function () {
                    setFixtures('<a id="login-info-link"><a>');
                    spyOn(CustomerListCustOption, "viewLogInfo");

                    CustomerListCustOption.initialize();
                    $("#login-info-link").click();

                    expect(CustomerListCustOption.viewLogInfo).toHaveBeenCalled();
                });
            });

            describe("closeCustOption()", function () {
                it("#ViewOptionList should be hidden", function () {
                    setFixtures('<div id="ViewOptionList"><div>');

                    CustomerListCustOption.closeCustOption();

                    expect($("#ViewOptionList").is(":hidden")).toBe(true);
                });
            });

            describe("viewBetSetting()", function () {
                it("Popup.openPopupWithIframe should be called with correct params", function () {
                    setFixtures('<div id="ViewOptionList" data-custid="1" data-systemid="2" data-externalid="3"><div>');
                    spyOn(Popup, "openPopupWithIframe");
                    var expectedUrl = "SportsbookBetSetting/Index?custid=1&username=2&nickname=3";

                    CustomerListCustOption.viewBetSetting();

                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(expectedUrl,
                        { id: "viewOptionBetSettingFrame", width: 905, height: 600, title: "BetSetting" });
                });
            });

            describe("viewLogInfo()", function () {
                beforeEach(function () {
                    setFixtures('<div id="ViewOptionList" data-custid="1" data-systemid="2" data-externalid="3"><div>');
                    spyOn(Popup, "openPopup");
                });

                it("Popup.openPopup should be called if data is load successfully", function () {
                    spyOn($.fn, "load").and.callFake(function (url, callback) {
                        callback({}, "success");
                    });

                    CustomerListCustOption.viewLogInfo();

                    expect(Popup.openPopup.calls.mostRecent().args[1].id).toEqual("CustomerLogInfo");
                });

                it("Popup.openPopup should not be called if data is not load successfully", function () {
                    spyOn($.fn, "load").and.callFake(function (url, callback) {
                        callback({}, "fail");
                    });

                    CustomerListCustOption.viewLogInfo();

                    expect(Popup.openPopup).not.toHaveBeenCalled();
                });

                it("$popup should be set by getting the existing if $popup is existing", function () {
                    spyOn($.fn, "load").and.callFake(function (url, callback) {
                        callback({}, "success");
                    });
                    setFixtures('<div id="CustomerLogInfo"><div class="wrapContent"><div><div>');

                    CustomerListCustOption.viewLogInfo();

                    expect(Popup.openPopup.calls.mostRecent().args[1].id).toEqual("CustomerLogInfo");
                });
            });

            describe("viewBetList()", function () {
                it("Popup.openPopupWithIframe should be called with correct params", function () {
                    setFixtures('<div id="ViewOptionList" data-custid="1" data-systemid="2" data-externalid="3"><div>');
                    spyOn(Popup, "openPopupWithIframe");
                    spyOn(Math, "min").and.returnValue(30);
                    
                    var expectedUrl = "CustomerOutstandingBetList/Index";

                    CustomerListCustOption.viewBetList();

                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(expectedUrl, { id: "viewOptionFrame", width: 930, height: 100});
                });
            });

            describe("viewStatement()", function () {
                it("Popup.openPopupWithIframe should be called with correct params", function () {
                    setFixtures('<div id="ViewOptionList" data-custid="1" data-systemid="2" data-externalid="3"><div>');
                    spyOn(Popup, "openPopupWithIframe");
                    spyOn(Math, "min").and.returnValue(30);

                    var expectedUrl = "CustomerOutstandingBetList/Index";

                    CustomerListCustOption.viewStatement();

                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(expectedUrl, { id: "viewOptionFrame", width: 930, height: 100 });
                });
            });
        });
});