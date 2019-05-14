define([
    "common/site",
    "pages/report/thirdpartywinloss/common/thirdpartywinloss.option"],
    function (Site, ThirdPartyWinLossOption) {
        describe("ThirdPartyWinLossOption", function () {
            var thirdPartyWinLossOption;
            var colNameList = ["Column1", "Column2", "Column3"];
            var colModelList = [
                {
                    name: "CurrencyName"
                }, {
                    name: "SystemId"
                }, {
                    name: "BetList"
                }];

            beforeAll(function () {
                spyOn(Site, "getResources").and.callFake(function (arrayStr) {
                    return arrayStr;
                });
                spyOn(Site, "clone").and.callFake(function (obj) {
                    return obj;
                });

                thirdPartyWinLossOption = new ThirdPartyWinLossOption({
                    ColNameList: colNameList,
                    ColModelList: colModelList
                });

                colModelList[0].formatter = thirdPartyWinLossOption.currencyFormatter;
                colModelList[1].formatter = thirdPartyWinLossOption.systemIdFormatter;
                colModelList[2].formatter = thirdPartyWinLossOption.betlistLink;
            });

            describe("getColName()", function () {
                it("should be returned list of column name", function () {
                    var result = thirdPartyWinLossOption.getColName();

                    expect(result.length).toBeGreaterThan(0);
                });
            });

            describe("getColModel()", function () {
                it("should be returned list of column model", function () {
                    var result = thirdPartyWinLossOption.getColModel();

                    expect(result.length).toBeGreaterThan(0);
                });
            });

            describe("getGridOption(level, reportBy)", function () {
                it("should be returned grid option with column names and column models", function () {
                    var result = thirdPartyWinLossOption.getGridOption(0, 0);

                    expect(result.colNames).toEqual(colNameList);
                    expect(result.colModel).toEqual(colModelList);
                });
            });

            describe("currencyFormatter(cellvalue, options, rowObject, level)", function () {
                it("returns correct formatter", function () {
                    var level = 0;
                    var currencyColumn = colModelList[0];
                    var rowObject = {
                        CurrencyId: 1,
                        CustomerId: 2,
                        Date: "01/01/2011"
                    };

                    var cellvalue = 0;
                    var expectedFormatter = '<a class="drilldown" href="javascript:;" data-drill-down=\'{"Level":0,"CurrencyId":1,"CustId":0,"Datetime":"01/01/2011"}\'>0</a>';

                    var formatter = currencyColumn.formatter(cellvalue, {}, rowObject, level);

                    expect(formatter).toEqual(expectedFormatter);
                });
            });

            describe("systemIdFormatter(cellvalue, options, rowObject)", function () {
                it("returns correct formatter", function () {
                    var systemIdColumn = colModelList[1];
                    var rowObject = {
                        CurrencyId: 1,
                        CustomerId: 2,
                        Date: "01/01/2011"
                    };

                    var cellvalue = 0;
                    var expectedFormatter = '<a class="drilldown" href="javascript:;" data-drill-down=\'{"Level":2,"CurrencyId":1,"CustId":2,"Datetime":"01/01/2011"}\'>0</a>';

                    var formatter = systemIdColumn.formatter(cellvalue, {}, rowObject);

                    expect(formatter).toEqual(expectedFormatter);
                });
            });

            describe("betlistLink(cellvalue, options, rowObject)", function () {
                it("returns correct formatter", function () {
                    var level = 0;
                    var betlistColumn = colModelList[2];
                    var rowObject = {
                        Date: "01/01/2011",
                        CurrencyId: 1,
                        CurrencyName: "usd",
                        CustomerId: 2,
                        ExternalId: 3,
                        SystemId: 4
                    };

                    var cellvalue = 0;
                    var expectedFormatter = '<a class="bet-list-link" href="javascript:;" '
                        + 'data-drill-down=\'{"DrillDownDate":"01/01/2011","DrillDownCurrencyId":1,"DrillDownCurrencyName":"usd","CustomerId":2,"ExternalId":3,"SystemId":4}\'>'
                        + '0</a>';

                    var formatter = betlistColumn.formatter(cellvalue, {}, rowObject);

                    expect(formatter).toEqual(expectedFormatter);
                });
            });

            describe("getTotalColModel(level, reportBy)", function () {
                it("should be returned list of column model", function () {
                    colModelList[0].name = "";

                    var result = thirdPartyWinLossOption.getTotalColModel(0, 0);

                    expect(result).toEqual(colModelList);
                });

                it("should be returned list of column model with no formatter for CurrencyName column", function () {
                    colModelList[0].name = "CurrencyName";

                    var result = thirdPartyWinLossOption.getTotalColModel(0, 0);

                    expect(result[0].formatter).toEqual(null);
                });
            });
        });
    });