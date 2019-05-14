define(["jquery",
    "common/site",
    "pages/customer/customerlist/customerlist.gridoption",
    "lib/jqgrid/jquery.jqgrid.additional",
    "components/paging",
    "pages/customer/customerlist/customerlist.state",
    "pages/customer/customerlist/customerlist.service"],
function ($, Site, CustomerListOption, jqGridAdditional, PagingHelper, CustomerListState, CustomerListService) {
    describe("CustomerListService", function () {
        var _state = {
            selectedCustomers: {},
            pagingOption: {
                pagesize: 1
            }
        };

        beforeAll(function () {
            spyOn(Site, "getSingleResource").and.callFake(function (str) {
                return str;
            });
            spyOn(Site, "getResources").and.callFake(function (strs) {
                return strs;
            });
            spyOn(CustomerListState, "getState").and.returnValue(_state);
            spyOn(Site, "blockUI");
            spyOn(Site, "unBlockUI");
        });

        describe("initialize()", function () {
            it("sets value for varibles", function () {
                setFixtures('<input type="hidden" id="IsAllowedCustomerCommission" value="True">'
                    + '<input type="hidden" id="IsAllowedUserEditComm" value="True">'
                    + '<input type="hidden" id="ProductList" value="SB">');

                CustomerListService.initialize();

                expect(CustomerListState.getState).toHaveBeenCalled();
            });
        });

        describe("resizeGrid()", function () {
            it("update width/height functions should be called", function () {
                spyOn(jqGridAdditional, "updateGridHeight");
                spyOn(jqGridAdditional, "updateGridWidth");

                CustomerListService.resizeGrid();

                expect(jqGridAdditional.updateGridHeight).toHaveBeenCalled();
                expect(jqGridAdditional.updateGridWidth).toHaveBeenCalled();
            });
        });

        describe("addGridScrollEventToHidePopups()", function () {
            it("hides all visible control popups grid body is scrolled", function () {
                setFixtures('<div class="ui-jqgrid-bdiv"></div>'
                    + '<div id="ViewOptionList"></div>'
                    + '<div id="update-cust-status-popup" style="display:none"></div>'
                    + '<div id="LevelListContainer"></div>'
                    + '<div id="OddsGroupListContainer"></div>');

                CustomerListService.addGridScrollEventToHidePopups();
                $(".ui-jqgrid-bdiv").scroll();

                expect($("#ViewOptionList").is(":hidden")).toBe(true);
                expect($("#update-cust-status-popup").is(":hidden")).toBe(true);
                expect($("#LevelListContainer").is(":hidden")).toBe(true);
                expect($("#OddsGroupListContainer").is(":hidden")).toBe(true);
            });
        });

        describe("processGridOption(showingColumns)", function () {
            it("updates index column and shows columns", function () {
                spyOn(CustomerListOption, "getGridOption").and.returnValue({ colModel: [{}] });
                spyOn(CustomerListService, "updateIndexColumnFormatter");
                spyOn(CustomerListService, "toggleColumn");

                CustomerListService.processGridOption();

                expect(CustomerListOption.getGridOption).toHaveBeenCalled();
                expect(CustomerListService.updateIndexColumnFormatter).toHaveBeenCalled();
                expect(CustomerListService.toggleColumn).toHaveBeenCalled();
            });
        });

        describe("updateIndexColumnFormatter(indexColumn, showingColumns)", function () {
            it("updates formatter of column if that Groupcolumn is showed", function () {
                var column = {};
                var showingColumns = { "Group": true };

                CustomerListService.updateIndexColumnFormatter(column, showingColumns);

                expect(typeof (column.formatter)).toBe("function");
            });

            it("return new correct formatter of column if that Groupcolumn is showed", function () {
                var column = {};
                var showingColumns = { "Group": true };
                var rowObject = {
                    CustId: "CustId",
                    GroupCommId: 1
                };
                var expectedFormat = '<input type="checkbox"  title="CustId" id="CustId" data-group-comm-id="1" class="select-cust-checkbox check-child" /><label for="CustId"></label>';

                CustomerListService.updateIndexColumnFormatter(column, showingColumns);

                expect(typeof (column.formatter)).toBe("function");
                expect(column.formatter(null, null, rowObject)).toEqual(expectedFormat);
            });

            it("return new correct formatter of column if that Groupcolumn is showed and checked", function () {
                var column = {};
                var showingColumns = { "Group": true };
                var rowObject = {
                    CustId: "CustId",
                    GroupCommId: 1
                };
                _state.selectedCustomers = { "CustId": 1 };
                var expectedFormat = '<input type="checkbox" checked title="CustId" id="CustId" data-group-comm-id="1" class="select-cust-checkbox check-child" /><label for="CustId"></label>';

                CustomerListService.updateIndexColumnFormatter(column, showingColumns);

                expect(typeof (column.formatter)).toBe("function");
                expect(column.formatter(null, null, rowObject)).toEqual(expectedFormat);
            });

            it("updates formatter of column to undefined if that Groupcolumn is not showed", function () {
                var column = {};
                var showingColumns = {};

                CustomerListService.updateIndexColumnFormatter(column, showingColumns);

                expect(typeof (column.formatter)).toBe("undefined");
            });
        });

        describe("toggleColumn(gridOption, showingColumns)", function () {
            it("updates index column and shows columns", function () {
                spyOn(CustomerListOption, "getGridOption").and.returnValue({ colModel: [{}] });
                spyOn(CustomerListService, "updateIndexColumnFormatter");
                spyOn(CustomerListService, "toggleColumn");

                CustomerListService.processGridOption();

                expect(CustomerListOption.getGridOption).toHaveBeenCalled();
                expect(CustomerListService.updateIndexColumnFormatter).toHaveBeenCalled();
                expect(CustomerListService.toggleColumn).toHaveBeenCalled();
            });
        });

        describe("showGridDropdownById(listId, $context)", function () {
            beforeEach(function () {
                spyOn($.fn, "offset").and.returnValue({ top: 0, left: 0 });
                spyOn($.fn, "outerHeight").and.returnValue(100);
                spyOn($.fn, "css");
            });

            it("popup should be toggled if context cusid and popup custid are the same", function () {
                var listId = "popup";
                var contextId = "context";

                setFixtures('<a id="' + contextId + '" data-custid="1"></a>'
                    + '<div id="' + listId + '" data-custid="1"></div>');
                window.innerHeight = 500;

                CustomerListService.showGridDropdownById(listId, $("#" + contextId));

                expect($("#" + listId).is(":hidden")).toBe(true);
                expect($.fn.css.calls.mostRecent().args[0].top).toBe(101);
            });

            it("changed popup data and shows popup if context cusid and popup custid are the same", function () {
                var listId = "popup";
                var contextId = "context";

                setFixtures('<a id="' + contextId + '" data-custid="2"></a>'
                    + '<div id="' + listId + '" data-custid="1" data-externalid="" data-systemid="" style="display:none"></div>'
                    + '<a id="cust-option-link-2" data-custid="2" data-externalid="externalid" data-systemid="systemid"><a>');
                window.innerHeight = 50;

                CustomerListService.showGridDropdownById(listId, $("#" + contextId));

                expect($("#" + listId).is(":hidden")).toBe(false);
                expect($("#" + listId).data("custid")).toEqual(2);
                expect($("#" + listId).data("externalid")).toEqual("externalid");
                expect($("#" + listId).data("systemid")).toEqual("systemid");
                expect($.fn.css.calls.mostRecent().args[0].top).toBe(-101);
            });
        });

        describe("updateGridData(option)", function () {
            beforeAll(function () {
                spyOn(CustomerListService, "closePopup");
                spyOn(CustomerListService, "bindData");
                spyOn(window, "alert");
            });

            beforeEach(function () {
                jasmine.Ajax.install();
            });

            afterEach(function () {
                jasmine.Ajax.uninstall();
            });

            it("does not call ajax if no data is changed", function () {
                var option = {
                    oldValue: "value",
                    newValue: "value",
                    url: "url"
                };
                spyOn($, "ajax");
                spyOn(window, "confirm").and.returnValue(true);

                CustomerListService.updateGridData(option);

                expect(CustomerListService.closePopup).toHaveBeenCalled();
                expect($.ajax).not.toHaveBeenCalled();
            });

            it("does not call ajax if confirmation is NO", function () {
                var option = {
                    oldValue: "value",
                    newValue: "value",
                    url: "url",
                    dataField: "dataField"
                };
                spyOn($, "ajax");
                spyOn(window, "confirm").and.returnValue(false);

                CustomerListService.updateGridData(option);

                expect(CustomerListService.closePopup).toHaveBeenCalled();
                expect($.ajax).not.toHaveBeenCalled();
            });

            it("window.alert should be called to show error message if ajax result returns fail", function () {
                var option = {
                    url: "url",
                    oldValue: "oldvalue",
                    newValue: "value",
                };
                spyOn(window, "confirm").and.returnValue(true);

                jasmine.Ajax
                        .stubRequest(option.url)
                        .andReturn({
                            responseText: JSON.stringify({
                                Success: false,
                                ErrorMessage: "Error"
                            })
                        });

                CustomerListService.updateGridData(option);

                expect(CustomerListService.closePopup).toHaveBeenCalled();
                expect(window.alert).toHaveBeenCalledWith("Error");
            });

            it("bindData(response, keepScrollPosition) should be called if ajax result returns success", function () {
                var contextId = "context";
                setFixtures('<tr id="1"><td id="' + contextId + '"></td></tr>');

                var option = {
                    url: "url",
                    oldValue: "oldvalue",
                    newValue: "value",
                    $context: $("#" + contextId)
                };
                spyOn(window, "confirm").and.returnValue(true);

                jasmine.Ajax
                        .stubRequest(option.url)
                        .andReturn({
                            responseText: JSON.stringify({
                                Success: true
                            })
                        });

                _state.cachedData = {
                    Data: [{}]
                };

                CustomerListService.updateGridData(option);

                expect(CustomerListService.closePopup).toHaveBeenCalled();
                expect(CustomerListService.bindData).toHaveBeenCalled();
            });
        });

        describe("closePopup(popUpSelector)", function () {
            it("popup should be hidden", function () {
                var popUpSelector = "popup";
                var contextId = "context";

                setFixtures('<div id="' + popUpSelector + '"></div>');

                CustomerListService.closePopup(popUpSelector);

                expect($("#" + popUpSelector).is(":hidden")).toBe(false);
            });
        });

        describe("submit()", function () {
            var ajaxOption = {};
            var ajaxObj = jasmine.createSpyObj("ajaxObj", ["abort"]);

            beforeAll(function () {
                spyOn(CustomerListService, "getPostData");
                spyOn(CustomerListService, "bindData");
                spyOn(window, "alert");

                spyOn($, "ajax").and.callFake(function (option) {
                    ajaxOption = option;
                    option.beforeSend();

                    return ajaxObj;
                });
            });

            it("getPostData() should be called", function () {
                CustomerListService.submit();

                expect(CustomerListService.getPostData).toHaveBeenCalled();
            });

            it("ajaxRequest.abort() should be called if _ajaxRequest is not null", function () {
                CustomerListService.submit();

                expect(ajaxObj.abort).toHaveBeenCalled();
            });

            it("bindData(response) should be called if calling ajax successfully", function () {
                CustomerListService.submit();

                ajaxOption.success({ Data: [{ "CustId": 0, "GroupCommId": 0 }, { "CustId": 1, "GroupCommId": 1 }, { "CustId": 2, "GroupCommId": 2 }] });

                expect(CustomerListService.bindData).toHaveBeenCalled();
            });

            it("Site.unBlockUI() should be called if calling ajax unsuccessfully", function () {
                CustomerListService.submit();

                ajaxOption.error();

                expect(Site.unBlockUI).toHaveBeenCalled();
            });
        });

        describe("getPostData()", function () {
            function setFixturesForColumnMultiSelect(inputs) {
                appendSetFixtures('<div id="ui-multiselect-options-grid-columns-multiselect"></div>');
                var $container = $("#ui-multiselect-options-grid-columns-multiselect");

                $.each(inputs, function (index, input) {
                    $container.append('<ul class="ui-multiselect-checkboxes">' + input + '</ul>');
                });
            }

            function setFixturesForOddGroupMultiSelect(inputs) {
                appendSetFixtures('<div id="ui-multiselect-options-odds-group-multiselect"></div>');
                var $container = $("#ui-multiselect-options-odds-group-multiselect");

                $.each(inputs, function (index, input) {
                    $container.append('<ul class="ui-multiselect-checkboxes">' + input + '</ul>');
                });
            }

            function setFixturesForValue(data) {
                appendSetFixtures('<input id="CurrencyId" value="' + data.CurrencyId + '">');
                appendSetFixtures('<input id="special-level-list-search" value="' + data.SpecialLevel + '">');
                appendSetFixtures('<input id="Username" value="' + data.Username + '">');
                appendSetFixtures('<input id="CurrencyName" value="' + data.CurrencyName + '">');
                appendSetFixtures('<input id="BAFilterOption" value="' + data.BaFilter + '">');
                appendSetFixtures('<input id="DdlGroupCommId" value="' + data.GroupCommId + '">');
                appendSetFixtures('<input id="BaseCurrency" value="' + data.BaseCurrency + '">');
                appendSetFixtures('<input id="CustStatusOption" value="' + data.CustStatus + '">');
            }

            it("does not return data if no grid column is checked", function () {
                setFixturesForColumnMultiSelect([]);

                var data = CustomerListService.getPostData();

                expect(data).toBe(undefined);
            });

            it("does not return data if no odd group is checked", function () {
                setFixturesForColumnMultiSelect(['<input type="checkbox" checked name="col1">']);
                setFixturesForOddGroupMultiSelect([]);
                appendSetFixtures('<input type="hidden" id="OddsGroups">');

                var data = CustomerListService.getPostData();

                expect(data).toBe(undefined);
            });

            it("returns correct data without odd groups", function () {
                _state.pagingOption.pageindex = 1;
                _state.pagingOption.pagesize = 2;
                var expectedData = {
                    PageIndex: 1,
                    PageSize: 2,
                    CurrencyId: "1",
                    SpecialLevel: "0",
                    Username: "User",
                    CurrencyName: "USD",
                    BaFilter: "0",
                    GroupCommId: "1",
                    BaseCurrency: "1",
                    CustStatus: "0",
                    GridColumns: [{ Name: "col1", Checked: true }],
                    OddsGroups: [{ Name: "odd1", Checked: true }]
                };
                setFixturesForValue(expectedData);
                setFixturesForColumnMultiSelect(['<input type="checkbox" checked name="col1">']);
                setFixturesForOddGroupMultiSelect(['<input type="checkbox" checked name="odd1">']);
                appendSetFixtures('<input type="hidden" id="OddsGroups">');

                var data = CustomerListService.getPostData();

                expect(data).toEqual(expectedData);
            });

            it("returns correct data without odd groups", function () {
                _state.pagingOption.pageindex = 1;
                _state.pagingOption.pagesize = 2;
                var expectedData = {
                    PageIndex: 1,
                    PageSize: 2,
                    CurrencyId: "1",
                    SpecialLevel: "0",
                    Username: "User",
                    CurrencyName: "USD",
                    BaFilter: "0",
                    GroupCommId: "1",
                    BaseCurrency: "1",
                    CustStatus: "0",
                    GridColumns: [{ Name: "col1", Checked: true }]
                };
                setFixturesForValue(expectedData);
                setFixturesForColumnMultiSelect(['<input type="checkbox" checked name="col1">']);

                var data = CustomerListService.getPostData();

                expect(data).toEqual(expectedData);
            });
        });

        describe("bindData(response, keepScrollPosition)", function () {
            var gridOption = {};

            beforeAll(function () {
                spyOn(jqGridAdditional, "clearGrid");
                spyOn(PagingHelper, "render");
                spyOn($.fn, "jqGrid");
                spyOn(CustomerListOption, "setGroupHeaderColumns");
                spyOn(CustomerListService, "resizeGrid");
                spyOn(CustomerListService, "addGridScrollEventToHidePopups");
                spyOn(CustomerListService, "processGridOption").and.returnValue(gridOption);
                spyOn(jqGridAdditional, "gridComplete");
            });

            it("shows No row if data is empty", function () {
                spyOn(jqGridAdditional, "setNoInfo");

                CustomerListService.bindData({ TotalRows: 0 }, true);

                expect(jqGridAdditional.setNoInfo).toHaveBeenCalled();
            });

            it("shows grid if data is not empty", function () {
                CustomerListService.bindData({ TotalRows: 1, Data: { Index: 1 } }, true);
                gridOption.gridComplete();

                expect(jqGridAdditional.gridComplete).toHaveBeenCalled();
                expect(PagingHelper.render).toHaveBeenCalled();
                expect(CustomerListService.processGridOption).toHaveBeenCalled();
                expect($.fn.jqGrid).toHaveBeenCalled();
                expect(CustomerListOption.setGroupHeaderColumns).toHaveBeenCalled();
                expect(CustomerListService.resizeGrid).toHaveBeenCalled();
                expect(CustomerListService.addGridScrollEventToHidePopups).toHaveBeenCalled();
            });

            it("shows chekbox in Index column if Group column is shown", function () {
                setFixtures('<div id="jqgh_ReportGrid_Index"></div>');
                spyOn($.fn, "serializeObject").and.returnValue({ Group: "Group" });

                CustomerListService.bindData({ TotalRows: 1, Data: { Index: 1 } }, false);

                expect($("#jqgh_ReportGrid_Index").html()).toEqual('<input type="checkbox" id="CheckAll"><label for="CheckAll"></label>');
            });
        });

        describe("toggleColumn(gridOption, showingColumns)", function () {
            it("removes columns if they are not shown", function () {
                var showingColumns = { Index: "Index", AAComm: "AAComm", BBComm: "BBComm", Column1: "Column1" };
                var gridOption = {
                    colNames: ["Index", "AAComm", "BBComm", "CCComm", "DDComm", "Column1"],
                    colModel: [
                        { name: "Index" },
                        { name: "AAComm" },
                        { name: "BBComm" },
                        { name: "CCComm" },
                        { name: "DDComm" },
                        { name: "Column1" }
                    ]
                };

                CustomerListService.toggleColumn(gridOption, showingColumns);

                expect(showingColumns["BBCommission"]).toBe(undefined);
                expect(showingColumns["CCCommission"]).toBe(undefined);
            });
        });
    });
});