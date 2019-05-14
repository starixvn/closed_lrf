define(["jquery", "common/site", "lib/jqgrid/jquery.jqgrid.additional", 'pages/report/agcasinowinloss/agcasinowinloss.option'],
    function ($, Site, jqGridAdditional, AgCasinoWinLossOption) {
        describe("AgCasinoWinLossOption", function () {
            var systemIdIndex = 3;
            var externalIdIndex = 2;
            var currencyIndex = 4;
            var dateIndex = 1;

            beforeAll(function () {
                spyOn(Site, "getResources").and.callFake(function (arrayStr) {
                    return arrayStr;
                });
            });

            describe("getColName()", function () {
                it("returns all column name list", function () {
                    var colName = AgCasinoWinLossOption.getColName();

                    expect(colName.length).toBeGreaterThan(0);
                    expect(colName[0]).toBe("#");
                });
            });

            describe("getColModel(level)", function () {
                it("hides systemIdColumn if level is 0", function () {
                    var colModel = AgCasinoWinLossOption.getColModel(0);

                    expect(colModel[systemIdIndex].hidden).toBe(true);
                });

                it("currencyColumn formatter should not be null if level is 0", function () {
                    var colModel = AgCasinoWinLossOption.getColModel(0);

                    expect(colModel[currencyIndex].formatter).not.toBe(null);
                    expect(colModel[systemIdIndex].formatter).toBe(null);
                });

                it("hides externalIdColumn if level is not 2", function () {
                    var colModel = AgCasinoWinLossOption.getColModel(1);

                    expect(colModel[externalIdIndex].hidden).toBe(true);
                });

                it("systemIdColumn formatter should not be null if level is 1", function () {
                    var colModel = AgCasinoWinLossOption.getColModel(1);

                    expect(colModel[systemIdIndex].formatter).not.toBe(null);
                    expect(colModel[currencyIndex].formatter).toBe(null);
                });

                it("hides dateColumn if level is not 0", function () {
                    var colModel = AgCasinoWinLossOption.getColModel(1);

                    expect(colModel[dateIndex].hidden).toBe(true);
                });

                it("dateColumn formatter should be 'm/d/Y' if reportbydaily is checked", function () {
                    setFixtures('<input type="radio" id="reportbydaily" checked />');
                    var colModel = AgCasinoWinLossOption.getColModel(0);

                    expect(colModel[dateIndex].formatoptions.newformat).toBe("m/d/Y");
                });
            });

            describe("getGridOption(level)", function () {
                it("calls methods to get columns", function () {
                    spyOn(AgCasinoWinLossOption, "getColName");
                    spyOn(AgCasinoWinLossOption, "getColModel");
                    spyOn(Site, "clone");

                    AgCasinoWinLossOption.getGridOption();

                    expect(AgCasinoWinLossOption.getColName).toHaveBeenCalled();
                    expect(AgCasinoWinLossOption.getColModel).toHaveBeenCalled();
                    expect(Site.clone).toHaveBeenCalled();
                });
            });

            describe("setDrillDownLink(level, currencyId, custId, datetime, cellvalue)", function () {
                it("returns correct formatter", function () {
                    var level = 1;
                    var colModel = AgCasinoWinLossOption.getColModel(level);
                    var systemIdColumn = colModel[systemIdIndex];
                    var rowObject = {
                        CurrencyId: 1,
                        CustomerId: 2,
                        Date: "01/01/2011"
                    };

                    var cellvalue = 0;
                    var expectedFormatter = '<a class="drilldown" href="javascript:;" data-drilldown=\'{\"level\":2,\"currencyId\":1,\"custId\":2,\"datetime\":\"01/01/2011\"}\'>0</a>';

                    var formatter = systemIdColumn.formatter(cellvalue, {}, rowObject);

                    expect(formatter).toEqual(expectedFormatter);
                });
            });

            describe("currencyFormatter(cellvalue, options, rowObject)", function () {
                it("returns correct formatter", function () {
                    var level = 0;
                    var colModel = AgCasinoWinLossOption.getColModel(level);
                    var currencyColumn = colModel[currencyIndex];
                    var rowObject = {
                        CurrencyId: 1,
                        CustomerId: 2,
                        Date: "01/01/2011"
                    };

                    var cellvalue = 0;
                    var expectedFormatter = '<a class="drilldown" href="javascript:;" data-drilldown=\'{\"level\":1,\"currencyId\":1,\"custId\":0,\"datetime\":\"01/01/2011\"}\'>0</a>';

                    var formatter = currencyColumn.formatter(cellvalue, {}, rowObject);

                    expect(formatter).toEqual(expectedFormatter);
                });
            });
        });
    });