define(["jquery", "common/site", "lib/jqgrid/jquery.jqgrid.additional", "pages/customer/customerlist/customerlist.gridoption"],
    function ($, Site, jqGridAdditional, CustomerListOption) {
        describe("CustomerListOption", function () {
            beforeAll(function () {
                spyOn(Site, "getSingleResource").and.callFake(function (str) {
                    return str;
                });
                spyOn(Site, "getResources").and.callFake(function (strs) {
                    return strs;
                });
            });

            describe("getGridOption(productAccess, isAllowedCustomerCommission)", function () {
                it("adds 2 columns of product to colModel and colNames if 2 product and customer commission are allowed", function () {
                    var productList = ["SB","NG"];

                    CustomerListOption.getGridOption(productList, true);

                    expect(CustomerListOption.gridOption.colNames.indexOf("SB")).toBeGreaterThan(-1);
                    expect(CustomerListOption.gridOption.colNames.indexOf("CS")).toBe(-1);

                    var length = CustomerListOption.gridOption.colModel.length;
                    expect(CustomerListOption.gridOption.colModel[length - 2].name).toEqual("SBComm");
                });
            });

            describe("setGroupHeaderColumns(grid)", function () {
                it("jqGrid header should be grouped with correct option with 2 product columns", function () {
                    var grid = jasmine.createSpyObj("grid", ["jqGrid"]);

                    var productList = ["SB", "NG"];

                    CustomerListOption.getGridOption(productList, true);
                    CustomerListOption.setGroupHeaderColumns(grid);

                    expect(grid.jqGrid).toHaveBeenCalledWith("setGroupHeaders", {
                        useColSpanStyle: true,
                        groupHeaders: [{
                            startColumnName: "SBComm",
                            numberOfColumns: 3,
                            titleText: "Commission (%)"
                        }]
                    });
                });
            });

            describe("groupColumn.formatter(cellValue, options, rowObject)", function () {
                it("returns correct format form with 'None' text if comm group is 0", function () {
                    var rowObject = {
                        CustId: "custId",
                        GroupColor: "#fff",
                        GroupCommId: 0
                    };
                    var expectedFormat = '<div id="groupName-custId" style="background-color:#fff" class="commission-color">None</div>';

                    CustomerListOption.getGridOption([], true);

                    var groupColumnIndex = 1;
                    var groupColumn = CustomerListOption.gridOption.colModel[groupColumnIndex];

                    expect(groupColumn.formatter(null, null, rowObject)).toEqual(expectedFormat);
                });

                it("returns correct format form with 'cellValue' text if comm group is not 0", function () {
                    var rowObject = {
                        CustId: "custId",
                        GroupColor: "#fff",
                        GroupCommId: 1
                    };
                    var cellValue = "cellValue";
                    var expectedFormat = '<div id="groupName-custId" style="background-color:#fff" class="commission-color">cellValue</div>';

                    CustomerListOption.getGridOption([], true);

                    var groupColumnIndex = 1;
                    var groupColumn = CustomerListOption.gridOption.colModel[groupColumnIndex];

                    expect(groupColumn.formatter(cellValue, null, rowObject)).toEqual(expectedFormat);
                });
            });

            describe("pedingFundColumn.formatter(cellValue, options, rowObject)", function () {
                it("returns correct format form with number if cellValue is 0", function () {
                    var cellValue = 0;
                    var expectedFormat = "0.00";

                    CustomerListOption.getGridOption([], false);

                    var pedingFundColumnIndex = 4;
                    var pedingFundColumn = CustomerListOption.gridOption.colModel[pedingFundColumnIndex];

                    expect(pedingFundColumn.formatter(cellValue, null, {})).toEqual(expectedFormat);
                });

                it("returns correct format form with a link text if comm group not is 0", function () {
                    var rowObject = {
                        CustId: "custId",
                        SystemId: "systemId",
                        ExternalId: "externalId"
                    };
                    var cellValue = 10;
                    var expectedFormat = '<a href="javascript:;" class="pendingFunds" data-custid="custId" data-systemid="systemId" data-externalid="externalId">10.00</a>';

                    CustomerListOption.getGridOption([], false);

                    var pedingFundColumnIndex = 4;
                    var pedingFundColumn = CustomerListOption.gridOption.colModel[pedingFundColumnIndex];

                    expect(pedingFundColumn.formatter(cellValue, null, rowObject)).toEqual(expectedFormat);
                });
            });

            describe("pedingFundColumn.formatter(cellValue, options, rowObject)", function () {
                it("returns correct format form", function () {
                    var cellValue = "status";
                    var rowObject = {
                        CustId: "custId",
                        IsSuspended: true,
                        IsClosed: false,
                        ExternalId: "externalId"
                    };
                    var expectedFormat = '<a href="javascript:;" title="Status" class="custStatusOption" id="edit-cust-status-custId"'
                            + ' data-custid="custId" data-externalid="externalId" data-issuspended="true" data-isclosed="false">status</a>';

                    CustomerListOption.getGridOption([], false);

                    var statusColumnIndex = 5;
                    var statusColumn = CustomerListOption.gridOption.colModel[statusColumnIndex];

                    expect(statusColumn.formatter(cellValue, null, rowObject)).toEqual(expectedFormat);
                });
            });

            describe("baStatusColumn.formatter(cellValue, options, rowObject)", function () {
                it("returns correct format form if BA status is true", function () {
                    var cellValue = true;
                    var rowObject = {
                        CustId: "custId",
                        ExternalId: "externalId"
                    };
                    var paramString = '{"custId":"custId","isAllowBA":false,"externalId":"externalId"}'
                    var expectedFormat = '<div title="TurnOffBaTooltip"'
                    + ' class="center-align switch ba-on">'
                    + '<label><input class="baStatus" type="checkbox" checked data-val=\'' + paramString
                    + '\' /><span class="lever"></span><label>'
                    + '</div>';

                    CustomerListOption.getGridOption([], false);

                    var baStatusColumnIndex = 6;
                    var baStatusColumn = CustomerListOption.gridOption.colModel[baStatusColumnIndex];

                    expect(baStatusColumn.formatter(cellValue, null, rowObject)).toEqual(expectedFormat);
                });

                it("returns correct format form if BA status is false", function () {
                    var cellValue = false;
                    var rowObject = {
                        CustId: "custId",
                        ExternalId: "externalId"
                    };
                    var paramString = '{"custId":"custId","isAllowBA":true,"externalId":"externalId"}'
                    var expectedFormat = '<div title="TurnOnBaTooltip"'
                    + ' class="center-align switch ba-off">'
                    + '<label><input class="baStatus" type="checkbox" data-val=\'' + paramString
                    + '\' /><span class="lever"></span><label>'
                    + '</div>';

                    CustomerListOption.getGridOption([], false);

                    var baStatusColumnIndex = 6;
                    var baStatusColumn = CustomerListOption.gridOption.colModel[baStatusColumnIndex];

                    expect(baStatusColumn.formatter(cellValue, null, rowObject)).toEqual(expectedFormat);
                });
            });

            describe("specialLevelColumn.formatter(cellValue, options, rowObject)", function () {
                it("returns correct format form  with 'None' text if cellValue is 0", function () {
                    var cellValue = 0;
                    var rowObject = {
                        CustId: "custId"
                    };
                    var expectedFormat = '<a href="javascript:;" class="grid-dropdown specialLevel" data-custid="custId" data-level="0">'
                    + '<span class="grid-dropdown-item grid-dropdown-label level-0">None</span>'
                    + '<i class="grid-dropdown-item grid-dropdown-icon icon-arrow text-bold" title="SpecialLevel"></i>'
                    + '</a>';

                    CustomerListOption.getGridOption([], false);

                    var specialLevelColumnIndex = 7;
                    var specialLevelColumn = CustomerListOption.gridOption.colModel[specialLevelColumnIndex];

                    expect(specialLevelColumn.formatter(cellValue, null, rowObject)).toEqual(expectedFormat);
                });

                it("returns correct format form  with 'cellValue' text if cellValue is not 0", function () {
                    var cellValue = 1;
                    var rowObject = {
                        CustId: "custId"
                    };
                    var expectedFormat = '<a href="javascript:;" class="grid-dropdown specialLevel" data-custid="custId" data-level="1">'
                    + '<span class="grid-dropdown-item grid-dropdown-label level-1">1</span>'
                    + '<i class="grid-dropdown-item grid-dropdown-icon icon-arrow text-bold" title="SpecialLevel"></i>'
                    + '</a>';

                    CustomerListOption.getGridOption([], false);

                    var specialLevelColumnIndex = 7;
                    var specialLevelColumn = CustomerListOption.gridOption.colModel[specialLevelColumnIndex];

                    expect(specialLevelColumn.formatter(cellValue, null, rowObject)).toEqual(expectedFormat);
                });
            });

            describe("oddsGroupColumn.formatter(cellValue, options, rowObject)", function () {
                it("returns correct format form  with 'None' text if cellValue is 0", function () {
                    var cellValue = 0;
                    var rowObject = {
                        CustId: "custId",
                        BAStatus: true
                    };
                    var expectedFormat = '<a href="javascript:;" class="grid-dropdown oddsGroup disabled" '
                    + 'data-custid="custId" data-group="0">'
                    + '<span class="grid-dropdown-item grid-dropdown-label group-0">None</span>'
                    + '<i class="grid-dropdown-item grid-dropdown-icon icon-arrow text-bold" title="OddsGroup"></i></a>';

                    CustomerListOption.getGridOption([], false);

                    var oddsGroupColumnIndex = 8;
                    var oddsGroupColumn = CustomerListOption.gridOption.colModel[oddsGroupColumnIndex];

                    expect(oddsGroupColumn.formatter(cellValue, null, rowObject)).toEqual(expectedFormat);
                });

                it("returns correct format form  with 'cellValue' text if cellValue is not 0", function () {
                    var cellValue = 1;
                    var rowObject = {
                        CustId: "custId",
                        BAStatus: false
                    };
                    var expectedFormat = '<a href="javascript:;" class="grid-dropdown oddsGroup" '
                    + 'data-custid="custId" data-group="1">'
                    + '<span class="grid-dropdown-item grid-dropdown-label group-1">1</span>'
                    + '<i class="grid-dropdown-item grid-dropdown-icon icon-arrow text-bold" title="OddsGroup"></i></a>';

                    CustomerListOption.getGridOption([], false);

                    var oddsGroupColumnIndex = 8;
                    var oddsGroupColumn = CustomerListOption.gridOption.colModel[oddsGroupColumnIndex];

                    expect(oddsGroupColumn.formatter(cellValue, null, rowObject)).toEqual(expectedFormat);
                });
            });

            describe("customerOptionColumn.formatter(cellValue, options, rowObject)", function () {
                it("returns correct format form", function () {
                    var cellValue = "status";
                    var rowObject = {
                        CustId: "custId",
                        SystemId: "systemId",
                        ExternalId: "externalId"
                    };
                    var expectedFormat = '<a href="javascript:;" data-systemid="systemId" data-externalid="externalId" data-custid="custId" '
                        + 'title="CustomerOption" class="custoptionlink" id="cust-option-link-custId">View<i class="grid-dropdown-icon icon-arrow"></i></a>';

                    CustomerListOption.getGridOption([], false);

                    var customerOptionColumnIndex = 9;
                    var customerOptionColumn = CustomerListOption.gridOption.colModel[customerOptionColumnIndex];

                    expect(customerOptionColumn.formatter(cellValue, null, rowObject)).toEqual(expectedFormat);
                });
            });

            describe("productColumn.cellattr(col.name)", function () {
                it("returns correct format form with column is SB", function () {
                    var rowObject = {
                        CustId: "custId"
                    };
                    var expectedFormat = ' id="SBComm-custId" ';

                    CustomerListOption.getGridOption(["SB"], true);

                    var sbColumnIndex = CustomerListOption.gridOption.colModel.length - 1;
                    var sbColumn = CustomerListOption.gridOption.colModel[sbColumnIndex];

                    expect(sbColumn.cellattr("SBComm", null, rowObject)).toEqual(expectedFormat);
                });
            });

            describe("gridOption", function () {
                it("beforeSelectRow() returns false", function () {
                    expect(CustomerListOption.gridOption.beforeSelectRow()).toBe(false);
                });

                it("onRightClickRow() returns false", function () {
                    expect(CustomerListOption.gridOption.onRightClickRow()).toBe(false);
                });
            });
        });
    });