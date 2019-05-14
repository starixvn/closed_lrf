define([
    "jquery",
    "common/querystring",
    "common/site",
    "pages/report/report",
    "pages/report/customerwinloss/customerwinloss",
    "pages/report/customerwinloss/customerwinloss.option",
    "lib/jqgrid/jquery.jqgrid.additional",
    "components/pluginhelper/daterangepicker",
    "components/pluginhelper/monthpicker",
    "components/pluginhelper/multiselect",
    "common/popup",
    "components/paging",
    "helpers/excel",
    "components/pluginhelper/autocomplete",
    "helpers/downloader",
    "components/toast"],
    function ($, QueryString, Site, Report, CustomerWinLoss, CustomerWinLossOption, jqGridAdditional, DatePicker, MonthPicker, MultiSelect,
        Popup, PagingHelper, ExcelHelper, AutoComplete, Downloader, Toast) {
        describe("CustomerWinLoss", function () {
            beforeAll(function () {
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                    return url;
                });
                spyOn(Site, "initialize");
                spyOn(Site, "addUserGuide");
                spyOn(Site, "getSingleResource").and.callFake(function (str) {
                    if (str === "Viewin") {
                        return str + " {0}";
                    }
                    return str;
                });
                spyOn(DatePicker, "initDateRangePicker");
                spyOn(MultiSelect, "initProductList");
                spyOn(MonthPicker, "initMonthPicker");
                spyOn(AutoComplete, "initialize");
                spyOn(Site, "blockUI");
                spyOn(Site, "unBlockUI");
            });

            describe("initialize()", function () {
                beforeAll(function () {
                    spyOn(CustomerWinLoss, "initEvent");
                    spyOn(CustomerWinLoss, "initSetting");
                });

                it("all initial methods should be called", function () {
                    CustomerWinLoss.initialize();

                    expect(Site.initialize).toHaveBeenCalled();
                    expect(Site.addUserGuide).toHaveBeenCalled();
                    expect(MultiSelect.initProductList).toHaveBeenCalled();
                    expect(DatePicker.initDateRangePicker).toHaveBeenCalled();
                    expect(AutoComplete.initialize).not.toHaveBeenCalled();
                    expect(CustomerWinLoss.initEvent).toHaveBeenCalled();
                    expect(CustomerWinLoss.initSetting).toHaveBeenCalled();
                });

                it("MonthPicker.initMonthPicker() should be called if report is for history", function () {
                    setFixtures('<input type="hidden" id="IsHistory" value="True" />');

                    CustomerWinLoss.initialize();

                    expect(MonthPicker.initMonthPicker).toHaveBeenCalled();
                });

                it("AutoComplete.initialize() should be called if report have username filter", function () {
                    setFixtures('<input type="text" id="Username" />');

                    CustomerWinLoss.initialize();

                    expect(AutoComplete.initialize).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                beforeEach(function () {
                    $("body").off();
                });

                afterEach(function () {
                    $("body").off();
                });

                it("CustomerWinLoss.submit() should be called if submit button is clicked", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    spyOn(CustomerWinLoss, "submit");
                    spyOn(Report, "ValidProducts").and.returnValues(true);

                    CustomerWinLoss.initEvent();
                    $('#SubmitButton').click();

                    expect(CustomerWinLoss.submit).toHaveBeenCalled();
                });

                it("CustomerWinLoss.submit() should not be called if submit button is clicked with no product selected", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    spyOn(CustomerWinLoss, "submit");
                    spyOn(Report, "ValidProducts").and.returnValues(false);

                    CustomerWinLoss.initEvent();
                    $('#SubmitButton').click();

                    expect(CustomerWinLoss.submit).not.toHaveBeenCalled();
                });

                describe("export report", function () {
                    var ajaxOption;

                    beforeEach(function () {
                        spyOn(Downloader, "download");
                        spyOn(Toast, "show");

                        spyOn($, "ajax").and.callFake(function (option) {
                            option.beforeSend();
                            ajaxOption = option;
                        });
                    });

                    it("CustomerWinLoss.exportExcel should not be called if ExportToExcel button is clicked with no product selected", function () {
                        setFixtures('<div id="ExportToExcel"></div>');
                        spyOn(Report, "ValidProducts").and.returnValues(false);

                        CustomerWinLoss.initEvent();
                        $('#ExportToExcel').click();

                        expect(Downloader.download).not.toHaveBeenCalled();
                    });

                    it("#ExportToExcel click - ajax settings should be correct", function () {
                        setFixtures('<div id="ExportToExcel"></div>');
                        spyOn(Report, "ValidProducts").and.returnValues(true);

                        var postData = { PageSize: 500, OrderItem: 2, IsAscSort: true, Username: '' };
                        spyOn($.fn, "serializeObject").and.returnValue(postData);

                        var expectedPostData = { PageSize: 500, OrderItem: 2, IsAscSort: true, Username: '', PageIndex: 1, isExportExcel: true };

                        CustomerWinLoss.initEvent();
                        $('#ExportToExcel').click();

                        expect(ajaxOption.type).toBe("POST");
                        expect(ajaxOption.dataType).toBe("binary");
                        expect(ajaxOption.responseType).toBe("blob");
                        expect(ajaxOption.url).toBe(CustomerWinLossOption.urlExcelData);
                        expect(ajaxOption.data).toEqual(expectedPostData);
                    });

                    it("#ExportToExcel click - beforeSend - Toast.show should be called", function () {
                        setFixtures('<div id="ExportToExcel"></div>');
                        spyOn(Report, "ValidProducts").and.returnValues(true);

                        var postData = { PageSize: 500, OrderItem: 2, IsAscSort: true, Username: '' };
                        spyOn($.fn, "serializeObject").and.returnValue(postData);

                        CustomerWinLoss.initEvent();
                        $('#ExportToExcel').click();

                        expect(Toast.show).toHaveBeenCalled();
                    });

                    it("#ExportToExcel click - call success os ajax function - Downloader.download should be called with correct parameter", function () {
                        setFixtures('<div id="ExportToExcel"></div>');
                        spyOn(Report, "ValidProducts").and.returnValues(true);

                        var postData = { PageSize: 500, OrderItem: 2, IsAscSort: true, Username: '' };
                        spyOn($.fn, "serializeObject").and.returnValue(postData);

                        CustomerWinLoss.initEvent();
                        $('#ExportToExcel').click();

                        var response = "Binary Data";
                        ajaxOption.success(response);

                        expect(Downloader.download).toHaveBeenCalledWith(response, "CustomerWinLoss.xls");
                    });
                });

                describe("export PP-Promotion Prize data", function () {
                    var ajaxOption;

                    beforeEach(function () {
                        spyOn(Downloader, "download");
                        spyOn(Toast, "show");

                        spyOn($, "ajax").and.callFake(function (option) {
                            option.beforeSend();
                            ajaxOption = option;
                        });
                    });

                    it("#ExportPromotionPrizeLink click - ajax settings should be correct", function () {
                        setFixtures('<div id="ExportPromotionPrizeLink"></div>');

                        var postData = { FromDate: '01/01/2019', ToDate: '01/02/2019', CurrencyId: 0, CurrencyName: 'All', Username: '', IsExcludedTestData: true, __RequestVerificationToken: '123' };
                        spyOn($.fn, "serializeObject").and.returnValue(postData);

                        var expectedPostData = { FromDate: '01/01/2019', ToDate: '01/02/2019', CurrencyId: 0, CurrencyName: 'All', Username: '', IsExcludedTestData: true, __RequestVerificationToken: '123' };

                        CustomerWinLoss.initEvent();
                        $('#ExportPromotionPrizeLink').click();

                        expect(ajaxOption.type).toBe("POST");
                        expect(ajaxOption.dataType).toBe("binary");
                        expect(ajaxOption.responseType).toBe("blob");
                        expect(ajaxOption.url).toBe(CustomerWinLossOption.urlPromotionPrizeExcelData);
                        expect(ajaxOption.data).toEqual(expectedPostData);
                    });

                    it("#ExportPromotionPrizeLink click - beforeSend - Toast.show should be called", function () {
                        setFixtures('<div id="ExportPromotionPrizeLink"></div>');

                        var postData = { PageSize: 500, OrderItem: 2, IsAscSort: true, Username: '' };
                        spyOn($.fn, "serializeObject").and.returnValue(postData);

                        CustomerWinLoss.initEvent();
                        $('#ExportPromotionPrizeLink').click();

                        expect(Toast.show).toHaveBeenCalled();
                    });

                    it("#ExportPromotionPrizeLink click - call success os ajax function - Downloader.download should be called with correct parameter", function () {
                        setFixtures('<div id="ExportPromotionPrizeLink"></div>');

                        var postData = { PageSize: 500, OrderItem: 2, IsAscSort: true, Username: '' };
                        spyOn($.fn, "serializeObject").and.returnValue(postData);

                        CustomerWinLoss.initEvent();
                        $('#ExportPromotionPrizeLink').click();

                        var response = "Binary Data";
                        ajaxOption.success(response);

                        expect(Downloader.download).toHaveBeenCalledWith(response, "PP_PromotionPrize.xls");
                    });
                });

                it("CustomerWinLoss.viewWinlossBetList() should be called if BetList link is clicked", function () {
                    setFixtures('<div class="main-content">'
                        + '<a class="bet-list-link" data-drill-down=\'{"CustId":1,"SystemId":2, "ExternalId":3}\'></a>'
                        + '</div>');
                    spyOn(CustomerWinLoss, "viewWinlossBetList");

                    CustomerWinLoss.initEvent();
                    $('.bet-list-link').click();

                    expect(CustomerWinLoss.viewWinlossBetList).toHaveBeenCalledWith(1, 2, 3);
                });

                it("CustomerWinLoss.viewHistoryReport() should be called if History Link is clicked", function () {
                    setFixtures('<div id="history-report-link"></div>');
                    spyOn(CustomerWinLoss, "viewHistoryReport");

                    CustomerWinLoss.initEvent();
                    $('#history-report-link').click();

                    expect(CustomerWinLoss.viewHistoryReport).toHaveBeenCalled();
                });

                it("CustomerWinLoss.viewCurrentReport() should be called if Current Link is clicked", function () {
                    setFixtures('<div id="current-report-link"></div>');
                    spyOn(CustomerWinLoss, "viewCurrentReport");

                    CustomerWinLoss.initEvent();
                    $('#current-report-link').click();

                    expect(CustomerWinLoss.viewCurrentReport).toHaveBeenCalled();
                });

                it("off() jquery function should be called with correct parameter when window fire unload event", function () {
                    spyOn($.fn, "off");
                    CustomerWinLoss.initEvent();

                    $(window).unload();

                    expect($.fn.off).toHaveBeenCalledWith("resize");
                });

                it("resizeGrid function should be called when window fire resize event", function () {
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "updateGridWidth");

                    CustomerWinLoss.initEvent();
                    $(window).resize();

                    expect(jqGridAdditional.updateGridHeight).toHaveBeenCalled();
                    expect(jqGridAdditional.updateGridWidth).toHaveBeenCalled();
                });
            });

            describe("initSetting", function () {
                it("updates state of Customer Win Loss Option", function () {
                    setFixtures('<input id="IsAllowedBA" type="hidden" value="True" />'
                        + '<input id="IsAllowedCustomerCommission" type="hidden" value="True" />');

                    CustomerWinLoss.initSetting();

                    expect(CustomerWinLossOption.isAllowBA).toBe(true);
                    expect(CustomerWinLossOption.hasCustomerComm).toBe(true);
                });
            });

            describe("submit()", function () {
                var ajaxObj = jasmine.createSpyObj("ajaxObj", ["abort"]);

                beforeAll(function () {
                    spyOn($, "ajax").and.callFake(function (option) {
                        option.beforeSend();
                        option.complete();
                        option.success();

                        return ajaxObj;
                    });
                });

                beforeEach(function () {
                    setFixtures('<form id="CustomerWinlossForm">'
                                + '<input type="hidden" name="CurrencyName" value="USD" />'
                                + '<input type="hidden" name="FromDate" value="01/01/2011" />'
                                + '<input type="hidden" name="ToDate" value="01/11/2011" />'
                                + '<input type="hidden" id="BaseCurrency" name="BaseCurrency" value="eur" />'
                                + '<input type="hidden" id="Username" name="Username" value="name" />'
                                + '<div id="ProductList">'
                                + '<div class="childCheckbox" data-product-code="Code1" data-original="true"></div>'
                                + '<div class="childCheckbox" data-product-code="Code2" data-original="false"></div>'
                                + '<div class="childCheckbox" data-product-code="Code3" data-original="true"></div>'
                                + '</div>'
                                + '</form>');

                    spyOn(CustomerWinLoss, "bindData");
                    spyOn(Report, "setOriginalProduct");
                });

                it("CustomerWinLoss.bindData should be called after calling ajax successfully", function () {
                    CustomerWinLoss.submit();

                    expect(CustomerWinLoss.bindData).toHaveBeenCalled();
                });

                it("title should be updated correctly after calling ajax successfully", function () {
                    appendSetFixtures('<div class="panel-heading hide">'
                        + '<div class="report-title"></div>'
                        + '</div>');
                    var expectedTitle = "CustomerWinLoss, 01/01/2011 → 01/11/2011, Viewin EUR, LicenseeW_L(CODE1, CODE3), Username: name";

                    CustomerWinLoss.submit();

                    expect($(".report-title").html()).toEqual(expectedTitle);
                    expect($(".panel-heading").hasClass("hide")).toBe(false);
                });

                it("title should be updated correctly after calling ajax successfully with no product code", function () {
                    appendSetFixtures('<div id="SubmitButton"></div>');
                    appendSetFixtures('<div class="panel-heading hide">'
                        + '<div class="report-title"></div>'
                        + '</div>');
                    spyOn(Report, "ValidProducts").and.returnValues(true);
                    $("#BaseCurrency").val("");
                    $("#ProductList").remove();
                    var expectedTitle = "CustomerWinLoss, 01/01/2011 → 01/11/2011, Viewin USD, Username: name";

                    CustomerWinLoss.initEvent();
                    $('#SubmitButton').click();

                    expect($(".report-title").html()).toEqual(expectedTitle);
                });

                it("title should be updated correctly after calling ajax successfully with no user name", function () {
                    appendSetFixtures('<div id="SubmitButton"></div>');
                    appendSetFixtures('<div class="panel-heading hide">'
                        + '<div class="report-title"></div>'
                        + '</div>');
                    spyOn(Report, "ValidProducts").and.returnValues(true);
                    $("#Username").remove();
                    var expectedTitle = "CustomerWinLoss, 01/01/2011 → 01/11/2011, Viewin EUR, LicenseeW_L(CODE1, CODE3)";

                    CustomerWinLoss.initEvent();
                    $('#SubmitButton').click();

                    expect($(".report-title").html()).toEqual(expectedTitle);
                });

                it("ajaxRequest.abort() should be called if ajaxRequest is not null", function () {
                    CustomerWinLoss.submit();

                    expect(ajaxObj.abort).toHaveBeenCalled();
                });
            });

            describe("bindData(response)", function () {
                var gridOption = {
                    totalColspan: 0,
                    colModel: {}
                };

                beforeAll(function () {
                    spyOn(jqGridAdditional, "clearGrid");
                    spyOn(jqGridAdditional, "setNoInfo");
                    spyOn(jqGridAdditional, "updateGridHeight");
                    spyOn(jqGridAdditional, "updateGridWidth");
                    spyOn(CustomerWinLossOption, "getGridOption").and.callFake(function () {
                        return gridOption;
                    });
                });

                beforeEach(function () {
                    spyOn($.fn, "jqGrid");
                    spyOn(CustomerWinLossOption, "setGroupHeaderColumns");
                    spyOn(PagingHelper, "render");
                });

                it("jqGridAdditional.clearGrid should be called", function () {
                    CustomerWinLoss.bindData({ TotalRows: 0 });

                    expect(jqGridAdditional.clearGrid).toHaveBeenCalled();
                });

                it("jqGridAdditional.setNoInfo should be called if response data is empty", function () {
                    CustomerWinLoss.bindData({ TotalRows: 0 });

                    expect(jqGridAdditional.setNoInfo).toHaveBeenCalled();
                    expect(CustomerWinLossOption.setGroupHeaderColumns).not.toHaveBeenCalled();
                });

                it("Promotion Prize link should be hide if response data is empty", function () {
                    setFixtures('<div id="ExportPromotionPrizeLink"></div>');

                    CustomerWinLoss.bindData({ TotalRows: 0 });

                    expect($("#ExportPromotionPrizeLink").css("display")).toEqual("none");
                });

                it("grid should be rendered if response data is not empty", function () {
                    CustomerWinLoss.bindData({ TotalRows: 2000, Data: [1] });

                    expect($.fn.jqGrid).toHaveBeenCalled();
                    expect(CustomerWinLossOption.setGroupHeaderColumns).toHaveBeenCalled();
                });

                it("pager should not be rendered if total data is not greater than number rows of a page", function () {
                    CustomerWinLoss.bindData({ TotalRows: 1, Data: [1] });

                    expect(PagingHelper.render).not.toHaveBeenCalled();
                });

                it("pager should be rendered if total data is greater than number rows of a page", function () {
                    CustomerWinLoss.bindData({ TotalRows: 2000, Data: [1] });

                    expect(PagingHelper.render).toHaveBeenCalled();
                });

                it("Promotion Prize link should be hide if no Promotion Prize ticket counted", function () {
                    setFixtures('<div id="ExportPromotionPrizeLink"></div>');

                    CustomerWinLoss.bindData({ TotalRows: 1, Data: [1], PromotionPrize: '' });

                    expect($("#ExportPromotionPrizeLink").css("display")).toEqual("none");
                });

                it("Promotion Prize link should be shown if Promotion Prize ticket counted", function () {
                    setFixtures('<div id="ExportPromotionPrizeLink" style="{display: none}"></div>');

                    CustomerWinLoss.bindData({ TotalRows: 1, Data: [1], PromotionPrize: '1' });

                    expect($("#ExportPromotionPrizeLink").css("display")).toEqual("block");
                });

                describe("gridOption.onSortCol(index)", function () {
                    beforeEach(function () {
                        spyOn(CustomerWinLoss, "submit");

                        jasmine.clock().install();
                    });

                    afterEach(function () {
                        jasmine.clock().uninstall();
                    });

                    it("should not be sorted if grid has only 1 row", function () {
                        CustomerWinLoss.bindData({ TotalRows: 1, Data: [1] });

                        gridOption.onSortCol(0);
                        jasmine.clock().tick(101);

                        expect(CustomerWinLoss.submit).not.toHaveBeenCalled();
                    });

                    it("CustomerWinLoss.submit should be called when sorting", function () {
                        CustomerWinLoss.bindData({ TotalRows: 2, Data: [1, 2] });

                        gridOption.onSortCol(0);
                        jasmine.clock().tick(101);

                        expect(CustomerWinLoss.submit).toHaveBeenCalled();
                    });

                    it("grid should be sorted ascending on the first time", function () {
                        var sortType = "";
                        CustomerWinLoss.bindData({ TotalRows: 2, Data: [1, 2] });

                        gridOption.onSortCol(1);
                        jasmine.clock().tick(101);

                        var submitData = CustomerWinLoss.getSubmitData();
                        expect(submitData.IsAscSort).toBe(true);
                    });

                    it("grid should be sorted descending on the second time", function () {
                        var sortType = "";
                        CustomerWinLoss.bindData({ TotalRows: 2, Data: [1, 2] });

                        gridOption.onSortCol(2);
                        jasmine.clock().tick(101);

                        var submitData = CustomerWinLoss.getSubmitData();
                        expect(submitData.IsAscSort).toBe(true);

                        gridOption.onSortCol(2);
                        jasmine.clock().tick(101);

                        submitData = CustomerWinLoss.getSubmitData();
                        expect(submitData.IsAscSort).toBe(false);
                    });

                    it("grid should be sorted ascending on the third time", function () {
                        var sortType = "";
                        CustomerWinLoss.bindData({ TotalRows: 2, Data: [1, 2] });

                        gridOption.onSortCol(2);
                        jasmine.clock().tick(101);

                        var submitData = CustomerWinLoss.getSubmitData();
                        expect(submitData.IsAscSort).toBe(true);

                        gridOption.onSortCol(2);
                        jasmine.clock().tick(101);

                        submitData = CustomerWinLoss.getSubmitData();
                        expect(submitData.IsAscSort).toBe(false);

                        gridOption.onSortCol(2);
                        jasmine.clock().tick(101);

                        submitData = CustomerWinLoss.getSubmitData();
                        expect(submitData.IsAscSort).toBe(true);
                    });
                });

                describe("gridComplete(gridOption, response)", function () {
                    beforeEach(function () {
                        spyOn(jqGridAdditional, "gridComplete");
                        spyOn(jqGridAdditional, "assignTotal");
                        spyOn(jqGridAdditional, "setGroupFooters");
                        spyOn(jqGridAdditional, "addSortableHeaders");
                        spyOn(jqGridAdditional, "removeCursorOnNonSortableHeader");
                    });

                    it("jqGridAdditional.gridComplete should be called", function () {
                        CustomerWinLoss.bindData({ TotalRows: 1, Data: [1] });

                        gridOption.gridComplete(gridOption, {
                            Total: {}
                        });

                        expect(jqGridAdditional.gridComplete).toHaveBeenCalled();
                    });

                    it("does nothing if grid is not rendered the first time after submitting", function () {
                        gridOption.gridComplete(gridOption, {
                            Total: {}
                        });

                        expect(jqGridAdditional.gridComplete).not.toHaveBeenCalled();
                    });

                    it("jqGridAdditional.addSortableHeaders should be called if total rows is greater than 1", function () {
                        CustomerWinLoss.bindData({ TotalRows: 2, Data: [1] });

                        gridOption.gridComplete(gridOption, {
                            Total: {}
                        });

                        expect(jqGridAdditional.addSortableHeaders).toHaveBeenCalled();
                    });

                    it("jqGridAdditional.removeCursorOnNonSortableHeader should be called if total rows is 1", function () {
                        CustomerWinLoss.bindData({ TotalRows: 1, Data: [1] });

                        gridOption.gridComplete(gridOption, {
                            Total: {}
                        });

                        expect(jqGridAdditional.removeCursorOnNonSortableHeader).toHaveBeenCalled();
                    });
                });
            });

            describe("viewHistoryReport()", function () {
                it("redirects to correct url", function () {
                    spyOn(Site, "redirect");

                    CustomerWinLoss.viewHistoryReport();

                    expect(Site.redirect).toHaveBeenCalledWith("CustomerWinlossReport/History");
                });
            });

            describe("viewCurrentReport()", function () {
                it("redirects to correct url", function () {
                    spyOn(Site, "redirect");

                    CustomerWinLoss.viewCurrentReport();

                    expect(Site.redirect).toHaveBeenCalledWith("CustomerWinLossReport/Index");
                });
            });

            describe("viewWinlossBetList(custId, systemId, externalId)", function () {
                it("Popup.openPopupWithIframe should be called with correct params", function () {
                    spyOn(Popup, "openPopupWithIframe");
                    spyOn(QueryString, "setParam").and.callFake(function (url, param, value) {
                        return url + "&" + param + "=" + value;
                    });
                    spyOn(Math, "min").and.callFake(function () {
                        return 650;
                    });
                    spyOn($, "ajax");
                    spyOn(Report, "ValidProducts").and.returnValues(true);

                    setFixtures('<form id="CustomerWinlossForm">'
                            + '<input type="hidden" name="CurrencyId" value="0" />'
                            + '<input type="hidden" name="CurrencyName" value="USD" />'
                            + '<input type="hidden" name="FromDate" value="01/01/2011" />'
                            + '<input type="hidden" name="ToDate" value="01/11/2011" />'
                            + '<input type="hidden" name="BaseCurrency" value="eur" />'
                            + '<input type="hidden" id="IsHistory" name="IsHistory" value="True" />'
                            + '<div id="ProductList">'
                            + '<div class="childCheckbox" data-product-code="Code1" data-original="true"></div>'
                            + '<div class="childCheckbox" data-product-code="Code2" data-original="false"></div>'
                            + '<div class="childCheckbox" data-product-code="Code3" data-original="true"></div>'
                            + '</div>'
                            + '<div id="SubmitButton"></div>'
                            + '</form>');

                    CustomerWinLoss.initEvent();
                    $('#SubmitButton').click();

                    CustomerWinLoss.viewWinlossBetList(1, 2, 3);

                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(
                        "CustomerWinlossBetList/Index&ProductCodeList=CODE1,CODE3&currencyid=0&CurrencyName=USD&BaseCurrency=eur&custid=1&systemid=2&externalid=3&fromdate=01/01/2011&todate=01/11/2011&ishistoryreport=True",
                        { id: "betlist-popup", width: 970, height: 700, title: "CustomerBetList" });
                });
            });

            describe("ajaxPaging()", function () {
                beforeEach(function () {
                    spyOn(PagingHelper, "getSetting");
                    spyOn(CustomerWinLoss, "submit");
                });

                it("updates paging data", function () {
                    CustomerWinLoss.ajaxPaging();

                    expect(PagingHelper.getSetting).toHaveBeenCalled();
                });

                it("CustomerWinLoss.submit() should be called", function () {
                    CustomerWinLoss.ajaxPaging();

                    expect(CustomerWinLoss.submit).toHaveBeenCalled();
                });
            });
        });
    });