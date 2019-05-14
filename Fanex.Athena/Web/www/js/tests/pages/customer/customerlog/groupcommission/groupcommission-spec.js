define([
    "jquery",
    "common/site",
    "components/pluginhelper/autocomplete",
    "pages/customer/customerlog/common.option",
    "components/pluginhelper/monthpicker",
    "pages/customer/customerlog/customerlog.service",
    "pages/customer/customerlog/groupcommission/groupcommission"],
    function ($, Site, AutoComplete, CommonOption, MonthPicker, CustomerLogService, CustomerGroupComm) {
        describe("CustomerGroupComm", function () {
            describe("initialize()", function () {
                beforeAll(function () {
                    spyOn(CustomerLogService, "initialize");
                    spyOn(MonthPicker, "initMonthPicker");
                    spyOn(CustomerGroupComm, "initEvent");
                });

                it("should be initialized controls on page", function () {
                    setFixtures('<input id="MinDate" value="01/01/2017">');

                    CustomerGroupComm.initialize();

                    expect(CustomerLogService.initialize).toHaveBeenCalled();
                    expect(MonthPicker.initMonthPicker).toHaveBeenCalledWith({ minDate: "01/01/2017" });
                    expect(CustomerGroupComm.initEvent).toHaveBeenCalled();
                });

                it("Group Commission Tab should be active", function () {
                    setFixtures('<ul class="tabs">' +
                        '<li class="tab"><a id="loginlogTab" class="active"></a></li>' +
                        '<li class="tab"> <a id="customersettinglogTab"></a>' +
                        '</li><li class="tab"><a href="/CustomerLog/GroupCommission" id="groupcommlogTab">Group commission</a></li>' +
                        '</ul>');

                    CustomerGroupComm.initialize();

                    expect($("#groupcommlogTab").hasClass("active")).toEqual(true);
                });
            });

            describe("initEvent()", function () {
                it("loadGrid() should be called when submit button is clicked", function () {
                    setFixtures('<button id="SubmitButton"></button>');
                    spyOn(CustomerGroupComm, "loadGrid");

                    CustomerGroupComm.initEvent();
                    $('#SubmitButton').click();

                    expect(CustomerGroupComm.loadGrid).toHaveBeenCalled();
                });

                it("CustomerLogService.checkShowAll() should be called when showall is change", function () {
                    setFixtures('<input id="showall" type="checkbox">');
                    spyOn(CustomerLogService, "checkShowAll");

                    CustomerGroupComm.initEvent();
                    $("#showall").change();

                    expect(CustomerLogService.checkShowAll).toHaveBeenCalled();
                });
            });

            describe("loadGrid()", function () {
                it("CustomerLogService.loadGrid() should be called with correct params", function () {
                    var url = "url";
                    spyOn(CustomerGroupComm, "getUrl").and.callFake(function () { return url; });
                    var colNames = ["colNames"];
                    var gridOption = { colNames: "" };
                    CommonOption.gridOption = gridOption;
                    spyOn(CommonOption, "getColNames").and.callFake(function () { return colNames });
                    spyOn(CustomerLogService, "loadGrid");
                    spyOn(Site, "getResources").and.callFake(function (str) {
                        return str;
                    });

                    CustomerGroupComm.loadGrid();

                    expect(CustomerLogService.loadGrid).toHaveBeenCalledWith(url, { colNames: colNames }, true);
                });
            });

            describe("getUrl()", function () {
                it("should be returned correct url string", function () {
                    var fromDate = "06/01/2017";
                    var toDate = "06/30/2017";
                    spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                        return url;
                    });
                    appendSetFixtures('<input id="FromDate" value="' + fromDate + '"></input>');
                    appendSetFixtures('<input id="ToDate" value="' + toDate + '"></input>');
                    var expectedUrl = 'api/Log/GroupCommission?&Year=2017&Month=6&FromDay=1&ToDay=30';

                    var actuallUrl = CustomerGroupComm.getUrl();

                    expect(actuallUrl).toEqual(expectedUrl);
                });
            });
        });     
    });