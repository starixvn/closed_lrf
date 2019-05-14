define(["jquery", "common/site", "pages/report/weeklylivematch/weeklylivematch.option", "lib/jqgrid/jquery.jqgrid.additional",
        "components/pluginhelper/daterangepicker", "helpers/daterange", "helpers/excel", "pages/report/weeklylivematch/weeklylivematch",
        "lib/jqgrid/jquery.jqGrid.en", "lib/jqgrid/jquery.jqGrid.min", "lib/linq", "extensions/jquery.extension"],
        function ($, Site, WeeklyLiveMatchOption, jqGridAdditional, DatePicker, DateHelper, ExcelHelper, WeeklyLiveMatch) {
            describe("WeeklyLiveMatch", function () {
                beforeAll(function () {
                    spyOn(Site, "getSingleResource").and.callFake(function (text) {
                        return text;
                    });
                });

                describe("initialize()", function () {
                    beforeEach(function () {
                        spyOn(Site, "initialize");
                        spyOn(WeeklyLiveMatch, "initEvent");
                        spyOn(Site, "addUserGuide");
                        spyOn(DatePicker, "initDateRangePicker");

                        WeeklyLiveMatch.initialize();
                    });

                    it("Site.initialize() should be called", function () {
                        expect(Site.initialize).toHaveBeenCalled();
                    });
                    it("WeeklyLiveMatch.initEvent() should be called", function () {
                        expect(WeeklyLiveMatch.initEvent).toHaveBeenCalled();
                    });
                    it("Site.addUserGuide(option) should be called with correct parameter", function () {
                        expect(Site.addUserGuide).toHaveBeenCalledWith({ resourceName: "WeeklyLiveMatches", title: "WeeklyLiveMatches", height: 450 });
                    });
                    it("DatePicker.initDateRangePicker(firstDayOfWeekIsMonday) should be called with correct parameter", function () {
                        expect(DatePicker.initDateRangePicker).toHaveBeenCalledWith(true);
                    });
                });

                describe("initEvent()", function () {
                    beforeEach(function () {
                        spyOn(DateHelper, "setConstraintMonthRange");
                        setFixtures('<button id="SubmitButton">Submit</button>' +
                            '<button id="ExportToExcel">Export Excel</button>' +
                            '<input type="hidden" id="IsExportExcel" value="true" />'
                            );

                        WeeklyLiveMatch.initEvent();
                    });

                    describe("'#SubmitButton' fire click event", function () {
                        beforeEach(function () {
                            spyOn(WeeklyLiveMatch, "submit");
                            $('#SubmitButton').click();
                        });

                        it("'#IsExportExcel' has value is false", function () {
                            var result = $('#IsExportExcel').val();
                            expect(result).toBe("false");
                        });

                        it("WeeklyLiveMatch.submit() should be called", function () {
                            expect(WeeklyLiveMatch.submit).toHaveBeenCalled();
                        });
                    });

                    it("ExcelHelper.exportExcel(data, url, method) should be called when '#ExportToExcel' fire click event", function () {
                        spyOn($.fn, "serializeObject").and.returnValue({ FromDate: "03/01/2017", ToDate: "03/31/2017" });
                        spyOn(ExcelHelper, "exportExcel");
                        spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                            return url;
                        });

                        $('#ExportToExcel').click();
                        var data = { FromDate: "03/01/2017", ToDate: "03/31/2017", IsExportExcel: true, SortColumn: null, SortDirection: null };

                        expect(ExcelHelper.exportExcel).toHaveBeenCalledWith(data, 'api/WeeklyLiveMatchReport/index');
                    });
                });

                describe("submit()", function () {
                    var request;
                    beforeEach(function (done) {
                        jasmine.Ajax.install();

                        jasmine.Ajax
                            .stubRequest("api/WeeklyLiveMatchReport/index")
                            .andReturn({
                                'status': 200,
                                'contentType': 'application/json',
                                'responseText': '{ "Data": [{"Cell": [1, "Soccer", 0, 0]}], "NumberOfWeeks": 2, "TotalData": [5,8], "WeekHeaders": ["01 Feb - 05 Feb 2017", "06 Feb - 12 Feb 2017"] }'
                            });

                        spyOn($.fn, "serializeObject").and.returnValue({ FromDate: "03/01/2017", ToDate: "03/31/2017" });
                        spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                            return url;
                        });

                        spyOn(Site, "blockUI");
                        spyOn(Site, "unBlockUI");
                        spyOn(WeeklyLiveMatch, "bindData");

                        WeeklyLiveMatch.submit();
                        request = jasmine.Ajax.requests.mostRecent();

                        setTimeout(done, 10);
                    });

                    afterEach(function () {
                        jasmine.Ajax.uninstall();
                    });

                    it("ajax should be called with correct parameter", function () {
                        var data = { FromDate: ["03/01/2017"], ToDate: ["03/31/2017"], SortColumn: [""], SortDirection: [""] };

                        expect(request.method).toBe("POST");
                        expect(request.data()).toEqual(data);
                        expect(request.url).toBe("api/WeeklyLiveMatchReport/index");
                    });

                    it("Site.blockUI() should be called", function () {
                        expect(Site.blockUI).toHaveBeenCalled();
                    });

                    it("Site.unBlockUI() should be called", function () {
                        expect(Site.unBlockUI).toHaveBeenCalled();
                    });

                    it("WeeklyLiveMatch.bindData(response) should be called with correct parameter", function () {
                        var expectedResponse = {
                            Data: [{ Cell: [1, "Soccer", 0, 0] }],
                            NumberOfWeeks: 2,
                            TotalData: [5, 8],
                            WeekHeaders: ["01 Feb - 05 Feb 2017", "06 Feb - 12 Feb 2017"]
                        };

                        expect(WeeklyLiveMatch.bindData).toHaveBeenCalledWith(expectedResponse);
                    });
                });

                describe("bindData(response)", function () {
                    var response;
                    beforeEach(function () {
                        spyOn(jqGridAdditional, "clearGrid");
                        setFixtures('<div id="ReportGrid"></div>');
                        spyOn(WeeklyLiveMatchOption, "getGridOption").and.returnValue({});
                        spyOn(WeeklyLiveMatch, "setTotalRow");
                        spyOn(jqGridAdditional, "addSortableHeader");

                        response = {
                            Data: [{ Cell: [1, "Soccer", 0, 0] }],
                            NumberOfWeeks: 2,
                            TotalData: [5, 8],
                            WeekHeaders: ["01 Feb - 05 Feb 2017", "06 Feb - 12 Feb 2017"]
                        };
                    });

                    it("jqGridAdditional.clearGrid(reportId) should be called with correct parameter", function () {
                        WeeklyLiveMatch.bindData({ Data: [] });
                        expect(jqGridAdditional.clearGrid).toHaveBeenCalledWith("ReportGrid");
                    });

                    it("jqGridAdditional.setNoInfo() should be called", function () {
                        spyOn(jqGridAdditional, "setNoInfo");
                        WeeklyLiveMatch.bindData({ Data: [] });
                        expect(jqGridAdditional.setNoInfo).toHaveBeenCalled();
                    });

                    it("jqGrid function should be called", function () {
                        spyOn($.fn, "jqGrid");

                        WeeklyLiveMatch.bindData(response);

                        expect($.fn.jqGrid).toHaveBeenCalled();
                    });

                    it("jqGrid function should be called with correct parameter", function () {
                        var gridOption;
                        spyOn($.fn, "jqGrid").and.callFake(function (option) { gridOption = option; });
                        var expectedGridoption = {
                            Data: [{ Cell: [1, "Soccer", 0, 0] }],
                            userData: {
                                Week0: 5,
                                Week1: 8
                            },
                            rowTotal: 1
                        };

                        WeeklyLiveMatch.bindData(response);

                        expect(gridOption.data).toEqual(expectedGridoption.Data);
                        expect(gridOption.userData).toEqual(expectedGridoption.userData);
                        expect(gridOption.rowTotal).toBe(expectedGridoption.rowTotal);
                    });

                    it("WeeklyLiveMatch.setTotalRow() should be called", function () {
                        spyOn($.fn, "jqGrid");

                        WeeklyLiveMatch.bindData(response);

                        expect(WeeklyLiveMatch.setTotalRow).toHaveBeenCalled();
                    });

                    it("jqGridAdditional.addSortableHeader($grid, sortColumn, sortOrder, isLightText) should be called with correct parameters", function () {
                        spyOn($.fn, "jqGrid");

                        WeeklyLiveMatch.bindData(response);

                        expect(jqGridAdditional.addSortableHeader).toHaveBeenCalledWith($("#ReportGrid"), null, null, true);
                    });

                    describe("jqGridAdditional.gridComplete()", function () {
                        var gridOption;
                        beforeEach(function () {
                            spyOn($.fn, "jqGrid").and.callFake(function (option) { gridOption = option; });
                            spyOn(jqGridAdditional, "gridComplete");
                            spyOn(WeeklyLiveMatch, "resizeGrid");
                            spyOn(Site, "unBlockUI");
                        });

                        it("jqGridAdditional.gridComplete() should be called when gridOption.gridComplete function is triggered", function () {
                            WeeklyLiveMatch.bindData(response);
                            gridOption.gridComplete();

                            expect(jqGridAdditional.gridComplete).toHaveBeenCalled();
                        });

                        it("WeeklyLiveMatch.resizeGrid() should be called when gridOption.gridComplete function is triggered", function () {
                            WeeklyLiveMatch.bindData(response);
                            gridOption.gridComplete();

                            expect(WeeklyLiveMatch.resizeGrid).toHaveBeenCalled();
                        });

                        it("Site.unBlockUI() should be called when gridOption.gridComplete function is triggered", function () {
                            WeeklyLiveMatch.bindData(response);
                            gridOption.gridComplete();

                            expect(Site.unBlockUI).toHaveBeenCalled();
                        });
                    });
                });

                describe("setTotalRow()", function () {
                    beforeEach(function () {
                        setFixtures('<table class="ui-jqgrid-ftable">' +
                            '<tr class="footrow"><td></td><td></td><td></td></tr>' +
                            '</table>'
                            );

                        WeeklyLiveMatch.setTotalRow();
                    });

                    it("total row of '.ui-jqgrid-ftable' should has class 'grandTotal'", function () {
                        var $totalRow = $('.ui-jqgrid-ftable').find('.footrow');

                        expect($totalRow.hasClass("grandTotal")).toBe(true);
                    });

                    it("second cell in total row of '.ui-jqgrid-ftable' should be hidden", function () {
                        var $secondCell = $('.ui-jqgrid-ftable').find('.footrow').find('td:eq(1)');

                        expect($secondCell).toBeHidden();
                    });

                    it("first cell in total row of '.ui-jqgrid-ftable' should has correct colspan attribute", function () {
                        var $firstCell = $('.ui-jqgrid-ftable').find('.footrow').find('td:eq(0)');

                        expect($firstCell.attr('colspan')).toBe("2");
                    });

                    it("first cell in total row of '.ui-jqgrid-ftable' should has correct text", function () {
                        var $firstCell = $('.ui-jqgrid-ftable').find('.footrow').find('td:eq(0)');

                        expect($firstCell.html()).toBe("Total");
                    });
                });

                describe("resizeGrid()", function () {
                    beforeEach(function () {
                        setFixtures('<div id="ReportGrid"></div>');
                        spyOn(jqGridAdditional, "updateGridHeight");
                        spyOn(jqGridAdditional, "updateGridWidth");

                        WeeklyLiveMatch.resizeGrid();
                    });

                    it("jqGridAdditional.updateGridHeight() should be called", function () {
                        expect(jqGridAdditional.updateGridHeight).toHaveBeenCalled();
                    });
                    it("jqGridAdditional.updateGridWidth(grid) should be called with correct parameter", function () {
                        expect(jqGridAdditional.updateGridWidth).toHaveBeenCalledWith($("#ReportGrid"));
                    });
                });

                describe("Sort function", function () {
                    var _sortColumn = "Week0";
                    beforeEach(function () {
                        jasmine.clock().install();
                    });

                    afterEach(function () {
                        jasmine.clock().uninstall();
                    });

                    describe("gridOption.onSortCol(colName)", function () {
                        beforeEach(function () {
                            spyOn(Site, "initialize");
                            spyOn(WeeklyLiveMatch, "initEvent");
                            spyOn(Site, "addUserGuide");
                            spyOn(DatePicker, "initDateRangePicker");

                            WeeklyLiveMatch.initialize();

                            spyOn(Site, "blockUI");
                            spyOn(Site, "unBlockUI");
                            spyOn(WeeklyLiveMatch, "bindData");
                            spyOn(WeeklyLiveMatch, "sortData").and.returnValue({});

                            WeeklyLiveMatchOption.gridOption.onSortCol(_sortColumn);
                        });

                        it("Site.blockUI() should be called", function () {
                            expect(Site.blockUI).toHaveBeenCalled();
                        });

                        describe("setTimeout function", function () {
                            it("WeeklyLiveMatch.bindData() should be called", function () {
                                jasmine.clock().tick(101);
                                expect(WeeklyLiveMatch.bindData).toHaveBeenCalled();
                            });
                            it("WeeklyLiveMatch.sortData() should be called", function () {
                                jasmine.clock().tick(101);
                                expect(WeeklyLiveMatch.sortData).toHaveBeenCalled();
                            });
                            it("Site.unBlockUI() should be called", function () {
                                jasmine.clock().tick(101);
                                expect(Site.unBlockUI).toHaveBeenCalled();
                            });
                        });
                    });

                    describe("sortData(arrayData)", function () {
                        var cellIndex = 2;
                        var arrayData;
                        beforeEach(function () {
                            arrayData = [{ Cell: [1, "SB", 12, 23] }, { Cell: [2, "RC", 20, 15] }];
                            WeeklyLiveMatchOption.gridOption.onSortCol(_sortColumn);
                        });

                        it("Array data should be correctly return with ascending sorting", function () {
                            var result = WeeklyLiveMatch.sortData(arrayData);

                            var expectedResult = [{ Cell: [1, "SB", 12, 23] }, { Cell: [2, "RC", 20, 15] }];

                            expect(result[0].Cell).toEqual(expectedResult[0].Cell);
                            expect(result[1].Cell).toEqual(expectedResult[1].Cell);
                        });

                        it("Array data should be correctly return with descending sorting", function () {
                            jasmine.clock().tick(101);
                            var result = WeeklyLiveMatch.sortData(arrayData);

                            var expectedResult = [{ Cell: [1, "RC", 20, 15] }, { Cell: [2, "SB", 12, 23] }];

                            expect(result[0].Cell).toEqual(expectedResult[0].Cell);
                            expect(result[1].Cell).toEqual(expectedResult[1].Cell);
                        });
                    });
                });
            });
        });