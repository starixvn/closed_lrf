define(['jquery', 'common/site', 'lib/jqgrid/jquery.jqgrid.additional', 'pages/report/licenseewinloss/licenseewinloss.option', 'lib/jqgrid/jquery.jqGrid.min'],
    function ($, Site, jqGridAdditional, LicenseeWinLossOption) {
        describe("LicenseeWinLossOption", function () {
            beforeAll(function () {
                spyOn(Site, "getResources").and.callFake(function (text) {
                    return text;
                });
                spyOn(Site, "getSingleResource").and.callFake(function (text) {
                    return text;
                });
            });

            describe("LicenseeWinLossOption", function () {
                it("rowNum should be correct.", function () {
                    expect(LicenseeWinLossOption.rowNum).toBe(50);
                });

                it("totalColspan should be a correct array.", function () {
                    expect(LicenseeWinLossOption.totalColspan).toEqual([2, 2, 3]);
                });

                it("rowList should be a correct array.", function () {
                    expect(LicenseeWinLossOption.rowList).toEqual([50, 100, 200, 300, 400, 500, 1000, 2000]);
                });

                it("urlData should be a correct url.", function () {
                    expect(LicenseeWinLossOption.urlData).toBe('api/LicenseeWinLossReport/Index');
                });

                it("nonePagingSize should be correct.", function () {
                    expect(LicenseeWinLossOption.nonePagingSize).toBe(2000);
                });
            });

            describe("getColName(productOptions)", function () {
                var productOptions;
                beforeEach(function () {
                    productOptions = [{ Code: "SB", Name: "Sportsbook", Status: true }, { Code: "KN", Name: "Keno", Status: true }];
                });

                afterEach(function () {
                    LicenseeWinLossOption.hasCustomerComm = true;
                });

                it("gridOption.colNames should be correct.", function () {
                    LicenseeWinLossOption.hasCustomerComm = true;
                    var columnNames = LicenseeWinLossOption.getColName([]);

                    expect(columnNames).toEqual(['#', 'Date', 'ExternalId', 'SystemId', 'Currency', 'Total', 'Turnover', 'ActualStake', 'BuyBackAmount', 'TotalTransaction',
                        '@[Win]/@[Loss]', 'Comm', 'Total', 'Total', 'LicenseeW_L', '@[ProductBT]<br/>@[Commission]', '@[ProductCO]<br/>@[Commission]', 'BA<br/>@[Commission]',
                        '@[AmtDueToBetTrade]', '@[AmtDueToBA]', 'CurrencyId', 'CustomerId']);
                });

                it("gridOption.colNames should has correct value when we pass data of productOptions", function () {
                    LicenseeWinLossOption.hasCustomerComm = false;
                    var columnNames = LicenseeWinLossOption.getColName(productOptions);

                    expect(columnNames.length).toBe(26);
                    expect(columnNames[5]).toBe("Keno");
                    expect(columnNames[6]).toBe("Sportsbook");
                    expect(columnNames[7]).toBe("Total");

                    expect(columnNames[15]).toBe("Keno");
                    expect(columnNames[16]).toBe("Sportsbook");
                    expect(columnNames[17]).toBe("Total");
                });

                it("gridOption.colNames should has correct value when product BA is checked", function () {
                    productOptions.push({ Code: "BA", Status: true });
                    var columnNames = LicenseeWinLossOption.getColName(productOptions);

                    expect(columnNames.length).toBe(30);
                    expect(columnNames[11]).toBe("Sportsbook");
                    expect(columnNames[12]).toBe("BA");
                    expect(columnNames[13]).toBe("Total");
                });

                it("gridOption.colNames should has correct value when product BA is checked", function () {
                    productOptions.push({ Code: "BT", Status: true });
                    var columnNames = LicenseeWinLossOption.getColName(productOptions);

                    expect(columnNames.length).toBe(27);
                });
            });

            describe("getColModel(level, reportBy, productOptions)", function () {
                it("columnModels.length should equal with columnNames.length.", function () {
                    var columnNames = LicenseeWinLossOption.getColName([]);
                    var columnModels = LicenseeWinLossOption.getColModel(1, 2, []);

                    expect(columnModels.length).toBe(columnNames.length);
                });

                describe("When LicenseeWinLossOption.hasCustomerComm = false", function () {
                    afterEach(function () {
                        LicenseeWinLossOption.hasCustomerComm = true;
                    });

                    it("licenseeWlColumn should has column width is 90", function () {
                        LicenseeWinLossOption.hasCustomerComm = false;
                        var columnModels = LicenseeWinLossOption.getColModel(0, 1, []);

                        expect(columnModels[14].width).toBe(90);
                    });
                });

                describe("Bet List link for externalIdColumn", function () {
                    var columnModels;
                    beforeEach(function () {
                        columnModels = LicenseeWinLossOption.getColModel(2, 1, []);
                    });
                    it("externalIdColumn should have correct format", function () {
                        var externalIdColumn = columnModels[2];
                        var rowObject = {
                            Date: "2017-03-06T00:00:00",
                            CurrencyId: 9,
                            CurrencyName: "AUD",
                            CustomerId: 6507355,
                            ExternalId: "DEWSNIP",
                            SystemId: "12BETAUD01159"
                        };
                        var expected = '<a class="bet-list-link" href="javascript:;" ' +
                            'data-drill-down=\'{"DrillDownFromDate":"2017-03-06T00:00:00","DrillDownToDate":"2017-03-06T00:00:00","DrillDownCurrencyId":9,"DrillDownCurrencyName":"AUD","CustomerId":6507355,"ExternalId":"DEWSNIP","SystemId":"12BETAUD01159"}\'>ExternalId</a>';

                        var result = externalIdColumn.formatter("ExternalId", null, rowObject);

                        expect(result).toBe(expected);
                    });
                });

                describe("DrillDown link for systemIdColumn", function () {
                    var columnModels;
                    beforeEach(function () {
                        columnModels = LicenseeWinLossOption.getColModel(1, 1, []);
                    });

                    it("systemIdColumn should have correct format", function () {
                        var rowObject = {
                            Date: "2017-03-06T00:00:00",
                            CurrencyId: 9,
                            CurrencyName: "AUD",
                            CustomerId: 6507355,
                            ExternalId: "DEWSNIP",
                            SystemId: "12BETAUD01159"
                        };
                        var expected = '<a class="drilldown" href="javascript:;" onclick="return licenseewinlossDrilldown(2,9,6507355,\'2017-03-06T00:00:00\',\'AUD\');">SystemId</a>';

                        var systemIdColumn = columnModels[3];
                        var result = systemIdColumn.formatter("SystemId", null, rowObject);

                        expect(result).toBe(expected);
                    });
                });

                describe("DrillDown link for currencyColumn", function () {
                    var columnModels, currencyColumn, licenseeId;
                    beforeEach(function () {
                        columnModels = LicenseeWinLossOption.getColModel(0, 1, []);
                        currencyColumn = columnModels[4];
                        licenseeId = LicenseeWinLossOption.licenseeId;
                    });

                    afterEach(function () {
                        LicenseeWinLossOption.licenseeId = licenseeId;
                    });
                    it("currencyColumn should have correct format", function () {
                        var rowObject = {
                            Date: "2017-03-06T00:00:00",
                            CurrencyId: 9,
                            CurrencyName: "AUD",
                            CustomerId: 6507355,
                            ExternalId: "DEWSNIP",
                            SystemId: "12BETAUD01159"
                        };
                        var expected = '<a class="drilldown" href="javascript:;" onclick="return licenseewinlossDrilldown(2,9,0,\'2017-03-06T00:00:00\',\'AUD\');">Currency</a>';

                        var result = currencyColumn.formatter("Currency", null, rowObject);

                        expect(result).toBe(expected);
                    });
                    it("currencyColumn should have correct format", function () {
                        var rowObject = {
                            Date: "2017-03-06T00:00:00",
                            CurrencyId: 9,
                            CurrencyName: "AUD",
                            CustomerId: 6507355,
                            ExternalId: "DEWSNIP",
                            SystemId: "12BETAUD01159"
                        };
                        LicenseeWinLossOption.licenseeId = 1;
                        var expected = '<a class="drilldown" href="javascript:;" onclick="return licenseewinlossDrilldown(1,9,0,\'2017-03-06T00:00:00\',\'AUD\');">Currency</a>';

                        var result = currencyColumn.formatter("Currency", null, rowObject);

                        expect(result).toBe(expected);
                    });
                });

                describe("Add more product columns to grid", function () {
                    var productOptions;
                    beforeEach(function () {
                        productOptions = [{ Code: "SB", Status: true }, { Code: "KN", Status: true }];
                    });

                    afterEach(function () {
                        productOptions.slice(productOptions.length - 1);
                    });

                    it("Products should add correctly to Turnover column", function () {
                        productOptions.push({ Code: "BT", Status: true });
                        var result = LicenseeWinLossOption.getColModel(0, 2, productOptions);

                        expect(result[5].name).toBe("TurnOverKN");
                        expect(result[5].index).toBe("TurnOverKN");
                        expect(result[5].sortable).toBe(true);

                        expect(result[6].name).toBe("TurnOverSB");
                        expect(result[6].index).toBe("TurnOverSB");
                        expect(result[6].sortable).toBe(true);
                    });

                    it("Products should add correctly to LicenseeWinLoss column", function () {
                        productOptions.push({ Code: "BA", Status: true });
                        var result = LicenseeWinLossOption.getColModel(0, 2, productOptions);

                        expect(result[19].name).toBe("LicenseeWLKN");
                        expect(result[19].index).toBe("LicenseeWLKN");
                        expect(result[19].sortable).toBe(true);

                        expect(result[20].name).toBe("LicenseeWLSB");
                        expect(result[20].index).toBe("LicenseeWLSB");
                        expect(result[20].sortable).toBe(true);
                    });

                    it("Products should add correctly to BuyBackAmount column", function () {
                        productOptions.push({ Code: "BA", Status: true });
                        var result = LicenseeWinLossOption.getColModel(0, 2, productOptions);

                        expect(result[11].name).toBe("BuyBackAmountSB");
                        expect(result[11].index).toBe("BuyBackAmountSB");
                        expect(result[12].name).toBe("BuyBackAmountBA");
                        expect(result[12].index).toBe("BuyBackAmountBA");
                        expect(result[13].name).toBe("TotalBuyBackAmount");
                        expect(result[13].index).toBe("TotalBuyBackAmount");
                    });

                    it("TotalTurnOver column should be added with correct index", function () {
                        productOptions.push({ Code: "BA", Status: true });
                        var result = LicenseeWinLossOption.getColModel(0, 2, productOptions);

                        expect(result[8].name).toBe("TotalTurnOver");
                        expect(result[8].index).toBe("TotalTurnOver");
                    });

                    it("TotalLicenseeWL column should be added with correct index", function () {
                        productOptions.push({ Code: "BA", Status: true });
                        var result = LicenseeWinLossOption.getColModel(0, 2, productOptions);

                        expect(result[21].name).toBe("TotalLicenseeWL");
                        expect(result[21].index).toBe("TotalLicenseeWL");
                    });
                });
            });

            describe("getTotalColModel(level, productOptions)", function () {
                it("totalColumnModels.length should equal with columnNames.length.", function () {
                    var columnNames = LicenseeWinLossOption.getColName([]);
                    var totalColumnModels = LicenseeWinLossOption.getTotalColModel(1, []);

                    expect(totalColumnModels.length).toBe(columnNames.length);
                });
            });

            describe("getGridOption (level, reportBy, productOptions)", function () {
                beforeEach(function () {
                    spyOn(LicenseeWinLossOption, "getColName").and.returnValue(["index"]);
                    spyOn(LicenseeWinLossOption, "getColModel").and.returnValue([{ name: "index" }]);
                    spyOn(Site, "clone").and.callFake(function (obj) { return obj; });
                });

                it("GridOption should be returned correctly", function () {
                    var result = LicenseeWinLossOption.getGridOption(0, "Date", [{ Code: "SB", Status: true }]);

                    expect(result.colNames).toEqual(["index"]);
                    expect(result.colModel).toEqual([{ name: "index" }]);
                });
            });

            describe("addProductButton(grid, gridId, gridName, productOptions)", function () {
                var productOptions, $grid;
                var gridId = "jqgh_ReportGrid", gridName = "ReportGrid";
                beforeEach(function () {
                    $("*").off();
                    var gridHtml = '<div class="ui-jqgrid-view">' +
                        '<table class="ui-jqgrid-htable">' +
                        '<tr class="ui-jqgrid-labels">' +
                        '<th id="jqgh_ReportGrid_TotalTurnOverSingle">TurnOverExpand</th>' +
                        '<th class="ui-th-column-header"></th>' +
                        '<th id="jqgh_ReportGrid_TotalBuyBackAmountSingle">BuyBackExpand</th>' +
                        '<th class="ui-th-column-header"></th>' +
                        '<th id="jqgh_ReportGrid_TotalTransaction">TotalTransaction</th>' +
                        '<th class="ui-th-column-header" id="Container_Index2"></th>' +
                        '<th id="jqgh_ReportGrid_TotalLicenseeWLSingle">LicenseeWLExpand</th>' +
                        '<th class="ui-th-column-header"></th>' +
                        '</tr></table>' +
                        '<table id="ReportGrid"></table>' +
                        '<div id="ReportGrid_TotalLicenseeWLSingle"><div style="width: 50px;">LicenseeWLExpand</div></div>' +
                        '</div>';
                    setFixtures(gridHtml);
                    $grid = $("#ReportGrid");
                    productOptions = [{ Code: "SB", Status: true }, { Code: "KN", Status: true }];
                });

                afterEach(function () {
                    $(".ui-jqgrid-view").remove();
                    $("*").off();
                });

                it("'#ReportGrid_TotalLicenseeWLSingle div' has width is 100px", function () {
                    LicenseeWinLossOption.addProductButton($grid, gridId, gridName, productOptions);

                    expect($("#ReportGrid_TotalLicenseeWLSingle div").width()).toBe(100);
                });

                it("'#ReportGrid_TotalLicenseeWLSingle div' not change width that greater than 100px", function () {
                    $("#ReportGrid_TotalLicenseeWLSingle div").width(200);
                    LicenseeWinLossOption.addProductButton($grid, gridId, gridName, productOptions);

                    expect($("#ReportGrid_TotalLicenseeWLSingle div").width()).toBe(200);
                });

                describe("TurnOver, LicenseeWL, BuyBackAmount column have number of product options list are greater than 1", function () {
                    beforeEach(function () {
                        LicenseeWinLossOption.addProductButton($grid, gridId, gridName, productOptions);
                    });

                    it("'#btnTurnOverExpand' is added to TotalTurnoverSingle column", function () {
                        expect($("#btnTurnOverExpand").length).toBe(1);
                    });
                    it("'#btnTurnOverCollapse' is added to TotalTurnover column", function () {
                        expect($("#btnTurnOverCollapse").length).toBe(1);
                    });
                    it("'#btnLicenseeWLExpand' is added to TotalLicenseeWLSingle column", function () {
                        expect($("#btnLicenseeWLExpand").length).toBe(1);
                    });
                    it("'#btnLicenseeWLCollapse' is added to LicenseeWLSingle column", function () {
                        expect($("#btnLicenseeWLCollapse").length).toBe(1);
                    });
                });

                describe("TurnOver, LicenseeWL, BuyBackAmount column have number of product options list are not greater than 1", function () {
                    beforeEach(function () {
                        LicenseeWinLossOption.addProductButton($grid, gridId, gridName, [{ Code: "SB", Status: true }]);
                    });

                    it("'#btnTurnOverExpand' is not added to TotalTurnoverSingle column", function () {
                        expect($("#btnTurnOverExpand").length).toBe(0);
                    });
                    it("'#btnTurnOverCollapse' is not added to TotalTurnover column", function () {
                        expect($("#btnTurnOverCollapse").length).toBe(0);
                    });
                    it("'#btnLicenseeWLExpand' is not added to TotalLicenseeWLSingle column", function () {
                        expect($("#btnLicenseeWLExpand").length).toBe(0);
                    });
                    it("'#btnLicenseeWLCollapse' is not added to LicenseeWLSingle column", function () {
                        expect($("#btnLicenseeWLCollapse").length).toBe(0);
                    });

                    afterEach(function () {
                        LicenseeWinLossOption.hasCustomerComm = true;
                    });
                });

                describe("Allow BA for BuyBackAmount column", function () {
                    beforeEach(function () {
                        LicenseeWinLossOption.addProductButton($grid, gridId, gridName, [{ Code: "BA", Status: true }]);
                    });

                    it("'#btnBuyBackExpand' is added to TotalBuyBackAmountSingle column", function () {
                        expect($("#btnBuyBackExpand").length).toBe(1);
                    });
                    it("'#btnBuyBackCollapse' is added to TotalBuyBackAmount column", function () {
                        expect($("#btnBuyBackCollapse").length).toBe(1);
                    });
                });

                it("Container of '#btnBuyBackCollapse' should be correct when hasCustomerComm variable is false", function () {
                    LicenseeWinLossOption.hasCustomerComm = false;
                    LicenseeWinLossOption.addProductButton($grid, gridId, gridName, [{ Code: "BA", Status: true }]);

                    var $container = $("#btnBuyBackCollapse").parent();

                    expect($container.prop("id")).toBe("Container_Index2");
                });

                describe("toggle(isShow, column)", function () {
                    beforeEach(function () {
                        appendSetFixtures('<div class="report-content"></div>' +
                            '<div id="footer">Footer</div>' +
                            '<div class="ui-jqgrid-ftable">Footer Content</div>');
                        spyOn($.fn, "jqGrid");
                        spyOn(jqGridAdditional, "setFooterColumns");
                        spyOn(jqGridAdditional, "updateGridHeight");
                        spyOn(jqGridAdditional, "updateGridWidth");
                    });

                    it("Nothing happen when column param is not LicenseeWL, TurnOver, BuyBackAmount", function () {
                        LicenseeWinLossOption.addProductButton($grid, gridId, gridName, [{ Code: "BA", Status: true }]);
                        LicenseeWinLossOption.toggle(true, "LicenseeWL");

                        expect($.fn.jqGrid).not.toHaveBeenCalled();
                    });

                    describe("When clicking collapse/expand button on Turnover header", function () {
                        it("Call toogle function when '#btnTurnOverExpand' fire click event", function () {
                            LicenseeWinLossOption.addProductButton($grid, gridId, gridName, productOptions);
                            $("#btnTurnOverExpand").click();
                            var productColumnNames = ["TurnOverSB", "TurnOverKN", "TotalTurnOver"];

                            expect($.fn.jqGrid.calls.argsFor(0)).toEqual(["showCol", productColumnNames]);
                            expect($.fn.jqGrid.calls.argsFor(1)).toEqual(["hideCol", "TotalTurnOverSingle"]);
                        });
                        it("Call toogle function when '#btnTurnOverCollapse' fire click event", function () {
                            LicenseeWinLossOption.addProductButton($grid, gridId, gridName, productOptions);
                            $("#btnTurnOverCollapse").click();

                            var productColumnNames = ["TurnOverSB", "TurnOverKN", "TotalTurnOver"];

                            expect($.fn.jqGrid.calls.argsFor(0)).toEqual(["hideCol", productColumnNames]);
                            expect($.fn.jqGrid.calls.argsFor(1)).toEqual(["showCol", "TotalTurnOverSingle"]);
                        });
                    });

                    describe("When clicking collapse/expand button on LicenseeWL header", function () {
                        it("Call toogle function when '#btnLicenseeWLExpand' fire click event", function () {
                            LicenseeWinLossOption.addProductButton($grid, gridId, gridName, productOptions);
                            $("#btnLicenseeWLExpand").click();
                            var productColumnNames = ["LicenseeWLSB", "LicenseeWLKN", "TotalLicenseeWL"];

                            expect($.fn.jqGrid.calls.argsFor(0)).toEqual(["showCol", productColumnNames]);
                            expect($.fn.jqGrid.calls.argsFor(1)).toEqual(["hideCol", "TotalLicenseeWLSingle"]);
                        });
                        it("Call toogle function when '#btnLicenseeWLCollapse' fire click event", function () {
                            LicenseeWinLossOption.addProductButton($grid, gridId, gridName, productOptions);
                            $("#btnLicenseeWLCollapse").click();

                            var productColumnNames = ["LicenseeWLSB", "LicenseeWLKN", "TotalLicenseeWL"];

                            expect($.fn.jqGrid.calls.argsFor(0)).toEqual(["hideCol", productColumnNames]);
                            expect($.fn.jqGrid.calls.argsFor(1)).toEqual(["showCol", "TotalLicenseeWLSingle"]);
                        });
                    });

                    describe("When clicking collapse/expand button on BuyBackAmount header", function () {
                        beforeEach(function () {
                            productOptions.push({ Code: "BA", Status: true }, { Code: "BT", Status: true });
                            LicenseeWinLossOption.addProductButton($grid, gridId, gridName, productOptions);
                        });
                        afterEach(function () {
                            productOptions.slice(productOptions.length - 2);
                        });

                        it("Call toogle function when '#btnBuyBackExpand' fire click event", function () {
                            $("#btnBuyBackExpand").click();
                            var productColumnNames = ["BuyBackAmountSB", "BuyBackAmountBA", "TotalBuyBackAmount"];

                            expect($.fn.jqGrid.calls.argsFor(0)).toEqual(["showCol", productColumnNames]);
                            expect($.fn.jqGrid.calls.argsFor(1)).toEqual(["hideCol", "TotalBuyBackAmountSingle"]);
                        });
                        it("Call toogle function when '#btnBuyBackCollapse' fire click event", function () {
                            $("#btnBuyBackCollapse").click();

                            var productColumnNames = ["BuyBackAmountSB", "BuyBackAmountBA", "TotalBuyBackAmount"];

                            expect($.fn.jqGrid.calls.argsFor(0)).toEqual(["hideCol", productColumnNames]);
                            expect($.fn.jqGrid.calls.argsFor(1)).toEqual(["showCol", "TotalBuyBackAmountSingle"]);
                        });
                    });

                    describe("When pass column is BuyBackAmount", function () {
                        beforeEach(function () {
                            productOptions.push({ Code: "BA", Status: true }, { Code: "BT", Status: true });
                            LicenseeWinLossOption.addProductButton($grid, gridId, gridName, productOptions);
                            LicenseeWinLossOption.toggle(true, "BuyBackAmount");
                        });

                        afterEach(function () {
                            productOptions.slice(productOptions.length - 2);
                        });

                        it("jqGrid function should be called with correct parameter in the first time with column is BuyBackAmount", function () {
                            var productColumnNames = ["BuyBackAmountSB", "BuyBackAmountBA", "TotalBuyBackAmount"];

                            expect($.fn.jqGrid.calls.argsFor(0)).toEqual(["showCol", productColumnNames]);
                        });
                    });

                    describe("When pass column is LicenseeWL or TurnOver", function () {
                        it("jqGrid function should be called with correct parameter in the first time with column is LicenseeWL", function () {
                            LicenseeWinLossOption.addProductButton($grid, gridId, gridName, productOptions);
                            LicenseeWinLossOption.toggle(false, "LicenseeWL");

                            var productColumnNames = ["LicenseeWLSB", "LicenseeWLKN", "TotalLicenseeWL"];

                            expect($.fn.jqGrid.calls.argsFor(0)).toEqual(["hideCol", productColumnNames]);
                        });

                        it("jqGrid function should be called with correct parameter in the second time with column is TurnOver", function () {
                            LicenseeWinLossOption.addProductButton($grid, gridId, gridName, productOptions);
                            LicenseeWinLossOption.toggle(false, "TurnOver");

                            expect($.fn.jqGrid.calls.argsFor(1)).toEqual(["showCol", "TotalTurnOverSingle"]);
                        });
                    });
                });
            });

            describe("restoreExpanse()", function () {
                beforeEach(function () {
                    spyOn(LicenseeWinLossOption, "toggle");
                    LicenseeWinLossOption.restoreExpanse();
                });

                it("LicenseeWinLossOption.toggle() should be called", function () {
                    expect(LicenseeWinLossOption.toggle).toHaveBeenCalled();
                });

                it("LicenseeWinLossOption.toggle() should be called three times", function () {
                    expect(LicenseeWinLossOption.toggle.calls.count()).toBe(3);
                });
            });

            describe("LicenseeWinLossOption.setGroupHeaderColumns(grid, productOptions)", function () {
                beforeEach(function () {
                    setFixtures('<div id="ReportGrid"></div>');
                });

                it("jqGrid() function should be called with correct parameter when productOptions has data", function () {
                    var _method, _option;
                    spyOn($.fn, "jqGrid").and.callFake(function (method, option) { _method = method; _option = option; });
                    LicenseeWinLossOption.hasCustomerComm = true;
                    var productOptions = [{ Code: "SB", Status: true }, { Code: "KN", Status: true }];
                    LicenseeWinLossOption.setGroupHeaderColumns($("#ReportGrid"), productOptions);
                    var groupHeaders = [
                        {
                            startColumnName: "TurnOverKN",
                            numberOfColumns: 3,
                            titleText: "Turnover"
                        },
                        {
                            startColumnName: "LicenseeWLKN",
                            numberOfColumns: 3,
                            titleText: "LicenseeW_L"
                        },
                        {
                            startColumnName: 'CustomerWinLoss',
                            numberOfColumns: 3,
                            titleText: "CustomerW_L"
                        },
                        {
                            startColumnName: "BuyBackAmountSB",
                            numberOfColumns: 3,
                            titleText: "BuyBackAmount"
                        }
                    ];

                    expect(_method).toBe("setGroupHeaders");
                    expect(_option.useColSpanStyle).toBe(true);
                    expect(_option.groupHeaders[0]).toEqual(groupHeaders[0]);
                    expect(_option.groupHeaders[1]).toEqual(groupHeaders[1]);
                    expect(_option.groupHeaders[2]).toEqual(groupHeaders[2]);
                    expect(_option.groupHeaders[3]).toEqual(groupHeaders[3]);
                });

                it("jqGrid() function should be called with correct parameter when items in productOptions have status is false", function () {
                    var _method, _option;
                    spyOn($.fn, "jqGrid").and.callFake(function (method, option) { _method = method; _option = option; });
                    LicenseeWinLossOption.hasCustomerComm = false;
                    var productOptions = [{ Code: "SB", Status: false }, { Code: "KN", Status: false }];
                    LicenseeWinLossOption.setGroupHeaderColumns($("#ReportGrid"), productOptions);
                    var groupHeaders = [{}, {}, {}, {}];

                    expect(_method).toBe("setGroupHeaders");
                    expect(_option.useColSpanStyle).toBe(true);
                    expect(_option.groupHeaders[0]).toEqual(groupHeaders[0]);
                    expect(_option.groupHeaders[1]).toEqual(groupHeaders[1]);
                    expect(_option.groupHeaders[2]).toEqual(groupHeaders[2]);
                    expect(_option.groupHeaders[3]).toEqual(groupHeaders[3]);
                });
            });
        });
    });