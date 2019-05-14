define([
    "jquery",
    "common/site",
    "pages/report/customerwinloss/customerwinloss.option"],
    function ($, Site, CustomerWinLossOption) {
        describe("CustomerWinLossOption", function () {
            beforeAll(function () {
                spyOn(Site, "clone").and.callFake(function (obj) {
                    return obj;
                });

                spyOn(Site, "getResources").and.callFake(function (resources) {
                    return resources;
                });

                spyOn(Site, "getSingleResource").and.callFake(function (resource) {
                    return resource;
                });
            });

            describe("getGridOption()", function () {
                it("calls function to get column names and models", function () {
                    spyOn(CustomerWinLossOption, "getColName");
                    spyOn(CustomerWinLossOption, "getColModel");

                    CustomerWinLossOption.getGridOption();

                    expect(CustomerWinLossOption.getColName).toHaveBeenCalled();
                    expect(CustomerWinLossOption.getColModel).toHaveBeenCalled();
                });
            });

            describe("getColName()", function () {
                it("returns all column name list", function () {
                    var colName = CustomerWinLossOption.getColName();

                    expect(colName.length).toBeGreaterThan(0);
                    expect(colName[0]).toBe("#");
                });
            });

            describe("getColModel(totalRows)", function () {
                var customerWlTotalIndex = 7;
                var playerCommIndex = 6;
                var bacommIndex = 10;
                var amtDueToBAIndex = 11;
                var externalIdIndex = 1;
                var systemIdIndex = 2;

                it("customer comm columns should be hidden if report does not have Customer Comm column", function () {
                    spyOn(Site, "isFakeLicensee").and.returnValue(false);
                    CustomerWinLossOption.hasCustomerComm = false;

                    var colModels = CustomerWinLossOption.getColModel(10);

                    expect(colModels[customerWlTotalIndex].hidden).toBe(true);
                    expect(colModels[playerCommIndex].hidden).toBe(true);
                });

                it("customer comm columns should be hidden if report does not allow BA", function () {
                    spyOn(Site, "isFakeLicensee").and.returnValue(false);
                    CustomerWinLossOption.isAllowBA = false;

                    var colModels = CustomerWinLossOption.getColModel(10);

                    expect(colModels[bacommIndex].hidden).toBe(true);
                    expect(colModels[amtDueToBAIndex].hidden).toBe(true);
                });

                it("systemId column should be hidden if licensee is fake", function () {
                    spyOn(Site, "isFakeLicensee").and.returnValue(true);

                    var colModels = CustomerWinLossOption.getColModel(10);

                    expect(colModels[systemIdIndex].hidden).toBe(true);
                });

                it("should disable sorting if total row is 1", function () {
                    spyOn(Site, "isFakeLicensee").and.returnValue(false);

                    var result = CustomerWinLossOption.getGridOption(1);

                    $.each(result.colModel, function (index, value) {
                        expect(value.sortable).toBe(false);
                    });
                });

                it("returns correct CustomerWinLossOption for externalId cell", function () {
                    spyOn(Site, "isFakeLicensee").and.returnValue(false);

                    var models = CustomerWinLossOption.getColModel(2);
                    var externalIdColumn = models[externalIdIndex];
                    var result = externalIdColumn.cellattr();

                    expect(result).toBe(' style="text-overflow: ellipsis"');
                });

                it("returns correct formatter for externalId cell", function () {
                    spyOn(Site, "isFakeLicensee").and.returnValue(false);
                    var expectedFormat = '<a class="bet-list-link" href="javascript:;" data-drill-down=\'{"CustId":1,"ExternalId":2,"SystemId":3}\'>0</a>';

                    var models = CustomerWinLossOption.getColModel(2);
                    var externalIdColumn = models[externalIdIndex];
                    var result = externalIdColumn.formatter(0, {}, { CustId: 1, ExternalId: 2, SystemId: 3 });

                    expect(result).toEqual(expectedFormat);
                });
            });

            describe("setGroupHeaderColumns(grid)", function () {
                it("setGroupHeaders should be called with correct params if report has Customer Comm column", function () {
                    setFixtures('<div id="grid"></div>');
                    spyOn($.fn, "jqGrid");
                    CustomerWinLossOption.hasCustomerComm = true;

                    CustomerWinLossOption.setGroupHeaderColumns($("#grid"));

                    expect($.fn.jqGrid).toHaveBeenCalledWith("setGroupHeaders", {
                        useColSpanStyle: true,
                        groupHeaders: [{
                            startColumnName: "CustomerWL",
                            numberOfColumns: 3,
                            titleText: "CustomerW_L"
                        }]
                    });
                });

                it("setGroupHeaders should be called with empty params if report does not have Customer Comm column", function () {
                    setFixtures('<div id="grid"></div>');
                    spyOn($.fn, "jqGrid");
                    CustomerWinLossOption.hasCustomerComm = false;

                    CustomerWinLossOption.setGroupHeaderColumns($("#grid"));

                    expect($.fn.jqGrid).toHaveBeenCalledWith("setGroupHeaders", {
                        useColSpanStyle: true,
                        groupHeaders: [{}]
                    });
                });
            });
        });
    });