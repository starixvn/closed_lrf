define(["common/site", "lib/jqgrid/jquery.jqgrid.additional", "pages/report/customerturnover/customerturnover.option"],
    function (Site, jqGridAdditional, CustomerTurnoverOption) {
        describe("CustomerTurnoverOption", function () {
            beforeAll(function () {
                spyOn(Site, "clone").and.callFake(function (obj) {
                    return obj;
                });

                spyOn(Site, "getResources").and.callFake(function (resources) {
                    return resources;
                });
            });

            describe("getGridOption()", function () {
                it("calls function to get column names and models", function () {
                    spyOn(CustomerTurnoverOption, "getColName");
                    spyOn(CustomerTurnoverOption, "getColModel");

                    CustomerTurnoverOption.getGridOption();

                    expect(CustomerTurnoverOption.getColName).toHaveBeenCalled();
                    expect(CustomerTurnoverOption.getColModel).toHaveBeenCalled();
                });
            });

            describe("getColName()", function () {
                var customerWlTotalIndex = 12;

                it("customerWlTotal column name should be 'Total' if report has Customer comm", function () {
                    CustomerTurnoverOption.hasCustomerComm = true;

                    var colNames = CustomerTurnoverOption.getColName();

                    expect(colNames[customerWlTotalIndex]).toBe("Total");
                });

                it("customerWlTotal column name should be 'CustomerW_L' if report has Customer comm", function () {
                    CustomerTurnoverOption.hasCustomerComm = false;

                    var colNames = CustomerTurnoverOption.getColName();

                    expect(colNames[customerWlTotalIndex]).toBe("CustomerW_L");
                });
            });

            describe("getColModel()", function () {
                var customerWlIndex = 10;
                var playerIndex = 11;
                var dateIndex = 1;

                it("customerWl columns should be hidden if report does not have Customer comm", function () {
                    CustomerTurnoverOption.hasCustomerComm = false;

                    var colNames = CustomerTurnoverOption.getColModel();

                    expect(colNames[customerWlIndex].hidden).toBe(true);
                    expect(colNames[playerIndex].hidden).toBe(true);
                });

                it("date column format should be 'm/Y' if report is monthly", function () {
                    CustomerTurnoverOption.reportBy = "2";

                    var colNames = CustomerTurnoverOption.getColModel();

                    expect(colNames[dateIndex].formatoptions.newformat).toBe("m/Y");
                });
            });
        });
    });