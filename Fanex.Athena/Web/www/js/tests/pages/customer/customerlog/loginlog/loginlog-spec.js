define([
    "jquery",
    "common/site",
    "components/pluginhelper/autocomplete",
    "pages/customer/customerlog/loginlog/loginlog.option",
    "pages/customer/customerlog/customerlog.service",
    "pages/customer/customerlog/loginlog/loginlog"],
    function ($, Site, AutoComplete, LoginLogOption, CustomerLogService, CustomerLoginLog) {
        describe("CustomerLoginLog", function () {
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
                });

                it("should be initialized controls on page", function () {
                    CustomerLoginLog.initialize();

                    expect(CustomerLogService.initialize).toHaveBeenCalled();
                    expect(AutoComplete.initialize).toHaveBeenCalled();
                });

                it("initEvent() should be called control on page", function () {
                    spyOn(CustomerLoginLog, "initEvent");

                    CustomerLoginLog.initialize();

                    expect(CustomerLoginLog.initEvent).toHaveBeenCalled();
                });

                it("Customer setting log Tab should be active", function () {
                    setFixtures('<ul class="tabs">' +
                        '<li class="tab"><a id="loginlogTab"></a></li>' +
                        '<li class="tab"> <a id="CustomerLoginLoglogTab" class="active"></a>' +
                        '</li><li class="tab"><a href="/CustomerLog/GroupCommission" id="groupcommlogTab">Group commission</a></li>' +
                        '</ul>');

                    CustomerLoginLog.initialize();

                    expect($("#loginlogTab").hasClass("active")).toEqual(true);
                });
            });

            describe("initEvent()", function () {
                it("loadGrid() should be called when submit button is clicked", function () {
                    setFixtures('<button id="SubmitButton"></button>');
                    spyOn(CustomerLoginLog, "loadGrid");

                    CustomerLoginLog.initEvent();
                    $('#SubmitButton').click();

                    expect(CustomerLoginLog.loadGrid).toHaveBeenCalled();
                });

                it("loadGrid() should be called when entering in username textbox", function () {
                    setFixtures('<input id="Username"></input>');
                    spyOn(CustomerLoginLog, "loadGrid");

                    CustomerLoginLog.initEvent();
                    e = $.Event("keyup");
                    e.keyCode = 13;
                    $('#Username').trigger(e);

                    expect(CustomerLoginLog.loadGrid).toHaveBeenCalled();
                });

                it("loadGrid() should not be called when usename textbox is not inputted 'Enter' key", function () {
                    setFixtures('<input id="Username"></input>');
                    spyOn(CustomerLoginLog, "loadGrid");

                    CustomerLoginLog.initEvent();
                    e = $.Event("keyup");
                    e.which = 50;
                    $('#Username').trigger(e);

                    expect(CustomerLoginLog.loadGrid).not.toHaveBeenCalled();
                });
            });

            describe("loadGrid()", function () {
                it("CustomerLogService.loadGrid() should be called with correct params", function () {
                    var url = "url";
                    spyOn(CustomerLoginLog, "getUrl").and.callFake(function () { return url; });
                    var colNames = ["colNames"];
                    var gridOption = { colNames: "" };
                    LoginLogOption.gridOption = gridOption;
                    spyOn(LoginLogOption, "getColNames").and.callFake(function () { return colNames });
                    spyOn(CustomerLogService, "loadGrid");

                    CustomerLoginLog.loadGrid();

                    expect(CustomerLogService.loadGrid).toHaveBeenCalledWith(url, { colNames: colNames });
                });
            });

            describe("getUrl()", function () {
                it("should be returned correct url string", function () {
                    var userName = "user+name";
                    setFixtures('<input id="Username" value="' + userName + '"></input>');
                    var expectedUrl = 'api/Log/LoginLog?UserName=user%2Bname';

                    var actuallUrl = CustomerLoginLog.getUrl();

                    expect(actuallUrl).toEqual(expectedUrl);
                });
            });
        });
    });