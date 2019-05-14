define([
    "jquery",
    "common/site",
    "pages/customer/customerlog/customerlog.service",
    "lib/jqgrid/jquery.jqgrid.additional",
    "lib/jqgrid/jquery.jqGrid.en",
    "lib/jqgrid/jquery.jqGrid.min"],
    function ($, Site, CustomerLogService, jqGridAdditional) {
        describe("CustomerLogService", function () {
            beforeAll(function () {
                spyOn(Site, "initialize");
                spyOn(Site, "addUserGuide");
                spyOn(Site, "getSingleResource").and.callFake(function (str) {
                    return str;
                });
            });

            describe("initialize()", function () {
                it("should be called Site's methods to initialize page", function () {
                    CustomerLogService.initialize();

                    expect(Site.initialize).toHaveBeenCalled();
                    expect(Site.addUserGuide).toHaveBeenCalledWith({
                        resourceName: "CustomerLog",
                        title: "CustomerLog"
                    });
                });

                it("resizeGrid function should be called when window fire resize event", function () {
                    spyOn(CustomerLogService, "resizeGrid");
                    CustomerLogService.initialize();

                    $(window).resize();

                    expect(CustomerLogService.resizeGrid).toHaveBeenCalled();
                });

                it("off() jquery function should be called with correct parameter when window fire unload event", function () {
                    spyOn($.fn, "off");
                    CustomerLogService.initialize();

                    $(window).unload();

                    expect($.fn.off).toHaveBeenCalledWith("resize");
                });
            });

            describe("stopAjaxRequest()", function () {
                it("abort ajax if _ajaxRequest is not null", function () {
                    var isCalled = false;
                    var request = {
                        abort: function () {
                            isCalled = true;
                        }
                    };
                    spyOn($, "ajax").and.returnValue(request);

                    CustomerLogService.loadGrid("url", {}, false);
                    CustomerLogService.stopAjaxRequest();

                    expect(isCalled).toEqual(true);
                });
            });

            describe("loadGrid(url, gridOption, hasCheckbox)", function () {
                it("bindData should be called if data is got successfully and not empty", function () {
                    var url = "url";
                    var gridOption = { colNames: ["index"] };
                    var hasCheckBox = true;
                    var response = {
                        rows: [{ index: 0 }, { index: 1 }]
                    };
                    spyOn(Site, "blockUI");
                    spyOn(Site, "unBlockUI");
                    spyOn($, "ajax").and.callFake(function (option) {
                        option.beforeSend();
                        option.success(response);
                        option.complete();
                    });
                    spyOn(jqGridAdditional, "clearGrid");
                    spyOn(CustomerLogService, "bindData");
                    spyOn(CustomerLogService, "stopAjaxRequest");

                    CustomerLogService.loadGrid("url", gridOption, hasCheckBox);

                    expect(Site.blockUI).toHaveBeenCalled();
                    expect(Site.unBlockUI).toHaveBeenCalled();
                    expect(CustomerLogService.bindData).toHaveBeenCalledWith(response.rows, gridOption, hasCheckBox);
                });

                it("bindData should not be called if data is got successfully but empty", function () {
                    var url = "url";
                    var gridOption = { colNames: ["index"] };
                    var hasCheckBox = true;
                    var response = {
                        rows: []
                    };
                    spyOn($, "ajax").and.callFake(function (option) {
                        option.success(response);
                    });
                    spyOn(jqGridAdditional, "clearGrid");
                    spyOn(jqGridAdditional, "setNoInfo");
                    spyOn(CustomerLogService, "bindData");
                    spyOn(CustomerLogService, "stopAjaxRequest");

                    CustomerLogService.loadGrid("url", gridOption, hasCheckBox);

                    expect(jqGridAdditional.setNoInfo).toHaveBeenCalled();
                    expect(CustomerLogService.bindData).not.toHaveBeenCalled();
                });
            });

            describe("bindData(data, gridOption, hasCheckbox)", function () {
                beforeEach(function () {
                    setFixtures("<table id='ReportGrid'><tr>"
                        + "<th id='col1'><div class='ui-jqgrid-sortable' style='{cursor: pointer;}'></div></th>"
                        + "<th id='col2'><div class='ui-jqgrid-sortable' style='{cursor: pointer;}'></div></th></tr></table>");
                    var grid = $("#ReportGrid");
                    grid[0].p = {
                        colModel: [{ name: "col1", sortable: false }, { name: "col2", sortable: true }]
                    };
                    grid[0].grid = {
                        headers: [{ el: "#col1" }, { el: "#col2" }]
                    };
                });

                it("$.fn.jqGrid should be called with correct param", function () {
                    var gridOption = { colNames: ["index"] };
                    var hasCheckBox = true;
                    var data = [{ index: 0 }, { index: 1 }];
                    spyOn($.fn, "jqGrid");

                    CustomerLogService.bindData(data, gridOption, hasCheckBox);

                    expect(gridOption.data).toBe(data);
                    expect(typeof (gridOption.gridComplete)).toEqual("function");
                    expect($("#ReportGrid").jqGrid).toHaveBeenCalled();
                });

                it("unsortable column should be removed hand cursor", function () {
                    var gridOption = { colNames: ["index"] };
                    var hasCheckBox = false;
                    var data = [{ index: 0 }, { index: 1 }];
                    spyOn(jqGridAdditional, "gridComplete");
                    spyOn(CustomerLogService, "resizeGrid");
                    spyOn($.fn, "jqGrid");

                    CustomerLogService.bindData(data, gridOption, hasCheckBox);
                    gridOption.gridComplete();

                    expect($(".ui-jqgrid-sortable", "#col1").css("cursor")).toBe("default");
                });

                it("underline header title of sorted column", function () {
                    var gridOption = { colNames: ["index"] };
                    var hasCheckBox = false;
                    var data = [{ index: 0 }, { index: 1 }];
                    spyOn(jqGridAdditional, "gridComplete");
                    spyOn(CustomerLogService, "resizeGrid");
                    spyOn($.fn, "jqGrid");

                    CustomerLogService.bindData(data, gridOption, hasCheckBox);
                    gridOption.onSortCol("", 1);

                    expect($(".ui-jqgrid-sortable", "#col2").css("text-decoration")).toContain("underline");
                });

                it("resizeGrid should be called after grid completed", function () {
                    var gridOption = { colNames: ["index"] };
                    var hasCheckBox = false;
                    var data = [{ index: 0 }, { index: 1 }];
                    spyOn(jqGridAdditional, "gridComplete");
                    spyOn(CustomerLogService, "resizeGrid");
                    spyOn($.fn, "jqGrid");

                    CustomerLogService.bindData(data, gridOption, hasCheckBox);
                    gridOption.gridComplete();

                    expect(jqGridAdditional.gridComplete).toHaveBeenCalled();
                    expect(CustomerLogService.resizeGrid).toHaveBeenCalled();
                });

                it("checkShowAll should be called if hasCheckbox is true after grid completed", function () {
                    var gridOption = { colNames: ["index"] };
                    var hasCheckBox = true;
                    var data = [{ index: 0 }, { index: 1 }];
                    spyOn(CustomerLogService, "checkShowAll");
                    spyOn(jqGridAdditional, "gridComplete");
                    spyOn(CustomerLogService, "resizeGrid");
                    spyOn($.fn, "jqGrid");

                    CustomerLogService.bindData(data, gridOption, hasCheckBox);
                    gridOption.gridComplete();

                    expect(CustomerLogService.checkShowAll).toHaveBeenCalled();
                });
            });

            describe("checkShowAll()", function () {
                it("hide old-value if show all checkbox is uncheck", function () {
                    appendSetFixtures('<input type="checkbox" id="showall">');
                    appendSetFixtures('<div class="old-value"></div>');

                    CustomerLogService.checkShowAll();

                    expect($(".old-value").hasClass("hide")).toEqual(true);
                });
            });
        });
    });