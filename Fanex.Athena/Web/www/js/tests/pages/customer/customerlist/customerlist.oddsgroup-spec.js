define(["jquery",
    "common/site",
    "pages/customer/customerlist/customerlist.service",
    "pages/customer/customerlist/customerlist.oddsgroup"],
    function ($, Site, CustomerListService, CustomerListOddsGroup) {
        describe("CustomerListOddsGroup", function () {
            beforeAll(function () {
                spyOn(Site, "getSingleResource").and.callFake(function (str) {
                    return str + " {0}";
                });
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                    return url;
                });
            });

            describe("initialize()", function () {
                it("showGridDropdown() should be called if .oddsGroup is click", function () {
                    setFixtures('<div id="report-content"><a class="oddsGroup"></a></div>');
                    spyOn(CustomerListOddsGroup, "showGridDropdown");

                    CustomerListOddsGroup.initialize();
                    $(".oddsGroup").click();                   

                    expect(CustomerListOddsGroup.showGridDropdown).toHaveBeenCalled();

                });

                it("#OddsGroupListContainer should be hidden if .oddsGroup is loss focus", function () {
                    setFixtures('<div id="report-content"><a class="oddsGroup"></a><div id="OddsGroupListContainer"></div></div>');
                    spyOn(CustomerListOddsGroup, "showGridDropdown");
                    jasmine.clock().install();

                    CustomerListOddsGroup.initialize();
                    $(".oddsGroup").blur();
                    jasmine.clock().tick(301);

                    expect($("#OddsGroupListContainer").is(":hidden")).toBe(true);
                    jasmine.clock().uninstall();
                });

                it("setValue(oddsGroup) should be called if .oddsGroupLink is click", function () {
                    setFixtures('<div id="report-content">' +
                        '<a class="oddsGroup"></a>' +
                        '<div id="OddsGroupListContainer" style="display:none"><div class="oddsGroupLink" data-group="group1"></div></div>' +
                        '</div>');
                    spyOn(CustomerListOddsGroup, "setValue");

                    CustomerListOddsGroup.initialize();
                    $(".oddsGroupLink").click();

                    expect(CustomerListOddsGroup.setValue).toHaveBeenCalledWith("group1");
                });
            });

            describe("showGridDropdown()", function () {
                it("CustomerListService.showGridDropdownById should be called if .oddsGroup is not disabled", function () {
                    setFixtures('<div id="report-content"><a class="oddsGroup"></a></div>');
                    spyOn(CustomerListService, "showGridDropdownById");

                    CustomerListOddsGroup.initialize();
                    $(".oddsGroup").click();

                    expect(CustomerListService.showGridDropdownById).toHaveBeenCalled();
                });

                it("CustomerListService.showGridDropdownById should not be called if .oddsGroup is disabled", function () {
                    setFixtures('<div id="report-content"><a class="oddsGroup disabled"></a></div>');
                    spyOn(CustomerListService, "showGridDropdownById");

                    CustomerListOddsGroup.initialize();
                    $(".oddsGroup").click();

                    expect(CustomerListService.showGridDropdownById).not.toHaveBeenCalled();
                });
            });

            describe("setValue(oddsGroup)", function () {
                it("CustomerListService.updateGridData should be called with correct params", function () {
                    var option = {};
                    spyOn(CustomerListService, "updateGridData").and.callFake(function (actualOption) {
                        option = actualOption;
                    });

                    CustomerListOddsGroup.setValue("group2");

                    expect(option.confirmMessage).toEqual("AlertSetOddsGroupForCustomerMsg group2");
                });
            });
        });
    });