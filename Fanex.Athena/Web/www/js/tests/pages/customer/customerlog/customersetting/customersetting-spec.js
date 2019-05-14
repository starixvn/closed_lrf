define([
    "jquery",
    "common/site",
    "components/pluginhelper/autocomplete",
    "pages/customer/customerlog/common.option",
    "components/pluginhelper/monthpicker",
    "pages/customer/customerlog/customerlog.service",
    "pages/customer/customerlog/customersetting/customersetting"],
    function ($, Site, AutoComplete, CommonOption, MonthPicker, CustomerLogService, CustomerSetting) {
        describe("CustomerSetting", function () {
            beforeAll(function () {
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                    return url;
                });
                spyOn(Site, "getResources").and.callFake(function (str) {
                    return str;
                });
            });

            describe("initialize()", function () {
                beforeAll(function () {
                    spyOn(CustomerLogService, "initialize");
                    spyOn(AutoComplete, "initialize");
                    spyOn(MonthPicker, "initMonthPicker");
                });

                it("should be initialized controls on page", function () {
                    CustomerSetting.initialize();

                    expect(CustomerLogService.initialize).toHaveBeenCalled();
                    expect(AutoComplete.initialize).toHaveBeenCalled();
                    expect(MonthPicker.initMonthPicker).toHaveBeenCalled();
                });

                it("initEvent() should be called control on page", function () {
                    spyOn(CustomerSetting, "initEvent");

                    CustomerSetting.initialize();

                    expect(CustomerSetting.initEvent).toHaveBeenCalled();
                });

                it("Customer setting log Tab should be active", function () {
                    setFixtures('<ul class="tabs">' +
                        '<li class="tab"><a id="loginlogTab" class="active"></a></li>' +
                        '<li class="tab"> <a id="customersettinglogTab"></a>' +
                        '</li><li class="tab"><a href="/CustomerLog/GroupCommission" id="groupcommlogTab">Group commission</a></li>' +
                        '</ul>');

                    CustomerSetting.initialize();

                    expect($("#customersettinglogTab").hasClass("active")).toEqual(true);
                });
            });

            describe("initEvent()", function () {
                it("loadGrid() should be called when submit button is clicked", function () {
                    setFixtures('<button id="SubmitButton"></button>');
                    spyOn(CustomerSetting, "loadGrid");

                    CustomerSetting.initEvent();
                    $('#SubmitButton').click();

                    expect(CustomerSetting.loadGrid).toHaveBeenCalled();
                });

                it("loadGrid() should be called when entering in username textbox", function () {
                    setFixtures('<input id="Username"></input>');
                    spyOn(CustomerSetting, "loadGrid");

                    CustomerSetting.initEvent();
                    e = $.Event("keyup");
                    e.keyCode = 13;
                    $('#Username').trigger(e);

                    expect(CustomerSetting.loadGrid).toHaveBeenCalled();
                });

                it("loadGrid() should not be called when usename textbox is not inputted 'Enter' key", function () {
                    setFixtures('<input id="Username"></input>');
                    spyOn(CustomerSetting, "loadGrid");

                    CustomerSetting.initEvent();
                    e = $.Event("keyup");
                    e.which = 50;
                    $('#Username').trigger(e);

                    expect(CustomerSetting.loadGrid).not.toHaveBeenCalled();
                });

                it("CustomerLogService.checkShowAll() should be called when showall is change", function () {
                    setFixtures('<input id="showall" type="checkbox">');
                    spyOn(CustomerLogService, "checkShowAll");

                    CustomerSetting.initEvent();
                    $("#showall").change();

                    expect(CustomerLogService.checkShowAll).toHaveBeenCalled();
                });
            });

            describe("loadGrid()", function () {
                it("CustomerLogService.loadGrid() should be called with correct params", function () {
                    var url = "url";
                    spyOn(CustomerSetting, "getUrl").and.callFake(function () { return url; });
                    var colNames = ["colNames"];
                    var gridOption = { colNames: "" };
                    CommonOption.gridOption = gridOption;
                    spyOn(CommonOption, "getColNames").and.callFake(function () { return colNames });
                    spyOn(CustomerLogService, "loadGrid");

                    CustomerSetting.loadGrid();

                    expect(CustomerLogService.loadGrid).toHaveBeenCalledWith(url, { colNames: colNames }, true);
                });
            });

            describe("getUrl()", function () {
                it("should be returned correct url string", function () {
                    var userName = "user+name";
                    var fromDate = "06/01/2017";
                    var toDate = "06/30/2017";
                    var viewBy = 1;
                    appendSetFixtures('<input id="Username" value="' + userName + '"></input>');
                    appendSetFixtures('<input id="FromDate" value="' + fromDate + '"></input>');
                    appendSetFixtures('<input id="ToDate" value="' + toDate + '"></input>');
                    appendSetFixtures('<input id="ViewBy" value="' + viewBy + '"></input>');
                    var expectedUrl = 'api/Log/CustomerSetting?UserName=user%2Bname&Year=2017&Month=6&FromDay=1&ToDay=30&ViewById=1';

                    var actuallUrl = CustomerSetting.getUrl();

                    expect(actuallUrl).toEqual(expectedUrl);
                });
            });
        });
    });