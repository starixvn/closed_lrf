define(["jquery", "common/site", "pages/customer/customerlist/customerlist.custstatus"], function ($, Site, CustomerListCustStatus) {
    describe("CustomerListCustStatus", function () {
        beforeAll(function () {
            spyOn(Site, "getSingleResource").and.callFake(function (str) {
                return str;
            });
            spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                return url;
            });
            spyOn(Site, "blockUI");
            spyOn(Site, "unBlockUI");
            spyOn(window, "alert");
        });

        describe("initialize()", function () {
            it("initEvent should be called", function () {
                spyOn(CustomerListCustStatus, "initEvent");

                CustomerListCustStatus.initialize();

                expect(CustomerListCustStatus.initEvent).toHaveBeenCalled();
            });
        });

        describe("initEvent()", function () {
            it("showUpdatePopUp($context) should be called if custStatusOption is clicked", function () {
                setFixtures('<div id="report-content"><a class="custStatusOption"></a></div>');
                spyOn(CustomerListCustStatus, "showUpdatePopUp");

                CustomerListCustStatus.initEvent();
                $(".custStatusOption").click();

                expect(CustomerListCustStatus.showUpdatePopUp).toHaveBeenCalled();
            });

            it("updateCustStatus() should be called if custStatusUpdate is clicked", function () {
                setFixtures('<div id="UpdateCustStatus"><button id="custStatusUpdate"></button></div>');
                spyOn(CustomerListCustStatus, "updateCustStatus");

                CustomerListCustStatus.initEvent();
                $("#custStatusUpdate").click();

                expect(CustomerListCustStatus.updateCustStatus).toHaveBeenCalled();
            });

            it("closeUpdatePopUp() should be called if custStatusCancel is clicked", function () {
                setFixtures('<div id="UpdateCustStatus"><button id="custStatusCancel"></button></div>');
                spyOn(CustomerListCustStatus, "closeUpdatePopUp");

                CustomerListCustStatus.initEvent();
                $("#custStatusCancel").click();

                expect(CustomerListCustStatus.closeUpdatePopUp).toHaveBeenCalled();
            });

            it("checkStatusChange() should be called if chkCustStatus is changed", function () {
                setFixtures('<div id="UpdateCustStatus"><input type="checkbox" class="chkCustStatus"></div>');
                spyOn(CustomerListCustStatus, "checkStatusChange");

                CustomerListCustStatus.initEvent();
                $(".chkCustStatus").change();

                expect(CustomerListCustStatus.checkStatusChange).toHaveBeenCalled();
            });

            it("#UpdateCustStatus should be hidden if it's loss focus", function () {
                setFixtures('<div id="UpdateCustStatus""></div><a></a>');

                CustomerListCustStatus.initEvent();
                $("a").click();

                expect($("#UpdateCustStatus").is(":hidden")).toBe(false);
            });
        });

        describe("showUpdatePopUp($context)", function () {
            beforeEach(function () {
                spyOn(CustomerListCustStatus, "checkStatusChange");
                spyOn($.fn, "offset").and.returnValue({ top: 0, left: 0 });
                spyOn($.fn, "outerHeight").and.returnValue(100);
                spyOn($.fn, "css");
            });

            it("checkStatusChange() should be called if context cusid and popup custid are the same", function () {
                setFixtures('<div id="report-content"><button class="custStatusOption" data-custid="1"></button></div>'
                    + '<div id="UpdateCustStatus" data-custid="1"></div>');
                window.innerHeight = 500;

                CustomerListCustStatus.showUpdatePopUp($(".custStatusOption"));

                expect(CustomerListCustStatus.checkStatusChange).toHaveBeenCalled();
                expect($.fn.css.calls.mostRecent().args[0].top).toBe(101);
            });

            it("changed popup data if context cusid and popup custid are the same", function () {
                setFixtures('<div id="report-content"><button class="custStatusOption" data-custid="2"></button></div>'
                    + '<div id="UpdateCustStatus" data-custid="1" data-closed="" data-suspended="" data-externalid=""></div>'
                    + '<a id="edit-cust-status-2" data-isclosed="true" data-issuspended="false" data-externalid="ext"><a>'
                    + '<input type="hidden" id="custStatus-externalId">'
                    + '<input type="checkbox" id="custStatus-suspended">'
                    + '<input type="checkbox" id="custStatus-closed">');
                window.innerHeight = 50;

                CustomerListCustStatus.showUpdatePopUp($(".custStatusOption"));

                expect($("#custStatus-externalId").text()).toEqual("ext");
                expect($("#custStatus-suspended").is(":checked")).toBe(false);
                expect($("#custStatus-closed").is(":checked")).toBe(true);
                expect($("#UpdateCustStatus").data("custid")).toEqual(2);
                expect($("#UpdateCustStatus").data("closed")).toEqual(true);
                expect($("#UpdateCustStatus").data("suspended")).toEqual(false);
                expect($.fn.css.calls.mostRecent().args[0].top).toBe(-101);
            });
        });

        describe("closeUpdatePopUp()", function () {
            it("popup should be closed if it is opening", function () {
                setFixtures('<div id="UpdateCustStatus"></div>');
                spyOn($.fn, "fadeOut");

                CustomerListCustStatus.closeUpdatePopUp();

                expect($.fn.fadeOut).toHaveBeenCalled();
            });

            it("popup should not be closed if it is not opening", function () {
                setFixtures('<div id="UpdateCustStatus" style="display:none"></div>');
                spyOn($.fn, "fadeOut");

                CustomerListCustStatus.closeUpdatePopUp();

                expect($.fn.fadeOut).not.toHaveBeenCalled();
            });
        });

        describe("updateCustStatus()", function () {
            function mockAjax(response) {
                jasmine.Ajax
                        .stubRequest("CustomerAPI/UpdateCustStatus")
                        .andReturn({
                            responseText: JSON.stringify(response)
                        });
            }

            it("closeUpdatePopUp() should be called if confirm popup result is NO", function () {
                spyOn(window, "confirm").and.returnValue(false);
                spyOn(CustomerListCustStatus, "closeUpdatePopUp");

                CustomerListCustStatus.updateCustStatus();

                expect(CustomerListCustStatus.closeUpdatePopUp).toHaveBeenCalled();
            });

            it("alert shows error message if calling API fails", function () {
                setFixtures('<div id="UpdateCustStatus" data-custid="1" data-closed="" data-suspended="" data-externalid=""></div>'
                    + '<a id="edit-cust-status-1" data-isclosed="true" data-issuspended="false" data-externalid="ext"><a>'
                    + '<input type="checkbox" id="custStatus-suspended">'
                    + '<input type="checkbox" id="custStatus-closed">');
                spyOn(window, "confirm").and.returnValue(true);
                spyOn(CustomerListCustStatus, "closeUpdatePopUp");

                jasmine.Ajax.install();

                mockAjax({
                    Code: 1,
                    Message: "Error"
                });

                CustomerListCustStatus.updateCustStatus();

                expect(CustomerListCustStatus.closeUpdatePopUp).toHaveBeenCalledWith(1);
                expect(window.alert).toHaveBeenCalledWith("Error");
                jasmine.Ajax.uninstall();
            });

            it("changed popup data if calling API succeeds", function () {
                setFixtures('<div id="UpdateCustStatus" data-custid="1" data-closed="" data-suspended="" data-externalid=""></div>'
                    + '<a id="edit-cust-status-1" data-isclosed="" data-issuspended="" data-externalid=""><a>'
                    + '<input type="checkbox" id="custStatus-suspended">'
                    + '<input type="checkbox" id="custStatus-closed" checked>');
                spyOn(window, "confirm").and.returnValue(true);
                spyOn(CustomerListCustStatus, "closeUpdatePopUp");

                jasmine.Ajax.install();

                mockAjax({
                    Code: 0
                });

                CustomerListCustStatus.updateCustStatus();

                expect($("#edit-cust-status-1").text()).toEqual("Closed");
                expect($("#edit-cust-status-1").data("isclosed")).toEqual(true);
                expect($("#edit-cust-status-1").data("issuspended")).toEqual(false);
                expect($("#UpdateCustStatus").data("closed")).toEqual(true);
                expect($("#UpdateCustStatus").data("suspended")).toEqual(false);
                expect(CustomerListCustStatus.closeUpdatePopUp).toHaveBeenCalledWith(1);
                jasmine.Ajax.uninstall();
            });

            it("statusLink text is 'Suspended' if closed checkbox is not checked and suspended checkbox is checked", function () {
                setFixtures('<div id="UpdateCustStatus" data-custid="1" data-closed="" data-suspended="" data-externalid=""></div>'
                    + '<a id="edit-cust-status-1" data-isclosed="" data-issuspended="" data-externalid=""><a>'
                    + '<input type="checkbox" id="custStatus-suspended" checked>'
                    + '<input type="checkbox" id="custStatus-closed">');
                spyOn(window, "confirm").and.returnValue(true);
                spyOn(CustomerListCustStatus, "closeUpdatePopUp");

                jasmine.Ajax.install();

                mockAjax({
                    Code: 0
                });

                CustomerListCustStatus.updateCustStatus();

                expect($("#edit-cust-status-1").text()).toEqual("Suspended");
                jasmine.Ajax.uninstall();
            });

            it("statusLink text is 'Open' if closed and suspended checkbox are not checked", function () {
                setFixtures('<div id="UpdateCustStatus" data-custid="1" data-closed="" data-suspended="" data-externalid=""></div>'
                    + '<a id="edit-cust-status-1" data-isclosed="" data-issuspended="" data-externalid=""><a>'
                    + '<input type="checkbox" id="custStatus-suspended">'
                    + '<input type="checkbox" id="custStatus-closed">');
                spyOn(window, "confirm").and.returnValue(true);
                spyOn(CustomerListCustStatus, "closeUpdatePopUp");

                jasmine.Ajax.install();

                mockAjax({
                    Code: 0
                });

                CustomerListCustStatus.updateCustStatus();

                expect($("#edit-cust-status-1").text()).toEqual("Open");
                jasmine.Ajax.uninstall();
            });
        });

        describe("checkStatusChange()", function () {
            it("status update button is disabled if status is changed", function () {
                setFixtures('<div id="UpdateCustStatus" data-closed="false" data-suspended="true">'
                    + '<input type="checkbox" id="custStatus-suspended">'
                    + '<input type="checkbox" id="custStatus-closed">'
                    + '<button id="custStatusUpdate"><button>'
                    + '</div>');

                CustomerListCustStatus.checkStatusChange();

                expect($("#custStatusUpdate").is(":disabled")).toBe(false);
            });

            it("status update button is disabled if status is not changed", function () {
                setFixtures('<div id="UpdateCustStatus" data-closed="false" data-suspended="false">'
                    + '<input type="checkbox" id="custStatus-suspended">'
                    + '<input type="checkbox" id="custStatus-closed">'
                    + '<button id="custStatusUpdate"><button>'
                    + '</div>');

                CustomerListCustStatus.checkStatusChange();

                expect($("#custStatusUpdate").is(":disabled")).toBe(true);
            });
        });
    });
})