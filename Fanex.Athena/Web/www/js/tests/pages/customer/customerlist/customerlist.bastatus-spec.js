define(["jquery",
    "common/site",
    "pages/customer/customerlist/customerlist.state",
    "pages/customer/customerlist/customerlist.service",
    "pages/customer/customerlist/customerlist.bastatus"],
    function ($, Site, CustomerListState, CustomerListService, CustomerListBaStatus) {
        describe("CustomerListBaStatus", function () {
            beforeAll(function () {
                spyOn(CustomerListState, "getState").and.returnValue({
                    pagingOption: {
                        pagesize: 1
                    },
                    cachedData: {
                        Data: [{
                            BAStatus: true,
                            OddsGroup: "group1"
                        }]
                    }
                });
                spyOn(Site, "getSingleResource").and.callFake(function (str) {
                    return str;
                });
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                    return url;
                });
                spyOn(Site, "blockUI");
                spyOn(Site, "unBlockUI");
            });

            describe("initialize()", function () {
                it("get customer list stage", function () {
                    CustomerListBaStatus.initialize();

                    expect(CustomerListState.getState).toHaveBeenCalled();
                });

                it("updateBASetting($context) should be called if Ba Status checkbox is changed", function () {
                    setFixtures('<div id="report-content"><input type="checkbox" class="baStatus"></div>');
                    spyOn(CustomerListBaStatus, "updateBASetting");

                    CustomerListBaStatus.initialize();
                    $(".baStatus").change();

                    expect(CustomerListBaStatus.updateBASetting).toHaveBeenCalled();
                });
            });

            describe("updateBASetting($context)", function () {
                it("alert should be shown if BA status can be updated", function () {
                    setFixtures('<input type="hidden" id="CanUpdateBAMessage" value="CanUpdateBAMessage">');
                    spyOn(window, "alert");

                    CustomerListBaStatus.updateBASetting();

                    expect(window.alert).toHaveBeenCalledWith("CanUpdateBAMessage");
                });

                it("window.confirm should be shown if BA status is updated", function () {
                    setFixtures('<div id="report-content"><input type="hidden" id="CanUpdateBA" value="1">' +
                        '<input class="baStatus" type="checkbox" data-val="{&quot;custId&quot;:1,&quot;isAllowBA&quot;:true,&quot;externalId&quot;:&quot;ext&quot;}"></div>');
                    spyOn(window, "confirm").and.returnValue(false);

                    CustomerListBaStatus.updateBASetting($(".baStatus"));

                    expect(window.confirm).toHaveBeenCalledWith("AlertTurnOnBAMsg");
                });

                it("update checking status of BA status if call update BA status API fails", function () {
                    setFixtures('<div id="report-content"><input type="hidden" id="CanUpdateBA" value="1">' +
                        '<input class="baStatus" type="checkbox" data-val="{&quot;custId&quot;:1,&quot;isAllowBA&quot;:false,&quot;externalId&quot;:&quot;ext&quot;}"></div>');
                    spyOn(window, "confirm").and.returnValue(true);
                    spyOn($, "ajax").and.callFake(function (options) {
                        options.beforeSend();
                        options.error();
                        options.complete();
                    });

                    CustomerListBaStatus.updateBASetting($(".baStatus"));

                    expect(window.confirm).toHaveBeenCalledWith("AlertTurnOffBAMsg");
                    expect($(".baStatus").is(":checked")).toBe(true);
                });

                it("update checking status of BA status and show window.alert if update BA status API does not exist", function () {
                    setFixtures('<div id="report-content"><input type="hidden" id="CanUpdateBA" value="1">' +
                        '<input class="baStatus" type="checkbox" checked data-val="{&quot;custId&quot;:1,&quot;isAllowBA&quot;:true,&quot;externalId&quot;:&quot;ext&quot;}"></div>');
                    spyOn(window, "confirm").and.returnValue(true);
                    spyOn(window, "alert");
                    spyOn($, "ajax").and.callFake(function (options) {
                        options.beforeSend();
                        options.statusCode["404"]();
                        options.complete();
                    });

                    CustomerListBaStatus.updateBASetting($(".baStatus"));

                    expect(window.confirm).toHaveBeenCalledWith("AlertTurnOnBAMsg");
                    expect($(".baStatus").is(":checked")).toBe(false);
                    expect(window.alert).toHaveBeenCalledWith("Error-Page not found");
                });

                it("update checking status of BA status and show response message if update BA status fails", function () {
                    setFixtures('<div id="report-content"><input type="hidden" id="CanUpdateBA" value="1">' +
                        '<input class="baStatus" type="checkbox" checked data-val="{&quot;custId&quot;:1,&quot;isAllowBA&quot;:true,&quot;externalId&quot;:&quot;ext&quot;}"></div>');
                    spyOn(window, "confirm").and.returnValue(true);
                    spyOn(window, "alert");
                    spyOn($, "ajax").and.callFake(function (options) {
                        options.beforeSend();
                        options.success({
                            IsSuccessful: false,
                            Message: "Fail"
                        });
                        options.complete();
                    });

                    CustomerListBaStatus.updateBASetting($(".baStatus"));

                    expect(window.confirm).toHaveBeenCalledWith("AlertTurnOnBAMsg");
                    expect($(".baStatus").is(":checked")).toBe(false);
                    expect(window.alert).toHaveBeenCalledWith("Fail");
                });

                it("CustomerListService.bindData should be called if update BA status succeeds", function () {
                    setFixtures('<div id="report-content"><input type="hidden" id="CanUpdateBA" value="1">' +
                        '<table><tr id="1"><td>' +
                        '<input class="baStatus" type="checkbox" checked data-val="{&quot;custId&quot;:1,&quot;isAllowBA&quot;:false,&quot;externalId&quot;:&quot;ext&quot;}">' +
                        '</td></tr></table>' +
                        '</div>');
                    spyOn(window, "confirm").and.returnValue(true);
                    spyOn(CustomerListService, "bindData");
                    spyOn($, "ajax").and.callFake(function (options) {
                        options.beforeSend();
                        options.success({
                            IsSuccessful: true,
                            OddsGroup: "group2"
                        });
                        options.complete();
                    });

                    CustomerListBaStatus.updateBASetting($(".baStatus"));

                    expect(CustomerListService.bindData).toHaveBeenCalledWith({ Data: [{ BAStatus: false, OddsGroup: "group2" }] }, true);
                });
            });
        });
    });