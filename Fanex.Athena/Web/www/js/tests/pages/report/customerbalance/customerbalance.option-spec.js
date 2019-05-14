define(["jquery", "common/site", "pages/report/customerbalance/customerbalance.option", ],
    function ($, Site, CustomerBalanceOption) {
        describe("CustomerBalanceOption", function () {
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

            describe("getGridOption(totalRows)", function () {
                it("calls function to get column names and models", function () {
                    spyOn(CustomerBalanceOption, "getColName");
                    spyOn(CustomerBalanceOption, "getColModel");

                    CustomerBalanceOption.getGridOption(0);

                    expect(CustomerBalanceOption.getColName).toHaveBeenCalled();
                    expect(CustomerBalanceOption.getColModel).toHaveBeenCalled();
                });
            });

            describe("setGroupHeaderColumns($grid)", function () {
                beforeEach(function () {
                    setFixtures("<div id='grid'></div>");
                    spyOn($.fn, "jqGrid");
                });

                it("sets group header for Customer columns if report has Customer comm", function () {
                    CustomerBalanceOption.hasCustomerComm = true;
                    CustomerBalanceOption.isAllowBA = false;

                    CustomerBalanceOption.setGroupHeaderColumns($("#grid"));

                    expect($.fn.jqGrid).toHaveBeenCalledWith("setGroupHeaders",
                        {
                            useColSpanStyle: true,
                            groupHeaders: [{
                                startColumnName: "WinLoss",
                                numberOfColumns: 3,
                                titleText: "CustomerW_L"
                            }, {}]
                        });
                });

                it("sets group header for BA columns if report allows BA", function () {
                    CustomerBalanceOption.hasCustomerComm = false;
                    CustomerBalanceOption.isAllowBA = true;

                    CustomerBalanceOption.setGroupHeaderColumns($("#grid"));

                    expect($.fn.jqGrid).toHaveBeenCalledWith("setGroupHeaders",
                        {
                            useColSpanStyle: true,
                            groupHeaders: [{}, {
                                startColumnName: "TurnoverBA",
                                numberOfColumns: 3,
                                titleText: "ProductBA"
                            }]
                        });
                });
            });

            describe("getColName()", function () {
                it("inserts Customer comm columns if report has Customer comm", function () {
                    CustomerBalanceOption.hasCustomerComm = true;
                    CustomerBalanceOption.isAllowBA = false;

                    var result = CustomerBalanceOption.getColName();

                    expect(result[CustomerBalanceOption.customerCommIndex + 1]).toBe("WinLoss");
                });

                it("does not insert Customer comm columns if report has Customer comm", function () {
                    CustomerBalanceOption.hasCustomerComm = false;
                    CustomerBalanceOption.isAllowBA = false;

                    var result = CustomerBalanceOption.getColName();

                    expect(result[CustomerBalanceOption.customerCommIndex + 1]).toBe("CustomerW_L");
                });

                it("inserts BA columns if report allows BA", function () {
                    CustomerBalanceOption.hasCustomerComm = false;
                    CustomerBalanceOption.isAllowBA = true;

                    var result = CustomerBalanceOption.getColName();

                    expect(result[CustomerBalanceOption.productBAIndex + 1]).toBe("Turnover");
                });
            });

            describe("getColModel(totalRows)", function () {
                it("inserts Customer comm columns if report has Customer comm", function () {
                    CustomerBalanceOption.hasCustomerComm = true;
                    CustomerBalanceOption.isAllowBA = false;

                    var result = CustomerBalanceOption.getColModel(2);

                    expect(result[CustomerBalanceOption.customerCommIndex + 1].index).toBe("CustomerWinLoss");
                });

                it("does not insert Customer comm columns if report has Customer comm", function () {
                    CustomerBalanceOption.hasCustomerComm = false;
                    CustomerBalanceOption.isAllowBA = false;

                    var result = CustomerBalanceOption.getColModel(2);

                    expect(result[CustomerBalanceOption.customerCommIndex + 1].index).toBe("CustomerW_L");
                });

                it("inserts BA columns if report allows BA", function () {
                    CustomerBalanceOption.hasCustomerComm = false;
                    CustomerBalanceOption.isAllowBA = true;

                    var result = CustomerBalanceOption.getColModel(2);

                    expect(result[CustomerBalanceOption.productBAIndex + 1].index).toBe("ProductBATurnover");
                });

                it("disables sorting if total rows is 1", function () {
                    CustomerBalanceOption.hasCustomerComm = false;
                    CustomerBalanceOption.isAllowBA = false;

                    var result = CustomerBalanceOption.getColModel(1);

                    $.each(result, function (index, item) {
                        expect(item.sortable).toBe(false);
                    });
                });

                it("returns correct attribute for externalId cell", function () {
                    CustomerBalanceOption.hasCustomerComm = false;
                    CustomerBalanceOption.isAllowBA = false;

                    var models = CustomerBalanceOption.getColModel(2);
                    var externalIdColumn = models[1];
                    var result = externalIdColumn.cellattr();

                    expect(result).toBe(' style="text-overflow: ellipsis"');
                });
            });

            describe("getOrderColumnCode(indexColumn, sortType)", function () {
                it("returns 0 if sort type is asc and sort column is not customer WL column", function () {
                    var result = CustomerBalanceOption.getOrderColumnCode("index", "asc");

                    expect(result).toBe(0);
                });

                it("returns 4 if sort type is desc and sort column is customer WL column", function () {
                    var result = CustomerBalanceOption.getOrderColumnCode("CustomerWinLoss", "desc");

                    expect(result).toBe(4);
                });

                it("returns 5 if sort type is asc and sort column is customer WL column", function () {
                    var result = CustomerBalanceOption.getOrderColumnCode("CustomerWinLoss", "asc");

                    expect(result).toBe(5);
                });

                it("returns 1 if sort column is deposit column", function () {
                    var result = CustomerBalanceOption.getOrderColumnCode("Deposit", "desc");

                    expect(result).toBe(1);
                });

                it("returns 2 if sort column is withdrawal column", function () {
                    var result = CustomerBalanceOption.getOrderColumnCode("Withdrawal", "desc");

                    expect(result).toBe(2);
                });

                it("returns 3 if sort column is turnover column", function () {
                    var result = CustomerBalanceOption.getOrderColumnCode("Turnover", "desc");

                    expect(result).toBe(3);
                });

                it("returns 6 if sort column is opening balance column", function () {
                    var result = CustomerBalanceOption.getOrderColumnCode("OpeningBalance", "desc");

                    expect(result).toBe(6);
                });

                it("returns 7 if sort column is closing balance column", function () {
                    var result = CustomerBalanceOption.getOrderColumnCode("ClosingBalance", "desc");

                    expect(result).toBe(7);
                });

                it("returns 0 by default", function () {
                    var result = CustomerBalanceOption.getOrderColumnCode("", "desc");

                    expect(result).toBe(0);
                });
            });
        });
    });