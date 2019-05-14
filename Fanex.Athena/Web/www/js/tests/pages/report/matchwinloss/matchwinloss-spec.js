define(["jquery", "common/site", "common/querystring", "components/pluginhelper/daterangepicker", "components/scrollablegrid",
    "components/pluginhelper/multiselect", "pages/report/matchwinloss/matchwinloss", "extensions/jquery.extension"],
    function ($, Site, QueryString, DatePicker, GridHelper, MultiSelect, MatchWinLoss) {
        describe("MatchWinLoss", function () {
            function transformQueryParamNameToLowerCase(url) {
                var paramNameRegex = /[&|?][^=]*/g;

                return url.replace(paramNameRegex, function (match) {
                    return match.toLowerCase();
                });
            }

            beforeAll(function () {
                spyOn(Site, "getSingleResource").and.callFake(function (resource) { return resource; });
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) { return url; });
            });

            describe("initialize()", function () {
                beforeEach(function () {
                    spyOn(Site, "initialize");
                    spyOn(DatePicker, "initSingleDatePicker");
                    spyOn(MultiSelect, "initProductList");
                    spyOn(Site, "addUserGuide");
                    spyOn(MatchWinLoss, "initEvent");
                    spyOn(GridHelper, "resizeGrid");

                    MatchWinLoss.initialize();
                });

                it("Site.initialize() should be called", function () {
                    expect(Site.initialize).toHaveBeenCalled();
                });
                it("DatePicker.initSingleDatePicker() should be called with correct parameter", function () {
                    expect(DatePicker.initSingleDatePicker).toHaveBeenCalledWith("Date");
                });
                it("MultiSelect.initProductList() should be called", function () {
                    expect(MultiSelect.initProductList).toHaveBeenCalled();
                });
                it("Site.addUserGuide() should be called with correct parameter", function () {
                    expect(Site.addUserGuide).toHaveBeenCalledWith({
                        resourceName: "MatchWL",
                        title: "MatchWinLoss"
                    });
                });
                it("MatchWinLoss.initEvent() should be called", function () {
                    expect(MatchWinLoss.initEvent).toHaveBeenCalled();
                });
                it("GridHelper.resizeGrid() should be called", function () {
                    expect(GridHelper.resizeGrid).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                beforeEach(function () {
                    $("body").off();
                    setFixtures('<button id="ExportToExcel"></button><input id="IsExportExcel" /><div id="MatchWinLossForm"></div>' +
                        '<button id="SubmitButton"></button>' +
                        '<div class="body-content"><table>' +
                        '<tr><td><a class="bet-list-link"></a></td></tr>' +
                        '<tr><td><a class="view-match-detail"></a></td></tr>' +
                        '</table></div>' +
                        '<div class="footer-content"><a class="outright-link" data-bettype="1"></a></div>');

                    MatchWinLoss.initEvent();
                });

                afterEach(function () {
                    $("body").off();
                });

                it("'#SubmitButton' fired click event - MatchWinLoss.submitForm should be called", function () {
                    spyOn(MatchWinLoss, "submit");

                    $("#SubmitButton").click();

                    expect(MatchWinLoss.submit).toHaveBeenCalled();
                });

                it("'#ExportToExcel' fired click event - '#IsExportExcel' should has correct value", function () {
                    $("#ExportToExcel").click();

                    var result = $("#IsExportExcel").val();

                    expect(result).toBe("true");
                });

                it("'#ExportToExcel' fired click event - '#MatchWinLossForm' fire submit event", function () {
                    spyOn($.fn, "submit");

                    $("#ExportToExcel").click();

                    expect($.fn.submit).toHaveBeenCalled();
                });

                it("'.view-match-detail' fired click event - MatchWinLoss.viewMatchWinlossDetail() should be called with correct parameter", function () {
                    spyOn(MatchWinLoss, "viewMatchWinlossDetail");
                    var element = document.getElementsByClassName("view-match-detail");

                    $(".view-match-detail").click();

                    expect(MatchWinLoss.viewMatchWinlossDetail).toHaveBeenCalledWith(element);
                });

                it("'.bet-list-link' fired click event - MatchWinLoss.viewMatchWinlossBetList() should be called with correct parameter", function () {
                    spyOn(MatchWinLoss, "viewMatchWinlossBetList");
                    var element = document.getElementsByClassName("bet-list-link");

                    $(".bet-list-link").click();

                    expect(MatchWinLoss.viewMatchWinlossBetList).toHaveBeenCalledWith(element);
                });

                it("'.outright-link' fired click event - MatchWinLoss.viewOutrightMixParlay(bettype) should be called with correct parameter", function () {
                    spyOn(MatchWinLoss, "viewOutrightMixParlay");
                    var bettype = 1;

                    $(".outright-link").click();

                    expect(MatchWinLoss.viewOutrightMixParlay).toHaveBeenCalledWith(bettype);
                });

                it("GridHelper.resizeGrid() should be called when window fire resize event", function () {
                    spyOn(GridHelper, "resizeGrid");

                    $(window).resize();

                    expect(GridHelper.resizeGrid).toHaveBeenCalled();
                });

                it("off() jquery function should be called with correct parameter when window fire unload event", function () {
                    spyOn($.fn, "off");

                    $(window).unload();

                    expect($.fn.off).toHaveBeenCalledWith("resize");
                });
            });

            describe("submit()", function () {
                beforeEach(function () {
                    setFixtures('<button id="ExportToExcel"></button><input id="IsExportExcel" /><div id="MatchWinLossForm"></div>');

                    spyOn(Site, "blockUI");
                    spyOn($.fn, "submit");

                    MatchWinLoss.submit();
                });

                it("Site.blockUI() should be called", function () {
                    expect(Site.blockUI).toHaveBeenCalled();
                });

                it("'#IsExportExcel' should has correct value", function () {
                    var result = $("#IsExportExcel").val();

                    expect(result).toBe("false");
                });

                it("'#MatchWinLossForm' fire submit event", function () {
                    expect($.fn.submit).toHaveBeenCalled();
                });
            });

            describe("viewMatchWinlossDetail(element)", function () {
                var ajaxOption;
                var $element;
                beforeEach(function () {
                    setFixtures('<div id="Date" data-original="05/01/2017"></div>' +
                        '<div class="body-content"><table>' +
                        '<tr data-match={"LeagueId":1,"MatchId":2,"ProductCode":"SB","RaceNo":"","HomeId":10,"AwayId":11}><td><a class="view-match-detail"></a></td></tr>' +
                        '</table></div>');

                    spyOn(Site, "setLicenseeOptionOriginalParam").and.callFake(function (param) { return param; });
                    spyOn(MatchWinLoss, "getProductCodeList").and.returnValues("SB");
                    spyOn(MatchWinLoss, "clearDetailRows");
                    spyOn($, "ajax").and.callFake(function (option) { ajaxOption = option; });

                    $element = $(".view-match-detail");
                });

                afterEach(function () {
                    ajaxOption = null;
                    $element = null;
                });

                it("MatchWinLoss.clearDetailRows() should be called with correct parameter", function () {
                    var $row = $element.closest("tr");

                    MatchWinLoss.viewMatchWinlossDetail($element);

                    expect(MatchWinLoss.clearDetailRows).toHaveBeenCalledWith($row);
                });

                it("$element should has class 'expanded'", function () {
                    MatchWinLoss.viewMatchWinlossDetail($element);

                    var result = $element.hasClass("expanded");

                    expect(result).toBe(true);
                });

                it("Detail Rows is showing - $element don't has class 'expanded' and ajax function should not be called", function () {
                    var $row = $element.closest("tr");
                    $row.addClass("active");

                    MatchWinLoss.viewMatchWinlossDetail($element);

                    var hasExpendedClass = $element.hasClass("expanded");

                    expect(hasExpendedClass).toBe(false);
                    expect($.ajax).not.toHaveBeenCalled();
                });

                it("ajax option should has correct value", function () {
                    var submitData = {
                        LeagueId: 1,
                        MatchId: 2,
                        ProductCode: "SB",
                        Date: "05/01/2017",
                        ProductCodeList: "SB"
                    };

                    MatchWinLoss.viewMatchWinlossDetail($element);

                    var data = JSON.stringify(submitData);

                    expect(ajaxOption.type).toBe("POST");
                    expect(ajaxOption.url).toBe("MatchWinLossReport/Detail");
                    expect(ajaxOption.data).toBe(data);
                    expect(ajaxOption.contentType).toBe("application/json; charset=utf-8");
                    expect(ajaxOption.dataType).toBe("html");
                    expect(ajaxOption.beforeSend).toBe(Site.blockUI);
                    expect(ajaxOption.complete).toBe(Site.unBlockUI);
                });

                it("call success function in ajax option - $parentRow should has correct html content", function () {
                    MatchWinLoss.viewMatchWinlossDetail($element);
                    var expectedResult = "<td>html content</td>";

                    var response = "<tr><td>html content</td></tr>";
                    ajaxOption.success(response);
                    var $parentRow = $element.closest("tr");
                    var result = $parentRow.siblings("tr").html();

                    expect(result).toBe(expectedResult);
                });

                it("call success function in ajax option - $parentRow should has correct rowspan attribute", function () {
                    MatchWinLoss.viewMatchWinlossDetail($element);
                    var expectedResult = "2";

                    var response = "<tr class='detail-row'><td>html content</td></tr>";
                    ajaxOption.success(response);
                    var $parentRow = $element.closest("tr");
                    var result = $parentRow.find("td:first").attr("rowspan");

                    expect(result).toBe(expectedResult);
                });

                it("call success function in ajax option - $parentRow should has class 'active'", function () {
                    MatchWinLoss.viewMatchWinlossDetail($element);

                    var response = "<tr><td>html content</td></tr>";
                    ajaxOption.success(response);
                    var $parentRow = $element.closest("tr");
                    var result = $parentRow.hasClass("active");

                    expect(result).toBe(true);
                });
            });

            describe("clearDetailRows($parentRow)", function () {
                var $viewDetailElement;
                var $parentRow;
                beforeEach(function () {
                    setFixtures(
                        '<div class="body-content"><table>' +
                        '<tr id="parentRow" class="active"><td rowspan="2"><a class="view-match-detail expanded"></a></td></tr>' +
                        '<tr class="detail-row"><td>detail row content</td></tr>' +
                        '</table></div>');

                    $viewDetailElement = $(".view-match-detail");
                    $parentRow = $("#parentRow");
                });

                afterEach(function () {
                    $viewDetailElement = null;
                    $parentRow = null;
                });

                it("$viewDetailElement should not contain class 'expanded'", function () {
                    MatchWinLoss.clearDetailRows($parentRow);

                    var result = $viewDetailElement.hasClass("expanded");

                    expect(result).toBe(false);
                });

                it("'.detail-row' should not removed", function () {
                    MatchWinLoss.clearDetailRows($parentRow);

                    var result = $(".detail-row").length === 0;

                    expect(result).toBe(true);
                });

                it("class '.active' should be removed from tr", function () {
                    MatchWinLoss.clearDetailRows($parentRow);

                    var result = $("table .active").length;

                    expect(result).toBe(0);
                });

                it("rowspan attribute should be removed from 'td' first of parent row", function () {
                    var originalRowspan = $parentRow.find("td:first").attr("rowspan");
                    expect(originalRowspan).toBe("2");

                    MatchWinLoss.clearDetailRows($parentRow);

                    var result = $parentRow.find("td:first").attr("rowspan");

                    expect(result).toBe(undefined);
                });

                it("remove jquery function should not be called when we have no '.detail-row'", function () {
                    spyOn($.fn, "remove");
                    $("table").html('<tr id="parentRow" class="active"><td rowspan="2"><a class="view-match-detail expanded"></a></td></tr>');
                    $parentRow = $("#parentRow");

                    MatchWinLoss.clearDetailRows($parentRow);

                    expect($.fn.remove).not.toHaveBeenCalled();
                });
            });

            describe("viewMatchWinlossBetList(element)", function () {
                beforeEach(function () {
                    setFixtures('<div id="Date" data-original="05/01/2017"></div>' +
                        '<div class="body-content"><table>' +
                        '<tr class="active" data-match={"LeagueId":1,"MatchId":2,"ProductCode":"SB","RaceNo":"","HomeId":10,"AwayId":11}><td><a id="parent" data-bettype="1"></a></td></tr>' +
                        '<tr><td><a id="child1" data-bettype="86" data-islive="true"></a></td></tr>' +
                        '<tr><td><a id="child2"></a></td></tr>' +
                        '</table></div>');

                    spyOn(Site, "setLicenseeOptionOriginalParam").and.callFake(function (param) { return param; });

                    var productOption = "SB";
                    spyOn(MatchWinLoss, "getProductCodeList").and.returnValues(productOption);
                    spyOn(Site, "blockUI");
                    spyOn(Site, "redirect");
                });

                it("Site.blockUI() should be called", function () {
                    var element = document.getElementById("parent");

                    MatchWinLoss.viewMatchWinlossBetList(element);

                    expect(Site.blockUI).toHaveBeenCalled();
                });

                it("data-bettype is 1, IsLive param has empty value - Site.redirect(url) should be called with correct parameter", function () {
                    var param = "MatchWinlossBetList/MatchBetType?fromdate=05/01/2017&date=05/01/2017" +
                        "&matchid=2&leagueid=1&raceno=&bettype=1&LiveIndicator=&homeid=10&awayid=11" +
                        "&productcodelist=SB";
                    var expectedParam = transformQueryParamNameToLowerCase(param);
                    var element = document.getElementById("parent");

                    MatchWinLoss.viewMatchWinlossBetList(element);

                    expect(Site.redirect).toHaveBeenCalledWith(expectedParam);
                });

                it("data-bettype is 86, IsLive param has value - Site.redirect(url) should be called with correct parameter", function () {
                    var param = "MatchWinlossBetList/MatchBetType?fromdate=05/01/2017&date=05/01/2017" +
                        "&matchid=2&leagueid=1&raceno=&bettype=86&LiveIndicator=true&homeid=10&awayid=11" +
                        "&productcodelist=SB";
                    var expectedParam = transformQueryParamNameToLowerCase(param);
                    var element = document.getElementById("child1");

                    MatchWinLoss.viewMatchWinlossBetList(element);

                    expect(Site.redirect).toHaveBeenCalledWith(expectedParam);
                });

                it("data-bettype is undefined, bettype will be 0 and IsLive param has empty value - Site.redirect(url) should be called with correct parameter", function () {
                    var param = "MatchWinlossBetList/MatchBetType?fromdate=05/01/2017&date=05/01/2017" +
                        "&matchid=2&leagueid=1&raceno=&bettype=0&LiveIndicator=&homeid=10&awayid=11" +
                        "&productcodelist=SB";
                    var expectedParam = transformQueryParamNameToLowerCase(param);
                    var element = document.getElementById("child2");

                    MatchWinLoss.viewMatchWinlossBetList(element);

                    expect(Site.redirect).toHaveBeenCalledWith(expectedParam);
                });
            });

            describe("viewOutrightMixParlay(betType)", function () {
                beforeEach(function () {
                    var productListHtml = '<div id="ProductList">'
                        + '<div class="childCheckbox" data-product-code="SB" data-original="true">SB</div>'
                        + '<div class="childCheckbox" data-product-code="BA" data-original="true">BA</div>'
                        + '<div class="childCheckbox" data-product-code="VS" data-original="false">VS</div>'
                        + '<div class="childCheckbox" data-product-code="VS2" data-original="true">BRVS</div>'
                        + '</div>';

                    setFixtures('<div id="Date" data-original="05/01/2017"></div>' + productListHtml);

                    spyOn(Site, "setLicenseeOptionOriginalParam").and.callFake(function (param) { return param; });

                    spyOn(Site, "blockUI");
                    spyOn(Site, "redirect");
                });

                it("Site.blockUI() should be called", function () {
                    MatchWinLoss.viewOutrightMixParlay(1);

                    expect(Site.blockUI).toHaveBeenCalled();
                });

                it("bettype value is not 10 - Site.redirect(url) should be called with correct parameter", function () {
                    var param = "MatchWinlossBetList/MixParlay?fromdate=05/01/2017&todate=05/01/2017&bettype=1&productcodelist=SB,BA,VS2";
                    var expectedParam = transformQueryParamNameToLowerCase(param);
                    var bettype = 1;

                    MatchWinLoss.viewOutrightMixParlay(bettype);

                    expect(Site.redirect).toHaveBeenCalledWith(expectedParam);
                });

                it("bettype value is 10 - Site.redirect(url) should be called with correct parameter", function () {
                    var param = "MatchWinlossBetList/Outright?fromdate=05/01/2017&todate=05/01/2017&bettype=10&productcodelist=SB,BA,VS2";
                    var expectedParam = transformQueryParamNameToLowerCase(param);
                    var bettype = 10;

                    MatchWinLoss.viewOutrightMixParlay(bettype);

                    expect(Site.redirect).toHaveBeenCalledWith(expectedParam);
                });
            });

            describe("getProductCodeList(productCode)", function () {
                beforeEach(function () {
                    var productListHtml = '<div id="ProductList">'
                        + '<div class="childCheckbox" data-product-code="SB" data-original="true">SB</div>'
                        + '<div class="childCheckbox" data-product-code="BA" data-original="true">BA</div>'
                        + '<div class="childCheckbox" data-product-code="VS" data-original="false">VS</div>'
                        + '</div>';

                    setFixtures(productListHtml);
                });

                it("productCode param is special products - return correct product option data", function () {
                    var expectedResult = "SB,BA";

                    var productCode = "SB";
                    var result = MatchWinLoss.getProductCodeList(productCode);

                    expect(result).toEqual(expectedResult);
                });
            });
        });
    });