define(["jquery", "common/site", "pages/report/winlossbyproduct/winlossbyproduct.option"],
    function ($, Site, WinLossByProductOption) {
        describe("WinLossByProductOption", function () {
            beforeAll(function () {
                spyOn(Site, "getResources").and.callFake(function (resource) { return resource; });
                spyOn(Site, "getSingleResource").and.callFake(function (resource) { return resource; });
            });

            describe("Default Option", function () {
                it("Initial values should be correct", function () {
                    var expectedGridOption = {
                        datatype: 'local',
                        colNames: [],
                        colModel: [],
                        data: [],
                        height: 'auto',
                        autowidth: false,
                        forceFit: false,
                        shrinkToFit: true,
                        loadtext: '',
                        loadui: 'disable',
                        loadonce: true,
                        footerrow: true,
                        pager: '#ppdata',
                        userDataOnFooter: true,
                        userData: [],
                        viewrecords: true,
                        gridview: true,
                        sortname: "Index",
                        rowList: [50, 100, 200, 300, 400, 500, 1000, 2000]
                    };
                    expect(WinLossByProductOption.currencyIndex).toBe(4);
                    expect(WinLossByProductOption.systemIdIndex).toBe(3);
                    expect(WinLossByProductOption.externalIdIndex).toBe(2);
                    expect(WinLossByProductOption.customerWlIndex).toBe(8);

                    expect(WinLossByProductOption.pageSize).toBe(50);
                    expect(WinLossByProductOption.nonePagingSize).toBe(3000);
                    expect(WinLossByProductOption.rowNum).toBe(50);
                    expect(WinLossByProductOption.totalColspan).toEqual([1, 2, 3]);
                    expect(WinLossByProductOption.urlData).toBe("api/WinLossByProductReport/Index");
                    expect(WinLossByProductOption.urlExcelData).toBe("api/WinLossByProductReport/Index");

                    expect(WinLossByProductOption.gridOption).toEqual(expectedGridOption);
                });
            });

            describe("getColName()", function () {
                it("colNameList length should equal 14", function () {
                    expect(WinLossByProductOption.getColName().length).toBe(14);
                });

                it("index of customerWlIndex should has value '@[Win]/@[Loss]' when 'hasCustomerComm' equal true", function () {
                    WinLossByProductOption.hasCustomerComm = true;
                    var colNameList = WinLossByProductOption.getColName();
                    expect(colNameList[WinLossByProductOption.customerWlIndex]).toBe("@[Win]/@[Loss]");
                });

                it("index of customerWlTotalIndex should has value 'CustomerW_L' when 'hasCustomerComm' equal false", function () {
                    WinLossByProductOption.hasCustomerComm = false;
                    var colNameList = WinLossByProductOption.getColName();
                    expect(colNameList[WinLossByProductOption.customerWlIndex]).toBe("CustomerW_L");
                });
            });

            describe("getColModel(level, reportBy)", function () {
                beforeAll(function () {
                    spyOn(Site, "isFakeLicensee").and.returnValue(true);
                });

                it("colModelList length should equal 14", function () {
                    expect(WinLossByProductOption.getColModel(0, 2).length).toBe(14);
                });

                it("dateColumn of colModel should be hidden when level greater than 0", function () {
                    var colModel = WinLossByProductOption.getColModel(1, 2);
                    var dateColumn = colModel[1];
                    expect(dateColumn.hidden).toBe(true);
                });

                it("dateColumn of colModel should be showed when level equal 0", function () {
                    var colModel = WinLossByProductOption.getColModel(0, 2);
                    var dateColumn = colModel[1];
                    expect(dateColumn.hidden).toBe(false);
                });

                it("systemIdColumn of colModel should be hidden when licensee is fake", function () {
                    var colModel = WinLossByProductOption.getColModel(0, 2);
                    var systemIdColumn = colModel[3];
                    expect(systemIdColumn.hidden).toBe(true);
                });

                it("format option of dateColumn should be 'm/Y' when reportBy equal 2", function () {
                    var colModel = WinLossByProductOption.getColModel(0, 2);
                    var dateColumn = colModel[1];
                    expect(dateColumn.formatoptions.newformat).toBe("m/Y");
                });

                it("format option of dateColumn should be 'm/d/Y' when reportBy not equal 2", function () {
                    var colModel = WinLossByProductOption.getColModel(0, 1);
                    var dateColumn = colModel[1];
                    expect(dateColumn.formatoptions.newformat).toBe("m/d/Y");
                });

                it("LicenseeWlCommColumn should be hidden when IsAllowBA is false", function () {
                    var originalIsAllowBA = WinLossByProductOption.IsAllowBA;

                    WinLossByProductOption.IsAllowBA = false;
                    var colModel = WinLossByProductOption.getColModel(0, 1);
                    var LicenseeWlCommColumn = colModel[12];

                    WinLossByProductOption.IsAllowBA = originalIsAllowBA;

                    expect(LicenseeWlCommColumn.hidden).toBe(true);
                });
            });

            describe("getGridOption(level, reportBy)", function () {
                it("gridOption.grouping should be true when level equal 0", function () {
                    var gridOption = WinLossByProductOption.getGridOption(0, 1);

                    expect(gridOption.grouping).toBe(true);
                });

                it("gridOption.groupingView should be correct object when level equal 0", function () {
                    var gridOption = WinLossByProductOption.getGridOption(0, 1);

                    expect(gridOption.groupingView).toEqual({
                        groupField: ['Date'],
                        groupColumnShow: [false],
                        plusicon: "ui-icon-circlesmall-plus icon-arrow",
                        minusicon: "ui-icon-circlesmall-minus icon-arrow"
                    });
                });

                it("gridOption.grouping should be false when level not equal 0", function () {
                    var gridOption = WinLossByProductOption.getGridOption(1, 1);

                    expect(gridOption.grouping).toBe(false);
                });

                it("gridOption.groupingView should be null when level not equal 0", function () {
                    var gridOption = WinLossByProductOption.getGridOption(1, 1);

                    expect(gridOption.groupingView).toEqual(null);
                });
            });

            describe("getTotalColModel(level)", function () {
                it("formatter of currencyColumn should be null", function () {
                    var colModel = WinLossByProductOption.getTotalColModel(0);

                    expect(colModel[4].formatter).toBe(null);
                });
            });

            describe("formatter of column model", function () {
                var originalLicenseeId;
                beforeEach(function () {
                    originalLicenseeId = WinLossByProductOption.licenseeId;
                });

                afterEach(function () {
                    WinLossByProductOption.licenseeId = originalLicenseeId;
                });

                it("format of currencyColumn with licenseeId is 1 should be correct", function () {
                    WinLossByProductOption.licenseeId = 1;
                    var cellValue = "Test";
                    var dataDrilldown = {
                        level: 1,
                        currencyId: 1,
                        custId: 0,
                        datetime: "05/01/2017",
                        currencyName: "EUR"
                    };
                    var drilldownJson = JSON.stringify(dataDrilldown);
                    var expectedResult = '<a class="drilldown" href="javascript:;" data-drill-down=\'' + drilldownJson + '\'>' + cellValue + '</a>';

                    var currencyColumn = WinLossByProductOption.getColModel(0, 1)[4];
                    var rowObject = {
                        CurrencyId: 1,
                        Date: "05/01/2017",
                        CurrencyName: "EUR"
                    };

                    var result = currencyColumn.formatter(cellValue, null, rowObject);

                    expect(result).toBe(expectedResult);
                });

                it("format of currencyColumn with licenseeId is not 1 should be correct", function () {
                    WinLossByProductOption.licenseeId = 2;
                    var cellValue = "Test";
                    var dataDrilldown = {
                        level: 2,
                        currencyId: 1,
                        custId: 0,
                        datetime: "05/01/2017",
                        currencyName: "EUR"
                    };
                    var drilldownJson = JSON.stringify(dataDrilldown);
                    var expectedResult = '<a class="drilldown" href="javascript:;" data-drill-down=\'' + drilldownJson + '\'>' + cellValue + '</a>';

                    var currencyColumn = WinLossByProductOption.getColModel(0, 1)[4];
                    var rowObject = {
                        CurrencyId: 1,
                        Date: "05/01/2017",
                        CurrencyName: "EUR"
                    };

                    var result = currencyColumn.formatter(cellValue, null, rowObject);

                    expect(result).toBe(expectedResult);
                });

                it("format of systemIdColumn should be correct", function () {
                    WinLossByProductOption.licenseeId = 1;
                    var cellValue = "Test";
                    var dataDrilldown = {
                        level: 2,
                        currencyId: 1,
                        custId: 1,
                        datetime: "05/01/2017",
                        currencyName: "EUR"
                    };
                    var drilldownJson = JSON.stringify(dataDrilldown);
                    var expectedResult = '<a class="drilldown" href="javascript:;" data-drill-down=\'' + drilldownJson + '\'>' + cellValue + '</a>';

                    var systemIdColumn = WinLossByProductOption.getColModel(1, 1)[3];
                    var rowObject = {
                        CurrencyId: 1,
                        CustomerId: 1,
                        Date: "05/01/2017",
                        CurrencyName: "EUR"
                    };

                    var result = systemIdColumn.formatter(cellValue, null, rowObject);

                    expect(result).toBe(expectedResult);
                });
            });

            it("format of currencyColumn should be correct with betlist link", function () {
                var cellValue = "Test";
                var param = {
                    DrillDownFromDate: "05/01/2017",
                    DrillDownToDate: "05/01/2017",
                    DrillDownCurrencyId: 1,
                    DrillDownCurrencyName: "EUR",
                    CustomerId: 2,
                    ExternalId: 3,
                    SystemId: 4
                };
                var paramJson = JSON.stringify(param);
                var expectedResult = '<a class="bet-list-link" href="javascript:;" data-drill-down=\'' + paramJson + '\'>' + cellValue + '</a>';

                var systemIdColumn = WinLossByProductOption.getColModel(2, 1)[3];
                var rowObject = {
                    CurrencyId: 1,
                    CustomerId: 2,
                    ExternalId: 3,
                    SystemId: 4,
                    Date: "05/01/2017",
                    CurrencyName: "EUR"
                };

                var result = systemIdColumn.formatter(cellValue, null, rowObject);

                expect(result).toBe(expectedResult);
            });
        });
    });