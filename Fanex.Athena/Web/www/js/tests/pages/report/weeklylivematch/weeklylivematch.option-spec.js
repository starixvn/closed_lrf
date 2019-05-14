define(["jquery", "common/site", "pages/report/weeklylivematch/weeklylivematch.option"], function ($, Site, WeeklyLiveMatchOption) {
    describe("WeeklyLiveMatchOption", function () {
        it("initial data should be correct", function () {
            var gridOption = {
                rowNum: 500,
                datatype: 'local',
                height: '100%',
                autowidth: false,
                forceFit: false,
                shrinkToFit: true,
                minWidth: 450,
                loadui: 'disable',
                loadonce: true,
                footerrow: true,
                userDataOnFooter: true,
                viewrecords: true,
                gridview: true,
                rownumbers: false,
                localReader: {
                    repeatitems: true,
                    cell: "Cell",
                    id: "Index"
                }
            };

            expect(WeeklyLiveMatchOption.urlData).toBe('api/WeeklyLiveMatchReport/index');
            expect(WeeklyLiveMatchOption.urlExcelData).toBe('api/WeeklyLiveMatchReport/index');
            expect(WeeklyLiveMatchOption.gridOption).toEqual(gridOption);
        });

        describe("getGridOption(numOfWeek, weekHeaders)", function () {
            beforeEach(function () {
                spyOn(Site, "clone").and.callFake(function (source) { return source; });
                spyOn(Site, "getResources").and.callFake(function (resource) { return resource; });
            });

            it("Site.clone(obj) should be called with correct times", function () {
                WeeklyLiveMatchOption.getGridOption(2, ["From 1 to 7", "From 8 to 14"]);

                expect(Site.clone.calls.count()).toBe(5);
            });

            it("return correct data", function () {
                var gridOption = WeeklyLiveMatchOption.getGridOption(2, ["From 1 to 7", "From 8 to 14"]);

                expect(gridOption.colNames[2]).toBe("From 1 to 7");

                var week1ColModel = {
                    width: 90,
                    sortable: true,
                    resizable: false,
                    align: "right",
                    title: true,
                    formatter: 'integer',
                    formatoptions:
                    {
                        thousandsSeparator: ","
                    },
                    name: "Week1",
                    index: "Week1",
                }
                expect(gridOption.colModel[3]).toEqual(week1ColModel);
            });
        });
    });
});