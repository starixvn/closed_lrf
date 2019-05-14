"use strict";
define(["jquery", "common/site", "lib/jqgrid/jquery.jqgrid.additional", "pages/report/cashoutwinloss/cashoutwinloss.option", "lib/jqgrid/jquery.jqGrid.min"],
    function ($, Site, jqGridAdditional, CashoutWinLossOption) {
        describe("CashoutWinLossOption", function () {
            beforeAll(function () {
                spyOn(Site, "getSingleResource").and.callFake(function (resource) { return resource; });
            });

            describe("initial properties should be correct", function () {
                it("Default values are correct", function () {
                    expect(CashoutWinLossOption.isLicenseeOfferBA).toBe(false);
                    expect(CashoutWinLossOption.buyBackAmountTotalColumnIndex).toBe(10);
                    expect(CashoutWinLossOption.totalColspan).toEqual([2, 3]);
                    expect(CashoutWinLossOption.urlData).toBe("api/CashOutWinLossReport/Index");
                    expect(CashoutWinLossOption.urlExcelData).toBe("api/CashOutWinLossReport/Index");
                });

                it("gridOption should be correct with default value", function () {
                    var gridOption = {
                        datatype: 'local',
                        colNames: [],
                        colModel: [],
                        data: [],
                        userDataOnFooter: true,
                        userData: [],
                        height: '100%',
                        autowidth: false,
                        forceFit: false,
                        shrinkToFit: true,
                        loadtext: '',
                        loadui: 'disable',
                        loadonce: true,
                        footerrow: true,
                        rowNum: 2000,
                        grouping: true,
                        viewrecords: true,
                        gridview: true,
                        pager: '#ppdata',
                        rownumbers: true
                    };

                    expect(CashoutWinLossOption.gridOption).toEqual(gridOption);
                });
            });

            describe("setGroupHeaders($grid)", function () {
                var originalValue = CashoutWinLossOption.isLicenseeOfferBA;
                var method, option;

                beforeEach(function () {
                    spyOn($.fn, "jqGrid").and.callFake(function (param1, param2) { method = param1, option = param2; });
                    setFixtures('<div id="grid"></div>');
                });

                afterEach(function () {
                    CashoutWinLossOption.isLicenseeOfferBA = originalValue;
                });

                it("jqGrid should be called with correct parameter when Licensee do not offer BA", function () {
                    var expectedResult = {
                        useColSpanStyle: true,
                        groupHeaders: [
                            {},
                            {
                                startColumnName: "SettleAmountTicketPayout",
                                numberOfColumns: 3,
                                titleText: "SettleAmount"
                            }
                        ]
                    };

                    CashoutWinLossOption.setGroupHeaders($("#grid"));

                    expect($.fn.jqGrid).toHaveBeenCalled();
                    expect(method).toBe("setGroupHeaders");
                    expect(option).toEqual(expectedResult);
                });

                it("jqGrid should be called with correct parameter when Licensee offer BA", function () {
                    CashoutWinLossOption.isLicenseeOfferBA = true;
                    var expectedResult = {
                        useColSpanStyle: true,
                        groupHeaders: [
                            {
                                startColumnName: "BuyBackAmountSB",
                                numberOfColumns: 3,
                                titleText: "BuyBackAmount"
                            },
                            {
                                startColumnName: "SettleAmountTicketPayout",
                                numberOfColumns: 3,
                                titleText: "SettleAmount"
                            }
                        ]
                    };

                    CashoutWinLossOption.setGroupHeaders($("#grid"));

                    expect($.fn.jqGrid).toHaveBeenCalled();
                    expect(method).toBe("setGroupHeaders");
                    expect(option).toEqual(expectedResult);
                });
            });

            describe("getColName()", function () {
                var originalValue = CashoutWinLossOption.isLicenseeOfferBA;

                beforeEach(function () {
                    spyOn(Site, "getResources").and.callFake(function (resource) { return resource; });
                });

                afterEach(function () {
                    CashoutWinLossOption.isLicenseeOfferBA = originalValue;
                });

                it("ColName should be returned correctly when Licensee do not offer BA", function () {
                    var expected = ['#', 'Date', 'ExternalId', "SystemId", "Currency",
                          'CashOutTimes', 'CashOutTickets', 'CashOutValue', 'ProductSB', 'ProductBA', 'BuyBackAmount', 'TicketPayout', 'CashOutCommission',
                          'TicketPayout', 'BBAmtComm', 'Total', 'CurrencyId', 'CustomerId'];

                    var result = CashoutWinLossOption.getColName();

                    expect(result).toEqual(expected);
                });

                it("ColName should be returned correctly when Licensee offer BA", function () {
                    CashoutWinLossOption.isLicenseeOfferBA = true;
                    var expected = ['#', 'Date', 'ExternalId', "SystemId", "Currency",
                          'CashOutTimes', 'CashOutTickets', 'CashOutValue', 'ProductSB', 'ProductBA', 'Total', 'TicketPayout', 'CashOutCommission',
                          'TicketPayout', 'BBAmtComm', 'Total', 'CurrencyId', 'CustomerId'];

                    var result = CashoutWinLossOption.getColName();

                    expect(result).toEqual(expected);
                });
            });

            describe("getColModel(level)", function () {
                var originalValue = CashoutWinLossOption.isLicenseeOfferBA;
                beforeEach(function () {
                    setFixtures('<input type="checkbox" id="reportbydaily" />');
                });

                afterEach(function () {
                    CashoutWinLossOption.isLicenseeOfferBA = originalValue;
                });

                it("formatter of currencyColumn should be correct with level is 0", function () {
                    var expected = '<a class="drilldown" href="javascript:;" onclick="return cashoutDrillDown(1,6,0,\'2017-03-25\');">EUR</a>';

                    var colModels = CashoutWinLossOption.getColModel(0);
                    var currencyColumn = colModels[4];
                    var result = currencyColumn.formatter("EUR", null, { CurrencyId: 6, Date: "2017-03-25" });

                    expect(result).toBe(expected);
                });

                it("formatter of currencyColumn should be correct with level is 1", function () {
                    var colModels = CashoutWinLossOption.getColModel(1);
                    var currencyColumn = colModels[4];
                    var result = currencyColumn.formatter;

                    expect(result).toBe(null);
                });

                it("dateColumn should be correct with level 0 and #reportbydaily is not checked", function () {
                    spyOn($.fn, "fmatter").and.callFake(function (param1, param2) { return param2; });
                    $("#reportbydaily").prop("checked", false);
                    var expectedFormat = '<a class="drilldown" href="javascript:;" onclick="return cashoutDrillDown(1,0,0,\'2017-03-25\');">03/2017</a>';

                    var colModels = CashoutWinLossOption.getColModel(0);
                    var dateColumn = colModels[1];
                    var dateFormattedResult = dateColumn.formatter("03/2017", null, { Date: "2017-03-25" });

                    expect($.fn.fmatter).toHaveBeenCalled();
                    expect(dateColumn.hidden).toBe(false);
                    expect(dateColumn.formatoptions.newformat).toBe('m/Y');
                    expect(dateFormattedResult).toBe(expectedFormat);
                });

                it("dateColumn should be correct with level 1 and #reportbydaily is checked", function () {
                    spyOn($.fn, "fmatter").and.callFake(function (param1, param2) { return param2; });
                    $("#reportbydaily").prop("checked", true);
                    var expectedFormat = '<a class="drilldown" href="javascript:;" onclick="return cashoutDrillDown(1,0,0,\'2017-03-25\');">2017-03-25</a>';
                    var colModels = CashoutWinLossOption.getColModel(1);
                    var dateColumn = colModels[1];
                    var dateFormattedResult = dateColumn.formatter("2017-03-25", null, { Date: "2017-03-25" });

                    expect($.fn.fmatter).toHaveBeenCalled();
                    expect(dateColumn.hidden).toBe(true);
                    expect(dateColumn.formatoptions.newformat).toBe('m/d/Y');
                    expect(dateFormattedResult).toBe(expectedFormat);
                });

                it("externalIdColumn and systemIdColumn are hidden when level is 0", function () {
                    var colModels = CashoutWinLossOption.getColModel(0);
                    var externalIdColumn = colModels[2];
                    var systemIdColumn = colModels[3];

                    expect(externalIdColumn.hidden).toBe(true);
                    expect(systemIdColumn.hidden).toBe(true);
                });

                it("externalIdColumn and systemIdColumn are visible when level is 1", function () {
                    var colModels = CashoutWinLossOption.getColModel(1);
                    var externalIdColumn = colModels[2];
                    var systemIdColumn = colModels[3];

                    expect(externalIdColumn.hidden).toBe(false);
                    expect(systemIdColumn.hidden).toBe(false);
                });

                it("externalIdColumn should has correct format", function () {
                    var colModels = CashoutWinLossOption.getColModel(1);
                    var externalIdColumn = colModels[2];

                    var cellObject = {
                        Date: "01-01-2017",
                        CurrencyId: 1,
                        CurrencyName: "EUR",
                        CustomerId: 2,
                        ExternalId: 3,
                        SystemId: 4
                    };

                    var drillDownObject = {
                        DrillDownDate: "01-01-2017",
                        DrillDownCurrencyId: 1,
                        DrillDownCurrencyName: "EUR",
                        CustomerId: 2,
                        ExternalId: 3,
                        SystemId: 4
                    };

                    var expected = '<a class="bet-list-link" href="javascript:;" data-drill-down=\'' + JSON.stringify(drillDownObject) + '\'>CellValue</a>';

                    var result = externalIdColumn.formatter("CellValue", null, cellObject);

                    expect(result).toBe(expected);
                });

                it("Columns for BuyBackAmount are inserted correctly", function () {
                    CashoutWinLossOption.isLicenseeOfferBA = true;
                    var colModels = CashoutWinLossOption.getColModel(1);

                    var buyBackAmountSBColumn = colModels[8];
                    var buyBackAmountBAColumn = colModels[9];
                    var buyBackAmountColumn = colModels[10];

                    expect(buyBackAmountSBColumn.name).toBe("BuyBackAmountSB");
                    expect(buyBackAmountSBColumn.index).toBe("BuyBackAmountSB");
                    expect(buyBackAmountBAColumn.name).toBe("BuyBackAmountBA");
                    expect(buyBackAmountBAColumn.index).toBe("BuyBackAmountBA");
                    expect(buyBackAmountColumn.name).toBe("TotalBuyBackAmount");
                    expect(buyBackAmountColumn.index).toBe("TotalBuyBackAmount");
                });
            });

            describe("getGridOption(level)", function () {
                beforeEach(function () {
                    spyOn(CashoutWinLossOption, "getColName").and.returnValues(["ColName1"]);
                    spyOn(CashoutWinLossOption, "getColModel").and.returnValues(["ColModel1"]);
                });

                it("getColName() should be called", function () {
                    CashoutWinLossOption.getGridOption(0);

                    expect(CashoutWinLossOption.getColName).toHaveBeenCalled();
                });

                it("getColModel() should be called with correct parameter", function () {
                    CashoutWinLossOption.getGridOption(0);

                    expect(CashoutWinLossOption.getColModel).toHaveBeenCalledWith(0);
                });

                it("result should be returned correctly", function () {
                    var result = CashoutWinLossOption.getGridOption(0);

                    expect(result.colNames).toEqual(["ColName1"]);
                    expect(result.colModel).toEqual(["ColModel1"]);
                });
            });

            describe("getTotalColModel(level)", function () {
                beforeEach(function () {
                    spyOn(CashoutWinLossOption, "getColModel").and.returnValues([{ formatter: "ABC", name: "CurrencyName" }]);
                });

                it("getColModel() should be called with correct parameter", function () {
                    CashoutWinLossOption.getTotalColModel(0);

                    expect(CashoutWinLossOption.getColModel).toHaveBeenCalledWith(0);
                });

                it("formatter of currencyNameColumn should be correct", function () {
                    var totalColModel = CashoutWinLossOption.getTotalColModel(0);
                    var currencyColumn = totalColModel[0];

                    expect(currencyColumn.formatter).toBe(null);
                });
            });
        });
    }
);