define(["jquery", "common/site", 'lib/jqgrid/jquery.jqgrid.additional', "pages/report/winlossbyleague/winlossbyleague.option"],
    function ($, Site, jqGridAdditional, WinLossByLeagueOption) {
        describe("WinLossByLeagueOption", function () {
            beforeAll(function () {
                spyOn(Site, "getResources").and.callFake(function (resource) { return resource; });
                spyOn(Site, "getSingleResource").and.callFake(function (resource) { return resource; });
            });

            describe("Default Option", function () {
                it("Initial values should be correct", function () {
                    expect(WinLossByLeagueOption.currencyIndex).toBe(4);
                    expect(WinLossByLeagueOption.systemIdIndex).toBe(3);
                    expect(WinLossByLeagueOption.externalIdIndex).toBe(2);
                    expect(WinLossByLeagueOption.customerWlTotalIndex).toBe(10);

                    expect(WinLossByLeagueOption.pageSize).toBe(50);
                    expect(WinLossByLeagueOption.nonePagingSize).toBe(2000);
                    expect(WinLossByLeagueOption.rowNum).toBe(50);
                    expect(WinLossByLeagueOption.totalColspan).toEqual([1, 2, 3]);
                    expect(WinLossByLeagueOption.urlData).toBe("api/WinLossByLeagueReport/Index");
                    expect(WinLossByLeagueOption.urlExcelData).toBe("api/WinLossByLeagueReport/Index");
                });

                it("Initial 'gridOption' should be correct", function () {
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
                        userDataOnFooter: true,
                        userData: [],
                        viewrecords: true,
                        gridview: true,
                        rowList: [50, 100, 200, 300, 400, 500, 1000, 2000]
                    };

                    expect(WinLossByLeagueOption.gridOption).toEqual(expectedGridOption);
                });
            });

            describe("getColName(level)", function () {
                it("getColName(level) should return correct data when level equal 0", function () {
                    var expected = Site.getResources(['#', 'Match', 'BetCount', 'Turnover', 'CustomerW_L', 'LicenseeW_L', 'BACommission', 'AmtDueTo']);
                    var result = WinLossByLeagueOption.getColName(0);

                    expect(result).toEqual(expected);
                });

                it("getColName(level) should return correct data when level equal 1", function () {
                    var expected = Site.getResources(['#', 'ExternalID', 'SystemID', 'BetCount', 'Turnover', 'CustomerW_L', 'LicenseeW_L', 'BACommission']);
                    var result = WinLossByLeagueOption.getColName(1);

                    expect(result).toEqual(expected);
                });
            });

            describe("getColModel(level)", function () {
                it("Result should be 'betcountColumn' object at index 2 when level equal 0", function () {
                    var expected =
                    {
                        name: 'BetCount',
                        index: 'BetCount',
                        width: 50,
                        align: 'right',
                        sortable: false,
                        resizable: false,
                        formatter: 'integer',
                        frozen: true,
                        formatoptions:
                        {
                            thousandsSeparator: ","
                        }
                    };

                    var result = WinLossByLeagueOption.getColModel(0)[2];

                    expect(result).toEqual(expected);
                });

                it("Result should be 'baCommColumn' object at last index when level equal 1", function () {
                    var expected =
                    {
                        name: 'BACommission',
                        index: 'BACommission',
                        width: 80,
                        align: 'right',
                        sortable: false,
                        resizable: false,
                        formatter: 'currency',
                        formatoptions: jqGridAdditional.DECIMAL_FORMAT_OPTIONS
                    };

                    var result = WinLossByLeagueOption.getColModel(1)[7];

                    expect(result).toEqual(expected);
                });
            });

            describe("getGridOption(level)", function () {
                it("WinLossByLeagueOption.getColName(level) should be called with correct parameter", function () {
                    spyOn(WinLossByLeagueOption, "getColName");

                    WinLossByLeagueOption.getGridOption(1);

                    expect(WinLossByLeagueOption.getColName).toHaveBeenCalledWith(1);
                });

                it("WinLossByLeagueOption.getColModel(level) should be called with correct parameter", function () {
                    spyOn(WinLossByLeagueOption, "getColModel");

                    WinLossByLeagueOption.getGridOption(0);

                    expect(WinLossByLeagueOption.getColModel).toHaveBeenCalledWith(0);
                });
            });

            describe("drilldownLink", function () {
                it("externalIdColumn should be formatted correctly", function () {
                    var level = 1;
                    var colModel = WinLossByLeagueOption.getColModel(level);
                    var externalIdColumn = colModel[1];
                    var rowObject = {
                        CustomerId: 1,
                        ExternalId: "ExternalId",
                        SystemId: 2
                    };
                    var cellvalue = 1;
                    var expectedFormatter = '<a class="drilldown" href="javascript:;" data-custid="1" data-externalid="ExternalId" data-systemid="2">1</a>';

                    var formatter = externalIdColumn.formatter(cellvalue, {}, rowObject);

                    expect(formatter).toEqual(expectedFormatter);
                });

                it("systemIdColumn should be formatted correctly", function () {
                    var level = 1;
                    var colModel = WinLossByLeagueOption.getColModel(level);
                    var systemIdColumn = colModel[2];
                    var rowObject = {
                        CustomerId: 1,
                        ExternalId: "ExternalId",
                        SystemId: 2
                    };
                    var cellvalue = 1;
                    var expectedFormatter = '<a class="drilldown" href="javascript:;" data-custid="1" data-externalid="ExternalId" data-systemid="2">1</a>';

                    var formatter = systemIdColumn.formatter(cellvalue, {}, rowObject);

                    expect(formatter).toEqual(expectedFormatter);
                });
            });

            describe("addLeagueGroupRow ", function () {
                it("should be added correct html", function () {
                    setFixtures('<table id="ReportGrid"></table>');
                    $("table").append('<tr class="jqgrow"><tr>');
                    $("table").append('<tr class="jqgrow"><tr>');

                    var leagueid = 1, leagueName = "leagueName";
                    WinLossByLeagueOption.addLeagueGroupRow(leagueid, leagueName);
                    var expectedFormatter = '<td colspan="8">&nbsp;&nbsp;&nbsp; <a id="leagueHeader" data-leagueid="1" href="javascript:;">leagueName</a></td>';

                    expect($("#ReportGrid").find("tr.jqgrow:first").siblings().html()).toEqual(expectedFormatter);
                });
            });
        });
    });