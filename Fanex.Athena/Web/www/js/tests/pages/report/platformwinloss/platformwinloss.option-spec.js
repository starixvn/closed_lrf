define(["jquery", "common/site", "lib/jqgrid/jquery.jqgrid.additional", 'pages/report/platformwinloss/platformwinloss.option'],
    function ($, Site, jqGridAdditional, PlatformWinLossOption) {
        describe("PlatformWinLossOption", function () {
            beforeAll(function () {
                spyOn(Site, "getResources").and.callFake(function (arrayStr) {
                    return arrayStr;
                });
            });

            describe("getColName", function () {
                it("Return three columns of customer win loss for level 0 when hasCustomerComm is true", function () {
                    PlatformWinLossOption.hasCustomerComm = true;
                    var level = 0;

                    var colName = PlatformWinLossOption.getColName(level, []);

                    expect(colName).toContain("@[Win]/@[Loss]");
                    expect(colName).toContain("Comm");
                    expect(colName).toContain("Total");
                });

                it("Return one column of customer win loss for level 0 when hasCustomerComm is false", function () {
                    PlatformWinLossOption.hasCustomerComm = false;
                    var level = 0;

                    var colName = PlatformWinLossOption.getColName(level, []);

                    expect(colName).toContain("Customer W/L");
                });

                it("Return three columns of customer win loss for level 1 when hasCustomerComm is true", function () {
                    PlatformWinLossOption.hasCustomerComm = true;
                    var level = 1;

                    var colName = PlatformWinLossOption.getColName(level, []);

                    expect(colName).toContain("@[Win]/@[Loss]");
                    expect(colName).toContain("Comm");
                    expect(colName).toContain("Total");
                });

                it("Return one column of customer win loss for level 1 when hasCustomerComm is false", function () {
                    PlatformWinLossOption.hasCustomerComm = false;
                    var level = 1;

                    var colName = PlatformWinLossOption.getColName(level, []);

                    expect(colName).toContain("Customer W/L");
                });

                it("Return two columns of BA for level 1 when allow BA", function () {
                    var productOptions = [{
                        Code: "BA",
                        Status: true
                    }];
                    var level = 1;

                    var colName = PlatformWinLossOption.getColName(level, productOptions);

                    expect(colName).toContain("BA<br/>@[Commission]");
                    expect(colName).toContain("@[AmtDueToBA]");
                });

                it("Return no column of BA for level 1 when not allow BA", function () {
                    var productOptions = [{
                        Code: "SB",
                        Status: true
                    }];
                    var level = 1;

                    var colName = PlatformWinLossOption.getColName(level, productOptions);

                    expect(colName).not.toContain("BA<br/>@[Commission]");
                    expect(colName).not.toContain("@[AmtDueToBA]");
                });
            });

            describe("getColModel", function () {
                it("Return three columns of customer win loss for level 0 when hasCustomerComm is true", function () {
                    PlatformWinLossOption.hasCustomerComm = true;
                    var level = 0;
                    var customerWlIndex = 5;

                    var colModel = PlatformWinLossOption.getColModel(level, []);

                    expect(colModel[customerWlIndex++].name).toBe("CustomerWinLoss");
                    expect(colModel[customerWlIndex++].name).toBe("CustomerComm");
                    expect(colModel[customerWlIndex].name).toBe("CustomerTotal");
                });

                it("Return one column of customer win loss for level 0 when hasCustomerComm is false", function () {
                    PlatformWinLossOption.hasCustomerComm = false;
                    var level = 0;
                    var customerWlIndex = 5;

                    var colModel = PlatformWinLossOption.getColModel(level, []);

                    expect(colModel[customerWlIndex++].name).toBe("CustomerTotal");
                    expect(colModel[customerWlIndex++].name).not.toBe("CustomerWinLoss");
                    expect(colModel[customerWlIndex].name).not.toBe("CustomerComm");
                });

                it("Return three columns of customer win loss for level 1 when hasCustomerComm is true", function () {
                    PlatformWinLossOption.hasCustomerComm = true;
                    var level = 1;
                    var customerWlIndex = 6;

                    var colModel = PlatformWinLossOption.getColModel(level, []);

                    expect(colModel[customerWlIndex++].name).toBe("CustomerWinLoss");
                    expect(colModel[customerWlIndex++].name).toBe("CustomerComm");
                    expect(colModel[customerWlIndex].name).toBe("CustomerTotal");
                });

                it("Return one column of customer win loss for level 1 when hasCustomerComm is false", function () {
                    PlatformWinLossOption.hasCustomerComm = false;
                    var level = 1;
                    var customerWlIndex = 6;

                    var colModel = PlatformWinLossOption.getColModel(level, []);

                    expect(colModel[customerWlIndex++].name).toBe("CustomerTotal");
                    expect(colModel[customerWlIndex++].name).not.toBe("CustomerWinLoss");
                    expect(colModel[customerWlIndex].name).not.toBe("CustomerComm");
                });

                it("Return two columns of BA for level 1 when allow BA", function () {
                    PlatformWinLossOption.hasCustomerComm = false;
                    var productOptions = [{
                        Code: "BA",
                        Status: true
                    }];
                    var level = 1;
                    var baIndex = 8;

                    var colModel = PlatformWinLossOption.getColModel(level, productOptions);

                    expect(colModel[baIndex++].name).toBe("BACommission");
                    expect(colModel[baIndex].name).toBe("AmtDueToBA");
                });

                it("Return no column of BA for level 1 when not allow BA", function () {
                    PlatformWinLossOption.hasCustomerComm = false;
                    var productOptions = [{
                        Code: "SB",
                        Status: true
                    }];
                    var level = 1;
                    var baIndex = 8;

                    var colModel = PlatformWinLossOption.getColModel(level, productOptions);

                    expect(colModel[baIndex++].name).not.toBe("BACommission");
                    expect(colModel[baIndex].name).not.toBe("AmtDueToBA");
                });

                it("Return full columns of level 1 with correct index", function () {
                    PlatformWinLossOption.hasCustomerComm = true;
                    var productOptions = [{
                        Code: "BA",
                        Status: true
                    }];
                    var level = 1;
                    var index = 6;

                    var colModel = PlatformWinLossOption.getColModel(level, productOptions);

                    expect(colModel[index++].name).toBe("CustomerWinLoss");
                    expect(colModel[index++].name).toBe("CustomerComm");
                    expect(colModel[index++].name).toBe("CustomerTotal");
                    ++index;
                    expect(colModel[index++].name).toBe("BACommission");
                    expect(colModel[index].name).toBe("AmtDueToBA");
                });
            });

            describe("getGridOption", function () {
                it("getGridOption should be called and return gridOption", function () {
                    var productOptions = [
                        {
                            Code: "BA",
                            Status: true
                        },
                        {
                            Code: "RB",
                            Status: true
                        }];
                    var level = 1;

                    var option = PlatformWinLossOption.getGridOption(level, productOptions);

                    expect(option).toBe(PlatformWinLossOption.gridOption);
                })
            });

            describe("betlistLink", function () {
                it("Return correct formatter", function () {
                    PlatformWinLossOption.hasCustomerComm = true;
                    var level = 1;
                    var colModel = PlatformWinLossOption.getColModel(level, []);
                    var externalIdColumn = colModel[1];
                    var rowObject = {
                        CurrencyId: 1,
                        CurrencyName: "Test",
                        CustomerId: 1,
                        ExternalId: 1,
                        SystemId: 1
                    };
                    var cellvalue = 0;
                    var expectedFormatter = '<a class="bet-list-link" href="javascript:;" data-drill-down=\'{"DrillDownCurrencyId":1,"DrillDownCurrencyName":"Test","CustomerId":1,"ExternalId":1,"SystemId":1}\'>0</a>';

                    var formatter = externalIdColumn.formatter(cellvalue, {}, rowObject);

                    expect(formatter).toEqual(expectedFormatter);
                });
            });

            describe("drilldownLink", function () {
                it("Return correct formatter if row is parent", function () {
                    PlatformWinLossOption.hasCustomerComm = true;
                    var level = 0;
                    var colModel = PlatformWinLossOption.getColModel(level, []);
                    var platformNameColumn = colModel[1];
                    var rowObject = {
                        Parent: 1,
                        IsLeaf: false,
                        PlatformType: 2,
                        ProductCode: "SB"
                    };
                    var cellvalue = 0;
                    var expectedFormatter = '<a class="drilldown text-bold" href="javascript:;" data-drill-down=\'{"PlatformType":2}\'>0</a>';

                    var formatter = platformNameColumn.formatter(cellvalue, {}, rowObject);

                    expect(formatter).toEqual(expectedFormatter);
                });

                it("Return correct formatter if row is leaf", function () {
                    PlatformWinLossOption.hasCustomerComm = true;
                    var level = 0;
                    var colModel = PlatformWinLossOption.getColModel(level, []);
                    var platformNameColumn = colModel[1];
                    var rowObject = {
                        Parent: 2,
                        IsLeaf: true,
                        PlatformType: -1,
                        ProductCode: "SB"
                    };
                    var cellvalue = 0;
                    var expectedFormatter = '<a class="drilldown" href="javascript:;" data-drill-down=\'{"PlatformType":2,"ProductCode":"SB"}\'>0</a>';

                    var formatter = platformNameColumn.formatter(cellvalue, {}, rowObject);

                    expect(formatter).toEqual(expectedFormatter);
                });
            });
        });
    });