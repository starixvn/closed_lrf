define(['jquery', 'common/site', 'common/querystring', 'pages/betlist/betlist', 'pages/betlist/commonbetlist'],
    function ($, Site, QueryString, BetList, CommonBetList) {
        describe("CommonBetList", function () {
            beforeEach(function () {
                setFixtures('<input id="ApiUrl" value="Test/Index" />');
                appendSetFixtures('<input id="IsServerPaging" value="1" />');

                spyOn(Site, "initialize");
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) { return url; });
                spyOn(Site, "getCurrentUrl").and.returnValue("http://localhost");
                spyOn(BetList, "initialize");
                spyOn(BetList, "loadDataPaging");
                spyOn(QueryString, "getQueryString").and.returnValue("fromdate=1/1/2016&todate=10/5/2016&pagesize=50&pageindex=2");
            });

            describe("initialize()", function () {
                it("'.content-filter' should be removed", function () {
                    appendSetFixtures('<div class="content-filter" style="width: 10px; height: 20px;"></div>');
                    CommonBetList.initialize();
                    expect($('.content-filter')).not.toExist();
                });

                it("BetList.loadDataPaging(url) should be called with correct parameters when 'IsServerPaging' value is 1", function () {
                    CommonBetList.initialize();
                    var url = "Test/Index?fromdate=1/1/2016&todate=10/5/2016&pagesize=50&pageindex=2";

                    expect(BetList.loadDataPaging).toHaveBeenCalledWith(url);
                });

                it("BetList.loadData(params, url) should be called with correct parameters when 'IsServerPaging' value is 0", function () {
                    spyOn(BetList, "loadData");
                    $("#IsServerPaging").val(0);
                    spyOn($, "parseJSON").and.returnValue({ FromDateString: "1/1/2016", ToDateString: "10/5/2016", DateString: "12/1/2016" });
                    CommonBetList.initialize();
                    var url = "Test/Index";
                    var param = {
                        FromDate: "1/1/2016", ToDate: "10/5/2016", Date: "12/1/2016",
                        FromDateString: "1/1/2016", ToDateString: "10/5/2016", DateString: "12/1/2016"
                    };

                    expect(BetList.loadData).toHaveBeenCalledWith(param, url);
                });
            });

            describe("exportToExcel()", function () {
                function transformQueryParamNameToLowerCase(url) {
                    var paramNameRegex = /[&|?][^=]*/g;

                    return url.replace(paramNameRegex, function (match) {
                        return match.toLowerCase();
                    });
                }

                beforeEach(function () {
                    appendSetFixtures('<input id="ExportToExcel" type="button" />');
                    appendSetFixtures('<input id="IsExportAll" value="1" />');
                    appendSetFixtures('<table id="BetListGrid"></table>');
                    spyOn($.fn, "getGridParam").and.callFake(function (param) {
                        if (param === 'page') {
                            return 1;
                        }
                        else if (param === 'rowNum') {
                            return 50;
                        }
                        else {
                            return -1;
                        }
                    });

                    spyOn(Site, "getSingleResource").and.callFake(function (resourceKey) { return resourceKey; });
                    spyOn(Site, "redirect");

                    CommonBetList.initialize();
                });

                afterEach(function () {
                    $("#ExportToExcel").remove();
                    $("#IsExportAll").remove();
                    $("#BetListGrid").remove();
                });

                it("Export All - window.alert should be called when totalRows > MAXIMUM_EXCEL_ROWS", function () {
                    spyOn(window, "alert");
                    spyOn($.fn, "jqGrid").and.returnValue(2147483647);

                    CommonBetList.exportToExcel();

                    expect(window.alert).toHaveBeenCalledWith("ExcelExceedRowsMsg");
                });

                it("Do not Export All - jqGrid should not be called", function () {
                    $("#IsExportAll").val(0);
                    spyOn($.fn, "jqGrid");

                    CommonBetList.exportToExcel();

                    expect($.fn.jqGrid).not.toHaveBeenCalled();
                });

                it("Server Paging - url to export excel should be correct with no sort param", function () {
                    spyOn(BetList, "getSortParams").and.returnValue(null);
                    var url = "http://localhost?PageIndex=1&PageSize=50&IsServerPaging=true&IsExportExcel=true";
                    var expectedUrl = transformQueryParamNameToLowerCase(url);

                    CommonBetList.exportToExcel();

                    expect(Site.redirect).toHaveBeenCalledWith(expectedUrl);
                });

                it("Server Paging - url to export excel should be correct with sort param", function () {
                    spyOn(BetList, "getSortParams").and.returnValue({ SortBy: "Index", SortOrder: "asc" });
                    var url = "http://localhost?PageIndex=1&PageSize=50&IsServerPaging=true&SortBy=Index&SortOrder=asc&IsExportExcel=true";
                    var expectedUrl = transformQueryParamNameToLowerCase(url);

                    CommonBetList.exportToExcel();

                    expect(Site.redirect).toHaveBeenCalledWith(expectedUrl);
                });

                it("No Server Paging - url to export excel should be correct with sort param", function () {
                    $("#IsServerPaging").val(0);
                    spyOn(BetList, "getSortParams").and.returnValue({ SortBy: "Index", SortOrder: "asc" });
                    var url = "http://localhost?SortBy=Index&SortOrder=asc&IsExportExcel=true";
                    var expectedUrl = transformQueryParamNameToLowerCase(url);

                    CommonBetList.exportToExcel();

                    expect(Site.redirect).toHaveBeenCalledWith(expectedUrl);
                });
            });
        });
});